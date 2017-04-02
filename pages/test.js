import Link from 'next/link'

export default () => (
  <ul>
    <li><Link href='/data?id=BIRTHS_SUMMARY' as='/data/BIRTHS_SUMMARY'><a>My first data post</a></Link></li>
    <li><Link href='/data?id=second' as='/data/second'><a>My second data post</a></Link></li>
    <li><Link href='/data?id=last' as='/data/last'><a>My last data post</a></Link></li>
  </ul>
)
