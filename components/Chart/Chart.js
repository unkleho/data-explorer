import { Component } from 'react';
import PropTypes from 'prop-types';
import { Router } from '../../routes';

import './Chart.css';
import ChartHeader from '../ChartHeader';
import ChartContent from '../ChartContent';
import ChartFooter from '../ChartFooter';
import {
	buildVictoryData,
	getDefaultDimensions,
	getDimensionColourMap,
} from '../../utils';
import theme from '../../styles/victoryTheme';

class Chart extends Component {
	static propTypes = {
		isLoading: PropTypes.bool,
		orgSlug: PropTypes.string,
		orgTitle: PropTypes.string,
		dataSetSlug: PropTypes.string,
		data: PropTypes.object,
		dataSets: PropTypes.array,
		dimensions: PropTypes.array,
		selectedDimensions: PropTypes.array,
		mainDimensionIndex: PropTypes.number,
		width: PropTypes.number,
		height: PropTypes.number,
	};

	static defaultProps = {
		dataSetSlug: '',
		dataSets: [],
	};

	constructor() {
		super();

		this.state = {
			victoryData: [],
		};
	}

	handleDataSetSelect = (id) => {
		Router.pushRoute(`/${this.props.orgSlug}/${id}`);
	};

	handleDimensionSelect = async (options, dimensionIndex) => {
		let ids = [];
		ids[0] = options.value;

		if (ids.length > 0) {
			const selectedDimensions = this.props.selectedDimensions;
			const dataSetSlug = this.props.dataSetSlug;

			// Update selectedDimensions array with selected dimensionId
			selectedDimensions[dimensionIndex] = ids;

			Router.pushRoute(
				`/${
					this.props.orgSlug
				}/${dataSetSlug}?selectedDimensions=${JSON.stringify(
					selectedDimensions,
				)}&mainDimensionIndex=${this.props.mainDimensionIndex}`,
			);
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
			const dataSetSlug = this.props.dataSetSlug;

			// Update selectedDimensions array with selected dimensionId
			selectedDimensions[dimensionIndex] = ids;

			Router.pushRoute(
				`/${
					this.props.orgSlug
				}/${dataSetSlug}?selectedDimensions=${JSON.stringify(
					selectedDimensions,
				)}&mainDimensionIndex=${this.props.mainDimensionIndex}`,
			);
		}
	};

	handleMainDimensionSelect = (mainDimensionIndex) => {
		const defaultDimensions = getDefaultDimensions(
			this.props.dimensions,
			this.props.dataSetSlug,
		);

		Router.pushRoute(
			`/${this.props.orgSlug}/${
				this.props.dataSetSlug
			}?selectedDimensions=${JSON.stringify(
				defaultDimensions,
			)}&mainDimensionIndex=${mainDimensionIndex}`,
		);
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.data !== this.props.data) {
			const mainDimension =
				this.props.dimensions &&
				this.props.dimensions[this.props.mainDimensionIndex];
			const victoryData = buildChartData(
				this.props.data,
				mainDimension,
				this.props.selectedDimensions[this.props.mainDimensionIndex],
			);

			this.setState({
				victoryData,
			});
		}
	}

	render() {
		const {
			isLoading,
			dataSetSlug,
			data,
			dataSets,
			dimensions,
			mainDimensionIndex,
			selectedDimensions,
			width,
			height,
			orgTitle,
		} = this.props;

		const mainDimension = dimensions && dimensions[mainDimensionIndex];
		// const colourMap = getDimensionColourMap(
		// 	selectedMainDimensionValues,
		// 	mainDimension && mainDimension.values,
		// );

		return (
			<div className="chart">
				<ChartHeader
					dataSetSlug={dataSetSlug}
					dataSets={dataSets}
					selectedDimensions={selectedDimensions}
					dimensions={dimensions}
					mainDimensionIndex={mainDimensionIndex}
					onDataSetSelect={this.handleDataSetSelect}
					onDimensionSelect={this.handleDimensionSelect}
					onMultiDimensionSelect={this.handleMultiDimensionSelect}
					onMainDimensionSelect={this.handleMainDimensionSelect}
				/>

				<main className="content container container--lg">
					{this.state.victoryData.length > 0 && (
						<ChartContent
							isLoading={isLoading}
							victoryData={this.state.victoryData}
							theme={theme}
							width={width}
							height={height}
							chartType={'line'}
							// colourMap={colourMap}
						/>
					)}

					<ChartFooter orgTitle={orgTitle} />
				</main>
			</div>
		);
	}
}

export default Chart;

// Build data for Victory Chart
// TODO: Move to own lib
const buildChartData = (
	data = [],
	mainDimension,
	selectedMainDimensions = [],
) => {
	const dimensionSlug = mainDimension && mainDimension.slug;

	// Loop through selectedMainDimensions to build multi-dimensional array
	return selectedMainDimensions.map((dimensionValue) => {
		return data
			.filter((d) => {
				return d.dimensions[dimensionSlug] === dimensionValue;
			})
			.map((d) => {
				return {
					x: new Date(d.date),
					y: d.value,
				};
			});
	});
};
