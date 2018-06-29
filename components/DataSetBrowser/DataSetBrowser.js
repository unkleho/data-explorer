import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Downshift from 'downshift';

import './DataSetBrowser.css';

class DataSetBrowser extends Component {
	static propTypes = {
		dataSets: PropTypes.array,
		onChange: PropTypes.func,
		selectedSlug: PropTypes.string,
	};

	componentDidMount() {
		console.log(this.selectedElement.clientHeight);
		console.log(this.menu.getBoundingClientRect());

		this.menu.scrollTop =
			this.selectedElement.offsetTop +
			this.selectedElement.clientHeight -
			this.menu.offsetHeight;
		// this.selectedElement.focus();
	}

	handleChange = (event) => {
		// Change and Select
		this.props.onChange(event);
	};

	handleSubmit = (event) => {
		console.log(event);
	};

	render() {
		const { dataSets: items, selectedSlug } = this.props;

		return (
			<div className="data-set-browser" ref={(menu) => (this.menu = menu)}>
				<Downshift
					onChange={this.handleChange}
					onSubmit={this.handleSubmit}
					// selectedItem={defaultSelectedItem}
					// defaultSelectedItem={defaultSelectedItem}
					itemToString={(item) => item && item.title}
				>
					{({
						getInputProps,
						getItemProps,
						getLabelProps,
						getMenuProps,
						// isOpen,
						inputValue,
						highlightedIndex,
						selectedItem,
					}) => (
						<div>
							<label {...getLabelProps()}>Enter a dataSet</label>
							<br />
							<input {...getInputProps()} />
							<ul {...getMenuProps()}>
								{items
									.filter(
										(item) =>
											!inputValue ||
											item.title.toLowerCase().includes(inputValue),
									)
									.map((item, index) => (
										<li
											ref={
												selectedSlug === item.slug &&
												((selectedElement) =>
													(this.selectedElement = selectedElement))
											}
											{...getItemProps({
												key: item.slug,
												index,
												item,
												style: {
													backgroundColor:
														highlightedIndex === index ? 'lightgray' : 'white',
													// fontWeight: selectedItem === item ? 'bold' : 'normal',
													fontWeight:
														selectedSlug === item.slug ? 'bold' : 'normal',
												},
											})}
										>
											{item.title}
										</li>
									))}
							</ul>
						</div>
					)}
				</Downshift>
			</div>
		);
	}
}

export default DataSetBrowser;
