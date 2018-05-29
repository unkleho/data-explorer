import { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import './App.css';
import '../../styles/base.css';
import '../../styles/helpers.css';
import Header from '../Header';
import { initGA, logPageView, logEvent } from '../../lib/analytics';

class App extends Component {
	static propTypes = {
		url: PropTypes.object,
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
		return (
			<div className="app">
				<Head>
					<title>Data Explorer</title>
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>
					{/* <link href="https://fonts.googleapis.com/css?family=Droid+Serif:400,400i,700,700i|Roboto:100,100i,300,300i,400,400i,500,500i,700,900" rel="stylesheet" />           */}
					<link
						rel="stylesheet"
						href="https://unpkg.com/react-select/dist/react-select.css"
					/>
					<link
						href="https://fonts.googleapis.com/icon?family=Material+Icons"
						rel="stylesheet"
					/>
				</Head>

				<Header pathname={this.props.url.pathname} />

				{this.props.children}
			</div>
		);
	}
}

export default App;
