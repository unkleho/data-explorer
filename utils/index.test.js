import { getChartType, getDimensionColourMap } from './';
import { colors } from '../styles/variables';

describe('data', () => {
  test('main selected dimensions are in order', () => {
    const selectedDimension = ['SX_3', 'SX_2'];
    const values = [
      {
        id: '00',
      },
      {
        id: 'SX_2'
      },
      {
        id: 'SX_3'
      }
    ];
    const result = getDimensionColourMap(selectedDimension, values, colors);
    const answer = [
      { id: 'SX_2', colour: 1 }, { id: 'SX_3', colour: 0 }
    ];
    expect(result).toBe(answer);
  });
});

describe('chartType', () => {
  test('is pie', () => {
    expect(getChartType(1)).toBe('pie');
  });

  test('is line', () => {
    expect(getChartType(2)).toBe('line');
  });
});
