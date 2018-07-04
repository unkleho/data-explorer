import { Component } from 'react';
import PropTypes from 'prop-types';
// import withRedux from 'next-redux-wrapper';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import './images.css';
import withApollo from '../lib/withApollo';
import ImageApp from '../components/ImageApp';
import ChartContent from '../components/ChartContent';
import ChartSelectedDimensions from '../components/ChartSelectedDimensions';
import { buildChartData, getChartType } from '../lib/chartUtils';
// import { getDefaultDimensions } from '../utils';
import theme from '../styles/victoryTheme';

class ImagesPage extends Component {
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
		const {
			query: { selectedDimensions, mainDimensionIndex },
		} = props;

		return {
			// Convert these url params from strings
			selectedDimensions: selectedDimensions && JSON.parse(selectedDimensions),
			mainDimensionIndex:
				typeof mainDimensionIndex === 'string'
					? parseInt(mainDimensionIndex, 10)
					: mainDimensionIndex,
		};
	}

	render() {
		const {
			// Prisma
			loading: isLoading,
			dataSet,
			organisation,
			mainDimensionIndex,
			selectedDimensions,
			// URL
			url,
		} = this.props;

		// Assign consts.
		const { title: orgTitle, identifier: orgSlug } = organisation;
		const { dimensions, sdmxData = {} } = dataSet;
		const { data = null, link = null } = sdmxData;

		const mainDimension = dimensions && dimensions[mainDimensionIndex];
		const selectedMainDimensions = selectedDimensions[mainDimensionIndex];

		// Work out chart type
		const chartType = getChartType(data);

		const victoryData = buildChartData(
			data,
			mainDimension,
			selectedMainDimensions,
			dimensions,
		);

		return (
			<ImageApp url={url} isLoading={isLoading}>
				{({ width, height }) => {
					return (
						<div className="images-page">
							<h1 className="images-page__title">{dataSet.title}</h1>

							{/* Main Dimension Values */}
							<div className="images-page__main-dimension-value">
								{mainDimension &&
									mainDimension.values
										.filter((dimension) =>
											selectedMainDimensions.includes(dimension.slug),
										)
										.map((dimension) => {
											return (
												<div className="images-page__main-dimension-value">
													{dimension.name}
												</div>
											);
										})}
							</div>

							<ChartSelectedDimensions
								className="images-page__chart-selected-dimensions"
								dimensions={dimensions}
								mainDimensionIndex={mainDimensionIndex}
								selectedDimensions={selectedDimensions}
							/>

							<ChartContent
								victoryData={victoryData}
								chartType={chartType}
								width={width}
								height={height}
								theme={theme}
							/>

							<p>{orgTitle}</p>
						</div>
					);
				}}
			</ImageApp>
		);
	}
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
		options: ({
			url: {
				query: { orgSlug, dataSetSlug, selectedDimensions },
			},
		}) => {
			// console.log(dataSetSlug, orgSlug);

			// Work out orgSlug from URL
			// const orgSlug = pathname.substr(1).toUpperCase();

			return {
				variables: {
					orgSlug: orgSlug.toUpperCase(),
					selectedDimensions: selectedDimensions
						? JSON.parse(selectedDimensions)
						: [],
					dataSetSlug,
				},
			};
		},
		props: ({ data }) => {
			return {
				...data,
			};
		},
	})(ImagesPage),
);
