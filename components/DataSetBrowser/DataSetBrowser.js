import { Component } from 'react';
// import { findDOMNode } from 'react-dom';
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
		// Ensure selectedItem is scrolled into view
		this.selectedItem.focus();
		this.selectedItem.blur();
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
			<div className="data-set-browser">
				<Downshift
					onChange={this.handleChange}
					onSubmit={this.handleSubmit}
					// selectedItem={defaultSelectedItem}
					// defaultSelectedItem={defaultSelectedItem}
					defaultHighlightedIndex={items.findIndex(
						(item) => item.slug === selectedSlug,
					)}
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
							{/* <label {...getLabelProps()}>Enter a dataSet</label> */}
							<input {...getInputProps()} className="data-set-browser__input" />
							<ul
								{...getMenuProps()}
								className="data-set-browser__items"
								ref={(items) => (this.items = items)}
							>
								{items
									.filter(
										(item) =>
											!inputValue ||
											item.title
												.toLowerCase()
												.includes(inputValue.toLowerCase()),
									)
									.map((item, index) => (
										<li
											className={`data-set-browser__item ${
												selectedSlug === item.slug
													? `data-set-browser__item--selected`
													: ''
											} ${
												highlightedIndex === index
													? `data-set-browser__item--highlighted`
													: ''
											}`}
											tabIndex={0}
											ref={
												selectedSlug === item.slug &&
												((selectedItem) => (this.selectedItem = selectedItem))
											}
											{...getItemProps({
												key: item.slug,
												index,
												item,
												// style: {
												// 	backgroundColor:
												// 		highlightedIndex === index ? 'lightgray' : 'white',
												// 	fontWeight:
												// 		selectedSlug === item.slug ? 'bold' : 'normal',
												// },
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
