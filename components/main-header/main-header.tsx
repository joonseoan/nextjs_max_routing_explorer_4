// We should minimize the number of client components.
// 'use client';

import Link from 'next/link';
// import { usePathname } from 'next/navigation';
import MainHeaderLink from './main-header-link';

export default function MainHeader() {
  // const path = usePathname();

  return (
    <header id="main-header">
      <div id="logo">
        <MainHeaderLink href='/'>
          Next News
        </MainHeaderLink>
        {/* <Link href="/">NextNews</Link> */}
      </div>
      <nav>
        <ul>
          <li>
            <MainHeaderLink href='/news'>
              News
            </MainHeaderLink>
          </li>
          <li>
            <MainHeaderLink href='/archive' >
              Archive
            </MainHeaderLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}