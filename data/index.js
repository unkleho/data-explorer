import absDataSets from './absDataSets';
import oecdDataSets from './oecdDataSets';
import unescoDataSets from './unescoDataSets';

const allData = {
  ABS: {
    name: 'Australian Bureau of Statistics',
    dataSets: absDataSets,
    defaultDataSetId: 'LF',
    apiUrl: 'http://stat.data.abs.gov.au/sdmx-json',
  },
  OECD: {
    name: 'Organisation for Economic Co-operation and Development',
    dataSets: oecdDataSets,
    defaultDataSetId: 'SNA_TABLE1',
    apiUrl: 'http://stats.oecd.org/sdmx-json',
  },
  UNESCO: {
    name: 'United Nations Educational, Scientific and Cultural Organization',
    dataSets: unescoDataSets,
    defaultDataSetId: 'DEMO_DS',
    apiUrl: 'http://data.uis.unesco.org/sdmx-json',
  },
}

export default allData;
