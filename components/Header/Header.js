import { Component } from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';

import styles from './Header.css';
import { initStore } from '../../store';
import Link from '../../components/Link';

class Header extends Component {
	static propTypes = {
		sourceId: PropTypes.string,
	};

	constructor() {
		super();

		this.state = {
			isMenuActive: false,
			sources: [
				{ title: 'ABS', id: 'ABS', slug: 'abs' },
				{ title: 'OECD', id: 'OECD', slug: 'oecd' },
				{ title: 'UKDS', id: 'UKDS', slug: 'ukds' },
				{ title: 'UNESCO', id: 'UNESCO', slug: 'unesco' },
				{ title: 'ABOUT', id: 'ABOUT', slug: 'about' },
			],
		};
	}

	handleSourceSelect = () => {};

	handleMenuToggle = () => {
		this.setState({
			isMenuActive: !this.state.isMenuActive,
		});
	};

	render() {
		const { pathname } = this.props;

		const {
			sources,
			// isMenuActive,
		} = this.state;

		return (
			<header>
				<div className="container">
					<div className="logo">
						{/* <span className="logo__abs">{sourceId}</span> */}
						<span className="logo__text">Data Explorer</span>
						&nbsp;<span style={{ fontSize: '0.5em', opacity: '0.7' }}>
							BETA
						</span>
						&nbsp;
						{/* <i
                className="material-icons arrow"
                onClick={this.handleMenuToggle}
              >{isMenuActive ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i> */}
					</div>

					<button
						className="menu-icon material-icons"
						onClick={this.handleMenuToggle}
					>
						menu
					</button>

					<div className={`menu ${this.state.isMenuActive && 'is-active'}`}>
						<ul role="menu">
							{sources.map((s) => {
								return (
									<li
										// onClick={this.handleMenuToggle}
										className={s.slug === pathname.substr(1) && 'is-active'}
										key={s.id}
									>
										<Link href={`/${s.slug}`}>
											<a>{s.title}</a>
										</Link>
									</li>
								);
							})}
							<li>
								<Link to="/demo">
									<a>Demo</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<style jsx>{styles}</style>
			</header>
		);
	}
}

function mapStateToProps(state) {
	return {
		...state,
	};
}

export default withRedux(initStore, mapStateToProps)(Header);
