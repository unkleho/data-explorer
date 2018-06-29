import { Component } from 'react';
import PropTypes from 'prop-types';

import './DataSetBrowser.css';

class DataSetBrowser extends Component {
	static propTypes = {
		dataSets: PropTypes.array,
	};

	render() {
		const { dataSets } = this.props;

		return (
			<div className="data-set-browser">
				{dataSets.map((dataSet) => {
					return <div>{dataSet.title}</div>;
				})}
			</div>
		);
	}
}

export default DataSetBrowser;
