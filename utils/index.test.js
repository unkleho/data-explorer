import { getChartType } from './';

describe('chartType', () => {
  test('is pie', () => {
    expect(getChartType(0)).toBe('pie');
  });

  test('is line', () => {
    expect(getChartType(1)).toBe('line');
  });
});
