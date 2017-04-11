import Link from 'next/link';

import Page from '../components/Page';
import { buildDataSets } from '../utils';
import dataSetsRaw from '../data/dataSets';

const dataSets = buildDataSets(dataSetsRaw);

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
