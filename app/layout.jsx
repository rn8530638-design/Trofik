import { Playfair_Display, Montserrat, Great_Vibes } from 'next/font/google';
import SiteChrome from '@/components/SiteChrome';
import { siteUrl } from '@/lib/siteUrl';
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

// Gloria Script does not ship Cyrillic glyphs. This close script alternative does,
// so Russian accent headings stay elegant and legible.
const script = Great_Vibes({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Студия красоты ТрофиК',
    template: '%s — Студия красоты ТрофиК',
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
