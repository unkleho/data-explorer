import { Component, PropTypes } from 'react';
import { blueGrey } from 'material-colors';

import { colors } from '../styles/variables';

class DataAside extends Component {
  static propTypes = {
    dimensions: PropTypes.array,
  }

  constructor() {
    super();

    this.state = {};
  }

  handleMainDimensionSelect = (event) => {
    const id = event.target.value;
    // Work out new index
    const index = this.props.dimensions.findIndex(dimension => dimension.id === id);
    // console.log('handleMainDimensionSelect', id);
    this.props.onMainDimensionSelect(index);
  }

  render() {
    const {
      mainDimensionIndex,
      dimensions,
      selectedDimensions,
      onMainDimensionIdSelect,
    } = this.props;

    const mainDimension = dimensions[mainDimensionIndex];

    return (
      <aside className="main-dimension-box">
        {dimensions.map((dimension, dimensionIndex) => {
          return (
            <div>
              <div className="dimension-title">
                {dimension.name}
              </div>

              <div className="dimension-buttons">
                {dimension.values.map((value) => {
                  const selectedDimension = selectedDimensions[dimensionIndex];
                  const selectedDimensionId = selectedDimension.indexOf(value.id);
                  const isActive = selectedDimensionId === -1 ? false : true;

                  return (
                    <button
                      className={isActive && 'active'}
                      style={{
                        backgroundColor: selectedDimensionId > -1 && colors[selectedDimensionId],
                      }}
                      onClick={() => onMainDimensionIdSelect(value.id, dimensionIndex)}
                    >{value.name}</button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* <div className="main-dimension-box__header">
          <select
            value={mainDimension && mainDimension.id}
            onChange={(event) => this.handleMainDimensionSelect(event)}
          >
            {dimensions.map((dimension) => {
              return (
                <option value={dimension.id}>{dimension.name}</option>
              )
            })}
          </select>
        </div>

        <div className="main-dimension-box__content">
          {mainDimension && mainDimension.values.map((value) => {
            const selectedDimension = selectedDimensions[mainDimensionIndex];
            const selectedDimensionId = selectedDimension.indexOf(value.id);
            const isActive = selectedDimensionId === -1 ? false : true;

            return (
              <button
                className={isActive && 'active'}
                style={{
                  backgroundColor: selectedDimensionId > -1 && colors[selectedDimensionId],
                }}
                onClick={() => onMainDimensionIdSelect(value.id, mainDimensionIndex)}
              >{value.name}</button>
            )
          })}
        </div> */}

        <style jsx>{`
          @lost gutter 0;

          aside {
            background-color: #ECEFF1;
            height: calc(100vh - 3em);
            overflow-x: auto;
          }

          .dimension-title {
            position: sticky;
            top: 0;
            background-color: ${blueGrey['200']};
            /*margin-bottom: 0.4em;*/
            margin-left: -1em;
            margin-right: -1em;
            padding: 0.5em 1em;
          }

          .main-dimension-box {
            padding: 0 1em 1em;

            @media(min-width: 32em) {
              lost-column: 1/4;
            }
          }

            .main-dimension-box__header {
              margin-bottom: 1em;
            }

          button {
            border: none;
            display: block;
            text-align: left;
            text-transform: capitalize;
            font-size: 0.7em;
            width: 100%;
            padding: 0.5em;
            border-radius: 4px;
            background-color: white;
            margin-bottom: 0.5em;

            &:first-child {
              margin-top: 0.4em;
            }

            &.active {
              color: white;
            }
          }
        `}</style>
      </aside>
    )
  }
}

export default DataAside;
