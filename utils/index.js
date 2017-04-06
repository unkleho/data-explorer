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

// Get array of dimension ids, used for creating initial API call.
export function getDefaultDimensionIds(dimensions) {
  if (typeof window !== 'undefined') {
    // console.table(dimensions);
  }
  let result = [];

  dimensions.forEach((dimension) => {
    const { id, values } = dimension;
    let defaultId = values[0].id;

    if (id !== 'TIME_PERIOD') {
      if (id === 'REGION' || id === 'STATE') {
        // Select Australia first rather than a state
        result.push(getIdByName(values, 'Australia') || defaultId);
      // } else if (id === 'SEX') {
      //   // Select Persons rather than Male or Female
      //   result.push(getIdByName(values, 'Persons') || defaultId);
      } else {
        result.push(defaultId);
      }
    };

  })

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

export function buildDimensionsApiUrl(dimensionIds) {
  let result = dimensionIds.reduce((prev, id) => {
    return `${prev}${id}.`;
  }, '');

  return result.slice(0, -1);
}

export function buildVictoryData(data) {
  // Dataset
  const observations = getObservations(data);
  // console.log(observations);
  const timePeriods = getTimePeriods(data);
  const dimensionsConfig = getDimensionsConfig(data);
  // console.log(dimensionsConfig);
  // console.log(timePeriods);

  return Object.keys(observations).map(function(key) {
    const value = observations[key];

    // Break key in array to get dimensions
    const dimensions = key.split(':');
    const timePeriodIndex = dimensions.length - 1;
    const timePeriod = dimensions[timePeriodIndex];
    const timePeriodKey = timePeriods[timePeriod].id;

    return {
      x: createDate(timePeriodKey),
      y: value[0],
    }
  })
}

export function getDimensionsConfig(data) {
  return data.structure.dimensions.observation;
}

// Create date from TIME_PERIOD
export function createDate(dateString) {
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
      month = parseInt(suffix);
    }
  }

  const result = new Date(year, month, day);
  // console.log(result);

  return result;
}

export function getObservations(data) {
  return data.dataSets[0].observations;
}

export function getTimePeriods(data) {
  // console.log('getTimePeriods');
  let result = data.structure.dimensions.observation.filter((obs) => {
    // console.log(obs.id === 'TIME_PERIOD');
    return obs.id === 'TIME_PERIOD';
  });

  return result && result[0] && result[0].values;
}

export function getName(data) {
  return data.structure.name;
}
