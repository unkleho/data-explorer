import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios';

import { buildDataSetApiUrl, getDefaultDimensions, buildApiUrl } from './utils';

export const reducer = (state = { isLoading: false }, action) => {
  switch (action.type) {
    case 'GET_DATASET_LOADING':
      console.log('GET_DATASET_LOADING');
      return {
        ...state,
        isDataSetLoading: true,
      }
    case 'GET_DATASET_FAILED':
      console.log('GET_DATASET_FAILED');
      return {
        ...state,
        isDataSetLoading: false,
        isError: true,
      }
    case 'GET_DATASET_SUCCESS':
      console.log('GET_DATASET_SUCCESS');
      // console.log(action.dataSet);

      return {
        ...state,
        isDataSetLoading: false,
        isDataSetLoaded: true,
        id: action.id,
        dataSet: action.dataSet,
        dimensions: action.dataSet.dimensions.observation,
        selectedDimensions: action.selectedDimensions,
      }
    case 'GET_DATA_LOADING':
      return {
        ...state,
        isLoading: true,
      }
    case 'GET_DATA_FAILED':
      console.log('GET_DATA_FAILED');
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    case 'GET_DATA_SUCCESS':
      console.log('GET_DATA_SUCCESS');
      // console.log(action.data);
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        data: action.data,
      }
    default:
      return state
  }
}

export const getDataSet = (id) => {
  return async (dispatch) => {
    dispatch({
      type: 'GET_DATASET_LOADING',
    });

    try {
      // Get dataSet metadata
      const dataSetResult = await axios.get(buildDataSetApiUrl(id));
      const dataSet = dataSetResult.data.structure;
      const dimensions = dataSet.dimensions.observation;
      const selectedDimensions = getDefaultDimensions(dimensions);

      dispatch({
        type: 'GET_DATASET_SUCCESS',
        id,
        dataSet,
        selectedDimensions,
      });

      // Get data
      const dataResult = await axios.get(buildApiUrl({
        selectedDimensions,
        dataSetId: id,
      }));

      dispatch({
        type: 'GET_DATA_SUCCESS',
        data: dataResult.data,
      })

      // dispatch(getData(buildApiUrl({
      //   selectedDimensions,
      //   dataSetId: id,
      // })));
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

export const initStore = (initialState) => {
  return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}
