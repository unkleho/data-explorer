import { Component } from 'react';
import { VictoryZoomContainer, VictoryBrushContainer, VictoryAxis, VictoryChart, VictoryLine } from 'victory';
import axios from 'axios';
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
      // dataSets: [
      //   {
      //     key: 'BIRTHS_SUMMARY',
      //     name: 'Births, summary, by state',
      //   },
      //   {
      //     key: 'CPI',
      //     name: 'Consumer Price Index (CPI) 16th Series',
      //   },
      // ],
      // dimensions: [
      //   {
      //     name: 'Measure',
      //     options: [
      //       { id: 1, name: 'Births' },
      //       { id: 2, name: 'Poplulation' },
      //       { id: 3, name: 'Crude birth rate' },
      //       { id: 4, name: 'Male births' },
      //       { id: 5, name: 'Female births' },
      //       { id: 6, name: 'Sex ratio' },
      //       { id: 7, name: 'Nuptial births' },
      //       { id: 8, name: 'Ex-nuptial births' },
      //       { id: 9, name: 'Ex-nuptial, paternity acknowledged births' },
      //       { id: 10, name: 'Ex-nuptial, paternity not acknowledged births' },
      //     ],
      //   },
      //   {
      //     name: 'Region',
      //     options: [
      //       { id: 0, name: 'Australia' },
      //       { id: 1, name: 'New South Wales' },
      //       { id: 2, name: 'Victoria' },
      //       { id: 3, name: 'Queensland' },
      //       { id: 4, name: 'South Australia' },
      //       { id: 5, name: 'Western Australia' },
      //       { id: 6, name: 'Tasmania' },
      //       { id: 7, name: 'Northern Territory' },
      //       { id: 8, name: 'Australian Capital Territory' },
      //     ],
      //   },
      //   {
      //     name: 'Frequency',
      //     options: [
      //       { id: 'A', name: 'Annual' },
      //     ],
      //   },
      // ],
    };
  }

  componentDidMount() {
    // Work out default dimensionIds
    console.log(this.state.dataSet);
    // const dimensionIds = getDefaultDimensionIds(this.state.dataSet.dimensions.observation);
    // console.log(dimensionIds);

    // Get dataSet meta
    axios.get(buildMetaApiUrl(this.state.dataSetKey))
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
          dataSetKey: this.state.dataSetKey,
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
    const dataSetKey = this.state.dataSetKey;
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
    // console.log(this.state.dataSet && this.state.dataSet.dimensions.observation);
    return (
      <div style={{
        fontFamily: 'Arial',
      }}>
        <h1>{this.state.dataSet && this.state.dataSet.name}</h1>
        <p>{this.state.dataSetKey}</p>
          <select value={this.state.dataSetKey} onChange={(event) => this.handleDataSetSelect(event)}>
            {dataSets.map((dataSet) => {
              return (
                <option value={dataSet.key}>{dataSet.name}</option>
              );
            })}
          </select>

          <div style={{
            display: 'flex',
          }}>
            {dimensions && dimensions.map((dimension, i) => {
              const options = dimension.values;
              const currentDimensionId = this.state.dimensionIds[i];
              return (
                <div>
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

          {/* <select onChange={this.handleDimensionSelect}>
            <option value={1}>Births</option>
            <option value={2}>Population</option>
            <option value={3}>Crude Birth Rate</option>
            <option value={4}>Male Births</option>
            <option value={5}>Female Births</option>
            <option value={6}>Sex Ratio</option>
            <option value={7}>Nuptial Births</option>
            <option value={8}>Ex-nuptial Births</option>
          </select> */}
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
            {/* <VictoryAxis
              tickValues={[
                new Date(1975, 1, 1),
                new Date(1980, 1, 1),
                new Date(1985, 1, 1),
                new Date(1990, 1, 1),
                new Date(1995, 1, 1),
                new Date(2000, 1, 1),
                new Date(2005, 1, 1),
                new Date(2010, 1, 1),
                new Date(2015, 1, 1)
              ]}
              tickFormat={(x) => new Date(x).getFullYear()}
            /> */}
            <VictoryLine
              style={{
                data: {stroke: "tomato"}
              }}
              data={victoryData}
            />
          </VictoryChart>

      </div>
    );
  }
}

export default Page;
