import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// TODO: Seems to get called every render, try to optimise.

class WithDimensions extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
	};

	constructor() {
		super();

		this.state = {};
	}

	componentDidMount() {
		this.updateDimensions();
		window.addEventListener('resize', this.updateDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	updateDimensions = () => {
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};

	render() {
		return (
			<Fragment>
				{this.props.children({
					width: this.state.width,
					height: this.state.height,
				})}
			</Fragment>
		);
	}
}

export default WithDimensions;
