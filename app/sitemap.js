import { getBlogPosts } from '@/lib/content';
import { siteUrl } from '@/lib/siteUrl';

// Карта строится на каждый запрос и читает статьи прямо из базы, поэтому новая
// публикация попадает в неё сразу и без пересборки проекта.
export const dynamic = 'force-dynamic';

const PAGES = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/uslugi', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/kontakty', changeFrequency: 'monthly', priority: 0.6 },
];

export default function sitemap() {
  const now = new Date();

  const posts = getBlogPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.created_at ? new Date(post.created_at) : now,
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [
    ...PAGES.map((page) => ({ url: `${siteUrl}${page.path}`, lastModified: now, changeFrequency: page.changeFrequency, priority: page.priority })),
    ...posts,
  ];
}
