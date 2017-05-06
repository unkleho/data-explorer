import { Component, PropTypes } from 'react';
import {
  VictoryZoomContainer,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryArea,
} from 'victory';

import { colors } from '../styles/variables';

class Content extends Component {
  static propTypes = {
    victoryData: PropTypes.array,
    chartType: PropTypes.string,
    theme: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    chartStyle: PropTypes.object,
    colourMap: PropTypes.array,
  }

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
      victoryData,
      chartType,
      theme,
      width,
      height,
      chartStyle,
      colourMap,
    } = this.props;

    return (
      <div>
        {(victoryData && victoryData.length > 0) ? (
          (chartType === 'line') ? (
            <div>
              <VictoryChart
                theme={theme}
                padding={{ top: 30, left: 60, right: 0, bottom: 60 }}
                animate={{ duration: 500 }}
                width={width}
                height={400}
                scale={{ x: 'time' }}
                style={chartStyle}
                // containerComponent={
                //   <VictoryZoomContainer responsive={false}
                //     dimension="x"
                //     zoomDomain={this.state.zoomDomain}
                //     onDomainChange={this.handleZoom.bind(this)}
                //   />
                // }
              >
                {victoryData.map((data, i) => {
                  return (
                    <VictoryLine
                      style={{
                        data: {
                          stroke: colourMap[i] && colors[colourMap[i].colour],
                          // fill: colors[i],
                        }
                      }}
                      data={data}
                    />
                  )
                })}
              </VictoryChart>

              {/* <VictoryChart
                theme={theme}
                padding={{ top: 10, left: 60, right: 0, bottom: 30 }}
                animate={{ duration: 500 }}
                width={width}
                height={80}
                scale={{x: "time"}}
                style={chartStyle}
                containerComponent={
                  <VictoryBrushContainer responsive={false}
                    dimension="x"
                    selectedDomain={this.state.selectedDomain}
                    onDomainChange={this.handleBrush.bind(this)}
                  />
                }
              >
                <VictoryAxis
                />
                {victoryData.map((data, i) => {
                  return (
                    <VictoryLine
                      style={{
                        data: {
                          stroke: colors[i],
                        }
                      }}
                      data={data}
                    />
                  )
                })}
              </VictoryChart> */}
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
                    return colors[d.eventKey]
                  }
                }
              }}
              animate={{ duration: 500 }}
            />
          )
        ) : (
          <p><br/>Sorry! No data available, try changing a dimension or choose another data set.</p>
        )}
      </div>
    )
  }
}

export default Content;
