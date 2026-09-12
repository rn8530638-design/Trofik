'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from './CookieBanner';

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return children;
  return <><Header />{children}<Footer /><CookieBanner /></>;
}
