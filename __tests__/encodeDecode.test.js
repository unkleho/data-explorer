import { buildEncodeDecode } from '../lib/encodeDecode';

describe('Encoding/Decoding', () => {
	// Build encode and decode from inferred json
	const { encode, decode } = buildEncodeDecode({
		selectedDimensions: [['0'], ['0', '1'], ['M']],
		mainDimensionIndex: 0,
	});

	const base64String = 'DAQCMAIxAAICMQACAjEAAggxNTk5AAIEMTAAAgJNAAAA';
	const json = {
		selectedDimensions: [['0', '1'], ['1'], ['1'], ['1599'], ['10'], ['M']],
		mainDimensionIndex: 0,
	};

	it('should return a base 64 string', () => {
		const result = encode(json);

		// Encode buffer to base 64 String
		expect(result).toBe(base64String);
	});

	it('should return a correct type', () => {
		const result = decode(base64String);

		expect(result).toEqual(json);
	});
});
