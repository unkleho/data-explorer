import { Component } from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import './data.css';
import withApollo from '../lib/withApollo';
import App from '../components/App';
import Chart from '../components/Chart';
import ChartLoader from '../components/ChartLoader';
import { initStore } from '../store';
import { getDefaultDimensions } from '../utils';

class Data extends Component {
	static propTypes = {
		organisation: PropTypes.shape({
			title: PropTypes.string,
		}),
		dataSet: PropTypes.shape({
			title: PropTypes.string,
			abstract: PropTypes.string,
		}),
		selectedDimensions: PropTypes.array,
		mainDimensionIndex: PropTypes.number,
	};

	static defaultProps = {
		organisation: {},
		dataSet: {
			dimensions: [],
		},
		selectedDimensions: undefined,
		mainDimensionIndex: 0,
	};

	static getInitialProps(props) {
		const {
			pathname,
			query: { dataSetSlug, selectedDimensions, mainDimensionIndex },
		} = props;

		// console.log(pathname);

		// const orgSlug = pathname.substr(1).toUpperCase();
		const orgSlug = pathname
			.substr(1)
			.replace('/[dataSetSlug]', '')
			.toUpperCase();

		return {
			orgSlug,
			dataSetSlug,
			selectedDimensions: selectedDimensions && JSON.parse(selectedDimensions),
			mainDimensionIndex:
				typeof mainDimensionIndex === 'string'
					? parseInt(mainDimensionIndex, 10)
					: mainDimensionIndex,
		};
	}

	constructor() {
		super();

		this.state = {};
	}

	handleMenuClick = (event) => {
		this.props.dispatch({
			type: 'TOGGLE_MENU',
		});
	};

	render() {
		const {
			// Prisma
			loading: isLoading,
			dataSet,
			organisation,
			// URL
			url,
			selectedDimensions,
			mainDimensionIndex,
		} = this.props;

		// Assign consts.
		const {
			dataSets,
			title: orgTitle = '',
			identifier: orgSlug,
		} = organisation;

		const {
			dimensions,
			sdmxData = {},
			title: dataSetTitle = '',
			abstract,
			imageUrl,
		} = dataSet;
		const { data = null, link = null } = sdmxData;

		// Build default selected dimensions if empty
		const selectedDimensionsNew =
			selectedDimensions || getDefaultDimensions(dimensions);

		return (
			<App
				url={url}
				isLoading={isLoading}
				title={!isLoading ? `${dataSetTitle} - ${orgTitle}` : 'Loading...'}
				description={abstract}
				imageUrl={imageUrl}
			>
				{({ width, height }) => {
					// Don't server-side render Chart, D3 wigs out on SSR.
					// TODO: Move this to Chart?
					if (!process.browser) {
						return null;
					}

					if (isLoading && !dataSet.title) {
						return <ChartLoader />;
					}

					return (
						<Chart
							isLoading={isLoading}
							orgSlug={orgSlug}
							orgTitle={orgTitle}
							dataSetSlug={dataSet.slug}
							dataSetLink={link}
							dataSets={dataSets}
							selectedDimensions={selectedDimensionsNew}
							dimensions={dimensions}
							mainDimensionIndex={mainDimensionIndex}
							data={data}
							imageUrl={imageUrl}
							width={width}
							height={height}
						/>
					);
				}}
			</App>
		);
	}
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
		$mainDimensionIndex: Int!
	) {
		organisation(identifier: $orgSlug) {
			identifier
			title
			dataSets {
				slug
				title
				tags {
					name
					slug
				}
				category {
					name
					slug
				}
			}
		}
		dataSet(
			slug: $dataSetSlug
			orgSlug: $orgSlug
			selectedDimensions: $selectedDimensions
			mainDimensionIndex: $mainDimensionIndex
		) {
			slug
			title
			abstract
			selectedDimensions
			imageUrl
			dimensions {
				name
				slug
				values {
					name
					slug
				}
			}
			sdmxData {
				link
				data {
					date
					value
					dimensions
				}
			}
		}
	}
`;

export default withApollo(
	graphql(query, {
		options: (props) => {
			// Split props access by server/browser because accessing props.url on server
			// doesn't resolve on server (could be a bug with Apollo 2).
			// To get around this, initialProps are returned via getInitialProps, but
			// used on the server. Browser still uses props.url.
			// Would prefer to access props.url for server and browser, leave it like this
			// until issue is resolved.

			if (!process.browser) {
				// Server

				const {
					orgSlug,
					dataSetSlug,
					selectedDimensions,
					mainDimensionIndex,
				} = props.initialProps;

				return {
					variables: {
						orgSlug,
						dataSetSlug,
						selectedDimensions,
						mainDimensionIndex: mainDimensionIndex || 0,
					},
				};
			} else {
				// Browser

				const {
					url: {
						pathname,
						query: { dataSetSlug, selectedDimensions, mainDimensionIndex },
					},
				} = props;

				// Work out orgSlug from URL
				// const orgSlug = pathname.substr(1).toUpperCase();
				const orgSlug = pathname
					.substr(1)
					.replace('/[dataSetSlug]', '')
					.toUpperCase();

				return {
					variables: {
						orgSlug,
						selectedDimensions: selectedDimensions
							? JSON.parse(selectedDimensions)
							: [],
						dataSetSlug,
						mainDimensionIndex: mainDimensionIndex || 0,
					},
				};
			}
		},
		props: ({ data }) => {
			return {
				...data,
			};
		},
	})(withRedux(initStore, mapStateToProps)(Data)),
);
