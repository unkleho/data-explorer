const Sidebar = ({
  id,
  handleDataSetSelect,
  handleDimensionSelect,
  dataSets,
  selectedDimensions,
  dimensions,
}) => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo__abs">ABS</span> <span className="logo__text">Data Explorer</span> <span style={{ fontSize: '0.4em' }}>beta</span>
      </div>

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

      <div>
        {selectedDimensions && dimensions && dimensions.map((dimension, i) => {
          const options = dimension.values;
          const currentDimensionIds = selectedDimensions[i];

          return (
            <div className="dimension-box">
              <h5>{dimension.name}</h5>
              <select
                multiple
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
        })}
      </div>

      <style jsx>{
        `aside {
          font-size: 0.8em;
        }`
      }
      </style>
    </aside>
  )
}

export default Sidebar;
