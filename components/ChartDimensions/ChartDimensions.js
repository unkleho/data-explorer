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
		onCloseClick: PropTypes.func,
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
			onCloseClick,
		} = this.props;

		return (
			<div className="chart-dimensions">
				<header className="chart-dimensions__header">
					<h1>Dimensions</h1>{' '}
					<button
						className="chart-dimensions__close-button button material-icons"
						onClick={onCloseClick}
					>
						close
					</button>
				</header>
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
						const value = currentDimensionIds[0];
						const isSelected = mainDimensionIndex === i;

						return (
							<div
								className={`chart-dimensions__dimension ${
									isSelected ? 'is-selected' : ''
								}`}
								key={`chart-dimensions__dimension-${i}`}
							>
								<h5
									onClick={() => onMainDimensionSelect(i)}
									title="Click to enable comparisons within this dimension"
								>
									<span>{dimension.name}</span>
									<i className="material-icons">timeline</i>
								</h5>

								<Select
									name="form-field-name"
									value={value}
									clearable={false}
									searchable={false}
									options={options.map((option) => {
										return {
											label: option.name,
											value: option.slug,
										};
									})}
									disabled={isSelected}
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
