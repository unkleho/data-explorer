import { Component, PropTypes } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import Measure from 'react-measure';
import Select from 'react-select';
import withRedux from 'next-redux-wrapper';
import { blueGrey } from 'material-colors';

import Page from '../components/Page';
import LoadingBar from '../components/LoadingBar';
import DataContent from '../components/DataContent';
import DataHeader from '../components/DataHeader';
import DataAside from '../components/DataAside';
// import Modal from '../components/Modal';
import theme from '../styles/victoryTheme';
import { colors } from '../styles/variables';
import { initStore } from '../store';
import {
  getDataSets,
  getDataSet,
  getData,
  selectMainDimensionId,
} from '../actions';
import {
  buildVictoryData,
  buildApiUrl,
  getTimePeriods,
  getChartType,
  toggleArrayItem,
  getDefaultDimensions,
  getDimensionColourMap,
} from '../utils';
import allData from '../data';

class Data extends Component {

  static propTypes = {
    id: PropTypes.string,
  }

  constructor() {
    super();

    this.state = {
    };
  }

  static async getInitialProps ({ query: { id = null, source }, isServer, store }) {
    // Work out if custom default dataSet exists
    const defaultId = allData[source].defaultDataSetId;
    const newId = id || defaultId || allData[source].dataSets.children[0].id;    

    // TODO: Let's do this properly hey... get it from 'data'
    // if (!id && source === 'ABS') {
    //   newId = 'LF';
    // } else if (!id && source === 'OECD') {
    //   newId = 'SNA_TABLE1';
    // } else if (!id && source === 'UNESCO') {
    //   newId = 'DEMO_DS';
    // } else {
    //   newId = id;
    // }

    await store.dispatch(getDataSets(source));
    await store.dispatch(getDataSet(newId, source));

    return {
      id: newId,
      source,
    }
  }

  handleDataSetSelect = (id) => {
    Router.push(`/data?id=${id}&source=${this.props.source}`);
  }

  handleDimensionSelect = async (options, dimensionIndex) => {
    let ids = [];
    ids[0] = options.value;
    // console.log(options);

    if (ids.length > 0) {
      const selectedDimensions = this.props.selectedDimensions;
      const dataSetId = this.props.id;

      // Update selectedDimensions array with selected dimensionId
      selectedDimensions[dimensionIndex] = ids;

      this.props.dispatch(getData(buildApiUrl({
        selectedDimensions,
        dataSetId,
        baseApiUrl: 'http://stats.oecd.org/sdmx-json',
      })));
    }

    // Cool little script for html multi select
    // const ids = [...event.target.options].filter(({ selected }) => selected).map(({ value }) => value);
    // const ids = options.map((option) => {
    //   return option.value;
    // });
  }

  handleMultiDimensionSelect = (options, dimensionIndex) => {
    const ids = options.map((option) => {
      return option.value;
    });

    if (ids.length > 0) {
      const selectedDimensions = this.props.selectedDimensions;
      const dataSetId = this.props.id;

      // Update selectedDimensions array with selected dimensionId
      selectedDimensions[dimensionIndex] = ids;

      this.props.dispatch(getData(buildApiUrl({
        selectedDimensions,
        dataSetId,
        baseApiUrl: 'http://stats.oecd.org/sdmx-json',
      })));
    }
  }

  handleMenuClick = (event) => {
    this.props.dispatch({
      type: 'TOGGLE_MENU',
    })
  }

  handleMainDimensionIdSelect = (id, dimensionId) => {
    // this.props.dispatch(selectMainDimensionId(id, dimensionId));

    this.props.dispatch(getData(buildApiUrl({
      selectedDimensions: this.props.selectedDimensions.map((selectedDimension, i) => {
        if (i === dimensionId) {
          return toggleArrayItem(selectedDimension, id);
        } else {
          return selectedDimension;
        }
      }),
      dataSetId: this.props.id,
    })));
  }

  handleMainDimensionSelect = (mainDimensionIndex) => {
    const defaultDimensions = getDefaultDimensions(this.props.dimensions, this.props.id);

    this.props.dispatch(getData(buildApiUrl({
      selectedDimensions: defaultDimensions,
      dataSetId: this.props.id,
    })));

    this.props.dispatch({
      type: 'SELECT_MAIN_DIMENSION',
      mainDimensionIndex,
      selectedDimensions: defaultDimensions,
    })
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
      selectedDimensions,
      isMenuActive,
    } = this.props;
    const mainDimensionIndex = this.props.mainDimensionIndex || 0;
    const mainDimension = dimensions[mainDimensionIndex];
    const selectedMainDimension = selectedDimensions[mainDimensionIndex];

    // let colourMap;
    const colourMap = getDimensionColourMap(selectedMainDimension, mainDimension.values);

    let victoryData = [];
    let chartType;

    if (isLoaded && data) {
      // Work out chart type based on data
      const timePeriods = getTimePeriods(data);
      victoryData = buildVictoryData(data);
      chartType = getChartType(timePeriods && timePeriods.length);
      // console.log('chartType: ' + chartType);
    }

    return (
      <Page>

        {isMenuActive && (
          <DataHeader
            id={this.props.id}
            dataSets={dataSets}
            selectedDimensions={selectedDimensions}
            dimensions={dimensions}
            mainDimensionIndex={mainDimensionIndex}
            onDataSetSelect={this.handleDataSetSelect}
            onDimensionSelect={this.handleDimensionSelect}
            onMultiDimensionSelect={this.handleMultiDimensionSelect}
            onMainDimensionSelect={this.handleMainDimensionSelect}
            onMainDimensionIdSelect={this.handleMainDimensionIdSelect}
          />
        )}

        {/* <DataAside
          mainDimensionIndex={mainDimensionIndex || 0}
          selectedDimensions={selectedDimensions}
          dimensions={dimensions}
          onMainDimensionIdSelect={this.handleMainDimensionIdSelect}
          onMainDimensionSelect={this.handleMainDimensionSelect}
        ></DataAside> */}

        <main className="content">
          <Measure
            onMeasure={(dimensions) => {
              this.setState({ dimensions });
            }}
          >
            <div>
              {isMenuActive && (
                <div className="overlay" onClick={this.handleMenuClick}>
                </div>
              )}

              {/* <div className="content-header">
                <button className="" onClick={this.handleMenuClick}>Menu</button>

                <div className="content-header__id">{this.props.id}</div>
                <h3 className="content-header__title">{dataSet && dataSet.name}</h3>

                <div className="content-header__dimensions">
                  {selectedDimensions && dimensions && dimensions.map((dimension, i) => {
                    const currentDimensionIds = selectedDimensions[i];

                    const results = (dimension.values.filter((item) => {
                      return currentDimensionIds && currentDimensionIds.indexOf(item.id) > -1 ? true : false;
                    }));

                    return results && results[0] && (
                      <div className="content-header__dimension">
                        <span className="content-header__dimension__name">
                          {dimension.name}
                        </span>
                        <span className="content-header__dimension__current">
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
              </div> */}

              {(typeof window !== 'undefined' && this.state.dimensions) ? (
                <div className="content">
                  {isLoading && (
                    <p className="loading">Loading</p>
                  )}
                  <DataContent
                    victoryData={victoryData}
                    chartStyle={chartStyle}
                    theme={theme}
                    width={this.state.dimensions.width}
                    height={this.state.dimensions.height}
                    chartType={chartType}
                    colourMap={colourMap}
                  />
                </div>
              ) : (
                <p><br/>Loading..</p>
              )
            }
            </div>
          </Measure>

          <p style={{ fontSize: '0.6em', float: 'right' }}>Source: Australian Bureau of Statistics</p>
        </main>

        <style jsx>{`
          /*.overlay {
            position: absolute;
            z-index: 50;
            background-color: white;
            opacity: 0.5;
            width: 100%;
            height: 100%;

            @media(min-width: 32em) {
              display: none;
            }
          }*/

          main {
            width: 100%;
            line-height: 1.27777778em;
            padding-left: calc(1.27777778em * 1);
            padding-right: calc(1.27777778em * 1);
            background-color: white;

            @media(min-width: 32em) {
              /*lost-column: 3/4;*/

              padding-left: calc(1.27777778em * 2);
              padding-right: calc(1.27777778em * 3);
            }
          }

          .content {
            position: relative;
          }

          .loading {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            background-color: rgba(0,0,0,0.05);
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }
        `}</style>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state,
  }
}


export default withRedux(initStore, mapStateToProps)(Data);
