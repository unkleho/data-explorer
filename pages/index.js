import { Component } from 'react';

class Home extends Component {
	componentDidMount() {
		window.location.replace('/abs');
	}

	render() {
		return <div />;
	}
}

export default Home;
