import { Component } from 'react';
import PropTypes from 'prop-types';

import './Logo.css';

class Logo extends Component {
	static propTypes = {
		className: PropTypes.string,
	};

	render() {
		const { className } = this.props;

		return (
			<div className={`logo ${className ? className : ''}`}>
				<span className="logo__svg" />
				<span className="logo__text">Data Explorer</span>
				&nbsp;<span style={{ fontSize: '0.5em', opacity: '0.7' }}>BETA</span>
				&nbsp;
			</div>
		);
	}
}

export default Logo;
