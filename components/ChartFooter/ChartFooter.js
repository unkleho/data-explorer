import { Component } from 'react';
import PropTypes from 'prop-types';

import './ChartFooter.css';
import ShareBox from '../ShareBox';
import Chart from '../Chart/Chart';

class ChartFooter extends Component {
	static propTypes = {
		orgTitle: PropTypes.string,
		orgSlug: PropTypes.string,
		dataSetTitle: PropTypes.string,
		dataSetSlug: PropTypes.string,
		dataSetLink: PropTypes.string,
		selectedDimensions: PropTypes.array,
		imageUrl: PropTypes.string,
	};

	render() {
		const {
			orgTitle,
			orgSlug,
			dataSetTitle,
			dataSetSlug,
			dataSetLink,
			selectedDimensions,
			mainDimensionIndex,
			imageUrl,
		} = this.props;

		const csvUrl = `/download/?format=csv&orgSlug=${orgSlug}&dataSetSlug=${dataSetSlug}&selectedDimensions=${JSON.stringify(
			selectedDimensions,
		)}&mainDimensionIndex=${mainDimensionIndex}`;

		return orgTitle ? (
			<div className="chart-footer">
				<div className="chart-footer__content">
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

						{imageUrl && (
							<a
								href={imageUrl}
								className="button"
								download="dataexplorer-chart.png"
								style={{
									marginLeft: '1em',
								}}
							>
								Download Chart Image
							</a>
						)}
					</p>
				</div>

				<ShareBox className="chart-footer__share-box" title={dataSetTitle} />
			</div>
		) : null;
	}
}

export default ChartFooter;
