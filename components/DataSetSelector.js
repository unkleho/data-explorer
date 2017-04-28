import { Component, PropTypes } from 'react';
import { blueGrey } from 'material-colors';

import { colors } from '../styles/variables';

class DataSetSelector extends Component {
  static propTypes = {
    dataSets: PropTypes.array,
    selectedId: PropTypes.string,
    handleDataSetSelect: PropTypes.func,
    isActive: PropTypes.bool,
  }

  constructor() {
    super();

  }

  componentDidMount() {
    // console.log(this.props.selectedId);
    // console.log('componentDidMount');
    // not working
    // this.refs[this.props.selectedId].scrollIntoView({ block: 'end', behaviour: 'smooth' });
  }

  componentDidUpdate(prevProps) {
    // TODO: Probably needs condition
    // if (prevProps.selectedId !== this.props.selectedId) {
      this.refs[this.props.selectedId].scrollIntoView({ block: 'end', behaviour: 'smooth' });
    // }
  }

  handleDataSetSelect = (id, i) => {
    this.props.onDataSetSelect(id);
    this.refs[id].scrollIntoView({ block: 'end', behaviour: 'smooth' });
  }

  render() {
    const {
      isActive,
      selectedId
    } = this.props;

    return (
      <div
        className={`box ${isActive ? 'is-active' : ''}`}
        // ref={(box) => { this.box = box; }}
      >
        {this.props.dataSets.map((dataSet, i) => {
          const id = dataSet.id;

          return (
            <div
              // onClick={() => this.props.onDataSetSelect(dataSet.id)}
              onClick={() => this.handleDataSetSelect(id, i)}
              ref={id}
              className={`title ${selectedId === id ? 'is-active' : ''}`}
            >{dataSet.title}</div>
          )
        })}

        <style jsx>{`
          .box {
            display: none;
            background-color: #ECEFF1;
            overflow-x: auto;
            height: 10em;
          }

          .box.is-active {
            display: block;
          }

          .title.is-active {
            background-color: red;
          }
        `}</style>
      </div>
    )
  }
}

export default DataSetSelector;
