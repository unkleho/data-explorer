import { Component } from 'react';
import PropTypes from 'prop-types';

import './Chart.css';
import { Router } from '../../routes';
import ChartHeader from '../ChartHeader';
import ChartContent from '../ChartContent';
import ChartFooter from '../ChartFooter';
import ChartEditorContainer from '../ChartEditorContainer';
import { buildChartData, getChartType } from '../../lib/chartUtils';
import { getDefaultDimensions } from '../../utils';
import theme from '../../styles/victoryTheme';

class Chart extends Component {
	static propTypes = {
		isLoading: PropTypes.bool,
		orgSlug: PropTypes.string,
		orgTitle: PropTypes.string,
		dataSetSlug: PropTypes.string,
		dataSetLink: PropTypes.string,
		data: PropTypes.array,
		dataSets: PropTypes.array,
		dimensions: PropTypes.array,
		selectedDimensions: PropTypes.array,
		mainDimensionIndex: PropTypes.number,
		imageUrl: PropTypes.string,
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

	// TODO: Refactor this! Same as componentDidUpdate
	componentDidMount() {
		const {
			data,
			mainDimensionIndex,
			dimensions,
			selectedDimensions,
		} = this.props;

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

	componentDidUpdate(prevProps, prevState) {
		const {
			data,
			mainDimensionIndex,
			dimensions,
			selectedDimensions,
		} = this.props;

		// console.log('Chart (componentDidUpdate) ---------------');
		// console.log(data);

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
			dataSetLink,
			dataSets,
			dimensions,
			mainDimensionIndex,
			selectedDimensions,
			imageUrl,
			width,
			// height,
			orgSlug,
			orgTitle,
		} = this.props;

		const { victoryData, chartType } = this.state;

		const dataSet =
			dataSets && dataSets.filter((dataSet) => dataSet.slug === dataSetSlug)[0];

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
					width={width}
				/>
				<div className="content container container--lg">
					{process.browser && (
						<ChartContent
							isLoading={isLoading}
							victoryData={victoryData}
							theme={theme}
							width={width}
							// height={height}
							chartType={chartType}
							// colourMap={colourMap}
						/>
					)}

					<ChartFooter
						orgTitle={orgTitle}
						orgSlug={orgSlug}
						dataSetTitle={dataSet && dataSet.title}
						dataSetSlug={dataSetSlug}
						dataSetLink={dataSetLink}
						selectedDimensions={selectedDimensions}
						mainDimensionIndex={mainDimensionIndex}
						imageUrl={imageUrl.replace(
							'https://api.urlbox.io/v1/pbKNPR3RN4IvC88i',
							`${process.env.BASE_URL}/chart-images`,
						)}
					/>

					{/* Only show editor on staging or dev */}
					{process.env.BASE_URL !== 'https://dataexplorer.io' && (
						<ChartEditorContainer orgSlug={orgSlug} dataSetSlug={dataSetSlug} />
					)}
				</div>
			</div>
		);
	}
}

export default Chart;
