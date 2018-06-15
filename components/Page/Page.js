import { Component } from 'react';
import PropTypes from 'prop-types';

import './Page.css';

class Page extends Component {
	static propTypes = {
		title: PropTypes.string,
	};

	render() {
		return (
			<article>
				<header className="page__header">
					<div className="container container--xs">
						<h1>{this.props.title}</h1>
					</div>
				</header>

				<div className="container container--xs">{this.props.children}</div>
			</article>
		);
	}
}

export default Page;
