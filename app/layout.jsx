import localFont from 'next/font/local';
import SiteChrome from '@/components/SiteChrome';
import { siteUrl } from '@/lib/siteUrl';
import './globals.css';

// Шрифты Google (OFL), урезанные под сайт: базовая латиница, русские буквы, тире,
// кавычки, ₽, №, стрелки; без хинтинга, вес 400–700. Один файл на семейство вместо
// пары «латиница + кириллица» — 122 КБ вместо 231 КБ на первой загрузке телефона.
// Символов вне набора (например, é или украинских букв) в шрифтах нет — браузер
// возьмёт их из системного шрифта.
const playfair = localFont({
  src: './fonts/playfair.woff2',
  weight: '400 700',
  variable: '--font-heading',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});

const montserrat = localFont({
  src: './fonts/montserrat.woff2',
  weight: '400 700',
  variable: '--font-body',
  display: 'swap',
});

// Gloria Script does not ship Cyrillic glyphs. This close script alternative (Great Vibes)
// does, so Russian accent headings stay elegant and legible.
const greatVibes = localFont({
  src: './fonts/greatvibes.woff2',
  weight: '400',
  variable: '--font-script',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
  // Не на пути первой отрисовки — не отнимает канал у главного фото на телефоне.
  preload: false,
});

// Цифры (цены, длительность, статистика) набираются отдельным гротеском (Manrope):
// у него ровные табличные знаки, поэтому суммы читаются лучше основного шрифта.
const manrope = localFont({
  src: './fonts/manrope.woff2',
  weight: '400 700',
  variable: '--font-numeric',
  display: 'swap',
  // Не на пути первой отрисовки — не отнимает канал у главного фото на телефоне.
  preload: false,
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
    <html lang="ru" className={`${playfair.variable} ${montserrat.variable} ${greatVibes.variable} ${manrope.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
