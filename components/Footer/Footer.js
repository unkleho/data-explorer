import { Component } from 'react';
// import PropTypes from 'prop-types';

import './Footer.css';

class Footer extends Component {
	// static propTypes = {};

	render() {
		// const {} = this.props;

		return (
			<footer className="footer">
				<p>
					<strong>Data Explorer 2018</strong> | Follow{' '}
					<a
						href="https://twitter.com/dataexplorerio"
						target="_blank"
						rel="noopener noreferrer"
					>
						@dataexplorerio
					</a>{' '}
					for updates and feedback
				</p>
				<p>
					By{' '}
					<a
						href="https://twitter.com/unkleho"
						target="_blank"
						rel="noopener noreferrer"
					>
						@unkleho
					</a>
				</p>
			</footer>
		);
	}
}

export default Footer;
