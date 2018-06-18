import { Component } from 'react';
import PropTypes from 'prop-types';

import './ChartFooter.css';

class ChartFooter extends Component {
	static propTypes = {
		orgTitle: PropTypes.string,
		orgSlug: PropTypes.string,
		dataSetSlug: PropTypes.string,
		selectedDimensions: PropTypes.array,
	};

	render() {
		const { orgTitle, orgSlug, dataSetSlug, selectedDimensions } = this.props;
		const csvUrl = `/download/?format=csv&orgSlug=${orgSlug}&dataSetSlug=${dataSetSlug}&selectedDimensions=${JSON.stringify(
			selectedDimensions,
		)}`;

		return orgTitle ? (
			<div className="chart-footer">
				<p>Source: {orgTitle}</p>
				<p>
					<a href={csvUrl}>Download CSV</a>
				</p>
			</div>
		) : null;
	}
}

export default ChartFooter;
