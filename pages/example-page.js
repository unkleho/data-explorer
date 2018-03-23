import { Component } from 'react';
import PropTypes from 'prop-types';

import './example-page.css';
import withData, { createApolloReduxStore } from '../lib/withData';
import ExampleApp from '../components/examples/ExampleApp';
import ExampleComponent from '../components/examples/ExampleComponent';
import { exampleAction } from '../actions/exampleActions';

class ExamplePage extends Component {
	static propTypes = {
		id: PropTypes.string,
	};

	constructor() {
		super();

		this.state = {};
	}

	static getInitialProps({ query: { id = null }, serverState }) {
		const store = createApolloReduxStore(serverState);
		store.dispatch(exampleAction('payload'));

		return {
			id,
		};
	}

	render() {
		const { id, url } = this.props;

		const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xlg', 'xxlg'];
		const colours = ['primary', 'secondary', 'tertiary', 'highlight'];

		return (
			<ExampleApp url={url}>
				<h1 className="title">
					Example Page <span>{id}</span>
				</h1>
				<h2>Heading 2</h2>
				<h3>Heading 3</h3>
				<h4>Heading 4</h4>
				<h5>Heading 5</h5>

				<p>
					Tacos activated charcoal put a bird on it fashion axe salvia taxidermy
					subway tile health goth. Gentrify tote bag selfies celiac, hell of
					scenester mixtape deep v pug typewriter live-edge activated charcoal
					cornhole hammock jianbing. Food truck four loko synth irony lomo
					meggings.
				</p>

				<p>
					Etsy typewriter yr waistcoat. Slow-carb keytar tumblr hoodie. Umami
					actually stumptown, kogi vaporware put a bird on it williamsburg
					brunch truffaut church-key tumeric.
				</p>

				<h2>Style Guide</h2>

				<h3>Type Scale</h3>
				{sizes.map((size) => (
					<p
						className={`font-size-${size}`}
						key={`font-size-${size}`}
					>{`font-size-${size}`}</p>
				))}

				<h3>Colours</h3>
				{colours.map((colour) => (
					<div className="boxes" key={`boxes-${colour}`}>
						<h4>{colour}</h4>

						<div>
							{[...Array(7)].map((shade, i) => {
								return (
									<div
										className={`box box--colour-${colour}`}
										key={`box--colour-${colour}-${i}`}
									/>
								);
							})}
						</div>
					</div>
				))}

				<h2>Example Component</h2>
				<ExampleComponent title="Title" />

				<h2>dotenv Test</h2>
				<p>{process.env.TEST}</p>
			</ExampleApp>
		);
	}
}

export default withData(ExamplePage);
