'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from './CookieBanner';

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return children;
  const usesPremiumTheme = pathname === '/' || pathname.startsWith('/uslugi') || pathname.startsWith('/kontakty') || pathname.startsWith('/blog');
  return (
    <div className={usesPremiumTheme ? `homepage-theme${pathname === '/' ? ' homepage-gradient' : ''}` : undefined}>
      {pathname === '/' && <div className="homepage-pinned-background" aria-hidden="true" />}
      <Header />
      {children}
      <Footer />
      <CookieBanner />
    </div>
  );
}
