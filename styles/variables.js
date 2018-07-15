import {
	// amber,
	cyan,
	deepOrange,
	deepPurple,
	purple,
	yellow,
	blue,
	green,
	indigo,
	pink,
	grey,
	// red,
	lime,
	teal,
} from 'material-colors';

// TODO: Cleanup!

// Colors array (order is important)
export const colors = [
	pink['500'],
	blue['600'],
	purple['400'],
	yellow['600'],
	green['500'],
	cyan['300'],
	deepOrange['400'],
	deepPurple['500'],
	lime['500'],
	indigo['500'],
	teal['600'],
];
export const primary = indigo;
export { grey };

// Typography
export const sansSerif = "'Inter UI', 'Helvetica Neue', Helvetica, sans-serif";
export const letterSpacing = 'normal';
export const fontSize = 12;

// Layout
export const padding = 8;
export const baseProps = {
	width: 350,
	height: 350,
	padding: 50,
};
