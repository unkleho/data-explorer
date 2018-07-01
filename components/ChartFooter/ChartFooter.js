import { Component } from 'react';
import PropTypes from 'prop-types';

import './ChartFooter.css';

class ChartFooter extends Component {
	static propTypes = {
		orgTitle: PropTypes.string,
		orgSlug: PropTypes.string,
		dataSetSlug: PropTypes.string,
		dataSetLink: PropTypes.string,
		selectedDimensions: PropTypes.array,
	};

	render() {
		const {
			orgTitle,
			orgSlug,
			dataSetSlug,
			dataSetLink,
			selectedDimensions,
			mainDimensionIndex,
		} = this.props;

		const csvUrl = `/download/?format=csv&orgSlug=${orgSlug}&dataSetSlug=${dataSetSlug}&selectedDimensions=${JSON.stringify(
			selectedDimensions,
		)}&mainDimensionIndex=${mainDimensionIndex}`;

		return orgTitle ? (
			<div className="chart-footer">
				<p>
					Source: {orgTitle} (<a href={dataSetLink} target="_blank">
						URL
					</a>)
					<br /> Disclaimer: This website is still in beta, charts may not be
					accurate.
				</p>
				<p>
					<a href={csvUrl} className="button">
						Download CSV
					</a>
				</p>
			</div>
		) : null;
	}
}

export default ChartFooter;
