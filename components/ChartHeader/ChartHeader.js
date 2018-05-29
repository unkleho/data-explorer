import { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import './ChartHeader.css';
import './ChartHeader.global.css';
import { blueGrey700, colors } from '../../styles/variables';
import DataSetSelector from '../DataSetSelector';

class ChartHeader extends Component {
	static propTypes = {
		dataSets: PropTypes.array,
		mainDimensionIndex: PropTypes.number,
		dimensions: PropTypes.array,
	};

	constructor() {
		super();

		this.state = {
			showDataSetSelector: false,
		};
	}

	handleDataSetSelect = (id) => {
		this.setState({
			showDataSetSelector: false,
		});

		this.props.onDataSetSelect(id);
	};

	handleDataSetTitleClick = (event) => {
		this.setState({
			showDataSetSelector: !this.state.showDataSetSelector,
		});
	};

	handleDimensionSelect = (options, selectedDimensionIndex) => {
		this.props.onDimensionSelect(options, selectedDimensionIndex);
	};

	handleMultiDimensionSelect = (options, selectedDimensionIndex) => {
		this.props.onMultiDimensionSelect(options, selectedDimensionIndex);
	};

	render() {
		const {
			id,
			dataSets,
			selectedDimensions,
			dimensions,
			mainDimensionIndex = 0,
			onMainDimensionSelect,
		} = this.props;

		const dataSet =
			dataSets && dataSets.filter((dataSet) => dataSet.originalId === id)[0];
		const mainDimension = dimensions && dimensions[mainDimensionIndex];

		return (
			<aside>
				<div
					className={`data-header ${
						this.state.showDataSetSelector ? 'is-open' : ''
					}`}
				>
					<div className="container container--lg">
						<div className="data-header__inside">
							<div className="data-header__id">
								{dataSet && dataSet.originalId}
							</div>
							<h1
								className="data-header__title"
								onClick={this.handleDataSetTitleClick}
							>
								{dataSet && dataSet.title}{' '}
								{this.state.showDataSetSelector ? (
									<span>
										Close <i className="material-icons">&#xE5D8;</i>
									</span>
								) : (
									<span>
										Change <i className="material-icons">&#xE5DB;</i>
									</span>
								)}
							</h1>

							{this.state.showDataSetSelector && (
								<DataSetSelector
									isActive={this.state.showDataSetSelector}
									selectedId={dataSet.originalId}
									dataSets={dataSets}
									onDataSetSelect={this.handleDataSetSelect}
								/>
							)}
						</div>
					</div>
				</div>

				<div className="container container--lg">
					<div className="dimension-boxes">
						{selectedDimensions &&
							dimensions &&
							dimensions.map((dimension, i) => {
								const options = dimension.values;
								const currentDimensionIds = selectedDimensions[i];

								if (dimension && dimension.id !== 'FREQUENCY') {
									return (
										<div
											className={`dimension-box ${
												i === mainDimensionIndex ? 'is-selected' : ''
											}`}
											key={`dimension-box-${i}`}
										>
											<h5 onClick={() => onMainDimensionSelect(i)}>
												<span>{dimension.name}</span>
												<i className="material-icons">compare_arrows</i>
											</h5>

											<Select
												name="form-field-name"
												value={
													currentDimensionIds &&
													currentDimensionIds.length === 1
														? currentDimensionIds[0]
														: currentDimensionIds
												}
												clearable={false}
												searchable={false}
												options={options.map((option) => {
													return {
														label: option.name,
														value: option.originalId,
													};
												})}
												onChange={(options) =>
													this.handleDimensionSelect(options, i)
												}
											/>
										</div>
									);
								} else {
									return null;
								}
							})}
					</div>

					<div className="main-dimension-box">
						<h1>
							<i className="material-icons">compare_arrows</i> Compare:{' '}
							{mainDimension && mainDimension.name}
						</h1>

						<Select
							name="form-field-name"
							value={selectedDimensions[mainDimensionIndex]}
							clearable={false}
							multi={true}
							options={
								mainDimension &&
								mainDimension.values.map((option) => {
									return {
										label: option.name,
										value: option.originalId,
									};
								})
							}
							onChange={(options) =>
								this.handleMultiDimensionSelect(options, mainDimensionIndex)
							}
							// valueComponent={CustomValueComponent}
						/>
					</div>
				</div>

				<style jsx global>{`
					.Select--multi .Select-value:nth-child(1) {
						background-color: ${colors[0]};
					}

					.Select--multi .Select-value:nth-child(2) {
						background-color: ${colors[1]};
					}

					.Select--multi .Select-value:nth-child(3) {
						background-color: ${colors[2]};
					}

					.Select--multi .Select-value:nth-child(4) {
						background-color: ${colors[3]};
					}

					.Select--multi .Select-value:nth-child(5) {
						background-color: ${colors[4]};
					}

					.Select--multi .Select-value:nth-child(6) {
						background-color: ${colors[5]};
						color: ${blueGrey700};
					}

					.Select--multi .Select-value:nth-child(7) {
						background-color: ${colors[6]};
					}
				`}</style>
			</aside>
		);
	}
}

export default ChartHeader;
