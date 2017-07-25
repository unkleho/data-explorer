import axios from 'axios';

import allData from '../data';
import {
  buildDataSets,
  buildDataSetApiUrl,
  getDefaultDimensions,
  buildApiUrl,
} from '../utils';
import { logEvent } from '../lib/analytics';

export const getDataSets = (sourceId) => {
  const dataSets = buildDataSets(allData[sourceId].dataSets); // List of DataSets

  return (dispatch) => {
    dispatch({
      type: 'GET_DATASETS_LOADING',
    });

    try {
      dispatch({
        type: 'GET_DATASETS_SUCCESS',
        dataSets,
        sourceId: sourceId,
        sourceTitle: sourceId,
      })
    } catch(e) {
      console.log(e);

      dispatch({
        type: 'GET_DATASETS_FAILED',
      });
    }
  }
}

export const getDataSet = (id, sourceId, selectedDimensions) => {
  const baseApiUrl = allData[sourceId].apiUrl;
  console.log(selectedDimensions);

  return async (dispatch) => {
    dispatch({
      type: 'GET_DATASET_LOADING',
    });

    try {
      // Get dataSet metadata
      const dataSetResult = await axios.get(buildDataSetApiUrl(id, baseApiUrl));
      // console.log(buildDataSetApiUrl(id, baseApiUrl));

      const dataSet = dataSetResult.data.structure;
      const dimensions = dataSet.dimensions.observation;
      selectedDimensions = selectedDimensions || getDefaultDimensions(dimensions, id);

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

export const getData = (selectedDimensions, dataSetId, sourceId) => {
  const baseApiUrl = allData[sourceId].apiUrl;

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
      const dimensionsString = JSON.stringify(selectedDimensions);

      dispatch({
        type: 'GET_DATA_SUCCESS',
        data: result.data,
      });

      console.log(JSON.stringify(selectedDimensions));

      logEvent(sourceId, 'Select Dimension', `${dataSetId} - ${dimensionsString}`);
    } catch(e) {
      dispatch({
        type: 'GET_DATA_FAILED',
      })
    }
  }
}
