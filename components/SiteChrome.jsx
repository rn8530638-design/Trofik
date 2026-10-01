'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from './CookieBanner';
import BookingInvite from './BookingInvite';

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return children;
  // Тёмная тема на всех публичных страницах, включая 404 и будущие.
  return (
    <div className={`homepage-theme ${pathname === '/' ? 'homepage-gradient' : 'inner-gradient'}`}>
      {pathname === '/' && <div className="homepage-pinned-background" aria-hidden="true" />}
      <Header />
      {children}
      <Footer />
      <CookieBanner />
      <BookingInvite />
    </div>
  );
}
