import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { VictoryChart, VictoryLine, VictoryPie } from 'victory';

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

	render() {
		const {
			isLoading,
			victoryData,
			chartType,
			theme,
			width,
			// height,
			// chartStyle,
			colourMap,
		} = this.props;

		const chartHeight = width < 768 ? 260 : 405;

		return (
			<div>
				{victoryData && victoryData.length > 0 ? (
					chartType === 'line' ? (
						<div>
							<VictoryChart
								theme={theme}
								padding={{ top: 18, left: 70, right: 0, bottom: 32 }}
								animate={{ duration: 500 }}
								width={width}
								height={chartHeight}
								scale={{ x: 'time' }}
							>
								{victoryData.map((data, i) => {
									return (
										<VictoryLine
											style={{
												data: {
													stroke: colors[i],
													// stroke: colourMap[i] && colors[colourMap[i].colour],
													// fill: colors[i],
												},
											}}
											data={data}
											key={`victory-line-${i}`}
										/>
									);
								})}
							</VictoryChart>
						</div>
					) : (
						<VictoryPie
							innerRadius={30}
							height={250}
							data={victoryData}
							style={{
								data: {
									fill: (d) => {
										// console.log(d);
										const i = d.eventKey;
										return colourMap[i] && colors[colourMap[i].colour];
										// return colors[d.eventKey]
									},
								},
							}}
							labels={(d) => {
								return colourMap[d.eventKey] && colourMap[d.eventKey].name;
							}}
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
