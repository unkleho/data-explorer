// Build data for Victory Chart
export const buildChartData = (
	data = [],
	mainDimension,
	selectedMainDimensions = [],
	dimensions,
) => {
	const chartType = getChartType(data);

	if (chartType === 'line') {
		return buildLineChartData(data, mainDimension, selectedMainDimensions);
	} else if (chartType === 'pie') {
		return buildPieChartData(
			data,
			mainDimension,
			selectedMainDimensions,
			dimensions,
		);
	}
};

// Build Line chart data
const buildLineChartData = (
	data = [],
	mainDimension,
	selectedMainDimensions = [],
) => {
	// Check if data is valid
	if (data.length === 0) {
		return null;
	}

	const dimensionSlug = mainDimension && mainDimension.slug;

	// Loop through selectedMainDimensions to build multi-dimensional array
	const result = selectedMainDimensions.map((dimensionValue) => {
		return data
			.filter((d) => {
				return d.dimensions[dimensionSlug] === dimensionValue;
			})
			.map((d) => {
				return {
					x: new Date(d.date),
					y: d.value,
					// label: d.value,
				};
			});
	});

	return result;
};

// Build line chart data
const buildPieChartData = (data, mainDimension, selectedMainDimensions) => {
	const mainDimensionValues = mainDimension.values;

	return data.map((d, i) => {
		const slug = selectedMainDimensions[i];
		const value = mainDimensionValues.filter((value) => value.slug === slug)[0]
			.name;

		return {
			x: new Date(d.date),
			y: d.value,
			label: `${value} (${d.value})`,
		};
	});
};

export const getChartType = (data) => {
	if (!data || data.length === 0) {
		return null;
	}

	const firstDate = data[0].date;

	return data.length === data.filter((d) => d.date === firstDate).length
		? 'pie'
		: 'line';
};
