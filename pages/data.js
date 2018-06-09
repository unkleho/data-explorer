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
import { encodeDecodeUrlParams } from '../lib/encodeDecode';

const { decode } = encodeDecodeUrlParams;

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
		const {
			query: { selectedDimensions, mainDimensionIndex, encodedParams },
		} = props;

		return {
			// Convert these url params from strings
			// selectedDimensions: selectedDimensions && JSON.parse(selectedDimensions),
			selectedDimensions: buildSelectedDimensions(
				selectedDimensions,
				encodedParams,
			),
			mainDimensionIndex:
				typeof mainDimensionIndex === 'string'
					? parseInt(mainDimensionIndex, 10)
					: mainDimensionIndex,
		};
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
		const { dimensions, data } = dataSet;

		return (
			<App url={url} isLoading={isLoading}>
				{({ width, height }) => {
					return (
						<Fragment>
							<Chart
								isLoading={isLoading}
								orgSlug={orgSlug}
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
			url: {
				pathname,
				query: { dataSetSlug, selectedDimensions, encodedParams },
			},
		}) => {
			// Work out orgSlug from URL
			const orgSlug = pathname
				.substr(1)
				.toUpperCase()
				// NOTE: Need to use page component with encoded-params suffix, so we need to remove it to get org slug.
				.replace('-ENCODED-PARAMS', '');

			console.log(typeof encodedParams === 'string');
			console.log(decode(encodedParams).selectedDimensions);
			// console.log(decode(encodedParams).selectedDimensions);

			return {
				variables: {
					orgSlug,
					selectedDimensions: buildSelectedDimensions(
						selectedDimensions,
						encodedParams,
					),
					dataSetSlug,
				},
			};
		},
		props: ({ data }) => {
			// console.log(data);
			return {
				// isLoading: data.loading,
				...data,
			};
		},
	})(withRedux(initStore, mapStateToProps)(Data)),
);

function buildSelectedDimensions(selectedDimensions, encodedParams) {
	// if (typeof encodedParams === 'string') {
	//   decode(encodedParams).selectedDimensions
	// } else if {
	//
	// }
	return typeof encodedParams === 'string'
		? decode(encodedParams).selectedDimensions
		: selectedDimensions ? JSON.parse(selectedDimensions) : [];
}
