import { Component, PropTypes } from 'react';
import { blueGrey300 } from '../styles/variables';

class Header extends Component {
  static propTypes = {
  }

  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <header>
        <style jsx>{`
          header {
            padding-left: 1em;
            background-color: ${blueGrey300};
          }

          .logo {
            font-size: 1.2em;
            line-height: 2;
            color: white;
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
        `}</style>
        <div className="logo">
          <span className="logo__abs">ABS</span> <span className="logo__text">Data Explorer</span> <span style={{ fontSize: '0.4em' }}>beta</span>
        </div>
      </header>
    )
  }
}

// const Header = ({
//   victoryData,
//   chartType,
//   theme,
//   width,
//   height,
//   colors,
//   data,
// }) => {
//   return (
//   )
// }

export default Header;
