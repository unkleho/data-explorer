// @flow

import Link from 'next/link';
import styles from './Header.css';

type Props = {
  children?: Element<any>,
  pathname?: string
}

export default ({ pathname }) => {
  return (
    <header className="header">

      <Link prefetch href='/'>
        <a className={pathname === '/' && 'is-active'}>Home</a>
      </Link>

      <Link prefetch href='/about'>
        <a className={pathname === '/about' && 'is-active'}>About</a>
      </Link>

      <Link prefetch href='/example-page'>
        <a className={pathname === '/example-page' && 'is-active'}>Example Page</a>
      </Link>

      <style jsx>{styles}</style>

    </header>
  )
}
