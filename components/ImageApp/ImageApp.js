import { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import './ImageApp.css';
import '../../styles/base.css';
import '../../styles/helpers.css';
import LoadingBar from '../LoadingBar';
import WithDimensions from '../WithDimensions';
import HeadMetaFields from '../HeadMetaFields';
import { initGA, logPageView, logEvent } from '../../lib/analytics';

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
						href="https://fonts.googleapis.com/icon?family=Material+Icons"
						rel="stylesheet"
					/>
					<HeadMetaFields
						title={title}
						description="Visualise public data from the ABS, OECD, UNESCO and UKDS."
						imageUrl="/static/data-explorer-logo.png"
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
