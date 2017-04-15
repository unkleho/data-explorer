const Content = ({
  victoryData,
  chartType,
  theme,
  width,
  height,
  colors,
  data,
}) => {
  return (
    <div>
      {(victoryData && victoryData.length > 0) ? (
        (chartType === 'line') ? (
          <div>
            <VictoryChart
              theme={theme}
              padding={{ top: 30, left: 60, right: 0, bottom: 60 }}
              animate={{ duration: 500 }}
              width={this.state.dimensions.width}
              height={400}
              scale={{ x: "time" }}
              style={chartStyle}
              containerComponent={
                <VictoryZoomContainer responsive={false}
                  dimension="x"
                  zoomDomain={this.state.zoomDomain}
                  onDomainChange={this.handleZoom.bind(this)}
                />
              }
            >
              {victoryData.map((data, i) => {
                return (
                  <VictoryLine
                    style={{
                      data: {
                        stroke: colors[i],
                        // fill: colors[i],
                      }
                    }}
                    data={data}
                  />
                )
              })}
            </VictoryChart>

            <VictoryChart
              theme={theme}
              padding={{ top: 10, left: 60, right: 0, bottom: 30 }}
              animate={{ duration: 500 }}
              width={this.state.dimensions.width}
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
  ) : (
    <p><br/>Loading..</p>
  )
}

export default Content;
