import { Component, PropTypes } from 'react';
import { blueGrey } from 'material-colors';

import { colors } from '../styles/variables';

class DataAside extends Component {
  static propTypes = {
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
      <aside>
        <div className="main-dimension-box">

          <div className="main-dimension-box__header">
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
          </div>

        </div>

        <style jsx>{`
          .main-dimension-box {
            padding: 1em;

            @media(min-width: 32em) {
              lost-column: 1/4;
            }
          }
        `}</style>
      </aside>
    )
  }
}

export default DataAside;
