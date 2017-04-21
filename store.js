import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios';

import { buildDataSetApiUrl, getDefaultDimensions, buildApiUrl } from './utils';

export const reducer = (state = {
  isLoading: false,
  isMenuActive: true,
}, action) => {
  switch (action.type) {
    case 'GET_DATASET_LOADING':

      console.log('GET_DATASET_LOADING');
      return {
        ...state,
        isLoading: true,
      }

    case 'GET_DATASET_FAILED':

      console.log('GET_DATASET_FAILED');
      return {
        ...state,
        isLoading: false,
        isError: true,
      }

    case 'GET_DATASET_SUCCESS':

      console.log('GET_DATASET_SUCCESS');
      // console.log(action.dataSet);
      const displayDimensions = action.dimensions.filter(({ id }) => {
        return id !== 'TIME_PERIOD';
      })

      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        id: action.id,
        dataSet: action.dataSet,
        dimensions: displayDimensions,
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

    case 'SELECT_MAIN_DIMENSION_ID':

      console.log(action.id);
      console.log(action.dimensionId);

      const selectedDimensions = state.selectedDimensions.map((selectedDimension, i) => {
        if (i === action.dimensionId) {
          return toggleArrayItem(selectedDimension, action.id);
        } else {
          return selectedDimension;
        }
      })

      console.log(selectedDimensions);

      return {
        ...state,
        selectedDimensions,
      }

    case 'TOGGLE_MENU':
      console.log('TOGGLE_MENU', !state.isMenuActive);

      return {
        ...state,
        isMenuActive: !state.isMenuActive,
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

export const selectMainDimensionId = (id, dimensionId) => {
  return {
    type: 'SELECT_MAIN_DIMENSION_ID',
    id,
    dimensionId,
  }

  // return (dispatch) => {
  //   dispatch({
  //     type: 'SELECT_MAIN_DIMENSION_ID',
  //   });
  // }
}

export const initStore = (initialState) => {
  return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}

function toggleArrayItem(a, v) {
    var i = a.indexOf(v);
    if (i === -1) {
      a.push(v);
    } else {
      a.splice(i,1);
    }

    return a;
}
