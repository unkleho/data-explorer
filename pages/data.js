import { Component } from 'react';
import PropTypes from 'prop-types';
import { Router } from '../routes';
import Measure from 'react-measure';
import withRedux from 'next-redux-wrapper';
import { gql, graphql } from 'react-apollo';

import styles from './data.css';
import withData from '../lib/withData';
import App from '../components/App';
import DataHeader from '../components/DataHeader';
import DataContent from '../components/DataContent';
import DataTable from '../components/DataTable';
import theme from '../styles/victoryTheme';
import { initStore } from '../store';
import {
	getDataSets,
	getDataSet,
	// getData,
} from '../actions';
import {
	buildVictoryData,
	buildTableData,
	getTimePeriods,
	getChartType,
	// toggleArrayItem,
	getDefaultDimensions,
	getDimensionColourMap,
} from '../utils';
import allData from '../data';

class Data extends Component {
	static propTypes = {
		id: PropTypes.string,
		query: PropTypes.shape({
			id: PropTypes.string,
			sourceId: PropTypes.string,
		}),
		orgId: PropTypes.string,
	};

	constructor() {
		super();

		this.state = {};
	}

	static async getInitialProps({
		query: {
			id = null,
			sourceId = 'ABS',
			selectedDimensions = null,
			mainDimensionIndex = null,
		},
		isServer,
		store,
		pathname,
	}) {
		const orgId = getOrgId(pathname) || sourceId;

		// Work out if custom default dataSet exists
		const defaultId = allData[orgId].defaultDataSetId;
		// const defaultId = organisation && organisation.defaultDataSet.originalId;
		const newId = id || defaultId || allData[orgId].dataSets.children[0].id;
		selectedDimensions = selectedDimensions
			? JSON.parse(selectedDimensions)
			: null;

		await store.dispatch(getDataSets(orgId));
		await store.dispatch(getDataSet(newId, orgId, selectedDimensions));

		if (mainDimensionIndex !== null) {
			store.dispatch({
				type: 'SELECT_MAIN_DIMENSION',
				mainDimensionIndex,
				selectedDimensions,
			});
		}

		return {
			id: newId,
			orgId,
			orgSlug: orgId.toLowerCase(),
		};
	}

	handleDataSetSelect = (id) => {
		Router.pushRoute(`/${this.props.orgSlug}/${id}`);
	};

	handleDimensionSelect = async (options, dimensionIndex) => {
		let ids = [];
		ids[0] = options.value;
		// console.log(options);

		if (ids.length > 0) {
			const selectedDimensions = this.props.selectedDimensions;
			const dataSetId = this.props.id;

			// Update selectedDimensions array with selected dimensionId
			selectedDimensions[dimensionIndex] = ids;
			// Router.push(`/${this.props.orgSlug}?id=${dataSetId}&selectedDimensions=${JSON.stringify(selectedDimensions)}&mainDimensionIndex=${this.props.mainDimensionIndex}`);

			Router.pushRoute(
				`/${
					this.props.orgSlug
				}/${dataSetId}?selectedDimensions=${JSON.stringify(
					selectedDimensions,
				)}&mainDimensionIndex=${this.props.mainDimensionIndex}`,
			);

			// this.props.dispatch(getData(selectedDimensions, dataSetId, this.props.sourceId));
		}

		// Cool little script for html multi select
		// const ids = [...event.target.options].filter(({ selected }) => selected).map(({ value }) => value);
		// const ids = options.map((option) => {
		//   return option.value;
		// });
	};

	handleMultiDimensionSelect = (options, dimensionIndex) => {
		const ids = options.map((option) => {
			return option.value;
		});

		if (ids.length > 0) {
			const selectedDimensions = this.props.selectedDimensions;
			const dataSetId = this.props.id;

			// Update selectedDimensions array with selected dimensionId
			selectedDimensions[dimensionIndex] = ids;

			// Router.push(`/${this.props.orgSlug}?id=${dataSetId}&selectedDimensions=${JSON.stringify(selectedDimensions)}&mainDimensionIndex=${this.props.mainDimensionIndex}`);

			Router.pushRoute(
				`/${
					this.props.orgSlug
				}/${dataSetId}?selectedDimensions=${JSON.stringify(
					selectedDimensions,
				)}&mainDimensionIndex=${this.props.mainDimensionIndex}`,
			);

			// this.props.dispatch(getData(selectedDimensions, dataSetId, this.props.sourceId));
		}
	};

	handleMainDimensionSelect = (mainDimensionIndex) => {
		const defaultDimensions = getDefaultDimensions(
			this.props.dimensions,
			this.props.id,
		);

		Router.pushRoute(
			`/${this.props.orgSlug}/${
				this.props.id
			}?selectedDimensions=${JSON.stringify(
				defaultDimensions,
			)}&mainDimensionIndex=${mainDimensionIndex}`,
		);

		// this.props.dispatch(getData(defaultDimensions, this.props.id, this.props.sourceId));
		// this.props.dispatch({
		//   type: 'SELECT_MAIN_DIMENSION',
		//   mainDimensionIndex,
		//   selectedDimensions: defaultDimensions,
		// })
	};

	handleMenuClick = (event) => {
		this.props.dispatch({
			type: 'TOGGLE_MENU',
		});
	};

	render() {
		const chartStyle = {
			parent: {},
		};

		const {
			sourceTitle,
			dataSet, // From GraphCool
			// dataSets,
			organisation, // From GraphCool
			// dimensions,
			isLoaded,
			isLoading,
			data,
			selectedDimensions,
			isMenuActive,
			url,
		} = this.props;

		// All dataSets within organisation
		const dataSets = organisation && organisation.dataSets;
		const dimensions = dataSet && dataSet.dimensions;

		console.log('render()');
		// console.log(dataSet);
		console.table(dimensions);
		// console.table(dataSet.dimensions);
		// console.log(mainDimensionIndex);

		// Index of currently selected dimension
		const mainDimensionIndex = parseInt(this.props.mainDimensionIndex, 10) || 0;
		// Currently selected dimension
		const mainDimension = dimensions[mainDimensionIndex];
		const selectedMainDimensionValues = selectedDimensions[mainDimensionIndex];

		// console.log(this.props.organisation.dataSets);

		// let colourMap;
		const colourMap = getDimensionColourMap(
			selectedMainDimensionValues,
			mainDimension.values,
		);

		let victoryData,
			tableData = [];
		let chartType;

		if (isLoaded && data) {
			// Work out chart type based on data
			const timePeriods = getTimePeriods(data);
			victoryData = buildVictoryData(
				data,
				mainDimensionIndex,
				selectedMainDimensionValues,
			);
			tableData = buildTableData(data);
			chartType = getChartType(timePeriods && timePeriods.length);
			// console.log('chartType: ' + chartType);
			// console.table(victoryData);
		}

		return (
			<App url={url}>
				{isMenuActive && (
					<DataHeader
						id={this.props.id}
						dataSets={dataSets}
						selectedDimensions={selectedDimensions}
						dimensions={dimensions}
						mainDimensionIndex={mainDimensionIndex}
						onDataSetSelect={this.handleDataSetSelect}
						onDimensionSelect={this.handleDimensionSelect}
						onMultiDimensionSelect={this.handleMultiDimensionSelect}
						onMainDimensionSelect={this.handleMainDimensionSelect}
					/>
				)}
				<main className="content container">
					<Measure
						onMeasure={(dimensions) => {
							this.setState({ dimensions });
						}}
					>
						<div>
							{isMenuActive && (
								<div className="overlay" onClick={this.handleMenuClick} />
							)}

							{typeof window !== 'undefined' && this.state.dimensions ? (
								<div className="content">
									{isLoading && <p className="loading">Loading</p>}
									<DataContent
										isLoading={isLoading}
										victoryData={victoryData}
										chartStyle={chartStyle}
										theme={theme}
										width={this.state.dimensions.width}
										height={this.state.dimensions.height}
										chartType={chartType}
										colourMap={colourMap}
									/>

									<DataTable data={tableData} />
								</div>
							) : (
								<p>
									<br />Loading..
								</p>
							)}
						</div>
					</Measure>

					<p style={{ fontSize: '0.6em', float: 'right', textAlign: 'right' }}>
						Source: {sourceTitle}
						<br />
						Disclaimer: This website is in active development. Charts may not be
						accurate.
					</p>
				</main>
				<style jsx>{styles}</style>
			</App>
		);
	}
}

function getOrgId(pathname) {
	return pathname !== '/data'
		? pathname.replace('/', '').toUpperCase()
		: undefined;
}

function mapStateToProps(state) {
	return {
		...state,
	};
}

const query = gql`
	query getOrganisation($organisationId: String!, $dataSetId: String!) {
		organisation: Organisation(organisationId: $organisationId) {
			organisationId
			title
			dataSets {
				id: dataSetId
				title
			}
			defaultDataSet {
				originalId
			}
		}
		dataSet: allDataSets(filter: { dataSetId: $dataSetId }) {
			title
			dimensions {
				name
				keyPosition
				dimensionId
				id: originalId
				values: dimensionValues {
          dimensionValueId
					name
					id: originalId
				}
			}
		}
	}
`;

export default withData(
	graphql(query, {
		options: ({
			url: { pathname, query: { id, selectedDimensions, mainDimensionIndex } },
		}) => {
			const organisationId = pathname.substr(1).toUpperCase();
      const dataSetId = `${organisationId}__${id}`;
      console.log(dataSetId);

			return {
				variables: {
					organisationId,
					dataSetId,
				},
			};
		},
		props: ({ data }) => {
			const { organisation, dataSet } = data;

      // console.log(data);
      // dataSet[0] && console.table(dataSet[0].dimensions[2].values);

      // console.log(data && dataSet && dataSet[0].dimensions[2].values);

      // if (dataSet[0]) {
      //   console.log(data.dataSet[0]);
      //   console.log(dataSet[0]);
      // }

			return {
				...data,
				dataSet: dataSet && dataSet[0] && {
          ...dataSet[0],
          dimensions: dataSet[0].dimensions.slice(0, -1),
        },
				organisation: {
					...organisation,
					// defaultDataSetId: organisation.defaultDataSet.originalId,
					dataSets:
						organisation &&
						organisation.dataSets.map((dataSet) => ({
							...dataSet,
							id: dataSet.id.replace(`${organisation.organisationId}__`, ''),
						})),
				},
			};
		},
	})(withRedux(initStore, mapStateToProps)(Data)),
);
