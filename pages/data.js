import { Component, PropTypes } from 'react';
import {
  VictoryZoomContainer,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
} from 'victory';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head'

import { buildVictoryData, getName, buildApiUrl, buildMetaApiUrl, buildDataSets, getDefaultDimensionIds, getObservations } from '../utils';
import data from '../data/data';
import dataSetsRaw from '../data/dataSets';

class Page extends Component {

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
    console.log('victoryData');
    console.log(victoryData);

    return (
      <div style={{
        display: 'flex',
      }}>
        <style jsx global>{`
          html {
            box-sizing: border-box;
          }

          *, *:before, *:after {
            box-sizing: inherit;
          }

          body {
            position: relative;
            background: white;
            font-family: 'Lato', sans-serif;
            margin: 0;
            font-size: 18px;
            line-height: 23px;
            color: #404040;
            // letter-spacing: -0.03em;
          }

          body::after {
            // background: linear-gradient(to bottom, hsla(280, 50%, 30%, .3), hsla(280, 50%, 30%, .3) 1px, transparent 1px, transparent);
            // background-size: 100% 1.27777778em;
            // bottom: 0;
            // content: "";
            // display: block;
            // left: 0;
            // position: absolute;
            // right: 0;
            // top: 0;
            // z-index: 9999;
            // pointer-events: none;
          }

          h1, .h1 {
            font-family: 'Libre Baskerville', serif;
            font-size: 4.22222222em;
            line-height: 1.21052632em;
            margin-top: 0.30263158em;
            margin-bottom: 0.60526316em;
          }

          h2, .h2 {
            font-family: 'Libre Baskerville', serif;
            font-size: 2.61111111em;
            line-height: 1.46808511em;
            margin-top: 0.4893617em;
            margin-bottom: 0.4893617em;
          }

          h3, .h3 {
            font-weight: 900;
            font-family: 'Lato', sans-serif;
            font-size: 1.61111111em;
            line-height: 1.5862069em;
            margin-top: 0.79310345em;
            margin-bottom: 0em;
            max-width: 20em;
            // text-align: center;
          }

          h4, .h4 {
            font-size: 1em;
            line-height: 1.27777778em;
            margin-top: 1.27777778em;
            margin-bottom: 0em;
          }

          h5, .h5 {
            font-size: 1em;
            line-height: 1.27777778em;
            margin-top: 1.27777778em;
            margin-bottom: 0em;
          }

          p, ul, ol, pre, table, blockquote {
            margin-top: 0em;
            margin-bottom: 1.27777778em;
          }

          ul ul, ol ol, ul ol, ol ul {
            margin-top: 0em;
            margin-bottom: 0em;
          }

          /* Let's make sure all's aligned */
          hr, .hr {
            border: 1px solid;
            margin: -1px 0;
          }

          a, b, i, strong, em, small, code {
            line-height: 0;
          }

          sub, sup {
            line-height: 0;
            position: relative;
            vertical-align: baseline;
          }

          sup {
            top: -0.5em;
          }

          sub {
            bottom: -0.25em;
          }

          select {
            max-width: 100%;
          }

          main {
            line-height: 1.27777778em;
            // padding-right: 1.27777778em;
            padding-left: calc(1.27777778em * 2);
          }

          aside {
            line-height: 1.27777778em;
            padding-left: 1.27777778em;
            width: 20em;
            overflow: hidden;
          }
        `}</style>

        <Head>
          <title>ABS Data Explorer</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link href="https://fonts.googleapis.com/css?family=Lato:400,700,900|Libre+Baskerville:400,400i,700" rel="stylesheet" />
        </Head>

        <aside className="sidebar" style={{
        }}>
          <h4>Data Set</h4>
          <select value={this.props.id} onChange={(event) => this.handleDataSetSelect(event)}>
            {dataSets && dataSets.map((dataSet) => {
              return (
                <option value={dataSet.key}>{dataSet.name}</option>
              );
            })}
          </select>

          <div style={{
            // display: 'flex',
          }}>
            {this.state.dimensionIds && dimensions && dimensions.map((dimension, i) => {
              const options = dimension.values;
              const currentDimensionId = this.state.dimensionIds[i];
              return (
                <div style={{
                  // marginBottom: '1em',
                  // paddingBottom: '1em',
                  // borderTop: '1px solid #EEE',
                }}>
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
          <h3>{this.props.dataSet && this.props.dataSet.name}</h3>

          {victoryData && victoryData.length > 0 ? (
            <div>
              <VictoryChart
                animate={{ duration: 500 }}
                width={700}
                height={400}
                scale={{x: "time"}}
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
                    data: {
                      stroke: "tomato",
                    }
                  }}
                  data={victoryData}
                />

              </VictoryChart>

              <VictoryChart
                padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
                animate={{ duration: 500 }}
                width={700}
                height={100}
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
                <VictoryLine
                  style={{
                    data: {
                      stroke: "tomato"
                    }
                  }}
                  data={victoryData}
                />
              </VictoryChart>
            </div>
          ) : (
            <p>No data</p>
          )
        }
        </main>

      </div>
    );
  }
}

export default Page;
