import { blueGrey50, blueGrey100, blueGrey300, blueGrey700, deepOrange600, colors } from '../styles/variables';

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
  const mainDimension = dimensions[mainDimensionIndex];
  const displayDimensions = dimensions.filter((dimension, i) => i !== mainDimensionIndex);
  // console.table(displayDimensions);

  const handleMainDimensionSelect = (event) => {
    const id = event.target.value;
    // Work out new index
    const index = dimensions.findIndex(dimension => dimension.id === id);
    // console.log('handleMainDimensionSelect', id);
    onMainDimensionSelect(index);
  }

  return (
    <aside className="sidebar">
      <div className="data-set-box">
        <h4>Data Set</h4>
        <select
          value={id}
          onChange={(event) => onDataSetSelect(event)}
        >
          {dataSets && dataSets.map((dataSet) => {
            return (
              <option value={dataSet.id}>{dataSet.title}</option>
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
        onChange={this.onDataSetSelect2}
      /> */}

      <div className="main-dimension-box">

        <div className="main-dimension-box__header">
          <select
            value={mainDimension && mainDimension.id}
            onChange={(event) => handleMainDimensionSelect(event)}
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
            console.log(selectedDimension.indexOf(value.id));
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

      <div className="dimension-boxes">
        {selectedDimensions && dimensions && dimensions.map((dimension, i) => {
          const options = dimension.values;
          const currentDimensionIds = selectedDimensions[i];

          if (i !== mainDimensionIndex) {
            return (
              <div className="dimension-box">
                <h5 onClick={() => onMainDimensionSelect(i)}>{dimension.name}</h5>
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
          padding: 1em 1em 0;

          @media(min-width: 32em) {
          }
        }

        .data-set-box {
          margin-bottom: 1.5em;
        }

        .data-set-box h4 {
          margin-top: 0;
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

              flex: 1;
              border: none;
              background-color: #DDD;
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
          margin-right: -1em;
        }

        .dimension-box {
          flex: 1;
          border-top: 2px solid ${blueGrey100};
          margin-top: 1.3em;
          margin-bottom: 1em;
          margin-right: 1em;
        }
      `}</style>

    </aside>
  )
}

export default DataHeader;
