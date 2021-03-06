import absDataSets from './absDataSets';
import oecdDataSets from './oecdDataSets';
import unescoDataSets from './unescoDataSets';
import ukdsDataSets from './ukdsDataSets';

const baseUrl = process.env.NOW_URL || `http://localhost:${process.env.PORT}`;

const allData = {
	ABS: {
		name: 'Australian Bureau of Statistics',
		dataSets: absDataSets,
		defaultDataSetId: 'LF',
		// apiUrl: 'http://stat.data.abs.gov.au/sdmx-json',
		apiUrl: `${baseUrl}/api/abs`,
	},
	OECD: {
		name: 'Organisation for Economic Co-operation and Development',
		dataSets: oecdDataSets,
		defaultDataSetId: 'SNA_TABLE1',
		// apiUrl: 'http://stats.oecd.org/sdmx-json',
		apiUrl: `${baseUrl}/api/oecd`,
	},
	UKDS: {
		name: 'United Kingdom Data Service',
		dataSets: ukdsDataSets,
		defaultDataSetId: 'TABLE5',
		// apiUrl: 'https://stats.ukdataservice.ac.uk/sdmx-json',
		apiUrl: `${baseUrl}/api/ukds`,
	},
	UNESCO: {
		name: 'United Nations Educational, Scientific and Cultural Organization',
		dataSets: unescoDataSets,
		defaultDataSetId: 'DEMO_DS',
		// apiUrl: 'http://data.uis.unesco.org/sdmx-json',
		apiUrl: `${baseUrl}/api/unesco`,
	},
};

export default allData;
