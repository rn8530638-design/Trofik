import { siteUrl } from '@/lib/siteUrl';

// Читается при запросе, чтобы смена SITE_URL на сервере не требовала пересборки.
export const dynamic = 'force-dynamic';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/admin/', '/api/'] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
