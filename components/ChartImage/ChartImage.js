import { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import './ChartImage.css';

class ChartImage extends Component {
	static propTypes = {
		orgSlug: PropTypes.string,
		dataSetSlug: PropTypes.string,
		selectedDimensions: PropTypes.array,
	};

	render() {
		const { orgSlug, dataSetSlug } = this.props;

		return (
			<div className="chart-image">
				{orgSlug} {dataSetSlug}
			</div>
		);
	}
}

const QUERY = gql`
	query getDataSet(
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

export default graphql(QUERY, {
	options: (props) => {
		console.log(props);

		return {
			orgSlug: 'ABS',
			dataSetSlug: 'LF',
			selectedDimensions: [],
		};
	},
	props: ({ data }) => {
		console.log(data);

		return data;
	},
})(ChartImage);
