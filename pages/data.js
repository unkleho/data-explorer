import { Component, PropTypes } from 'react';
import {
  VictoryZoomContainer,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryPie,
} from 'victory';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import Measure from 'react-measure';
import Select from 'react-select';

import Page from '../components/Page';
import theme from '../styles/victoryTheme';
import { buildVictoryData, getName, buildApiUrl, buildMetaApiUrl, buildDataSets, getDefaultDimensionIds, getObservations } from '../utils';
import data from '../data/data';
import dataSetsRaw from '../data/dataSets';

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

  static async getInitialProps ({ query: { id } }) {
    // Get dataSet metadata
    const res = await axios.get(buildMetaApiUrl(id));
    const dataSet = res.data.structure;
    const dimensions = dataSet.dimensions.observation;
    const dimensionIds = getDefaultDimensionIds(dimensions);

    try {
      // Get data!
      const res2 = await axios.get(buildApiUrl({
        dimensionIds,
        dataSetKey: id,
      }));
      const data = res2.data;

      return {
        id,
        dataSet,
        dataSets: buildDataSets(dataSetsRaw), // List of DataSets
        data,
        dimensions,
      }
    } catch(e) {
      console.log(e);

      return {
        id,
        dataSet,
        dataSets: buildDataSets(dataSetsRaw), // List of DataSets
        dimensions,
      }
    }
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
      dimensionIds: getDefaultDimensionIds(this.props.dimensions),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        data: this.props.data,
        dimensionIds: getDefaultDimensionIds(this.props.dimensions),
      })
    }
  }

  handleZoom(domain) {
    this.setState({selectedDomain: domain});
  }

  handleBrush(domain) {
    this.setState({ zoomDomain: domain });
  }

  handleDataSetSelect = (event) => {
    const id = event.target.value;
    Router.push(`/data?id=${id}`);
  }

  handleDataSetSelect2 = (selected) => {
    // console.log(selected.value);
    Router.push(`/data?id=${selected.value}`);
  }

  handleDimensionSelect = async (event, dimensionIndex) => {
    const dimensionId = event.target.value;
    const dimensionIds = this.state.dimensionIds;
    const dataSetKey = this.props.id;

    // Update dimensionIds array with selected dimensionId
    dimensionIds[dimensionIndex] = dimensionId;

    const res = await axios.get(buildApiUrl({
      dimensionIds: dimensionIds,
      dataSetKey,
    }));

    this.setState({
      data: res.data,
      dimensionIds,
    })
  }

  render() {
    const chartStyle = {
      parent: {
        // minWidth: "100%",
        // marginLeft: "10%",
      }
    };
    const { data } = this.state;
    const { dataSets, dimensions } = this.props;
    const victoryData = data && buildVictoryData(data);
    // console.log('victoryData');
    // console.log(victoryData);

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
                  <option value={dataSet.key}>{dataSet.name}</option>
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
            {this.state.dimensionIds && dimensions && dimensions.map((dimension, i) => {
              const options = dimension.values;
              const currentDimensionId = this.state.dimensionIds[i];
              return (
                <div className="dimension-box">
                  <h5>{dimension.name}</h5>
                  <select
                    value={currentDimensionId}
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
                    {this.state.dimensionIds && dimensions && dimensions.map((dimension, i) => {
                      const currentDimensionId = this.state.dimensionIds[i];
                      const result = (dimension.values.filter((item) => {
                        return item.id === currentDimensionId;
                      }));

                      return result[0] && (
                        <div className="header__dimension">
                          <span className="header__dimension__name">
                            {dimension.name}
                          </span>
                          <span className="header__dimension__current">
                            {result[0].name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {victoryData && victoryData.length > 0 ? (
                  <div>
                    {/* <VictoryPie
                      innerRadius={50}
                      data={[
                        {month: "September", y:5000},
                        {month: "October", y: 5000},
                        {month: "November", y: 5000},
                      ]}
                      x="month"
                      // y={(datum) => datum.profit - datum.loss}
                    /> */}

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
                      <VictoryLine
                        style={{
                          // data: {
                          //   stroke: "tomato",
                          // }
                        }}
                        data={victoryData}
                      />

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
                      <VictoryLine
                        style={{
                          // data: {
                          //   stroke: "tomato"
                          // }
                        }}
                        data={victoryData}
                      />
                    </VictoryChart>
                  </div>
                ) : (
                  <p>No data, try changing a dimension.</p>
                )
              }
              </div>
            </Measure>
          </main>
      </Page>
    );
  }
}

export default Data;
