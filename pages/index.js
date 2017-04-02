import Link from 'next/link'

export default () => (
  <ul>
    <li><Link href='/data?id=BIRTHS_SUMMARY'
      // as='/data/BIRTHS_SUMMARY'
    ><a>My first data post</a></Link></li>
    <li><Link href='/test' as='/test'><a>My second data post</a></Link></li>
  </ul>
)
