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
    		}
    	}
    `;

		const variables = {
			orgSlug,
			dataSetSlug,
			selectedDimensions,
		};

		const result = await request(process.env.GRAPHQL_URL, query, variables);

		const mainDimension = result.dataSet.dimensions[mainDimensionIndex];
		// const selectedMainDimensions = selectedDimensions[mainDimensionIndex];
		const mainDimensionSlug = mainDimension.slug;

		const dataForCSV = [];

		result.dataSet.data.forEach((r) => {
			// Convert to ISO Date
			const isoDate = r.date.split('T')[0];

			// Work out if dataForCSV array already has date value
			const hasDate =
				dataForCSV.filter((d) => d.date.split('T')[0] === isoDate).length !== 0;
			// Get current main dimension slug
			const dimensionSlug = r.dimensions[mainDimensionSlug];
			// Get name of selected main dimension
			const dimensionName = mainDimension.values.filter(
				(v) => v.slug === dimensionSlug,
			)[0].name;

			if (hasDate) {
				// Get index of existing object using date
				const index = dataForCSV.findIndex(
					(d) => d.date.split('T')[0] === isoDate,
				);

				// Re-assign object with appended dimensionName and value
				dataForCSV[index] = {
					...dataForCSV[index],
					[dimensionName]: r.value,
				};
			} else {
				dataForCSV.push({
					date: isoDate,
					[dimensionName]: r.value,
				});
			}
		});

		return dataForCSV;
	} catch (e) {
		console.log(e);
	}
};

module.exports = buildDownload;
