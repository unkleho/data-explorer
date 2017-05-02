import { Component, PropTypes } from 'react';
import { blueGrey } from 'material-colors';
import Select from 'react-select';
import Router from 'next/router';

import { blueGrey50, blueGrey100, blueGrey300, blueGrey700, deepOrange600, colors } from '../styles/variables';
import DataSetSelector from '../components/DataSetSelector';

class DataHeader extends Component {

  constructor() {
    super();

    this.state = {
      showDataSetSelector: false,
    }
  }

  handleDataSetSelect = (id) => {
    this.setState({
      showDataSetSelector: false,
    })

    Router.push(`/data?id=${id}`);
  }

  handleDataSetTitleClick = (event) => {
    this.setState({
      showDataSetSelector: !this.state.showDataSetSelector,
    })
  }

  handleDimensionSelect = (options, selectedDimensionIndex) => {
    this.props.onDimensionSelect(options, selectedDimensionIndex);
  }

  handleMultiDimensionSelect = (options, selectedDimensionIndex) => {
    this.props.onMultiDimensionSelect(options, selectedDimensionIndex);
  }

  render() {
    const {
      id,
      dataSets,
      selectedDimensions,
      dimensions,
      mainDimensionIndex = 0,
      onDataSetSelect,
      onDimensionSelect,
      onMainDimensionIdSelect,
      onMainDimensionSelect,
      onMultiDimensionSelect,
    } = this.props;

    const dataSet = dataSets.filter(dataSet => dataSet.id === id)[0];
    const mainDimension = dimensions[mainDimensionIndex];
    const displayDimensions = dimensions.filter((dimension, i) => i !== mainDimensionIndex);
    // console.table(displayDimensions);

    return (
      <aside className="box">
        <div className="data-set-box">
          <div className="data-set-box__id">{dataSet.id}</div>
          <h1 onClick={this.handleDataSetTitleClick}>{dataSet.title}</h1>

          {/* {this.state.showDataSetSelector && ( */}
            <DataSetSelector
              isActive={this.state.showDataSetSelector}
              selectedId={dataSet.id}
              dataSets={dataSets}
              onDataSetSelect={this.handleDataSetSelect}
            />
          {/* )} */}

        </div>

        <div className="dimension-boxes">
          {/* <i className="material-icons">filter_list</i> */}

          {selectedDimensions && dimensions && dimensions.map((dimension, i) => {
            const options = dimension.values;
            const currentDimensionIds = selectedDimensions[i];

            // console.log(currentDimensionIds);

            if (i !== mainDimensionIndex) {
              return (
                <div className="dimension-box">
                  <h5 onClick={() => onMainDimensionSelect(i)}>{dimension.name}</h5>

                  <Select
                    name="form-field-name"
                    value={currentDimensionIds.length === 1 ? currentDimensionIds[0] : currentDimensionIds}
                    clearable={false}
                    // multi={true}
                    options={options.map((option) => {
                      return {
                        label: option.name,
                        value: option.id,
                      }
                    })}
                    // onChange={(event) => onDimensionSelect(event, i)}
                    onChange={(options) => this.handleDimensionSelect(options, i)}
                  />
                  {/* <select
                    // multiple
                    value={currentDimensionIds}
                    onChange={(event) => onDimensionSelect(event, i)}
                  >
                    {options.map((option) => {
                      return (
                        <option value={option.id}>{option.name}</option>
                      );
                    })}
                  </select> */}
                </div>
              );
            }
          })}
        </div>

        <div className="main-dimension-box">
          <Select
            name="form-field-name"
            value={selectedDimensions[mainDimensionIndex]}
            clearable={false}
            multi={true}
            options={mainDimension.values.map((option) => {
              return {
                label: option.name,
                value: option.id,
              }
            })}
            onChange={(options) => this.handleMultiDimensionSelect(options, mainDimensionIndex)}
          />
        </div>

        <style jsx>{`
          @lost gutter 0.5em;

          .box {
            background-color: ${blueGrey50};
            /*padding: 1em 1em 0;*/

            @media(min-width: 32em) {
              /*lost-column: 3/4 1;*/
            }
          }

          .data-set-box {
            padding: 1em;
            /*background-color: ${blueGrey['500']};*/

            & h1 {
              font-size: 2em;
              color: ${blueGrey['700']};
              margin-top: 0;
              margin-bottom: 0;
            }
          }

            .data-set-box__id {
              color: ${blueGrey['400']};
              font-size: 0.8em;
              opacity: 0.6;
            }

            :global(.Select-value) {
              font-size: 12px;
            }

            :global(.Select-menu-outer) {
              font-size: 12px;
              line-height: 16px;
            }

            /*:global(.Select-control) {
              background-color: transparent;
              border: none;
            }

            :global(.is-open) > :global(.Select-control) {
              background-color: transparent;
              border: none;
            }


            :global(.Select-clear) {
              display: none;
            }

            :global(.Select-value-label) {
              color: white !important;
              font-size: 2em;
              font-family: 'Roboto';
              font-weight: 600;
            }

            :global(.data-set-box__select) {
              & .Select-control {
                background-color: transparent;
              }
            }*/

          .dimension-boxes {
            display: flex;
            padding: 1em;
            background-color: white;

            & i {
              margin-right: 1em;
            }
          }

          .dimension-box {
            flex: 1;
            margin-right: 1em;
          }
        `}</style>

      </aside>
    )


  }

}

export default DataHeader;
