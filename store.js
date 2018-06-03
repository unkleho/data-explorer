import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

export const reducer = (
	state = {
		isLoading: false,
		isMenuActive: true,
		// mainDimensionIndex: 0,
	},
	action,
) => {
	switch (action.type) {
		case 'GET_DATASETS_SUCCESS':
			console.log('GET_DATASETS_SUCCESS');
			return {
				...state,
				sourceId: action.sourceId,
				sourceTitle: action.sourceTitle,
				dataSets: action.dataSets,
			};

		case 'GET_DATASET_LOADING':
			console.log('GET_DATASET_LOADING');
			return {
				...state,
				isLoading: true,
			};

		case 'GET_DATASET_FAILED':
			console.log('GET_DATASET_FAILED');
			return {
				...state,
				isLoading: false,
				isError: true,
			};

		case 'GET_DATASET_SUCCESS':
			console.log('GET_DATASET_SUCCESS');
			const displayDimensions = action.dimensions.filter(({ id }) => {
				return id !== 'TIME_PERIOD';
			});

			return {
				...state,
				isLoading: false,
				isLoaded: true,
				id: action.id,
				// dataSet: action.dataSet,
				dimensions: displayDimensions,
				selectedDimensions: action.selectedDimensions,
			};

		case 'GET_DATA_LOADING':
			console.log('GET_DATA_LOADING');
			return {
				...state,
				isLoading: true,
			};

		case 'GET_DATA_FAILED':
			console.log('GET_DATA_FAILED');
			return {
				...state,
				isLoading: false,
				isError: true,
			};

		case 'GET_DATA_SUCCESS':
			console.log('GET_DATA_SUCCESS');
			return {
				...state,
				isLoading: false,
				isLoaded: true,
				data: action.data,
			};

		case 'SELECT_MAIN_DIMENSION':
			console.log('SELECT_MAIN_DIMENSION');
			return {
				...state,
				mainDimensionIndex: action.mainDimensionIndex,
				selectedDimensions: action.selectedDimensions, // TODO: Make default here?
			};

		case 'TOGGLE_MENU':
			console.log('TOGGLE_MENU', !state.isMenuActive);
			return {
				...state,
				isMenuActive: !state.isMenuActive,
			};

		default:
			return state;
	}
};

export const initStore = (initialState) => {
	return createStore(reducer, initialState, applyMiddleware(thunkMiddleware));
};

// function toggleArrayItem(a, v) {
//   var i = a.indexOf(v);
//   if (i === -1) {
//     a.push(v);
//   } else {
//     a.splice(i,1);
//   }
//
//   return a;
// }
