const isDev = process.env.NODE_ENV === 'development';

// 'unsafe-inline' для скриптов нужен из-за встроенных скриптов Next (данные RSC): с nonce
// каждую страницу пришлось бы рендерить на каждый запрос. Для стилей — из-за inlineCss.
// Яндекс.Карта на «Контактах» встраивается iframe-ом.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  'frame-src https://yandex.ru https://*.yandex.ru',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  poweredByHeader: false,
  // CSS приходит вместе с HTML — без отдельного блокирующего запроса (быстрее первая отрисовка на телефоне).
  experimental: { inlineCss: true },
  // AVIF в 1,5–2 раза легче JPEG при том же качестве; WebP — запасной вариант для старых браузеров.
  // 60 — для слайдов главного экрана: фото грузится вместе с первой отрисовкой, каждый килобайт на счету.
  images: { formats: ['image/avif', 'image/webp'], qualities: [60, 75] },
  async headers() {
    const privateHeaders = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'Cache-Control', value: 'no-store' }];
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: privateHeaders },
      { source: '/api/admin/:path*', headers: privateHeaders },
    ];
  },
};

module.exports = nextConfig;
