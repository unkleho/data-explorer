import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	VictoryChart,
	VictoryLine,
	VictoryPie,
	VictoryTooltip,
	VictoryVoronoiContainer,
} from 'victory';
import memoizeOne from 'memoize-one';

import './ChartContent.css';
import { colors } from '../../styles/variables';

class Content extends Component {
	static propTypes = {
		victoryData: PropTypes.array,
		chartType: PropTypes.string,
		theme: PropTypes.object,
		width: PropTypes.number,
		height: PropTypes.number,
		chartStyle: PropTypes.object,
		colourMap: PropTypes.array,
	};

	static defaultProps = {
		chartType: 'line',
		chartStyle: {
			parent: {},
		},
		victoryData: [],
	};

	constructor() {
		super();

		this.state = {};
	}

	handleZoom(domain) {
		this.setState({ selectedDomain: domain });
	}

	handleBrush(domain) {
		this.setState({ zoomDomain: domain });
	}

	// Work out max by flattening array, then spreading into max func.
	getMaxY = memoizeOne(
		(victoryData) =>
			victoryData && victoryData.length > 0
				? Math.max(
						...victoryData
							.reduce((prev, curr) => prev.concat(curr), [])
							.map((d) => d.y),
				  )
				: null,
	);

	render() {
		const {
			isLoading,
			victoryData,
			chartType,
			theme,
			width,
			// height,
			// chartStyle,
			// colourMap,
		} = this.props;

		const chartHeight = width < 768 ? 260 : 405;
		const maxY = this.getMaxY(victoryData);

		// Work out left padding based on number of digits in maxY
		const paddingLeft = maxY ? Math.ceil(maxY).toString().length * 12 : 70;

		return (
			<div>
				{victoryData && victoryData.length > 0 ? (
					chartType === 'line' ? (
						<VictoryChart
							theme={theme}
							padding={{ top: 18, left: paddingLeft, right: 0, bottom: 32 }}
							animate={{ duration: 500 }}
							width={width}
							height={chartHeight}
							scale={{ x: 'time' }}
							domain={{
								y: [0, maxY],
							}}
							containerComponent={<VictoryVoronoiContainer />}
						>
							{victoryData.map((data, i) => {
								return (
									<VictoryLine
										style={{
											data: {
												stroke: colors[i],
												strokeWidth: 3,
												// stroke: colourMap[i] && colors[colourMap[i].colour],
												// fill: colors[i],
											},
										}}
										data={data}
										labelComponent={<VictoryTooltip />}
										key={`victory-line-${i}`}
									/>
								);
							})}
						</VictoryChart>
					) : (
						<VictoryPie
							theme={theme}
							innerRadius={0}
							height={width < 768 ? 200 : 130}
							padding={20}
							data={victoryData}
							style={{
								data: {
									fill: (d) => {
										const i = d.eventKey;

										return colors[i];
									},
								},
							}}
							// labels={(d) => {
							// 	return colourMap[d.eventKey] && colourMap[d.eventKey].name;
							// }}
							animate={{ duration: 500 }}
						/>
					)
				) : (
					<Fragment>
						{!isLoading && (
							<div className="chart-content__no-data">
								<p>
									Sorry! No data available, try changing a dimension or choose
									another data set.
								</p>
							</div>
						)}
					</Fragment>
				)}
			</div>
		);
	}
}

export default Content;
