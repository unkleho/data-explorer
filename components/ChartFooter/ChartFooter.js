import { Component } from 'react';
import PropTypes from 'prop-types';

import './ChartFooter.css';

class ChartFooter extends Component {
	static propTypes = {
		orgTitle: PropTypes.string,
	};

	render() {
		const { orgTitle } = this.props;

		return (
			<div className="chart-footer">
				<p
					style={{
						fontSize: '0.6em',
						float: 'right',
						textAlign: 'right',
					}}
				>
					Source: {orgTitle}
					<br />
					Disclaimer: This website is in active development. Charts may not be
					accurate.
				</p>
			</div>
		);
	}
}

export default ChartFooter;
