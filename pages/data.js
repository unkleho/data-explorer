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
import { getDefaultDimensions } from '../utils';

class Data extends Component {
	static propTypes = {
		selectedDimensions: PropTypes.array,
		organisation: PropTypes.shape({
			title: PropTypes.string,
		}),
		link: PropTypes.array,
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
		// console.log(props.query, props.pathname);

		if (!process.browser) {
			console.log('Server');

			const {
				pathname,
				query: { dataSetSlug, selectedDimensions, mainDimensionIndex },
			} = props;

			// Work out orgSlug from URL
			const orgSlug = pathname.substr(1).toUpperCase();

			return {
				orgSlug,
				selectedDimensions:
					selectedDimensions && JSON.parse(selectedDimensions),
				dataSetSlug,
				mainDimensionIndex:
					typeof mainDimensionIndex === 'string'
						? parseInt(mainDimensionIndex, 10)
						: mainDimensionIndex,
			};
		} else {
			console.log('Browser');

			// OLD ---------------
			const {
				query: { selectedDimensions, mainDimensionIndex },
			} = props;

			return {
				// Convert these url params from strings
				selectedDimensions:
					selectedDimensions && JSON.parse(selectedDimensions),
				mainDimensionIndex:
					typeof mainDimensionIndex === 'string'
						? parseInt(mainDimensionIndex, 10)
						: mainDimensionIndex,
			};
		}
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
		const { dimensions, sdmxData = {}, title: dataSetTitle } = dataSet;
		const { data = null, link = null } = sdmxData;

		console.log('Data -------------------------');
		console.log(data);

		// Build meta image url
		// const metaImageUrl = !isLoading
		// 	? `/images/${orgSlug.toLowerCase()}/${
		// 			dataSet.slug
		// 	  }?selectedDimensions=${JSON.stringify(
		// 			selectedDimensions,
		// 	  )}&mainDimension=${mainDimensionIndex}`
		// 	: '/static/data-explorer-logo.png';

		return (
			<App
				url={url}
				isLoading={isLoading}
				title={dataSetTitle}
				// imageUrl={metaImageUrl}
			>
				{({ width, height }) => {
					return (
						<Fragment>
							<Chart
								isLoading={isLoading}
								orgSlug={orgSlug}
								orgTitle={orgTitle}
								dataSetSlug={dataSet.slug}
								dataSetLink={link}
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

			if (!process.browser) {
				console.log('Server');

				const { orgSlug, dataSetSlug, selectedDimensions } = props.initialProps;

				return {
					variables: {
						orgSlug,
						dataSetSlug,
						selectedDimensions,
					},
				};
			} else {
				console.log('Browser');
				// OLD --------------------------------------
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
			console.log(data.dataSet);

			return {
				...data,
			};
		},
	})(withRedux(initStore, mapStateToProps)(Data)),
);
