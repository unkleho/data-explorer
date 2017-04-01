import { Component } from 'react';
import { VictoryZoomContainer, VictoryBrushContainer, VictoryAxis, VictoryChart, VictoryLine } from 'victory';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head'

import { buildVictoryData, getName, buildApiUrl, buildMetaApiUrl, buildDataSets, getDefaultDimensionIds } from '../utils';
import data from '../data/data';
import dataSetsRaw from '../data/dataSets';

class Page extends Component {

  constructor() {
    super();
    this.state = {
      data: null,
      dataSetKey: 'BIRTHS_SUMMARY',
      dataSet: null, // Current dataSet
      dataSets: buildDataSets(dataSetsRaw),
    };
  }

  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  componentDidMount() {
    // Work out default dimensionIds
    console.log(this.props.id);
    if (this.props.id) {
      this.setState({
        dataSetKey: this.props.id,
      })
    }
    // const dimensionIds = getDefaultDimensionIds(this.state.dataSet.dimensions.observation);
    // console.log(dimensionIds);

    const dataSetKey = this.props.id;

    // Get dataSet meta
    axios.get(buildMetaApiUrl(dataSetKey))
      .then(data => {
        const dimensions = data.data.structure.dimensions.observation;

        this.setState({
          dataSet: data.data.structure,
          dimensions,
          dimensionIds: getDefaultDimensionIds(dimensions),
        });

        // Get data!
        axios.get(buildApiUrl({
          dimensionIds: getDefaultDimensionIds(dimensions),
          dataSetKey: dataSetKey,
        }))
          .then(data => {
            this.setState({ data: data.data });
          })
      })
  }

  handleZoom(domain) {
    this.setState({selectedDomain: domain});
  }

  handleBrush(domain) {
    this.setState({zoomDomain: domain});
  }

  handleDataSetSelect = (event) => {
    const dataSetKey = event.target.value;

    // Router.push(`/data/${dataSetKey}`);
    window.history.pushState(null, null,`/data/${dataSetKey}`);

    // Get new dataSet meta data
    axios.get(buildMetaApiUrl(dataSetKey))
      .then(data => {
        console.log('buildMetaApiUrl');
        // console.log(data);
        const dimensions = data.data.structure.dimensions.observation;
        // Workout default dimensionIds
        const dimensionIds = getDefaultDimensionIds(dimensions);
        console.log(dimensionIds);
        // const dimensionIds = this.state.dimensionIds;

        // Get data
        axios.get(buildApiUrl({ dimensionIds: dimensionIds, dataSetKey }))
          .then(data => {
            this.setState({ data: data.data });
          })

        this.setState({
          dataSet: data.data.structure,
          dimensions: data.data.structure.dimensions.observation,
          dataSetKey,
          dimensionIds,
        });
      })
  }

  handleDimensionSelect = (event, dimensionIndex) => {
    const dimensionId = event.target.value;
    const dimensionIds = this.state.dimensionIds;
    const dataSetKey = this.props.id;

    // const dataSetKey = this.state.dataSetKey;
    // const dimensions = this.state.dataSet.dimensions.observation;
    // console.log(dimensions);

    // Update dimensionIds array with selected dimensionId
    dimensionIds[dimensionIndex] = dimensionId;

    console.log('dimensionIds');
    console.log(dimensionIds);

    axios.get(buildApiUrl({
      dimensionIds: dimensionIds,
      // dimensionIds: getDefaultDimensionIds(dimensions),
      dataSetKey
    }))
      .then(data => {
        // console.table(buildVictoryData(data.data));
        this.setState({
          data: data.data,
          dimensionIds,
        });
      })
  }

  render() {
    const chartStyle = { parent: {minWidth: "100%", marginLeft: "10%"}};

    const victoryData = this.state.data && buildVictoryData(this.state.data);
    console.log('victoryData');
    console.log(victoryData);
    // console.log(this.state.dimensionIds);

    // console.log(this.state.dataSet.dimensions);
    const dataSets = this.state.dataSets;
    const dimensions = this.state.dataSet && this.state.dataSet.dimensions.observation;
    console.log('dimensions');
    console.log(dimensions);
    // console.log(this.state.dataSet && this.state.dataSet.dimensions.observation);
    return (
      <div style={{
        // fontFamily: 'Libre Baskerville, serif',
        // fontFamily: 'Libre Franklin, sans-serif',
        display: 'flex',
      }}>
        <style jsx global>{`
          body {
            background: white;
            font-family: 'Lato', sans-serif;
            // letter-spacing: -0.03em;
          }

          h1 {
            font-family: 'Libre Baskerville', serif;
            font-size: 1.2em;
          }

          h2 {
            font-family: 'Lato', sans-serif;
            font-weight: 700;
            font-size: 0.8em;
            text-transform: uppercase;
          }
        `}</style>

        <Head>
          <title>My page title</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link href="https://fonts.googleapis.com/css?family=Lato:400,700,900|Libre+Baskerville:400,400i,700" rel="stylesheet" />
        </Head>

        <aside className="sidebar" style={{
          width: '20em',
          overflow: 'hidden',
          paddingRight: '2em',
        }}>
          <h2>Data Set</h2>
          <select value={this.state.dataSetKey} onChange={(event) => this.handleDataSetSelect(event)}>
            {dataSets.map((dataSet) => {
              return (
                <option value={dataSet.key}>{dataSet.name}</option>
              );
            })}
          </select>

          <div style={{
            // display: 'flex',
          }}>
            {dimensions && dimensions.map((dimension, i) => {
              const options = dimension.values;
              const currentDimensionId = this.state.dimensionIds[i];
              return (
                <div style={{
                  // marginBottom: '1em',
                  paddingBottom: '1em',
                  borderTop: '1px solid #EEE',
                }}>
                  <h2>{dimension.name}</h2>
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
          paddingLeft: '2em',
        }}>
          <h1>{this.state.dataSet && this.state.dataSet.name}</h1>

          <VictoryChart width={600} height={400} scale={{x: "time"}} style={chartStyle}
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
                data: {stroke: "tomato"}
              }}
              data={victoryData}
            />

          </VictoryChart>

          <VictoryChart
            padding={{top: 0, left: 50, right: 50, bottom: 30}}
            width={600} height={100} scale={{x: "time"}} style={chartStyle}
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
                data: {stroke: "tomato"}
              }}
              data={victoryData}
            />
          </VictoryChart>
        </main>

      </div>
    );
  }
}

export default Page;
