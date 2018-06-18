import { Component } from 'react';
import PropTypes from 'prop-types';

import './Chart.css';
import { Router } from '../../routes';
import ChartHeader from '../ChartHeader';
import ChartContent from '../ChartContent';
import ChartFooter from '../ChartFooter';
import { getDefaultDimensions } from '../../utils';
import theme from '../../styles/victoryTheme';

class Chart extends Component {
	static propTypes = {
		isLoading: PropTypes.bool,
		orgSlug: PropTypes.string,
		orgTitle: PropTypes.string,
		dataSetSlug: PropTypes.string,
		data: PropTypes.array,
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

	handleDataSetSelect = (dataSetSlug) => {
		Router.pushRoute(`/${this.props.orgSlug.toLowerCase()}/${dataSetSlug}`);
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
				`/${this.props.orgSlug.toLowerCase()}/${dataSetSlug}?selectedDimensions=${JSON.stringify(
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
				`/${this.props.orgSlug.toLowerCase()}/${dataSetSlug}?selectedDimensions=${JSON.stringify(
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
			`/${this.props.orgSlug.toLowerCase()}/${
				this.props.dataSetSlug
			}?selectedDimensions=${JSON.stringify(
				defaultDimensions,
			)}&mainDimensionIndex=${mainDimensionIndex}`,
		);
	};

	componentDidUpdate(prevProps, prevState) {
		const {
			data,
			mainDimensionIndex,
			dimensions,
			selectedDimensions,
		} = this.props;

		if (prevProps.data !== data) {
			const mainDimension = dimensions && dimensions[mainDimensionIndex];

			// Work out chart type
			const chartType = getChartType(data);

			const victoryData = buildChartData(
				data,
				mainDimension,
				selectedDimensions[mainDimensionIndex],
				dimensions,
			);

			this.setState({
				victoryData,
				chartType,
			});
		}
	}

	render() {
		const {
			isLoading,
			dataSetSlug,
			dataSets,
			dimensions,
			mainDimensionIndex,
			selectedDimensions,
			width,
			height,
			orgSlug,
			orgTitle,
		} = this.props;

		const { victoryData, chartType } = this.state;

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

				<div className="content container container--lg">
					<ChartContent
						isLoading={isLoading}
						victoryData={victoryData}
						theme={theme}
						width={width}
						height={height}
						chartType={chartType}
						// colourMap={colourMap}
					/>

					<ChartFooter
						orgTitle={orgTitle}
						orgSlug={orgSlug}
						dataSetSlug={dataSetSlug}
						selectedDimensions={selectedDimensions}
					/>
				</div>
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
	dimensions,
) => {
	const chartType = getChartType(data);

	if (chartType === 'line') {
		return buildLineChartData(data, mainDimension, selectedMainDimensions);
	} else if (chartType === 'pie') {
		return buildPieChartData(
			data,
			mainDimension,
			selectedMainDimensions,
			dimensions,
		);
	}
};

const buildLineChartData = (
	data = [],
	mainDimension,
	selectedMainDimensions = [],
) => {
	// Check if data is valid
	if (data.length === 0) {
		return null;
	}

	const dimensionSlug = mainDimension && mainDimension.slug;

	// Loop through selectedMainDimensions to build multi-dimensional array
	const result = selectedMainDimensions.map((dimensionValue) => {
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

	return result;
};

const buildPieChartData = (data, mainDimension, selectedMainDimensions) => {
	const mainDimensionValues = mainDimension.values;

	return data.map((d, i) => {
		const slug = selectedMainDimensions[i];
		const value = mainDimensionValues.filter((value) => value.slug === slug)[0]
			.name;

		return {
			x: new Date(d.date),
			y: d.value,
			label: `${value} (${d.value})`,
		};
	});

	// return [{ x: null, y: 1000 }, { x: null, y: 2000 }, { x: null, y: 3000 }];
};

const getChartType = (data) => {
	if (!data || data.length === 0) {
		return null;
	}

	const firstDate = data[0].date;

	return data.length === data.filter((d) => d.date === firstDate).length
		? 'pie'
		: 'line';
};
