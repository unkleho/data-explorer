import { Component, PropTypes } from 'react';
import { blueGrey, deepOrange } from 'material-colors';

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
    this.refs.box.scrollTop = this.refs[id].offsetTop;
    // this.refs[id].scrollIntoView({ block: 'end', behaviour: 'smooth' });
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
        ref="box"
      >
        {this.props.dataSets.map((dataSet, i) => {
          const id = dataSet.id;

          return (
            <a
              // onClick={() => this.props.onDataSetSelect(dataSet.id)}
              onClick={() => this.handleDataSetSelect(id, i)}
              ref={id}
              className={`title ${selectedId === id ? 'is-active' : ''}`}
            >{dataSet.title}</a>
          )
        })}

        <style jsx>{`
          .box {
            display: none;
            position: absolute;
            padding: 1em;
            background-color: white;
            overflow-x: auto;
            height: 14em;
            z-index: 100;
            margin-right: 1em;
          }

          .box.is-active {
            display: block;
          }

          .title {
            display: block;
            padding: 0.2em;
            cursor: pointer;

            &:hover {
              color: ${deepOrange['700']};
            }
          }

          .title.is-active {
            background-color: ${deepOrange['500']};
            color: white;

            &:hover {
              color: white;              
            }
          }
        `}</style>
      </div>
    )
  }
}

export default DataSetSelector;
