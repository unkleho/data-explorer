import { Component } from 'react';
// import PropTypes from 'prop-types';

import './ChartLoader.css';

class ChartLoader extends Component {
	// static propTypes = {};

	render() {
		// const {} = this.props;

		return (
			<div className="chart-loader">
				<div className="chart-loader__logo">
					<div className="chart-loader__logo__outer" />
					<div className="chart-loader__logo__middle" />
					<div className="chart-loader__logo__inner" />
				</div>
			</div>
		);
	}
}

export default ChartLoader;
