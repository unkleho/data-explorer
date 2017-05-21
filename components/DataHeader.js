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

    this.props.onDataSetSelect(id)
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
    // console.log(selectedDimensions);
    // console.table(displayDimensions);

    return (
      <aside className={`box`}>

        <div className={`data-set-box ${this.state.showDataSetSelector ? 'is-open' : ''}`}>
          <div className="data-set-box__id">{dataSet && dataSet.id}</div>
          <h1
            className="data-set-box__title" onClick={this.handleDataSetTitleClick}
          >
            {dataSet && dataSet.title} {this.state.showDataSetSelector ? (
              <span>Close <i className="material-icons">&#xE5D8;</i></span>
            ) : (
              <span>Change <i className="material-icons">&#xE5DB;</i></span>
            )}
          </h1>

          {this.state.showDataSetSelector && (
            <DataSetSelector
              isActive={this.state.showDataSetSelector}
              selectedId={dataSet.id}
              dataSets={dataSets}
              onDataSetSelect={this.handleDataSetSelect}
            />
          )}
        </div>

        <div className="dimension-boxes">
          {/* <i className="material-icons">filter_list</i> */}

          {selectedDimensions && dimensions && dimensions.map((dimension, i) => {
            const options = dimension.values;
            const currentDimensionIds = selectedDimensions[i];

            if (dimension.id !== 'FREQUENCY') {
              return (
                <div
                  className={`dimension-box ${i === mainDimensionIndex ? 'is-selected' : ''}`}
                  key={`dimension-box-${i}`}
                >
                  <h5 onClick={() => onMainDimensionSelect(i)}>
                    <i className="material-icons">&#xE24B;</i>
                    {dimension.name}
                  </h5>

                  <Select
                    name="form-field-name"
                    value={currentDimensionIds.length === 1 ? currentDimensionIds[0] : currentDimensionIds}
                    clearable={false}
                    searchable={false}
                    options={options.map((option) => {
                      return {
                        label: option.name,
                        value: option.id,
                      }
                    })}
                    onChange={(options) => this.handleDimensionSelect(options, i)}
                  />
                </div>
              );
            }
          })}
        </div>

        <div className="main-dimension-box">
          <h1><i className="material-icons">compare_arrows</i> {mainDimension.name}</h1>

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
            // valueComponent={CustomValueComponent}
          />
        </div>

        <style jsx>{`
          @lost gutter 0.5em;

          .box {
            background-color: ${blueGrey50};
            background-color: white;
            /*padding: 1em 1em 0;*/

            @media(min-width: 32em) {
              /*lost-column: 3/4 1;*/
            }
          }

          .data-set-box {
            padding: 1em;
            background-color: #F5F7F8;

            & h1 {
              cursor: pointer;
              font-size: 2em;
              color: ${blueGrey['600']};
              margin-top: 0;
              margin-bottom: 0;

              & span {
                display: inline-block;
                font-weight: normal;
                color: white;
                background-color: ${blueGrey['300']};
                font-size: 0.3em;
                line-height: 1;
                padding: 0.5em 1em;
                border-radius: 4px;

                & i {
                  font-size: 1em;
                  margin: 0;
                  line-height: 1;
                }
              }
            }

            &.is-open {
              height: 20em;
            }
          }

            .data-set-box__id {
              color: ${blueGrey['400']};
              font-size: 0.8em;
              opacity: 0.6;
            }

            :global(.Select-value) {
              font-size: 14px;
              margin-bottom: 5px;
            }

            :global(.Select-menu-outer) {
              font-size: 14px;
              line-height: 16px;
            }

            :global(.Select--multi) :global(.Select-value) {
              background-color: ${blueGrey['300']};
              color: white;
              border: none;
            }

            :global(.Select--multi) :global(.Select-value-icon) {
              border-right: 1px solid white;
            }

            :global(.Select--multi) :global(.Select-value:nth-child(1)) {
              background-color: ${colors[0]};
            }

            :global(.Select--multi) :global(.Select-value:nth-child(2)) {
              background-color: ${colors[1]};
            }

            :global(.Select--multi) :global(.Select-value:nth-child(3)) {
              background-color: ${colors[2]};
            }

            :global(.Select--multi) :global(.Select-value:nth-child(4)) {
              background-color: ${colors[3]};
            }

            :global(.Select--multi) :global(.Select-value:nth-child(5)) {
              background-color: ${colors[4]};
            }

            :global(.Select--multi) :global(.Select-value:nth-child(6)) {
              background-color: ${colors[5]};
              color: ${blueGrey700}
            }

            :global(.Select--multi) :global(.Select-value:nth-child(7)) {
              background-color: ${colors[6]};
            }

          .dimension-boxes {
            display: flex;
            flex-direction: column;
            padding: 1em;
            background-color: white;

            & i {
              margin-right: 1em;
            }

            @media(min-width: 32em) {
              flex-direction: row;
            }
          }

          .dimension-box {
            flex: 1;
            margin-right: 0;
            margin-bottom: 1em;

            & h5 {
              cursor: pointer;
              display: inline-block;
              background-color: ${blueGrey['100']};
              padding: 0.5em;
              border-radius: 4px;

              & i {
                display: none;
                opacity: 0.5;
                font-size: 1.2em;
                margin-right: 0.5em;
              }

              &:hover {
                color: ${deepOrange600};

                & i {
                  opacity: 1;
                }
              }
            }

            &:last-child {
              margin-right: 0;
              margin-bottom: 0;
            }

            &.is-selected {
              opacity: 0.3;
            }

            @media(min-width: 32em) {
              margin-right: 1em;
              margin-bottom: 0;
            }
          }

          .main-dimension-box {
            background-color: white;
            padding: 0 1em 1em;

            & h1 {
              display: flex;
              /*align-items: baseline;*/
              font-size: 0.8em;
              text-transform: uppercase;

              & i {
                font-size: 1em;
                margin-right: 0.5em;
              }
            }
          }
        `}</style>

      </aside>
    )

  }

}



export default DataHeader;
