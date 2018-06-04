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
