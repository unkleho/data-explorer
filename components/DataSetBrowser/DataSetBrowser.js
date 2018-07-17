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

	constructor() {
		super();

		this.state = {
			inputValue: '',
		};
	}

	componentDidMount() {
		// Ensure selectedItem is scrolled into view
		this.selectedItem.focus();
		this.selectedItem.blur();
	}

	handleChange = (event) => {
		// Change and Select
		this.props.onChange(event);
	};

	handleInputValueChange = (inputValue) => {
		// Downshift changes inputValue to null onClickOutside, so we need to
		// override this and not allow inputValue to change.
		if (inputValue !== null) {
			this.setState({
				inputValue: inputValue,
			});
		}
	};

	handleSubmit = (event) => {
		console.log(event);
	};

	render() {
		const { dataSets: items, selectedSlug } = this.props;
		// console.log(this.state);

		return (
			<div className="data-set-browser">
				<Downshift
					isOpen={true}
					onChange={this.handleChange}
					onInputValueChange={this.handleInputValueChange}
					onSubmit={this.handleSubmit}
					// selectedItem={defaultSelectedItem}
					// defaultSelectedItem={defaultSelectedItem}
					defaultHighlightedIndex={items.findIndex(
						(item) => item.slug === selectedSlug,
					)}
					itemToString={(item) => item && item.title}
					onOuterClick={(state) => {
						// console.log(state.getInputProps());
					}}
				>
					{({
						getInputProps,
						getItemProps,
						getLabelProps,
						getMenuProps,
						isOpen,
						inputValue,
						highlightedIndex,
						selectedItem,
					}) => {
						// console.log(inputValue, isOpen);

						return (
							<div>
								{/* <label {...getLabelProps()}>Enter a dataSet</label> */}
								<input
									{...getInputProps({
										value: this.state.inputValue,
										placeholder: 'Find a dataset',
									})}
									className="data-set-browser__input"
								/>
								<ul
									{...getMenuProps()}
									className="data-set-browser__items"
									ref={(items) => (this.items = items)}
								>
									{items
										.filter(
											(item) =>
												!this.state.inputValue ||
												item.title
													.toLowerCase()
													.includes(this.state.inputValue.toLowerCase()),
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
						);
					}}
				</Downshift>
			</div>
		);
	}
}

export default DataSetBrowser;
