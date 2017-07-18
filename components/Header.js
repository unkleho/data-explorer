import { Component } from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
// import Link from 'next/link';
// import { blueGrey, orange } from 'material-colors';

import { initStore } from '../store';
// import { blueGrey300 } from '../styles/variables';

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
      ],
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
                // const idParam = s.id === 'UNESCO' ? '&id=DEMO_DS' : '';

                return (
                  <li
                    onClick={this.handleMenuToggle}
                    className={s.id === sourceId && 'is-active'}
                  >
                    {/* <Link
                      href={`/data?sourceId=${s.id}${idParam}`}
                    > */}
                      <a
                        href={`/data?sourceId=${s.id}`}
                      >{s.title}</a>
                    {/* </Link> */}
                  </li>
                )
              })}
            </ul>
          </div>

        </div>

        <style jsx>{`
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
