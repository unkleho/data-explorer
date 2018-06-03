import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import './data.css';
import withApollo from '../lib/withApollo';
import App from '../components/App';
import Chart from '../components/Chart';
import { initStore } from '../store';
import { getDataSet } from '../actions';
import allData from '../data';
import { getDefaultDimensions } from '../utils';
import { select } from 'async';

class Data extends Component {
	static propTypes = {
		selectedDimensions: PropTypes.array,
		organisation: PropTypes.shape({
			title: PropTypes.string,
		}),
		// query: PropTypes.shape({
		// 	id: PropTypes.string,
		// 	sourceId: PropTypes.string,
		// }),
	};

	static defaultProps = {
		selectedDimensions: undefined,
		organisation: {},
		dataSet: {
			dimensions: [],
		},
		mainDimensionIndex: 0,
	};

	constructor() {
		super();

		this.state = {};
	}

	static getInitialProps(props) {
		const { query: { selectedDimensions, mainDimensionIndex } } = props;

		return {
			// Convert these url params from strings
			selectedDimensions: selectedDimensions && JSON.parse(selectedDimensions),
			mainDimensionIndex:
				typeof mainDimensionIndex === 'string'
					? parseInt(mainDimensionIndex, 10)
					: mainDimensionIndex,
		};
	}

	// static async getInitialProps(props) {
	// 	const {
	// 		query: {
	// 			id = null,
	// 			sourceId = 'ABS',
	// 			selectedDimensions = null,
	// 			mainDimensionIndex = null,
	// 		},
	// 		// isServer,
	// 		store,
	// 		pathname,
	// 	} = props;

	// 	const orgId = getOrgId(pathname) || sourceId;

	// 	// Work out if custom default dataSet exists
	// 	const defaultId = allData[orgId].defaultDataSetId;
	// 	const newId = id || defaultId || allData[orgId].dataSets.children[0].id;

	// 	// Parse selectedDimensions from URL
	// 	const selectedDimensionsNew = selectedDimensions
	// 		? JSON.parse(selectedDimensions)
	// 		: null;

	// 	// Get dataSet metadata and observations data
	// 	await store.dispatch(getDataSet(newId, orgId, selectedDimensionsNew));

	// 	if (mainDimensionIndex !== null) {
	// 		store.dispatch({
	// 			type: 'SELECT_MAIN_DIMENSION',
	// 			mainDimensionIndex,
	// 			selectedDimensions: selectedDimensionsNew,
	// 		});
	// 	}

	// 	return {
	// 		id: newId,
	// 		orgId,
	// 		orgSlug: orgId.toLowerCase(),
	// 	};
	// }

	handleMenuClick = (event) => {
		this.props.dispatch({
			type: 'TOGGLE_MENU',
		});
	};

	render() {
		const {
			// Prisma
			isLoading,
			dataSet,
			organisation,
			// URL
			url,
			selectedDimensions,
			mainDimensionIndex,
		} = this.props;

		// Assign consts.
		const { dataSets, title: orgTitle } = organisation;
		const { dimensions, data } = dataSet;

		return (
			<App url={url}>
				{({ width, height }) => {
					return (
						<Fragment>
							<Chart
								isLoading={isLoading}
								orgSlug={'ABS'}
								orgTitle={orgTitle}
								dataSetSlug={dataSet.slug}
								dataSets={dataSets}
								selectedDimensions={
									selectedDimensions || getDefaultDimensions(dimensions)
								}
								dimensions={dimensions}
								mainDimensionIndex={mainDimensionIndex}
								data={data}
								width={width}
								height={height}
							/>
						</Fragment>
					);
				}}
			</App>
		);
	}
}

function getOrgId(pathname) {
	return pathname !== '/data'
		? pathname.replace('/', '').toUpperCase()
		: undefined;
}

function mapStateToProps(state) {
	return {
		...state,
	};
}

const query = gql`
	query getOrganisation(
		$orgSlug: String!
		$selectedDimensions: [[String!]!]
		$dataSetSlug: String!
	) {
		organisation(identifier: $orgSlug) {
			identifier
			title
			dataSets {
				slug
				title
			}
		}
		dataSet(
			slug: $dataSetSlug
			orgSlug: $orgSlug
			selectedDimensions: $selectedDimensions
		) {
			slug
			title
			dimensions {
				name
				slug
				values {
					name
					slug
				}
			}
			data {
				date
				value
				dimensions
			}
			# observations
		}
	}
`;

export default withApollo(
	graphql(query, {
		options: ({
			url: { pathname, query: { dataSetSlug = 'LF', selectedDimensions = [] } },
		}) => {
			// Work out orgSlug from URL
			const orgSlug = pathname.substr(1).toUpperCase();

			return {
				variables: {
					orgSlug: 'ABS',
					selectedDimensions: JSON.parse(selectedDimensions),
					dataSetSlug,
				},
			};
		},
		props: ({ data }) => {
			return {
				isLoading: data.loading,
				...data,
			};
		},
	})(withRedux(initStore, mapStateToProps)(Data)),
);
