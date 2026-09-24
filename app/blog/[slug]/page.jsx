import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/content';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getBlogPostBySlug(slug);
  if (!article) return { title: 'Статья не найдена' };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const article = getBlogPostBySlug(slug);
  if (!article) notFound();
  const paragraphs = article.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <div className={styles.container}>
          <Link className={styles.backLink} href="/blog">← Все статьи</Link>
          <p className={styles.meta}><span>{article.category}</span>{article.read_time}</p>
          <h1>{article.title}</h1>
          <p className={styles.excerpt}>{article.excerpt}</p>
          <div className={styles.cover}>
            <Image src={article.image_path || '/images/catalog-makeup.jpg'} alt="" fill priority sizes="(max-width: 900px) calc(100vw - 40px), 920px" />
          </div>
          <div className={styles.content}>{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        </div>
      </article>
    </main>
  );
}
