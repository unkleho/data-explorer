import { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

import './Overlay.css';

const duration = 300;

class Overlay extends Component {
	static propTypes = {
		isActive: PropTypes.bool,
		onClick: PropTypes.func,
	};

	render() {
		const { isActive, onClick } = this.props;

		return (
			<Transition in={isActive} timeout={duration} unmountOnExit={true}>
				{(state) => (
					<div className={`overlay overlay--${state}`} onClick={onClick} />
				)}
			</Transition>
		);
	}
}

export default Overlay;
