import { Component } from 'react';
import Router from 'next/router';

class Home extends Component {
  componentDidMount() {
    // Router.push(`/data?id=LF`);
    window.location.replace('/data?id=LF&source=ABS');
  }

  render() {
    return (
      <div></div>
    )
  }
}

export default Home;
