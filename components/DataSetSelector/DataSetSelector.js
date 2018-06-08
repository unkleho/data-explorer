import { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import './DataSetSelector.css';

class DataSetSelector extends Component {
	static propTypes = {
		dataSets: PropTypes.array,
		selectedSlug: PropTypes.string,
		handleDataSetSelect: PropTypes.func,
		isActive: PropTypes.bool,
	};

	componentDidMount() {
		// console.log(this.props.selectedSlug);
		// console.log('componentDidMount');
		// not working
		// this.refs[this.props.selectedSlug].scrollIntoView({ block: 'end', behaviour: 'smooth' });
	}

	componentDidUpdate(prevProps) {
		// TODO: Probably needs condition
		// if (prevProps.selectedSlug !== this.props.selectedSlug) {
		// this.refs[this.props.selectedSlug].scrollIntoView({ block: 'end', behaviour: 'smooth' });
		// }
	}

	handleDataSetSelect = (id) => {
		this.props.onDataSetSelect(id);
		// this.refs.box.scrollTop = this.refs[id].offsetTop;
		// this.refs[id].scrollIntoView({ block: 'end', behaviour: 'smooth' });
	};

	render() {
		const { isActive, selectedSlug, dataSets } = this.props;

		return (
			<div
				className={`data-set-selector box ${isActive ? 'is-active' : ''}`}
				// ref={(box) => { this.box = box; }}
				ref="box"
			>
				<Select
					name="form-field-name"
					value={selectedSlug}
					clearable={false}
					options={dataSets.map((option) => {
						return {
							label: option.title,
							value: option.slug,
						};
					})}
					openOnFocus
					autofocus={true}
					searchable={true}
					onChange={(option) => this.handleDataSetSelect(option.value)}
				/>

				{/* {dataSets.map((dataSet, i) => {
          const id = dataSet.id;

          return (
            <a
              // onClick={() => this.props.onDataSetSelect(dataSet.id)}
              onClick={() => this.handleDataSetSelect(id, i)}
              ref={id}
              className={`title ${selectedSlug === id ? 'is-active' : ''}`}
            >{dataSet.title}</a>
          )
        })} */}
			</div>
		);
	}
}

export default DataSetSelector;
