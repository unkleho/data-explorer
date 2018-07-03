import { Component } from 'react';
import Downshift from 'downshift';
// import PropTypes from 'prop-types';

import './ChartMultiDimensions.css';

class ChartMultiDimensions extends Component {
	state = {
		inputValue: '',
		selectedItem: [],
	};

	handleKeyDown = (event) => {
		const { inputValue, selectedItem } = this.state;
		if (
			selectedItem.length &&
			!inputValue.length &&
			keycode(event) === 'backspace'
		) {
			this.setState({
				selectedItem: selectedItem.slice(0, selectedItem.length - 1),
			});
		}
	};

	handleInputChange = (event) => {
		this.setState({ inputValue: event.target.value });
	};

	handleChange = (item) => {
		let { selectedItem } = this.state;

		if (selectedItem.indexOf(item) === -1) {
			selectedItem = [...selectedItem, item];
		}

		this.setState({
			inputValue: '',
			selectedItem,
		});
	};

	handleDelete = (item) => () => {
		this.setState((state) => {
			const selectedItem = [...state.selectedItem];
			selectedItem.splice(selectedItem.indexOf(item), 1);
			return { selectedItem };
		});
	};

	render() {
		const { classes } = this.props;
		const { inputValue, selectedItem } = this.state;

		return (
			<Downshift
				inputValue={inputValue}
				onChange={this.handleChange}
				selectedItem={selectedItem}
			>
				{({
					getInputProps,
					getItemProps,
					isOpen,
					inputValue: inputValue2,
					selectedItem: selectedItem2,
					highlightedIndex,
				}) => (
					<div className={classes.container}>
						{renderInput({
							fullWidth: true,
							classes,
							InputProps: getInputProps({
								startAdornment: selectedItem.map((item) => (
									<Chip
										key={item}
										tabIndex={-1}
										label={item}
										className={classes.chip}
										onDelete={this.handleDelete(item)}
									/>
								)),
								onChange: this.handleInputChange,
								onKeyDown: this.handleKeyDown,
								placeholder: 'Select multiple countries',
								id: 'integration-downshift-multiple',
							}),
						})}
						{isOpen ? (
							<Paper className={classes.paper} square>
								{getSuggestions(inputValue2).map((suggestion, index) =>
									renderSuggestion({
										suggestion,
										index,
										itemProps: getItemProps({ item: suggestion.label }),
										highlightedIndex,
										selectedItem: selectedItem2,
									}),
								)}
							</Paper>
						) : null}
					</div>
				)}
			</Downshift>
		);
	}
}

export default ChartMultiDimensions;
