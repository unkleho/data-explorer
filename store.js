import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios';

export const reducer = (state = { lastUpdate: 0, light: false, isLoading: false }, action) => {
  switch (action.type) {
    case 'TICK':
      return { lastUpdate: action.ts, light: !!action.light }
    case 'DATA_LOADING':
      console.log('hi');
      return { isLoading: true }
    case 'DATA_SUCCESS':
      return {
        isLoading: false,
        data2: action.data,
      }
    default:
      return state
  }
}

export const startClock = () => dispatch => {
  return setInterval(() => dispatch({ type: 'TICK', light: true, ts: Date.now() }), 800)
}

export const getData = (url) => {
  return async (dispatch) => {
    dispatch({
      type: 'DATA_LOADING',
    });

    // Fetch
    try {
      const result = await axios.get(url);
      console.log('try');

      dispatch({
        type: 'DATA_SUCCESS',
        data: result.data,
      })
    } catch(e) {
      dispatch({
        type: 'DATA_FAILED',
      })
    }
  }
}

export const initStore = (initialState) => {
  return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}
