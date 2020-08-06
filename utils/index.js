// @flow

// type SdmxDataDataSet = {
//   action: string,
//   observations: any, // Hash Map { 0:0:0:0: [1, 0, null] }
// }

// type SdmxDataAnnotation = {
//   text: string,
//   title: string,
//   uri: string,
// }

// type SdmxDataStructureObservation = {
//   id: string,
//   name: string,
//   values: {
//     id: string,
//     name: string,
//   }[]
// }

// type SdmxData = {
// 	headers: {
// 		id: string,
// 		link: {
// 			href: string,
// 			rel: string,
// 		}[],
// 		prepared: string, // Date
// 		sender: {
// 			id: string,
// 			name: string,
// 		},
// 		test: boolean,
// 	},
// 	dataSets: {
// 		action: string,
// 		observations: any, // Hash Map { 0:0:0:0: [1, 0, null] }
// 	}[],
// 	structure: {
// 		annotations: {
// 			text: string,
// 			title: string,
// 			uri: string,
// 		}[],
// 		attributes: {
// 			dataSet: Array<any>, // Empty
// 			observation: {
// 				id: string,
// 				name: string,
// 				values: {
// 					id: string,
// 					name: string,
// 				}[],
// 			}[],
// 			series: Array<any>, // Empty
// 			description: string,
// 		},
// 		dimensions: {
// 			observation: {
// 				id: string,
// 				keyPosition: 0,
// 				name: string,
// 				values: {
// 					// Use this for fixing line chart colour bug!
// 					id: string,
// 					name: string,
// 				}[],
// 			}[],
// 		},
// 		links: {
// 			href: string,
// 			rel: string,
// 		},
// 		name: string,
// 	},
// };

export function buildTableData(data) {
	// console.log(data.dataSets);
}

/*
 * ABS Data Utilities
 * ------------------------------------------------------------------ */

// ---------------------------------------------------
// Copied from data-explorer-graphql/lib
// Can't get field to return nested array in Prisma, so it is difficult to get selected
// default dimensions. So we run the same function on the server and client.
// Very ugly :(
// ---------------------------------------------------

// Get an array of default dimensions, used for creating initial API call.
// TODO: Set up global defaults
export function getDefaultDimensions(dimensions) {
	let result = [];

	dimensions
		// Filter out time period
		.filter((dimension) => dimension.slug !== 'TIME_PERIOD')
		.forEach((dimension) => {
			const { slug, values } = dimension;
			const defaultSlug = values[0].slug;

			let dimensionSlugs = [];

			if (slug === 'REGION' || slug === 'STATE') {
				// Select Australia first rather than a state
				dimensionSlugs.push(getSlugByName(values, 'Australia') || defaultSlug);
			} else {
				dimensionSlugs.push(defaultSlug);
			}

			result.push(dimensionSlugs);
		});

	return result;

	function getSlugByName(values, name) {
		const result = values.filter((value) => {
			return value.name === name;
		});

		if (result.length === 1) {
			return result[0].slug;
		} else {
			return undefined;
		}
	}
}

export function buildPieChartData(observations, dimensionsConfig) {
	return Object.keys(observations).map((key) => {
		// console.log(observations[key][0]);
		return {
			x: null,
			y: observations[key][0],
		};
	});
}

export function getDimensionColourMap(selectedDimension, values) {
	const result = [];

	values &&
		values.forEach((value) => {
			const colourIndex = selectedDimension.indexOf(value.id);

			if (colourIndex > -1) {
				result.push({
					...value,
					colour: colourIndex,
				});
			}
		});

	return result;
}

export function toggleArrayItem(a, v) {
	var i = a.indexOf(v);
	if (i === -1) {
		a.push(v);
	} else {
		a.splice(i, 1);
	}

	return a;
}
