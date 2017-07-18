import { Component } from 'react';
// import PropTypes from 'prop-types';
import Head from 'next/head';
// import { blueGrey } from 'material-colors';

import styles from './Page.css';
import Header from '../components/Header';
// import { blueGrey50, blueGrey100, blueGrey300, blueGrey700, deepOrange600 } from '../styles/variables';

class Page extends Component {

  render() {
    return (
      <div>
        <Head>
          <title>ABS Data Explorer</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link href="https://fonts.googleapis.com/css?family=Droid+Serif:400,400i,700,700i|Roboto:100,100i,300,300i,400,400i,500,500i,700,900" rel="stylesheet" />
          <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
        </Head>

        <Header />
        {this.props.children}

        <style jsx global>{styles}</style>
      </div>
    );
  }
}

export default Page;
