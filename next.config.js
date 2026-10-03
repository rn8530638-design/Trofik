/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  // CSS приходит вместе с HTML — без отдельного блокирующего запроса (быстрее первая отрисовка на телефоне).
  experimental: { inlineCss: true },
  // AVIF в 1,5–2 раза легче JPEG при том же качестве; WebP — запасной вариант для старых браузеров.
  images: { formats: ['image/avif', 'image/webp'] },
};

module.exports = nextConfig;
