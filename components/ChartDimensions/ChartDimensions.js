import { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import './ChartDimensions.css';

class ChartDimensions extends Component {
	static propTypes = {
		dimensions: PropTypes.array,
		selectedDimensions: PropTypes.array,
		mainDimensionIndex: PropTypes.number,
		onDimensionSelect: PropTypes.func,
		onMainDimensionSelect: PropTypes.func,
	};

	static defaultProps = {
		selectedDimensions: [],
		dimensions: [],
	};

	render() {
		const {
			dimensions,
			selectedDimensions,
			mainDimensionIndex,
			onDimensionSelect,
			onMainDimensionSelect,
		} = this.props;

		return (
			<div className="chart-dimensions">
				{dimensions
					// Filter out any unwanted dimensions
					// TODO: Maybe do this higher up in data
					.filter(
						(dimension) =>
							dimension.slug !== 'FREQUENCY' &&
							dimension.slug !== 'TIME_PERIOD',
					)
					.map((dimension, i) => {
						const options = dimension.values;
						const currentDimensionIds = selectedDimensions[i];

						return (
							<div
								className={`chart-dimensions__dimension ${
									i === mainDimensionIndex ? 'is-selected' : ''
								}`}
								key={`chart-dimensions__dimension-${i}`}
							>
								<h5 onClick={() => onMainDimensionSelect(i)}>
									<span>{dimension.name}</span>
									<i className="material-icons">compare_arrows</i>
								</h5>

								<Select
									name="form-field-name"
									value={
										currentDimensionIds && currentDimensionIds.length === 1
											? currentDimensionIds[0]
											: currentDimensionIds
									}
									clearable={false}
									searchable={false}
									options={options.map((option) => {
										return {
											label: option.name,
											value: option.slug,
										};
									})}
									onChange={(options) => onDimensionSelect(options, i)}
								/>
							</div>
						);
					})}
			</div>
		);
	}
}

export default ChartDimensions;
