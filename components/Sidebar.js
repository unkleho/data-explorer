import { blueGrey50, blueGrey100, blueGrey300, blueGrey700, deepOrange600 } from '../styles/variables';

const Sidebar = ({
  id,
  handleDataSetSelect,
  handleDimensionSelect,
  handleMainDimensionIdSelect,
  onMainDimensionSelect,
  dataSets,
  selectedDimensions,
  dimensions,
  mainDimensionIndex = 0,
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
          onChange={(event) => handleDataSetSelect(event)}
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
        onChange={this.handleDataSetSelect2}
      /> */}

      <div className="main-dimension-box">
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

        {mainDimension && mainDimension.values.map((value) => {
          const selectedDimension = selectedDimensions[mainDimensionIndex];
          // console.log(selectedDimension.indexOf(value.id));
          const isActive = selectedDimension.indexOf(value.id) === -1 ? false : true;

          return (
            <button
              className={isActive && 'active'}
              onClick={() => handleMainDimensionIdSelect(value.id, mainDimensionIndex)}
            >{value.name}</button>
          )
        })}
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
                  onChange={(event) => handleDimensionSelect(event, i)}
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
        aside {
          background-color: ${blueGrey50};
          padding: 1em;

          @media(min-width: 32em) {
          }
        }

        button {
          border: none;
          background-color: #DDD;
          margin-right: 1em;
        }

        button.active {
          background-color: white;
        }

        .data-set-box {
          /*padding: 1.27777778em 1.27777778em 1.1em;*/
          /*margin-bottom: 1.5em;*/
          /*padding-bottom: 1.5em;*/
          /*background-color: ${blueGrey100};*/
        }

        .data-set-box h4 {
          margin-top: 0;
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

export default Sidebar;
