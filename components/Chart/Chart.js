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
		orgSlug: PropTypes.string.isRequired,
		orgTitle: PropTypes.string,
		dataSetId: PropTypes.string.isRequired,
		data: PropTypes.object,
		dataSets: PropTypes.array.isRequired,
		dimensions: PropTypes.array,
		selectedDimensions: PropTypes.array,
		mainDimensionIndex: PropTypes.number,
		width: PropTypes.number,
		height: PropTypes.number,
	};

	handleDataSetSelect = (id) => {
		Router.pushRoute(`/${this.props.orgSlug}/${id}`);
	};

	handleDimensionSelect = async (options, dimensionIndex) => {
		let ids = [];
		ids[0] = options.value;

		if (ids.length > 0) {
			const selectedDimensions = this.props.selectedDimensions;
			const dataSetId = this.props.dataSetId;

			// Update selectedDimensions array with selected dimensionId
			selectedDimensions[dimensionIndex] = ids;

			Router.pushRoute(
				`/${
					this.props.orgSlug
				}/${dataSetId}?selectedDimensions=${JSON.stringify(
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
			const dataSetId = this.props.dataSetId;

			// Update selectedDimensions array with selected dimensionId
			selectedDimensions[dimensionIndex] = ids;

			Router.pushRoute(
				`/${
					this.props.orgSlug
				}/${dataSetId}?selectedDimensions=${JSON.stringify(
					selectedDimensions,
				)}&mainDimensionIndex=${this.props.mainDimensionIndex}`,
			);
		}
	};

	handleMainDimensionSelect = (mainDimensionIndex) => {
		const defaultDimensions = getDefaultDimensions(
			this.props.dimensions,
			this.props.dataSetId,
		);

		Router.pushRoute(
			`/${this.props.orgSlug}/${
				this.props.dataSetId
			}?selectedDimensions=${JSON.stringify(
				defaultDimensions,
			)}&mainDimensionIndex=${mainDimensionIndex}`,
		);
	};

	render() {
		const {
			isLoading,
			dataSetId,
			data,
			dataSets,
			dimensions,
			mainDimensionIndex,
			selectedDimensions,
			width,
			height,
			orgTitle,
		} = this.props;

		const selectedMainDimensionValues = selectedDimensions[mainDimensionIndex];
		const mainDimension = dimensions && dimensions[mainDimensionIndex];

		const victoryData = buildVictoryData(
			data,
			mainDimensionIndex,
			selectedMainDimensionValues,
		);

		const colourMap = getDimensionColourMap(
			selectedMainDimensionValues,
			mainDimension && mainDimension.values,
		);

		return (
			<div className="chart">
				<ChartHeader
					id={dataSetId}
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
					<ChartContent
						isLoading={isLoading}
						victoryData={victoryData}
						theme={theme}
						width={width}
						height={height}
						// chartType={chartType}
						colourMap={colourMap}
					/>

					<ChartFooter orgTitle={orgTitle} />
				</main>
			</div>
		);
	}
}

export default Chart;
