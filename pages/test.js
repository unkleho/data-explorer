import Link from 'next/link';

import Page from '../components/Page';
import { buildDataSets } from '../utils';
import dataSetsRaw from '../data/dataSets';
import dataRaw from '../data/data';

const dataSets = buildDataSets(dataSetsRaw);

console.log(dataRaw);

export default () => (
  <Page>

    <ul>
      {dataSets.map((dataSet,i) => {
        return (
          <li key={`dataSet-${i}`}>
            <Link href={`/data?id=${dataSet.id}`} as={`/data/${dataSet.id}`}>
              <a>{dataSet.title}</a>
            </Link>
          </li>
        )
      })}
    </ul>
  </Page>
)
