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
import Logo from '../components/Logo';
import { buildChartData, getChartType } from '../lib/chartUtils';
// import { getDefaultDimensions } from '../utils';
import theme from '../styles/victoryTheme';
import { getDefaultDimensions } from '../utils';
import { colors, grey } from '../styles/variables';

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
			orgSlug: props.query.orgSlug.toUpperCase(),
			dataSetSlug: props.query.dataSetSlug,
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
			mainDimensionIndex = 0,
			selectedDimensions,
			// URL
			url,
		} = this.props;

		// Assign consts.
		const {
			title: orgTitle,
			// identifier: orgSlug
		} = organisation;
		const { dimensions, sdmxData = {} } = dataSet;
		const {
			data = null,
			// link = null
		} = sdmxData;

		const mainDimension = dimensions && dimensions[mainDimensionIndex];
		const selectedDimensionsNew =
			selectedDimensions || getDefaultDimensions(dimensions);
		const selectedMainDimensions = selectedDimensionsNew[mainDimensionIndex];

		// Work out chart type
		const chartType = getChartType(data);

		const victoryData = buildChartData(
			data,
			mainDimension,
			selectedMainDimensions,
			dimensions,
		);

		return (
			<ImageApp url={url} isLoading={isLoading} title={dataSet.title}>
				{({ width, height }) => {
					if (!process.browser) {
						return 'loading...';
					}

					return (
						<div className="images-page">
							<h1 className="images-page__title">{dataSet.title}</h1>

							<Logo className="images-page__logo" />

							<ChartSelectedDimensions
								className="images-page__chart-selected-dimensions"
								dimensions={dimensions}
								mainDimensionIndex={mainDimensionIndex}
								selectedDimensions={selectedDimensionsNew}
							/>

							{/* Main Dimension Values */}
							<div className="images-page__main-dimensions">
								{mainDimension &&
									mainDimension.values
										.filter((dimension) =>
											selectedMainDimensions.includes(dimension.slug),
										)
										.map((dimension, i) => {
											// TODO: Colour array with background/foreground colours
											return (
												<div
													className="images-page__main-dimension"
													style={{
														backgroundColor: colors[i],
														color: i === 3 ? grey[800] : 'white',
													}}
													key={dimension.slug}
												>
													{dimension.name}
												</div>
											);
										})}
							</div>

							<ChartContent
								victoryData={victoryData}
								chartType={chartType}
								width={width}
								height={height - 137}
								theme={theme}
							/>

							<p className="images-page__org-title">Source: {orgTitle}</p>
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
		options: (props) => {
			const {
				url: {
					query: { orgSlug, dataSetSlug, selectedDimensions },
				},
			} = props;
			// console.log(dataSetSlug, orgSlug);

			// Work out orgSlug from URL
			// const orgSlug = pathname.substr(1).toUpperCase();
			// const orgSlug = props.orgSlug;
			// const dataSetSlug = props.dataSetSlug;
			// const selectedDimensions = undefined;

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
