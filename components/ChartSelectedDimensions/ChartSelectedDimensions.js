import { Component } from 'react';
import PropTypes from 'prop-types';

import './ChartSelectedDimensions.css';

// TODO: Make this receive only on prop, rather than 3!

class ChartSelectedDimensions extends Component {
	static propTypes = {
		selectedDimensions: PropTypes.array,
		dimensions: PropTypes.array,
		mainDimensionIndex: PropTypes.number,
		onEditClick: PropTypes.func,
	};

	render() {
		const {
			selectedDimensions,
			dimensions,
			mainDimensionIndex,
			className,
			onEditClick,
		} = this.props;

		// Filter out mainDimension
		const filteredSelectedDimensions = selectedDimensions.filter(
			(d, i) => i !== mainDimensionIndex,
		);

		// Filter out FREQ and TIME_PERIOD and mainDimension
		const filteredDimensions = dimensions
			.filter(
				(dimension) =>
					dimension.slug !== 'FREQUENCY' && dimension.slug !== 'TIME_PERIOD',
			)
			.filter((dimension, i) => mainDimensionIndex !== i);

		const dimensionsString = filteredDimensions
			.map((dimension, i) => {
				// Similar code in ChartDimensions, make it a function?
				const dimensionValueSlug = filteredSelectedDimensions[i][0];
				const value = dimension.values.filter((v) => {
					return v.slug === dimensionValueSlug;
				})[0];

				return `${value.name}`;
			})
			.join(', ');

		return (
			<div
				className={`chart-selected-dimensions ${className ? className : ''}`}
			>
				<div className="chart-selected-dimensions__title" />
				{dimensionsString}.
				{onEditClick && (
					<button
						className="chart-selected-dimensions__edit-button material-icons"
						onClick={onEditClick}
					>
						edit
					</button>
				)}
			</div>
		);
	}
}

export default ChartSelectedDimensions;
