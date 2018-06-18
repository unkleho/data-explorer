const request = require('graphql-request').request;

const buildDownload = async ({
	format = 'csv',
	orgSlug,
	dataSetSlug,
	selectedDimensions,
	mainDimensionIndex,
}) => {
	try {
		const query = `
      query getDataSet(
    		$orgSlug: String!
    		$selectedDimensions: [[String!]!]
    		$dataSetSlug: String!
    	) {
    		organisation(identifier: $orgSlug) {
    			title
    		}
    		dataSet(
    			slug: $dataSetSlug
    			orgSlug: $orgSlug
    			selectedDimensions: $selectedDimensions
    		) {
    			slug
    			title
    			data {
    				date
    				value
    				dimensions
    			}
    		}
    	}
    `;

		const variables = {
			orgSlug,
			dataSetSlug,
			selectedDimensions: JSON.parse(selectedDimensions),
		};

		const result = await request(process.env.GRAPHQL_URL, query, variables);

		// console.log(result.dataSet.data);

		return result.dataSet.data.map((r) => {
			// console.log(r);
			return {
				date: r.date,
				value: r.value,
			};
		});
	} catch (e) {
		console.log(e);
	}
};

module.exports = buildDownload;
