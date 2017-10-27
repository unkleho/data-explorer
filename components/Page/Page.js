import { Component } from 'react';
// import PropTypes from 'prop-types';

import styles from './Page.css';

class Page extends Component {

  render() {
    return (
      <article>
        {this.props.children}
        <style jsx global>{styles}</style>
      </article>
    );
  }
}

export default Page;
