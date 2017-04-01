// Convert data HTML object to something usable.
export function buildDataSets(data) {
  return data.children.map(option => {
    return {
      name: option.html,
      key: option.value,
    }
  });
}

export function buildMetaApiUrl(key) {
  return `http://stat.data.abs.gov.au/sdmx-json/metadata/${key}/all`;
}

export function buildApiUrl({ dimensionIds, dataSetKey }) {
  const dimensionString = buildDimensionsApiUrl(dimensionIds);

  const url = `http://stat.data.abs.gov.au/sdmx-json/data/${dataSetKey}/${dimensionString}/all?detail=Full&dimensionAtObservation=AllDimensions`;

  console.log(url);

  return url
  // return `http://stat.data.abs.gov.au/sdmx-json/data/LF/0.13.3.1599.30.M/all?detail=Full&dimensionAtObservation=AllDimensions`
}

// Get array of dimension ids
export function getDefaultDimensionIds(dimensions) {
  console.log(dimensions);
  let result = [];

  dimensions.forEach((dimension) => {
    if (dimension.id !== 'TIME_PERIOD') {
      result.push(dimension.values[0].id);
    };
  })

  console.log(result);

  return result;
}

export function buildDimensionsApiUrl(dimensionIds) {
  let result = dimensionIds.reduce((prev, id) => {
    return `${prev}${id}.`;
  }, '');

  return result.slice(0, -1);
}

export function buildVictoryData(data) {
  const observations = getObservations(data);
  const timePeriods = getTimePeriods(data);
  console.log('buildVictoryData');
  console.log(data);
  // console.log('timePeriods');
  // console.log(timePeriods);

  return Object.keys(observations).map(function(key) {
    const value = observations[key];

    // Break key in array to get dimensions
    const dimensions = key.split(':');
    const timePeriodIndex = dimensions.length - 1;
    const timePeriod = dimensions[timePeriodIndex];

    return {
      x: createDate(timePeriods[timePeriod].id),
      y: value[0],
    }
  })
}

export function createDate(dateString) {
  let year;
  let month = 0;
  let day = 1;

  if (!isNaN(dateString)) {
    // Assume year if just a Number
    year = dateString;
  } else {
    const date = dateString.split('-');
    year = date[0];

    if (date[0] === 'Q1') {
      month = 0;
    } else if (date[0] === 'Q2') {
      month = 3;
    } else if (date[0] === 'Q3') {
      month = 6;
    } else if (date[0] === 'Q4') {
      month = 9;
    }
  }

  return new Date(year, month, day);
}

export function getObservations(data) {
  return data.dataSets[0].observations;
}

export function getTimePeriods(data) {
  console.log('getTimePeriods');

  let result = data.structure.dimensions.observation.filter((obs) => {
    // console.log(obs.id === 'TIME_PERIOD');
    return obs.id === 'TIME_PERIOD';
  });
  console.log(result);
  return result[0].values;
}

export function getName(data) {
  return data.structure.name;
}
