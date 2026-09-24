import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/content';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Блог',
  description: 'Заметки мастеров студии ТрофиК о красоте, уходе и подготовке к важным событиям.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const [featured, ...rest] = getBlogPosts();
  return (
    <main className={styles.page}>
      <section className={styles.blog} aria-labelledby="blog-title">
        <div className={styles.container}>
          <header className={styles.heading}>
          <span className={styles.marker} aria-hidden="true" />
          <p className={styles.eyebrow}>Блог студии</p>
          <h1 id="blog-title" className={styles.title}>Красота в деталях</h1>
          <p className={styles.lead}>Заметки о заботе о себе, подготовке к важным событиям и вдохновении, которое хочется сохранить.</p>
          </header>
          <div className={styles.articles}>
          {featured ? <article className={styles.featuredCard}>
            <Link className={styles.featuredPhoto} href={`/blog/${featured.slug}`} aria-label={`Открыть статью «${featured.title}»`}>
              <Image src={featured.image_path || '/images/catalog-makeup.jpg'} alt="" fill priority sizes="(max-width: 767px) calc(100vw - 24px), (max-width: 1099px) 45vw, 410px" />
            </Link>
            <div className={styles.featuredContent}>
              <p className={styles.meta}><span>{featured.category}</span>{featured.read_time}</p>
              <h2><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h2>
              <p>{featured.excerpt}</p>
              <Link className={styles.readLink} href={`/blog/${featured.slug}`}>Читать статью</Link>
            </div>
          </article> : <p className={styles.empty}>Скоро здесь появятся первые заметки студии.</p>}
          {rest.length > 0 && <div className={styles.grid}>{rest.map((article) => (
            <article key={article.id} className={styles.card}>
              <Link className={styles.photoWrap} href={`/blog/${article.slug}`} aria-label={`Открыть статью «${article.title}»`}>
                <Image src={article.image_path || '/images/catalog-makeup.jpg'} alt="" fill sizes="(max-width: 767px) calc(100vw - 24px), (max-width: 1099px) 45vw, 410px" />
              </Link>
              <div className={styles.cardContent}>
                <p className={styles.meta}><span>{article.category}</span>{article.read_time}</p>
                <h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2>
                <p>{article.excerpt}</p>
                <Link className={styles.readLink} href={`/blog/${article.slug}`} aria-label={`Читать статью «${article.title}»`}>Читать статью</Link>
              </div>
            </article>
          ))}</div>}
          </div>
        </div>
      </section>
    </main>
  );
}
