import axios from 'axios';

import { buildDataSetApiUrl, getDefaultDimensions, buildApiUrl } from '../utils';

export const getDataSet = (id, baseApiUrl) => {
  return async (dispatch) => {
    dispatch({
      type: 'GET_DATASET_LOADING',
    });

    try {
      // Get dataSet metadata
      const dataSetResult = await axios.get(buildDataSetApiUrl(id, baseApiUrl));
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

export const getData = (url) => {
  return async (dispatch) => {
    dispatch({
      type: 'GET_DATA_LOADING',
    });

    // Fetch
    try {
      const result = await axios.get(url);

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
