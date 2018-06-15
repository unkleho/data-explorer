import { Component } from 'react';
import PropTypes from 'prop-types';

import './ChartFooter.css';

class ChartFooter extends Component {
	static propTypes = {
		orgTitle: PropTypes.string,
	};

	render() {
		const { orgTitle } = this.props;

		return orgTitle ? (
			<div className="chart-footer">
				<p>Source: {orgTitle}</p>
			</div>
		) : null;
	}
}

export default ChartFooter;
