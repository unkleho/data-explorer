import { Component, PropTypes } from 'react';
import withRedux from 'next-redux-wrapper';
import Router from 'next/router';
import Link from 'next/link';
import { blueGrey, orange } from 'material-colors';

import { initStore } from '../store';
import { blueGrey300 } from '../styles/variables';

class Header extends Component {

  static propTypes = {
    sourceId: PropTypes.string,
  }

  constructor() {
    super();

    this.state = {
      isMenuActive: false,
      sources: [
        { title: 'ABS', id: 'ABS' },
        { title: 'OECD', id: 'OECD' },
        { title: 'UNESCO', id: 'UNESCO' },
      ]
    };
  }

  handleSourceSelect = () => {

  }

  handleMenuToggle = () => {
    this.setState({
      isMenuActive: !this.state.isMenuActive,
    });
  }

  render() {
    const {
      sourceId,
    } = this.props;

    const {
      sources,
      isMenuActive,
    } = this.state;

    return (
      <header className={`${isMenuActive && 'is-active'}`}>

        <div className="container">

          <div className="logo">
            <span className="logo__abs">{sourceId}</span>
              &nbsp;<span className="logo__text">Data Explorer</span>
              &nbsp;<span style={{ fontSize: '0.6em', opacity: '0.7' }}>BETA</span>
              &nbsp;
              <i
                className="material-icons arrow"
                onClick={this.handleMenuToggle}
              >{isMenuActive ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
          </div>

          <div className={`menu ${isMenuActive && 'is-active'}`}>
            <ul>
              {sources.map((s) => {
                return (
                  <li
                    // onClick={() => Router.push(`/data?source=${s.source}`)}
                    onClick={this.handleMenuToggle}
                    className={s.id === sourceId && 'is-active'}
                  >
                    <Link
                      href={`/data?sourceId=${s.id}`}
                    >
                      <a>{s.title}</a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

        </div>

        <style jsx>{`
          header {
            background-color: ${blueGrey['700']};
            color: white;
            height: 2.95em;
            transition: 0.3s;
            overflow: hidden;

            &.is-active {
              height: 5.9em;
            }
          }

          a:link, a:visited {
            color: white;
          }

          .logo {
            font-size: 1em;
            line-height: 3;
            margin-left: 1em;
            display: flex;
            align-items: baseline;
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

            .arrow {
              align-self: center;
              cursor: pointer;
            }

            .menu {
              /*display: none;*/
              background-color: ${blueGrey['600']};

              & ul {
                display: flex;
                margin-left: 0;
                margin-bottom: 0;
                padding-left: 0;
                list-style: none;
                line-height: 3;
              }

              & li {
                /*margin-right: 1.5em;*/
                padding-left: 1em;
                padding-right: 1em;

                &.is-active {
                  background-color: ${orange['900']};
                }
              }

              /*&.is-active {
                display: block;
              }*/
            }
        `}</style>
      </header>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state,
  }
}

export default withRedux(initStore, mapStateToProps)(Header);
