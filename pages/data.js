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
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import Measure from 'react-measure';
import Select from 'react-select';
import { initStore, startClock, getData } from '../store';
import { connect } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import Page from '../components/Page';
import theme from '../styles/victoryTheme';
import { colors } from '../styles/variables';
import {
  buildVictoryData,
  getName,
  buildApiUrl,
  buildDataSetApiUrl,
  buildDataSets,
  getDefaultDimensions,
  getObservations,
  getTimePeriods,
  getChartType,
} from '../utils';

import dataSetsRaw from '../data/dataSets';
import birthSummaryData from '../data/birthSummaryDataStates';
// import birthSummaryData from '../data/birthSummaryData';
import birthSummaryDataSet from '../data/birthSummaryDataSet';

class Data extends Component {

  static propTypes = {
    id: PropTypes.string,
  }

  constructor() {
    super();

    this.state = {
      data: null, // Data from ABS
      dataSet: null, // Current dataSet
      dataSets: buildDataSets(dataSetsRaw), // List of DataSets
    };
  }

  static async getInitialProps ({ query: { id }, isServer }) {
    const dataSets = buildDataSets(dataSetsRaw); // List of DataSets

    // const dataSetResult = birthSummaryDataSet;
    // const dataSet = dataSetResult.structure;

    const dataSetResult = await axios.get(buildDataSetApiUrl(id)); // Get dataSet metadata
    const dataSet = dataSetResult.data.structure;

    const dimensions = dataSet.dimensions.observation;
    const selectedDimensions = getDefaultDimensions(dimensions);

    let props = {
      id,
      dataSet,
      dataSets,
      dimensions,
    }

    try {
      // Get data!
      const dataResult = await axios.get(buildApiUrl({
        selectedDimensions,
        dataSetId: id,
      }));
      const data = dataResult.data;

      // const dataResult = birthSummaryData;
      // const data = dataResult;

      return {
        ...props,
        data,
        isLoaded: true,
      }
    } catch(e) {
      console.log(e);

      return {
        ...props,
        data: null,
        isLoaded: false,
      }
    }
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
      selectedDimensions: getDefaultDimensions(this.props.dimensions),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        data: this.props.data,
        selectedDimensions: getDefaultDimensions(this.props.dimensions),
      })
    }
  }

  handleZoom(domain) {
    this.setState({ selectedDomain: domain });
  }

  handleBrush(domain) {
    this.setState({ zoomDomain: domain });
  }

  handleDataSetSelect = (event) => {
    const id = event.target.value;
    Router.push(`/data?id=${id}`);
  }

  handleDimensionSelect = async (event, dimensionIndex) => {
    const ids = [...event.target.options].filter(({selected}) => selected).map(({value}) => value);

    if (ids.length > 0) {
      const dimensionId = event.target.value;
      const selectedDimensions = this.state.selectedDimensions;
      const dataSetId = this.props.id;

      // Update selectedDimensions array with selected dimensionId
      selectedDimensions[dimensionIndex] = ids;

      this.props.dispatch(getData(buildApiUrl({
        selectedDimensions,
        dataSetId,
      })));

      const res = await axios.get(buildApiUrl({
        selectedDimensions,
        dataSetId,
      }));

      this.setState({
        data: res.data,
        selectedDimensions,
      })
    }
  }

  render() {
    console.log(this.props.isLoading);
    console.log(this.props.data2);
    const chartStyle = {
      parent: {
      }
    };
    const { data } = this.state;
    const { dataSets, dimensions, isLoaded } = this.props;
    // console.log(isLoaded);

    let victoryData = [];
    let chartType;

    // console.log('data', data);

    if (isLoaded && data) {
      // Work out chart type based on data
      const timePeriods = getTimePeriods(data);
      victoryData = buildVictoryData(data);
      chartType = getChartType(timePeriods && timePeriods.length);
      console.log('chartType: ' + chartType);
    }
    // console.log('victoryData');
    // console.log(victoryData);
    // console.log(chartType);

    return (
      <Page>
        <style>

        </style>

        <aside className="sidebar">
          <div className="logo">
            <span className="logo__abs">ABS</span> <span className="logo__text">Data Explorer</span> <span style={{ fontSize: '0.4em' }}>beta</span>
          </div>

          <div className="data-set-box">
            <h4>Data Set</h4>
            <select
              value={this.props.id}
              onChange={(event) => this.handleDataSetSelect(event)}
            >
              {dataSets && dataSets.map((dataSet) => {
                return (
                  <option value={dataSet.id}>{dataSet.title}</option>
                );
              })}
            </select>
          </div>

          {/* <Select
            value={this.props.id}
            options={dataSets && dataSets.map((dataSet) => {
              return {
                value: dataSet.key,
                label: dataSet.name,
              }
            })}
            onChange={this.handleDataSetSelect2}
          /> */}

          <div>
            {this.state.selectedDimensions && dimensions && dimensions.map((dimension, i) => {
              const options = dimension.values;
              const currentDimensionIds = this.state.selectedDimensions[i];

              return (
                <div className="dimension-box">
                  <h5>{dimension.name}</h5>
                  <select
                    multiple
                    value={currentDimensionIds}
                    onChange={(event) => this.handleDimensionSelect(event, i)}
                  >
                    {options.map((option) => {
                      return (
                        <option value={option.id}>{option.name}</option>
                      );
                    })}
                  </select>
                </div>
              );
            })}
          </div>
        </aside>

          <main className="content" style={{
          }}>
            <Measure
              onMeasure={(dimensions) => {
                this.setState({ dimensions });
              }}
            >
              <div>
                <div className="header">
                  <div className="header__id">{this.props.id}</div>
                  <h3 className="header__title">{this.props.dataSet && this.props.dataSet.name}</h3>

                  <div className="header__dimensions">
                    {this.state.selectedDimensions && dimensions && dimensions.map((dimension, i) => {
                      const currentDimensionIds = this.state.selectedDimensions[i];

                      const results = (dimension.values.filter((item) => {
                        return currentDimensionIds && currentDimensionIds.indexOf(item.id) > -1 ? true : false;
                      }));

                      return results && results[0] && (
                        <div className="header__dimension">
                          <span className="header__dimension__name">
                            {dimension.name}
                          </span>
                          <span className="header__dimension__current">
                            {results.map((result, i) => {
                              const legendLabel = results.length > 1 ? (
                                <span style={{
                                  display: 'inline-block',
                                  backgroundColor: colors[i],
                                  width: '1em',
                                  height: '1em',
                                  marginRight: '0.2em',
                                }}></span>
                              ) : '';
                              return (
                                <span>{i > 0 && `, `}{legendLabel}{result.name}</span>
                              )
                            })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {(typeof window !== 'undefined' && this.state.dimensions) ? (
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
              </div>
            </Measure>
          </main>
      </Page>
    );
  }
}

export default withRedux(initStore)(connect(state => state)(Data));
