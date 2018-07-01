import buildDownload from '../lib/download';

describe('Download', () => {
	it('return csv', async () => {
		const result = await buildDownload({
			orgSlug: 'ABS',
			dataSetSlug: 'LF',
			selectedDimensions: [['0'], ['1'], ['1', '2'], ['1599'], ['10'], ['M']],
			mainDimensionIndex: 2,
		});

		expect(result[0]).toEqual({
			date: '1978-03-01',
			Males: 5173.601964,
			Females: 5315.728001,
		});

		expect(result[100]).toEqual({
			date: '1986-07-01',
			Males: 6040.212396,
			Females: 6209.451841,
		});
	});
});
