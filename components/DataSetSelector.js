import { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

class DataSetSelector extends Component {
  static propTypes = {
    dataSets: PropTypes.array,
    selectedId: PropTypes.string,
    handleDataSetSelect: PropTypes.func,
    isActive: PropTypes.bool,
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
      // this.refs[this.props.selectedId].scrollIntoView({ block: 'end', behaviour: 'smooth' });
    // }
  }

  handleDataSetSelect = (id) => {
    this.props.onDataSetSelect(id);
    // this.refs.box.scrollTop = this.refs[id].offsetTop;
    // this.refs[id].scrollIntoView({ block: 'end', behaviour: 'smooth' });
  }

  render() {
    const {
      isActive,
      selectedId,
      dataSets,
    } = this.props;

    return (
      <div
        className={`box ${isActive ? 'is-active' : ''}`}
        // ref={(box) => { this.box = box; }}
        ref="box"
      >
        <Select
          name="form-field-name"
          value={selectedId}
          clearable={false}
          options={dataSets.map((option) => {
            return {
              label: option.title,
              value: option.id,
            }
          })}
          openOnFocus
          autofocus={true}
          searchable={false}
          onChange={(option) => this.handleDataSetSelect(option.value)}
        />

        {/* {dataSets.map((dataSet, i) => {
          const id = dataSet.id;

          return (
            <a
              // onClick={() => this.props.onDataSetSelect(dataSet.id)}
              onClick={() => this.handleDataSetSelect(id, i)}
              ref={id}
              className={`title ${selectedId === id ? 'is-active' : ''}`}
            >{dataSet.title}</a>
          )
        })} */}

        <style jsx>{`
        `}</style>
      </div>
    )
  }
}

export default DataSetSelector;
