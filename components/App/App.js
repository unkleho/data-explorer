import { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
// import Urlbox from 'urlbox'; // TODO: Try to conditionally load this

import './App.css';
import '../../styles/base.css';
import '../../styles/helpers.css';
import Header from '../Header';
import Footer from '../Footer';
import LoadingBar from '../LoadingBar';
import WithDimensions from '../WithDimensions';
import HeadMetaFields from '../HeadMetaFields';
import { initGA, logPageView, logEvent } from '../../lib/analytics';

// let urlbox;

// if (!process.browser) {
// 	urlbox = Urlbox(process.env.URLBOX_API_KEY, process.env.URLBOX_API_SECRET);
// }

class App extends Component {
	static propTypes = {
		isLoading: PropTypes.bool,
		url: PropTypes.object,
		title: PropTypes.string,
		description: PropTypes.string,
		imageUrl: PropTypes.string,
	};

	static defaultProps = {
		imageUrl: '/static/data-explorer-logo.png',
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
		const { isLoading, title, imageUrl, description } = this.props;

		return (
			<div className="app">
				<Head>
					<title>{title} | Data Explorer</title>
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
						description={description}
						// imageUrl={metaImageUrl}
						imageUrl={imageUrl}
						imageAlt="Data Explorer Logo"
					/>
				</Head>

				<LoadingBar isLoading={isLoading} />
				<Header pathname={this.props.url.pathname} />

				<WithDimensions>
					{({ width, height }) => {
						return this.props.children({ width, height });
					}}
				</WithDimensions>

				<Footer />
			</div>
		);
	}
}

export default App;
