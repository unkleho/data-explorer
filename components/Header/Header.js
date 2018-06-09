import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './Header.css';
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
				{ title: 'ABS', id: 'ABS', slug: 'abs', dataSetSlug: 'LF' },
				{ title: 'OECD', id: 'OECD', slug: 'oecd', dataSetSlug: 'SNA_TABLE1' },
				{ title: 'UKDS', id: 'UKDS', slug: 'ukds', dataSetSlug: 'TABLE5' },
				{
					title: 'UNESCO',
					id: 'UNESCO',
					slug: 'unesco',
					dataSetSlug: 'DEMO_DS',
				},
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
			<header className="header">
				<div className="logo">
					{/* <span className="logo__abs">{sourceId}</span> */}
					<span className="logo__text">Data Explorer</span>
					&nbsp;<span style={{ fontSize: '0.5em', opacity: '0.7' }}>BETA</span>
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
									className={
										s.slug === pathname.substr(1) ? 'is-active' : undefined
									}
									key={s.id}
								>
									<Link
										route={`/${s.slug}${
											s.dataSetSlug ? `/${s.dataSetSlug}` : ''
										}`}
									>
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
			</header>
		);
	}
}

function mapStateToProps(state) {
	return {
		...state,
	};
}

export default connect(initStore, mapStateToProps)(Header);
