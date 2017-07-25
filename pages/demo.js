import Link from 'next/link';

import App from '../components/App';
import { buildDataSets } from '../utils';
import dataSetsRaw from '../data';

const dataSets = buildDataSets(dataSetsRaw);

export default () => (
  <App>
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
  </App>
)
