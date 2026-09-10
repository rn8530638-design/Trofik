import { Playfair_Display, Montserrat, Parisienne } from 'next/font/google';
import './globals.css';

const heading = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const body = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
});

// Parisienne has no Cyrillic glyphs — use only for Latin accents
const script = Parisienne({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
});

export const metadata = {
  // TODO: заменить на реальный домен
  metadataBase: new URL('https://trofik.ru'),
  title: {
    default: 'Студия красоты ТРОФиК',
    template: '%s — Студия красоты ТРОФиК',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${heading.variable} ${body.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
