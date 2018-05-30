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

type SdmxData = {
	headers: {
		id: string,
		link: {
			href: string,
			rel: string,
		}[],
		prepared: string, // Date
		sender: {
			id: string,
			name: string,
		},
		test: boolean,
	},
	dataSets: {
		action: string,
		observations: any, // Hash Map { 0:0:0:0: [1, 0, null] }
	}[],
	structure: {
		annotations: {
			text: string,
			title: string,
			uri: string,
		}[],
		attributes: {
			dataSet: Array<any>, // Empty
			observation: {
				id: string,
				name: string,
				values: {
					id: string,
					name: string,
				}[],
			}[],
			series: Array<any>, // Empty
			description: string,
		},
		dimensions: {
			observation: {
				id: string,
				keyPosition: 0,
				name: string,
				values: {
					// Use this for fixing line chart colour bug!
					id: string,
					name: string,
				}[],
			}[],
		},
		links: {
			href: string,
			rel: string,
		},
		name: string,
	},
};

export function buildTableData(data: SdmxData) {
	// console.log(data.dataSets);
}

/*
 * ABS Data Utilities
 * -------------------------------------------------------------------------- */

// import dataSets from '../data/absDataSets';
// import dataSets from '../data/oecdDataSets';

// API UTILITIES

// Get API URL for specific data set
export function buildDataSetApiUrl(key: string, baseApiUrl: string) {
	return `${baseApiUrl}/metadata/${key}/all`;
}

// Build the dimensions as a string for API URL
export function buildDimensionsApiUrl(selectedDimensions: Array<any>) {
	let result = selectedDimensions.reduce((prev, ids) => {
		const idString = ids.reduce((prev, id) => {
			return `${prev}${id}+`;
		}, '');
		return `${prev}${idString.slice(0, -1)}.`;
	}, '');

	return result.slice(0, -1);
}

// Get API URL for data within data set
export function buildApiUrl({ selectedDimensions, dataSetId, baseApiUrl }) {
	const dimensionString = buildDimensionsApiUrl(selectedDimensions);
	// console.log(dimensionString);

	const url = `${baseApiUrl}/data/${dataSetId}/${dimensionString}/all?detail=Full&dimensionAtObservation=AllDimensions`;

	console.log(url);

	return url;
	// return `http://stat.data.abs.gov.au/sdmx-json/data/LF/0.13.3.1599.30.M/all?detail=Full&dimensionAtObservation=AllDimensions`
}

// Convert data HTML object to something usable.
export function buildDataSets(data) {
	return data.children.map((option) => {
		return {
			...option,
		};
	});
}

// Get array of dimension ids, used for creating initial API call.
export function getDefaultDimensions(
	dimensions: Array<any>,
	id: string,
	dataSetDefaultDimensions: Array<any>,
) {
	if (typeof window !== 'undefined') {
		console.table(dimensions);
	}
	let result = [];

	console.log('getDefaultDimensions');

	console.log(dimensions);

	dimensions.forEach((dimension) => {
		const { id, values } = dimension;
		let defaultId = values[0].id;
		console.log(defaultId);

		let dimensionIds = [];

		if (id !== 'TIME_PERIOD') {
			if (id === 'REGION' || id === 'STATE') {
				// Select Australia first rather than a state
				dimensionIds.push(getIdByName(values, 'Australia') || defaultId);
				// } else if (id === 'SEX') {
				//   // Select Persons rather than Male or Female
				//   dimensiondIds.push(getIdByName(values, 'Persons') || defaultId);
			} else {
				dimensionIds.push(defaultId);
			}
		}

		if (dimensionIds.length > 0) {
			result.push(dimensionIds);
		}
	});

	// Work out if dataSet has default dimensions
	// TODO: Re-enable this!
	// const dataSet = getById(dataSets.children, id);
	// if (dataSet.defaultDimensions && dataSet.defaultDimensions.length > 0) {
	//   // TODO: Smarter merging needed, just replacing right now.
	//   result = dataSet.defaultDimensions;
	// }

	return result;

	function getIdByName(values, name) {
		const result = values.filter((value) => {
			return value.name === name;
		});

		if (result.length === 1) {
			return result[0].id;
		} else {
			return undefined;
		}
	}
}

export function getById(items: Array<any>, id: string) {
	const result = items.filter((item) => {
		return item.id === id;
	});

	if (result.length > 0) {
		return result[0];
	} else {
		return undefined;
	}
}

export function getDimensionsConfig(data: SdmxData) {
	return data.structure.dimensions.observation;
}

// Create date from TIME_PERIOD
export function createDate(dateString: string) {
	let year;
	let month = 0;
	let day = 1;

	if (!isNaN(dateString)) {
		// Assume year if just a Number
		year = dateString;
	} else {
		const date = dateString.split('-');
		const suffix = date[1];
		year = date[0];

		// Suffix could have Q for quarter or MM for month
		if (isNaN(suffix)) {
			// If not number, ie string
			if (suffix === 'Q1') {
				month = 0;
			} else if (suffix === 'Q2') {
				month = 3;
			} else if (suffix === 'Q3') {
				month = 6;
			} else if (suffix === 'Q4') {
				month = 9;
			}
		} else {
			// Assume it is monthly...
			// TODO: Best to get frequency argument to make sure
			month = parseInt(suffix, 10);
		}
	}

	const result = new Date(year, month, day);
	// console.log(result);

	return result;
}

export function getObservations(
	data: SdmxData,
	mainDimensionIndex: number,
	selectedValues: Array<any>,
) {
	// console.log('structure');
	// console.log(data.structure.dimensions.observation[mainDimensionIndex].values);
	const rawObservations = data.dataSets[0].observations;

	// const observationsPerValue = rawObservations.length/(rawSelectedValues.length);
	// console.log(rawObservations);

	// Divide up rawObservations based on rawSelectedValues
	// const dividedObservations = rawSelectedValues.map((value, i) => {
	//   return {
	//     id: value.id,
	//     observations: rawObservations.slice(),
	//   }
	// })

	return rawObservations;
}

export function getTimePeriods(data: SdmxData) {
	let result = data.structure.dimensions.observation.filter((obs) => {
		return obs.id === 'TIME_PERIOD';
	});

	return result && result[0] && result[0].values;
}

export function getName(data: SdmxData) {
	return data.structure.name;
}

/*
 * Victory Chart Utilities
 * -------------------------------------------------------------------------- */

export function buildVictoryData(
	data: SdmxData,
	mainDimensionIndex: number,
	selectedValues: Array<any>,
) {
	// console.log('mainDimensionIndex', 'selectedValues');
	// console.log(mainDimensionIndex, selectedValues);
	const totalObservations = Object.keys(data.dataSets[0].observations).length;

	if (totalObservations) {
		// Dataset
		const observations = getObservations(
			data,
			mainDimensionIndex,
			selectedValues,
		);
		// console.log(observations);
		const timePeriods = getTimePeriods(data);
		// console.log(timePeriods.length);
		const dimensionsConfig = getDimensionsConfig(data);
		// console.log('SdmxData');
		// console.log('timePeriods:' + timePeriods);
		const chartType = getChartType(timePeriods && timePeriods.length);
		// const chartType = 'line';
		const rawSelectedValues = data.structure.dimensions.observation[
			mainDimensionIndex
		].values.map((value) => value.id);

		if (chartType === 'line') {
			return buildLineChartData(
				observations,
				timePeriods,
				selectedValues,
				rawSelectedValues,
			);
		} else if (chartType === 'pie') {
			return buildPieChartData(observations, dimensionsConfig);
		} else {
			return [];
		}
	} else {
		return [];
	}
}

/*
When multiple values are selected in a dimension, SDMX API orders the dimensions in it's own way eg. http://stat.data.abs.gov.au/sdmx-json/data/CONFINEMENTS_NUPTIALITY/13.2.1+2+3+4.A/all?detail=Full&dimensionAtObservation=AllDimensions returns the data NOT in the 1+2+3+4 order. It actually orders by 1, 2, 4, 3. Very annoying, so we have to reorder the observations accordingly.
*/
function reorderLineChartData(data, selectedValues, rawSelectedValues) {
	let reorderedData = [];
	// console.log('reorderLineChartData');
	// console.log('selectedValues');
	// console.log(selectedValues);
	// console.log('rawSelectedValues');
	// console.log(rawSelectedValues);
	// console.log(data);

	// Loop through user selected values in dimension. Find corresponding value in rawSelectedValues and get index. Use index to select data array to reorder.
	selectedValues.forEach((value) => {
		const rawIndex = rawSelectedValues.indexOf(value);

		// Only push to array if data is available
		if (rawIndex !== -1) {
			reorderedData.push(data[rawIndex]);
		}
	});

	return reorderedData;
}

export function getChartType(periods: number) {
	let chartType;

	if (periods > 1) {
		chartType = 'line';
	} else {
		chartType = 'pie';
	}

	return chartType;
}

export function buildLineChartData(
	observations,
	timePeriods: Array<any>,
	selectedValues,
	rawSelectedValues,
) {
	// console.log('buildLineChartData');
	// console.log(timePeriods);
	let result = [];

	// Loop through massive glob of flat data and build multi-dimensional array
	Object.keys(observations).forEach(function(key, i) {
		const value = observations[key][0];
		const resultIndex = Math.floor(i / timePeriods.length);
		// const showLabel = i % timePeriods.length === Math.floor(timePeriods.length / 2);

		const timePeriodKey = getTimePeriodKey(key, timePeriods);

		if (typeof result[resultIndex] === 'undefined') {
			result[resultIndex] = [];
		}

		result[resultIndex].push({
			x: createDate(timePeriodKey),
			y: value,
			// label: resultIndex,
		});
	});

	// return result;

	return reorderLineChartData(result, selectedValues, rawSelectedValues);
}

// Get last key
export function getTimePeriodKey(observationKey: string, timePeriods) {
	// Break key in array to get dimensions
	const dimensions = observationKey.split(':');
	const timePeriodIndex = dimensions.length - 1;
	const timePeriod = dimensions[timePeriodIndex];
	const timePeriodKey = timePeriods[timePeriod].id;

	return timePeriodKey;
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

export function getDimensionColourMap(selectedDimension, values: Array<any>) {
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

export function toggleArrayItem(a: Array<any>, v: any) {
	var i = a.indexOf(v);
	if (i === -1) {
		a.push(v);
	} else {
		a.splice(i, 1);
	}

	return a;
}
