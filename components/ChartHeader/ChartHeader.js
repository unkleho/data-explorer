import { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import './ChartHeader.css';
import './ChartHeader.global.css';
import ChartDimensions from '../ChartDimensions';
import ChartSelectedDimensions from '../ChartSelectedDimensions';
import Overlay from '../Overlay';
import { colors, grey } from '../../styles/variables';
// import DataSetSelector from '../DataSetSelector';
import DataSetBrowser from '../DataSetBrowser';

class ChartHeader extends Component {
	static propTypes = {
		dataSetSlug: PropTypes.string.isRequired,
		dataSets: PropTypes.array.isRequired,
		dimensions: PropTypes.array,
		selectedDimensions: PropTypes.array,
		mainDimensionIndex: PropTypes.number,
		onDataSetSelect: PropTypes.func,
		onDimensionSelect: PropTypes.func,
		onMultiDimensionSelect: PropTypes.func,
		onMainDimensionSelect: PropTypes.func,
		width: PropTypes.number,
	};

	static defaultProps = {
		selectedDimensions: [],
		mainDimensionIndex: 0,
	};

	constructor() {
		super();

		this.state = {
			showDataSetSelector: false,
			showSelectedDimensionsMenu: false,
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

	handleSelectedDimensionsToggle = () => {
		this.setState({
			showSelectedDimensionsMenu: !this.state.showSelectedDimensionsMenu,
		});
	};

	handleDataSetBrowserChange = (event) => {
		this.setState({
			showDataSetSelector: false,
		});

		this.props.onDataSetSelect(event.slug);
	};

	render() {
		const {
			dataSetSlug,
			dataSets,
			selectedDimensions,
			dimensions,
			mainDimensionIndex,
			onDimensionSelect,
			onMainDimensionSelect,
			// width,
		} = this.props;

		// Get current dataSet
		const dataSet =
			dataSets && dataSets.filter((dataSet) => dataSet.slug === dataSetSlug)[0];
		const mainDimension = dimensions && dimensions[mainDimensionIndex];

		return dataSet ? (
			<div
				className={`chart-header ${
					this.state.showDataSetSelector ? 'is-open' : ''
				}`}
			>
				<Overlay
					isActive={this.state.showSelectedDimensionsMenu}
					onClick={this.handleSelectedDimensionsToggle}
				/>

				<div className="container container--lg">
					<div className="chart-header__inside">
						<div className="chart-header__slug">{dataSet.slug}</div>
						<h1
							className="chart-header__title"
							onClick={this.handleDataSetTitleClick}
						>
							{dataSet.title}{' '}
							{this.state.showDataSetSelector ? (
								<button className="chart-header__change-button button">
									Close <i className="material-icons">&#xE5D8;</i>
								</button>
							) : (
								<button className="chart-header__change-button button">
									Change <i className="material-icons">&#xE5DB;</i>
								</button>
							)}
						</h1>

						{this.state.showDataSetSelector && (
							// <DataSetSelector
							// 	isActive={this.state.showDataSetSelector}
							// 	selectedSlug={dataSet.slug}
							// 	dataSets={dataSets}
							// 	onDataSetSelect={this.handleDataSetSelect}
							// 	width={width}
							// />
							<DataSetBrowser
								dataSets={dataSets}
								onChange={this.handleDataSetBrowserChange}
								selectedSlug={dataSetSlug}
							/>
						)}
					</div>

					<div
						className={`chart-header__chart-dimensions ${
							this.state.showSelectedDimensionsMenu ? 'is-active' : ''
						}`}
					>
						<ChartDimensions
							dimensions={dimensions}
							selectedDimensions={selectedDimensions}
							mainDimensionIndex={mainDimensionIndex}
							onDimensionSelect={onDimensionSelect}
							onMainDimensionSelect={onMainDimensionSelect}
							onCloseClick={this.handleSelectedDimensionsToggle}
						/>
					</div>

					<div className="chart-header__main-dimension">
						<h1>
							<i className="material-icons">timeline</i>{' '}
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
										value: option.slug,
									};
								})
							}
							onChange={(options) =>
								this.handleMultiDimensionSelect(options, mainDimensionIndex)
							}
						/>
					</div>

					<div className="chart-header__chart-selected-dimensions">
						<ChartSelectedDimensions
							dimensions={dimensions}
							mainDimensionIndex={mainDimensionIndex}
							selectedDimensions={selectedDimensions}
							onEditClick={this.handleSelectedDimensionsToggle}
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
						color: ${grey['800']};
					}

					.Select--multi .Select-value:nth-child(5) {
						background-color: ${colors[4]};
					}

					.Select--multi .Select-value:nth-child(6) {
						background-color: ${colors[5]};
					}

					.Select--multi .Select-value:nth-child(7) {
						background-color: ${colors[6]};
					}

					.Select--multi .Select-value:nth-child(8) {
						background-color: ${colors[7]};
					}

					.Select--multi .Select-value:nth-child(9) {
						background-color: ${colors[8]};
					}

					.Select--multi .Select-value:nth-child(10) {
						background-color: ${colors[9]};
					}

					.Select--multi .Select-value:nth-child(11) {
						background-color: ${colors[10]};
					}

					.Select--multi .Select-value:nth-child(12) {
						background-color: ${colors[11]};
					}
				`}</style>
			</div>
		) : null;
	}
}

export default ChartHeader;
