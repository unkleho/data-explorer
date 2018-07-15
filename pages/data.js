import { Component } from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Urlbox from 'urlbox'; // TODO: Try to conditionally load this

import './data.css';
import withApollo from '../lib/withApollo';
import App from '../components/App';
import Chart from '../components/Chart';
import { initStore } from '../store';
import { getDefaultDimensions } from '../utils';

let urlbox;

if (!process.browser) {
	urlbox = Urlbox(process.env.URLBOX_API_KEY, process.env.URLBOX_API_SECRET);
}

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

		const orgSlug = pathname.substr(1).toUpperCase();

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
		const { dataSets, title: orgTitle, identifier: orgSlug } = organisation;
		const {
			dimensions,
			sdmxData = {},
			title: dataSetTitle,
			abstract,
		} = dataSet;
		const { data = null, link = null } = sdmxData;

		// Build default selected dimensions if empty
		const selectedDimensionsNew =
			selectedDimensions || getDefaultDimensions(dimensions);

		// --------------------------------------------------------------
		// Build imageUrl from urlbox
		// --------------------------------------------------------------

		let imageUrl;

		if (!process.browser) {
			// Build meta image url
			const imageUrlForUrlbox = `${
				process.env.BASE_URL
			}/images/${orgSlug.toLowerCase()}/${
				dataSet.slug
			}?selectedDimensions=${JSON.stringify(
				selectedDimensionsNew,
			)}&mainDimension=${mainDimensionIndex}`;

			imageUrl = urlbox.buildUrl({
				url: imageUrlForUrlbox,
				wait_for: '.VictoryChart',
				width: 600,
				height: 314,
			});
		} else {
			imageUrl = '/static/data-explorer-logo.png';
		}

		// --------------------------------------------------------------

		return (
			<App
				url={url}
				isLoading={isLoading}
				title={`${dataSetTitle} - ${orgTitle}`}
				description={abstract}
				imageUrl={imageUrl}
			>
				{({ width, height }) => {
					if (!process.browser) {
						return null;
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
			abstract
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

				const { orgSlug, dataSetSlug, selectedDimensions } = props.initialProps;

				return {
					variables: {
						orgSlug,
						dataSetSlug,
						selectedDimensions,
					},
				};
			} else {
				// Browser

				const {
					url: {
						pathname,
						query: { dataSetSlug, selectedDimensions },
					},
				} = props;

				// Work out orgSlug from URL
				const orgSlug = pathname.substr(1).toUpperCase();

				return {
					variables: {
						orgSlug,
						selectedDimensions: selectedDimensions
							? JSON.parse(selectedDimensions)
							: [],
						dataSetSlug,
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
