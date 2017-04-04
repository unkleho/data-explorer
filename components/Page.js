import { Component, PropTypes } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { blueGrey50, blueGrey100, blueGrey300, blueGrey700, deepOrange600 } from '../styles/variables';

class Page extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div style={{
        display: 'flex',
      }}>
        <style jsx global>{`
          html {
            box-sizing: border-box;
          }

          *, *:before, *:after {
            box-sizing: inherit;
          }

          body {
            position: relative;
            background: white;
            font-family: 'Droid Serif', serif;
            margin: 0;
            font-size: 18px;
            line-height: 23px;
            color: ${blueGrey700};
            // letter-spacing: -0.03em;
          }

          body::after {
            // background: linear-gradient(to bottom, hsla(280, 50%, 30%, .3), hsla(280, 50%, 30%, .3) 1px, transparent 1px, transparent);
            // background-size: 100% 1.27777778em;
            // bottom: 0;
            // content: "";
            // display: block;
            // left: 0;
            // position: absolute;
            // right: 0;
            // top: 0;
            // z-index: 9999;
            // pointer-events: none;
          }

          h1, .h1 {
            font-family: 'Roboto', sans-serif;
            font-size: 4.22222222em;
            line-height: 1.21052632em;
            margin-top: 0.30263158em;
            margin-bottom: 0.60526316em;
          }

          h2, .h2 {
            font-family: 'Roboto', sans-serif;
            font-size: 2.61111111em;
            line-height: 1.46808511em;
            margin-top: 0.4893617em;
            margin-bottom: 0.4893617em;
          }

          h3, .h3 {
            font-weight: 700;
            font-family: 'Droid Serif', serif;
            font-size: 2em;
            line-height: 1.4em;
            margin-top: 0.79310345em;
            margin-bottom: 0em;
            max-width: 20em;
            // text-align: center;
          }

          h4, .h4 {
            font-family: 'Roboto', sans-serif;
            text-transform: uppercase;
            font-size: 0.8em;
            line-height: 1.27777778em;
            margin-top: 1.27777778em;
            margin-bottom: 0.4em;
          }

          h5, .h5 {
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            text-transform: uppercase;
            font-size: 0.6em;
            line-height: 1.27777778em;
            margin-top: 0.4em;
            margin-bottom: 0.5em;
          }

          p, ul, ol, pre, table, blockquote {
            margin-top: 0em;
            margin-bottom: 1.27777778em;
          }

          ul ul, ol ol, ul ol, ol ul {
            margin-top: 0em;
            margin-bottom: 0em;
          }

          /* Let's make sure all's aligned */
          hr, .hr {
            border: 1px solid;
            margin: -1px 0;
          }

          a, b, i, strong, em, small, code {
            line-height: 0;
          }

          sub, sup {
            line-height: 0;
            position: relative;
            vertical-align: baseline;
          }

          sup {
            top: -0.5em;
          }

          sub {
            bottom: -0.25em;
          }

          select {
            width: 100%;
            border: none;
            font-size: 0.8em;
          }

          main {
            line-height: 1.27777778em;
            // padding-right: 1.27777778em;
            padding-left: calc(1.27777778em * 2);
            padding-right: calc(1.27777778em * 3);
            width: 80%;
          }

          aside {
            /*position: sticky;*/
            line-height: 1.27777778em;
            padding: 1.27777778em;
            width: 20%;
            min-height: 100vh;
            overflow: hidden;
            background-color: ${blueGrey50};
          }

          .logo {
            margin: -1.27777778em -1.27777778em 0;
            padding: 1.27777778em 1.27777778em 1.1em;
            font-size: 1.2em;
            line-height: 1.4;
            background-color: ${blueGrey300};
            color: white;
            /*margin-bottom: 1.2em;*/
            /*text-align: center;*/
          }

            .logo__abs {
              font-family: 'Roboto';
              font-weight: 700;
              /*color: #00796B;*/
            }

            .logo__text {
              font-family: 'Roboto';
              font-weight: 100;
              font-size: 1em;
            }

          .data-set-box {
            margin: 0 -1.27777778em;
            padding: 1.27777778em 1.27777778em 1.1em;
            /*margin-bottom: 1.5em;*/
            padding-bottom: 1.5em;
            background-color: ${blueGrey100};
          }

          .data-set-box h4 {
            margin-top: 0;
          }

          .dimension-box {
            border-top: 2px solid ${blueGrey100};
            margin-top: 1.3em;
            margin-bottom: 1em;
          }

          .header {
            padding-top: 1.8em;
            margin-bottom: 1em;
          }

          .header__title {
            margin-top: 0;
            margin-bottom: 0.3em;
          }

          .header__id {
            font-family: 'Roboto';
            opacity: 0.3;
            font-size: 0.8em;
          }

          .header__dimensions {
            display: flex;
            font-size: 0.8em;
          }

            .header__dimension {
              display: flex;
              flex-direction: column;
              margin-right: 2em;
            }

            .header__dimension__name {
              font-family: 'Roboto';
              opacity: 0.3;
              font-size: 0.8em;
              line-height: 1.4;
              margin-bottom: 0.3em;
            }

        `}</style>

        <Head>
          <title>ABS Data Explorer</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link href="https://fonts.googleapis.com/css?family=Droid+Serif:400,400i,700,700i|Roboto:100,100i,300,300i,400,400i,500,500i,700,900" rel="stylesheet" />
          <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
        </Head>

        {this.props.children}
      </div>
    );
  }
}

export default Page;
