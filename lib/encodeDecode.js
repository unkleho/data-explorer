import avro from 'avsc';
import {
	encode as encodeBase64,
	decode as decodeBase64,
} from 'base64-arraybuffer';

// Encode JSON, based on inferred example JSON
export const encode = (json, testJson) => {
	// Build type, inferred from testJson
	const type = avro.Type.forValue(testJson);

	// Create buffer
	const buffer = type.toBuffer(json);
	// console.log(buffer);

	// Encode buffer to base 64 String
	const base64String = encodeBase64(buffer);
	// console.log(base64String.length);

	return base64String.replace('=', '-');
};

// Decode JSON, based on inferred example JSON
export const decode = (base64String, testJson) => {
	if (!base64String) {
		return undefined;
	}

	// Build type, inferred from testJson
	const type = avro.Type.forValue(testJson);

	// console.log(base64String);
	// Decode base 64 string to array buffer
	const arrayBuffer = decodeBase64(base64String.replace('-', '='));
	// console.log(arrayBuffer);

	// https://github.com/mtth/avsc/issues/59
	const result = type.fromBuffer(new Buffer(arrayBuffer, 'binary'));
	// console.log(result);

	return result;
};

export const buildEncodeDecode = (testJson) => {
	return {
		encode: (json) => encode(json, testJson),
		decode: (json) => decode(json, testJson),
	};
};

// Custom URL Params encoder
// Move this?
export const encodeDecodeUrlParams = {
	encode: (json) =>
		encode(json, {
			selectedDimensions: [['0'], ['0', '1'], ['M']],
			mainDimensionIndex: 0,
		}),
	decode: (json) =>
		decode(json, {
			selectedDimensions: [['0'], ['0', '1'], ['M']],
			mainDimensionIndex: 0,
		}),
};
