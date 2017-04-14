import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios';

export const reducer = (state = { isLoading: false }, action) => {
  switch (action.type) {
    case 'GET_DATA_LOADING':
      return {
        isLoading: true,
      }
    case 'GET_DATA_FAILED':
      return {
        isLoading: false,
        isError: true,
      }
    case 'GET_DATA_SUCCESS':
      console.log('GET_DATA_SUCCESS');
      console.log(action.data);
      return {
        isLoading: false,
        isLoaded: true,
        data: action.data,
      }
    default:
      return state
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
