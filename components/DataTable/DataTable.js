import { Component } from 'react';
import PropTypes from 'prop-types';

// import { colors } from '../styles/variables';

class DataTable extends Component {
  static propTypes = {
    data: PropTypes.array,
    colourMap: PropTypes.array,
  }

  constructor() {
    super();

    this.state = {};
  }

  render() {
    // const {
    //   data,
    //   // colourMap,
    // } = this.props;

    return (
      <table>
        {/* {data.map(values => {
          console.log(values.y);
          // return (
          //   <tr><td>{values}</td></tr>
          // )
        })} */}
      </table>
    )
  }
}

export default DataTable;
