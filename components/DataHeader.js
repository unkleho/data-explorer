import { blueGrey50, blueGrey100, blueGrey300, blueGrey700, deepOrange600, colors } from '../styles/variables';
import { blueGrey } from 'material-colors';

const DataHeader = ({
  id,
  dataSets,
  selectedDimensions,
  dimensions,
  mainDimensionIndex = 0,
  onDataSetSelect,
  onDimensionSelect,
  onMainDimensionIdSelect,
  onMainDimensionSelect,
}) => {
  const dataSet = dataSets.filter(dataSet => dataSet.id === id)[0];
  const mainDimension = dimensions[mainDimensionIndex];
  const displayDimensions = dimensions.filter((dimension, i) => i !== mainDimensionIndex);
  // console.table(displayDimensions);


  return (
    <aside className="sidebar">
      <div className="data-set-box">
        <div className="data-set-box__id">{dataSet.id}</div>
        <h1>{dataSet.title}</h1>
        {/* <select
          value={id}
          onChange={(event) => onDataSetSelect(event)}
        >
          {dataSets && dataSets.map((dataSet) => {
            return (
              <option value={dataSet.id}>{dataSet.title}</option>
            );
          })}
        </select> */}
      </div>

      {/* <Select
        value={this.props.id}
        options={dataSets && dataSets.map((dataSet) => {
          return {
            value: dataSet.key,
            label: dataSet.name,
          }
        })}
        onChange={this.onDataSetSelect2}
      /> */}

      <div className="dimension-boxes">
        {selectedDimensions && dimensions && dimensions.map((dimension, i) => {
          const options = dimension.values;
          const currentDimensionIds = selectedDimensions[i];

          if (i !== mainDimensionIndex) {
            return (
              <div className="dimension-box">
                {/* <h5 onClick={() => onMainDimensionSelect(i)}>{dimension.name}</h5> */}
                <select
                  // multiple
                  value={currentDimensionIds}
                  onChange={(event) => onDimensionSelect(event, i)}
                >
                  {options.map((option) => {
                    return (
                      <option value={option.id}>{option.name}</option>
                    );
                  })}
                </select>
              </div>
            );
          }
        })}
      </div>

      <style jsx>{`
        @lost gutter 0.5em;

        aside {
          background-color: ${blueGrey50};
          /*padding: 1em 1em 0;*/

          @media(min-width: 32em) {
          }
        }

        .data-set-box {
          padding: 1em;
          background-color: ${blueGrey['500']};

          & h1 {
            font-size: 2em;
            color: white;
            margin-top: 0;
            margin-bottom: 0;
          }
        }

          .data-set-box__id {
            color: white;
            font-size: 0.8em;
            opacity: 0.6;
          }

        .main-dimension-box {
          display: flex;
        }

          .main-dimension-box__header {
            flex: 1;
            margin-right: 1em;
          }

          .main-dimension-box__content {
            flex: 4;
            /*display: flex;*/

            & button {
              lost-column: 1/4;

              border: none;
              background-color: #DDD;
              font-size: 1em;
              margin-right: 0.5em;
              margin-bottom: 0.5em;
              padding: 0.5em;
            }

            & button.active {
              background-color: white;
            }
          }

        .dimension-boxes {
          display: flex;
          padding: 1em;
          background-color: white;
        }

        .dimension-box {
          flex: 1;
          margin-right: 1em;
        }
      `}</style>

    </aside>
  )
}

export default DataHeader;
