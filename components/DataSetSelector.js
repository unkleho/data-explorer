import { Component, PropTypes } from 'react';
import { blueGrey } from 'material-colors';

import { colors } from '../styles/variables';

class DataSetSelector extends Component {
  static propTypes = {
    dataSets: PropTypes.array,
    handleDataSetSelect: PropTypes.func,
  }

  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div>
        {this.props.dataSets.map((dataSet) => {
          return (
            <div onClick={() => this.props.onDataSetSelect(dataSet.id)}>{dataSet.title}</div>
          )
        })}

        <style jsx>{`
          div {
            background-color: #ECEFF1;
          }
        `}</style>
      </div>
    )
  }
}

export default DataSetSelector;
