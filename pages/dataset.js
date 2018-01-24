import { Component } from 'react';
import { gql, graphql } from 'react-apollo';

import withData from '../lib/withData';

class DatasetPage extends Component {

  render() {
    const {
      dataSets,
    } = this.props;

    return (
      <div>{dataSets && dataSets[0].dimensions.map(dimension => (
        <li>{dimension.name}
          <ul>
            {dimension.values.map((value) => (
              <li>{value.name}</li>
            ))}
          </ul>
        </li>
      ))}</div>
    )
  }

}

const query = gql`
	query {
		# organisation: Organisation(organisationId: "ABS") {
		# 	organisationId
		# 	title
		# 	dataSets {
		# 		id: dataSetId
		# 		title
		# 	}
		# 	defaultDataSet {
		# 		originalId
		# 	}
		# }
		dataSets: allDataSets(filter: { dataSetId: "ABS__LF" }) {
			title
			dimensions {
				name
				keyPosition
				dimensionId
				id: originalId
				values: dimensionValues {
          dimensionValueId
					name
					id: originalId
				}
			}
		}
	}
`;

export default withData(
	graphql(query, {
    // options: () => {
		// 	return {
		// 		variables: {
		// 			organisationId: 'ABS',
		// 			dataSetId: 'ABS__LF',
		// 		},
		// 	};
		// },
		props: ({ data }) => {
      console.log(data.dataSets && data.dataSets[0].dimensions[2]);

			return {
        ...data,
			};
		},
	})(DatasetPage),
);
