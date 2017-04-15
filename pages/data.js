import { Component, PropTypes } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import Measure from 'react-measure';
import Select from 'react-select';
import withRedux from 'next-redux-wrapper';

import Page from '../components/Page';
import LoadingBar from '../components/LoadingBar';
import Content from '../components/Content';
import Sidebar from '../components/Sidebar';
import theme from '../styles/victoryTheme';
import { colors } from '../styles/variables';
import { initStore, getData, getDataSet } from '../store';
import {
  buildVictoryData,
  buildApiUrl,
  buildDataSets,
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
    };
  }

  static async getInitialProps ({ query: { id }, isServer, store }) {
    const dataSets = buildDataSets(dataSetsRaw); // List of DataSets

    console.log('getInitialProps');
    console.log(isServer);

    await store.dispatch(getDataSet(id));

    return {
      dataSets,
    }
  }

  handleDataSetSelect = (event) => {
    const id = event.target.value;
    Router.push(`/data?id=${id}`);
  }

  handleDimensionSelect = async (event, dimensionIndex) => {
    const ids = [...event.target.options].filter(({selected}) => selected).map(({value}) => value);

    if (ids.length > 0) {
      const selectedDimensions = this.props.selectedDimensions;
      const dataSetId = this.props.id;

      // Update selectedDimensions array with selected dimensionId
      selectedDimensions[dimensionIndex] = ids;

      this.props.dispatch(getData(buildApiUrl({
        selectedDimensions,
        dataSetId,
      })));
    }
  }

  render() {
    const chartStyle = {
      parent: {
      }
    };

    const {
      dataSet,
      dataSets,
      dimensions,
      isLoaded,
      isLoading,
      data,
      selectedDimensions
    } = this.props;
    // console.log('render');
    // console.log(selectedDimensions, dimensions);

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
        {isLoading && (
          <LoadingBar />
        )}

        <Sidebar
          id={this.props.id}
          dataSets={dataSets}
          selectedDimensions={selectedDimensions}
          dimensions={dimensions}
          handleDataSetSelect={this.handleDataSetSelect}
          handleDimensionSelect={this.handleDimensionSelect}
        />

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
                    {selectedDimensions && dimensions && dimensions.map((dimension, i) => {
                      const currentDimensionIds = selectedDimensions[i];

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
                    <Content
                      victoryData={victoryData}
                      chartStyle={chartStyle}
                      theme={theme}
                      width={this.state.dimensions.width}
                      height={this.state.dimensions.height}
                      chartType={chartType}
                    />
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

function mapStateToProps(state) {
  // console.log('mapStateToProps');
  // console.log(state);

  return {
    ...state,
  }
}


export default withRedux(initStore, mapStateToProps)(Data);
