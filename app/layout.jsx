import { Playfair_Display, Montserrat, Great_Vibes } from 'next/font/google';
import SiteChrome from '@/components/SiteChrome';
import './globals.css';

const heading = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const body = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

// Parisienne (from the brief) has no Cyrillic glyphs; Great Vibes is the closest calligraphic face that does
const script = Great_Vibes({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
});

export const metadata = {
  // TODO: заменить на реальный домен
  metadataBase: new URL('https://trofik.ru'),
  title: {
    default: 'Студия красоты Трофик',
    template: '%s — Студия красоты Трофик',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${heading.variable} ${body.variable} ${script.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
