import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import './data.css';
import withApollo from '../lib/withApollo';
import App from '../components/App';
import Chart from '../components/Chart';
import { initStore } from '../store';
import { getDataSet } from '../actions';
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

	static async getInitialProps(props) {
		const {
			query: {
				id = null,
				sourceId = 'ABS',
				selectedDimensions = null,
				mainDimensionIndex = null,
			},
			// isServer,
			store,
			pathname,
		} = props;

		const orgId = getOrgId(pathname) || sourceId;

		// Work out if custom default dataSet exists
		const defaultId = allData[orgId].defaultDataSetId;
		const newId = id || defaultId || allData[orgId].dataSets.children[0].id;

		// Parse selectedDimensions from URL
		const selectedDimensionsNew = selectedDimensions
			? JSON.parse(selectedDimensions)
			: null;

		// Get dataSet metadata and observations data
		await store.dispatch(getDataSet(newId, orgId, selectedDimensionsNew));

		if (mainDimensionIndex !== null) {
			store.dispatch({
				type: 'SELECT_MAIN_DIMENSION',
				mainDimensionIndex,
				selectedDimensions: selectedDimensionsNew,
			});
		}

		return {
			id: newId,
			orgId,
			orgSlug: orgId.toLowerCase(),
		};
	}

	handleMenuClick = (event) => {
		this.props.dispatch({
			type: 'TOGGLE_MENU',
		});
	};

	render() {
		const {
			isLoading, // From GraphCool
			orgSlug,
			// dataSet, // From GraphCool
			organisation, // From GraphCool
			dimensions,
			data,
			selectedDimensions,
			url,
		} = this.props;

		// All dataSets within organisation
		const dataSets = organisation && organisation.dataSets;
		const orgTitle = organisation && organisation.title;
		// const dimensions = dataSet && dataSet.dimensions;

		// Index of currently selected dimension
		const mainDimensionIndex = parseInt(this.props.mainDimensionIndex, 10) || 0;

		return (
			<App url={url}>
				{({ width, height }) => {
					return (
						<Fragment>
							<Chart
								isLoading={isLoading} // TODO: Is this needed???
								orgSlug={orgSlug}
								orgTitle={orgTitle}
								dataSetId={this.props.id}
								dataSets={dataSets}
								selectedDimensions={selectedDimensions}
								dimensions={dimensions}
								mainDimensionIndex={mainDimensionIndex}
								data={data}
								width={width}
								height={height}
							/>
						</Fragment>
					);
				}}
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
			id
			organisationId
			title
			dataSets {
				id
				originalId
				dataSetId
				title
			}
			defaultDataSet {
				id
				originalId
				title
				dimensions {
					_id: id
					name
					keyPosition
					dimensionId
					id: originalId
					values: dimensionValues {
						_id: id
						dimensionValueId
						name
						id: originalId
					}
				}
			}
		}
		# TODO: Remove this, but keep for now, seems to affect dataSet title for some reason
		dataSet: allDataSets(filter: { dataSetId: $dataSetId }) {
			id
			title
			dimensions {
				_id: id
				name
				keyPosition
				dimensionId
				id: originalId
				values: dimensionValues {
					_id: id
					dimensionValueId
					name
					id: originalId
				}
			}
		}
	}
`;

export default withApollo(
	graphql(query, {
		options: ({
			url: {
				pathname,
				query: { id, selectedDimensions, mainDimensionIndex },
			},
		}) => {
			const organisationId = pathname.substr(1).toUpperCase();
			const dataSetId = `${organisationId}__${id}`;

			return {
				variables: {
					organisationId,
					dataSetId,
				},
			};
		},
		props: ({ data }) => {
			const { organisation, dataSet, loading } = data;

			// console.log(data);

			if (!loading) {
				// Use organisation's default if can't find dataSet
				const newDataSet =
					dataSet.length > 0 ? dataSet[0] : organisation.defaultDataSet;

				return {
					...data,
					dataSet: newDataSet && {
						...newDataSet,
						dimensions: newDataSet.dimensions.slice(0, -1),
					},
					organisation: {
						...organisation,
						// defaultDataSetId: organisation.defaultDataSet.originalId,
						dataSets:
							organisation &&
							organisation.dataSets.map((dataSet) => ({
								...dataSet,
								// id: dataSet._id.replace(`${organisation.organisationId}__`, ''),
							})),
					},
				};
			}

			return {
				...data,
			};
		},
	})(withRedux(initStore, mapStateToProps)(Data)),
);
