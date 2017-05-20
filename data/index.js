import absDataSets from './absDataSets';
import oecdDataSets from './oecdDataSets';
import unescoDataSets from './unescoDataSets';

const allData = {
  ABS: {
    dataSets: absDataSets,
    defaultDataSetId: 'LF',
    apiUrl: 'http://stat.data.abs.gov.au/sdmx-json',
  },
  OECD: {
    dataSets: oecdDataSets,
    defaultDataSetId: 'SNA_TABLE1',
    apiUrl: 'http://stats.oecd.org/sdmx-json',
  },
  UNESCO: {
    dataSets: unescoDataSets,
    defaultDataSetId: 'DEMO_DS',
    apiUrl: 'http://data.uis.unesco.org/sdmx-json',
  },
}

export default allData;
