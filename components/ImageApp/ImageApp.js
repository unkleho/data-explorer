import { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
// import Urlbox from 'urlbox';

import './ImageApp.css';
import '../../styles/base.css';
import '../../styles/helpers.css';
import LoadingBar from '../LoadingBar';
import WithDimensions from '../WithDimensions';
import HeadMetaFields from '../HeadMetaFields';
import { initGA, logPageView, logEvent } from '../../lib/analytics';

// WARNING: Make this server-side only!
// const urlbox = Urlbox(
// 	process.env.URLBOX_API_KEY,
// 	process.env.URLBOX_API_SECRET,
// );

class ImageApp extends Component {
	static propTypes = {
		isLoading: PropTypes.bool,
		url: PropTypes.object,
		title: PropTypes.string,
	};

	componentDidMount() {
		if (!window.GA_INITIALIZED) {
			initGA();
			window.GA_INITIALIZED = true;
		}

		const { sourceId, id } = this.props.url.query;

		logPageView();
		// TODO: Generalise this!
		logEvent(sourceId, 'Select Dataset', id);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.url.query !== this.props.url.query) {
			const { sourceId, id } = this.props.url.query;

			logEvent(sourceId, 'Select Dataset', id);
		}
	}

	render() {
		const { isLoading, title } = this.props;

		return (
			<div className="image-app">
				<Head>
					<title>Data Explorer</title>
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>
					<link
						rel="stylesheet"
						href="https://unpkg.com/react-select/dist/react-select.css"
					/>
					<link
						href="https://fonts.googleapis.com/icon?family=Material+Icons"
						rel="stylesheet"
					/>
					<HeadMetaFields
						title={title}
						description="Visualise public data from the ABS, OECD, UNESCO and UKDS."
						imageUrl="/static/data-explorer-logo.png"
						// imageUrl={urlbox.buildUrl({
						// 	url: 'https://dataexplorer.io',
						// 	wait_for: '.VictoryChart',
						// })}
						imageAlt="Data Explorer Logo"
					/>
				</Head>

				<LoadingBar isLoading={isLoading} />

				<WithDimensions>
					{({ width, height }) => {
						return this.props.children({ width, height });
					}}
				</WithDimensions>
			</div>
		);
	}
}

export default ImageApp;
