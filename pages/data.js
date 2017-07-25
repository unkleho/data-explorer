import { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Measure from 'react-measure';
import withRedux from 'next-redux-wrapper';
// import { blueGrey } from 'material-colors';

import styles from './data.css';
import App from '../components/App';
// import LoadingBar from '../components/LoadingBar';
import DataContent from '../components/DataContent';
import DataHeader from '../components/DataHeader';
// import DataAside from '../components/DataAside';
// import Modal from '../components/Modal';
import theme from '../styles/victoryTheme';
// import { colors } from '../styles/variables';
import { initStore } from '../store';
import {
  getDataSets,
  getDataSet,
  getData,
  // selectMainDimensionId,
} from '../actions';
import {
  buildVictoryData,
  // buildApiUrl,
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
    query: PropTypes.shape({
      id: PropTypes.string,
      sourceId: PropTypes.string,
    }),
  }

  constructor() {
    super();

    this.state = {
    };
  }

  static async getInitialProps ({ query: { id = null, sourceId = 'ABS' }, isServer, store }) {
    // Work out if custom default dataSet exists
    const defaultId = allData[sourceId].defaultDataSetId;
    const newId = id || defaultId || allData[sourceId].dataSets.children[0].id;

    await store.dispatch(getDataSets(sourceId));
    await store.dispatch(getDataSet(newId, sourceId));

    return {
      id: newId,
      sourceId,
    }
  }

  handleDataSetSelect = (id) => {
    Router.push(`/data?id=${id}&sourceId=${this.props.sourceId}`);
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

      this.props.dispatch(getData(selectedDimensions, dataSetId, this.props.sourceId));
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

      this.props.dispatch(getData(selectedDimensions, dataSetId, this.props.sourceId));
    }
  }

  handleMenuClick = (event) => {
    this.props.dispatch({
      type: 'TOGGLE_MENU',
    })
  }

  handleMainDimensionIdSelect = (id, dimensionId) => {
    console.log('handleMainDimensionIdSelect');
    // TODO: May be not used - cleanup
    // this.props.dispatch(selectMainDimensionId(id, dimensionId));
    const selectedDimensions = this.props.selectedDimensions.map((selectedDimension, i) => {
      if (i === dimensionId) {
        return toggleArrayItem(selectedDimension, id);
      } else {
        return selectedDimension;
      }
    });

    this.props.dispatch(getData(selectedDimensions, this.props.id, this.props.sourceId));
  }

  handleMainDimensionSelect = (mainDimensionIndex) => {
    const defaultDimensions = getDefaultDimensions(this.props.dimensions, this.props.id);

    this.props.dispatch(getData(defaultDimensions, this.props.id, this.props.sourceId));
    this.props.dispatch({
      type: 'SELECT_MAIN_DIMENSION',
      mainDimensionIndex,
      selectedDimensions: defaultDimensions,
    })
  }

  render() {
    const chartStyle = {
      parent: {
      },
    };

    const {
      sourceTitle,
      // dataSet,
      dataSets,
      dimensions,
      isLoaded,
      isLoading,
      data,
      selectedDimensions,
      isMenuActive,
      url,
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
      <App url={url}>

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

        <main className="content container">
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

          <p style={{ fontSize: '0.6em', float: 'right', textAlign: 'right' }}>
            Source: {sourceTitle}<br/>
            Disclaimer: This website is in active development. Charts may not be accurate.
          </p>
        </main>

        <style jsx>{styles}</style>
      </App>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state,
  }
}


export default withRedux(initStore, mapStateToProps)(Data);
