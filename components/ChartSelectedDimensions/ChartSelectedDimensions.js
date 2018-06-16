import { Component } from 'react';
import PropTypes from 'prop-types';

import './ChartSelectedDimensions.css';

class ChartSelectedDimensions extends Component {
	static propTypes = {
		selectedDimensions: PropTypes.array,
		dimensions: PropTypes.array,
		onEditClick: PropTypes.func,
	};

	render() {
		const { selectedDimensions, dimensions, onEditClick } = this.props;

		const filteredDimensions = dimensions.filter(
			(dimension) =>
				dimension.slug !== 'FREQUENCY' && dimension.slug !== 'TIME_PERIOD',
		);

		const dimensionsString = filteredDimensions
			.map((dimension, i) => {
				// Similar code in ChartDimensions, make it a function?
				const dimensionValueSlug = selectedDimensions[i][0];
				const value = dimension.values.filter((v) => {
					return v.slug === dimensionValueSlug;
				})[0];

				console.log(filteredDimensions.length - 1, i);

				// const commaOrStop = filteredDimensions.length - 1 === i ? '.' : '';

				return `${value.name}`;
				// return (
				// 	<span key={`chart-selected-dimensions-title-${dimension.slug}`}>
				// 		{value.name}
				// 		{commaOrStop}
				// 	</span>
				// );
			})
			.toString('. ');

		return (
			<div className="chart-selected-dimensions">
				<div className="chart-selected-dimensions__title" />
				{dimensionsString}

				<button className="material-icons" onClick={onEditClick}>
					edit
				</button>
			</div>
		);
	}
}

export default ChartSelectedDimensions;
