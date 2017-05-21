import axios from 'axios';

import { buildDataSets } from '../utils';

import allData from '../data';

import { buildDataSetApiUrl, getDefaultDimensions, buildApiUrl } from '../utils';

export const getDataSets = (source) => {
  const dataSets = buildDataSets(allData[source].dataSets); // List of DataSets

  return (dispatch) => {
    dispatch({
      type: 'GET_DATASETS_LOADING',
    });

    try {
      dispatch({
        type: 'GET_DATASETS_SUCCESS',
        dataSets,
        source: source,
        sourceTitle: source,
      })
    } catch(e) {
      console.log(e);

      dispatch({
        type: 'GET_DATASETS_FAILED',
      });
    }
  }
}

export const getDataSet = (id, source) => {
  const baseApiUrl = allData[source].apiUrl;

  return async (dispatch) => {
    dispatch({
      type: 'GET_DATASET_LOADING',
    });

    try {
      // Get dataSet metadata
      const dataSetResult = await axios.get(buildDataSetApiUrl(id, baseApiUrl));
      console.log(buildDataSetApiUrl(id, baseApiUrl));

      const dataSet = dataSetResult.data.structure;
      const dimensions = dataSet.dimensions.observation;
      const selectedDimensions = getDefaultDimensions(dimensions, id);

      dispatch({
        type: 'GET_DATASET_SUCCESS',
        id,
        dataSet,
        dimensions,
        selectedDimensions,
      });

      // Get data
      const dataResult = await axios.get(buildApiUrl({
        selectedDimensions,
        dataSetId: id,
        baseApiUrl,
      }));

      dispatch({
        type: 'GET_DATA_SUCCESS',
        data: dataResult.data,
      })
    } catch(e) {
      console.log(e);
      dispatch({
        type: 'GET_DATASET_FAILED',
      })
    }
  }
}

export const getData = (selectedDimensions, dataSetId, source) => {
  const baseApiUrl = allData[source].apiUrl;

  return async (dispatch) => {
    dispatch({
      type: 'GET_DATA_LOADING',
    });

    // Fetch
    try {
      const result = await axios.get(buildApiUrl({
        selectedDimensions,
        dataSetId,
        baseApiUrl,
      }));

      dispatch({
        type: 'GET_DATA_SUCCESS',
        data: result.data,
      })
    } catch(e) {
      dispatch({
        type: 'GET_DATA_FAILED',
      })
    }
  }
}
