/*
  "material" theme (VictoryTheme.material)
  Try changing the theme. You could start with `colors` or `fontSize`.
*/

import { assign } from 'lodash';
import {
	// Colours
	// yellow200,
	deepOrange600,
	// lime300,
	// lightGreen500,
	// teal700,
	// cyan900,
	colors,
	blueGrey50,
	// blueGrey300,
	blueGrey700,
	grey900,
	primary,
	grey,

	// Typography
	sansSerif,
	letterSpacing,
	fontSize,

	// Layout
	padding,
	baseProps,
} from './variables';

// Labels
const baseLabelStyles = {
	fontFamily: sansSerif,
	fontSize,
	letterSpacing,
	padding,
	fill: blueGrey700,
};

const centeredLabelStyles = assign({ textAnchor: 'middle' }, baseLabelStyles);

// Strokes
const strokeDasharray = '10, 5';
const strokeLinecap = 'round';
const strokeLinejoin = 'round';

// Put it all together...
const theme = {
	area: assign(
		{
			style: {
				data: {
					fill: grey900,
				},
				labels: centeredLabelStyles,
			},
		},
		baseProps,
	),
	axis: assign(
		{
			style: {
				axis: {
					fill: 'transparent',
					stroke: primary['500'],
					strokeWidth: 1,
					strokeLinecap,
					strokeLinejoin,
				},
				axisLabel: assign({}, centeredLabelStyles, {
					padding,
					stroke: 'transparent',
				}),
				grid: {
					fill: 'transparent',
					stroke: primary['50'],
					strokeDasharray,
					strokeLinecap,
					strokeLinejoin,
				},
				ticks: {
					fill: 'transparent',
					size: 5,
					stroke: primary['500'],
					strokeWidth: 1,
					strokeLinecap,
					strokeLinejoin,
				},
				tickLabels: assign({}, baseLabelStyles, {
					fill: grey['600'],
					stroke: 'transparent',
				}),
			},
		},
		baseProps,
	),
	bar: assign(
		{
			style: {
				data: {
					fill: blueGrey700,
					padding,
					stroke: 'transparent',
					strokeWidth: 0,
					width: 5,
				},
				labels: baseLabelStyles,
			},
		},
		baseProps,
	),
	candlestick: assign(
		{
			style: {
				data: {
					stroke: blueGrey700,
				},
				labels: centeredLabelStyles,
			},
			candleColors: {
				positive: '#ffffff',
				negative: blueGrey700,
			},
		},
		baseProps,
	),
	chart: baseProps,
	errorbar: assign(
		{
			style: {
				data: {
					fill: 'transparent',
					opacity: 1,
					stroke: blueGrey700,
					strokeWidth: 2,
				},
				labels: assign({}, centeredLabelStyles, {
					stroke: 'transparent',
					strokeWidth: 0,
				}),
			},
		},
		baseProps,
	),
	group: assign(
		{
			colorScale: colors,
		},
		baseProps,
	),
	line: assign(
		{
			style: {
				data: {
					fill: 'transparent',
					opacity: 1,
					stroke: deepOrange600,
					strokeWidth: 2,
				},
				labels: assign({}, baseLabelStyles, {
					stroke: 'transparent',
					strokeWidth: 0,
					textAnchor: 'start',
				}),
			},
		},
		baseProps,
	),
	pie: assign(
		{
			colorScale: colors,
			style: {
				data: {
					padding,
					stroke: blueGrey50,
					strokeWidth: 1,
				},
				labels: assign({}, baseLabelStyles, {
					padding: 20,
					stroke: 'transparent',
					strokeWidth: 0,
				}),
			},
		},
		baseProps,
	),
	scatter: assign(
		{
			style: {
				data: {
					fill: blueGrey700,
					opacity: 1,
					stroke: 'transparent',
					strokeWidth: 0,
				},
				labels: assign({}, centeredLabelStyles, {
					stroke: 'transparent',
				}),
			},
		},
		baseProps,
	),
	stack: assign(
		{
			colorScale: colors,
		},
		baseProps,
	),
	tooltip: assign(
		{
			style: {
				data: {
					fill: 'transparent',
					stroke: 'transparent',
					strokeWidth: 0,
				},
				labels: centeredLabelStyles,
				flyout: {
					stroke: blueGrey700,
					strokeWidth: 1,
					fill: '#f0f0f0',
				},
			},
			flyoutProps: {
				cornerRadius: 10,
				pointerLength: 10,
			},
		},
		baseProps,
	),
	voronoi: assign(
		{
			style: {
				data: {
					fill: 'transparent',
					stroke: 'transparent',
					strokeWidth: 0,
				},
				labels: centeredLabelStyles,
			},
		},
		baseProps,
	),
};

export default theme;
