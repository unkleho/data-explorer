import { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import './ExampleApp.css';
import '../../styles/base.css';

import { initGA, logPageView, logEvent } from '../../lib/analytics';

class ExampleApp extends Component {
	static propTypes = {
		url: PropTypes.object,
	};

	componentDidMount() {
		if (!window.GA_INITIALIZED) {
			initGA();
			window.GA_INITIALIZED = true;
		}

		logPageView();
		logEvent('category', 'action', 'label');
	}

	componentDidUpdate(prevProps) {
		if (prevProps.url.query !== this.props.url.query) {
			logEvent('category', 'action', 'label');
		}
	}

	render() {
		return (
			<div className="example-app">
				<Head>
					<title>ABS Data Explorer</title>
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>
					<link
						href="https://fonts.googleapis.com/css?family=Droid+Serif:400,400i,700,700i|Roboto:100,100i,300,300i,400,400i,500,500i,700,900"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/icon?family=Material+Icons"
						rel="stylesheet"
					/>
				</Head>

				{this.props.children}
			</div>
		);
	}
}

export default ExampleApp;
