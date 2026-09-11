import Image from 'next/image';
import styles from './Hero.module.css';

function HeroStats() {
  return (
    <ul className={styles.stats}>
      {/* Items 1–2: real figures from the studio's Yandex Maps listing */}
      <li className={styles.stat}>
        <span className={styles.statValue}>
          <span className={styles.star} aria-hidden="true">★</span> 5.0
        </span>
        <span className={styles.statLabel}>85 оценок на Яндекс.Картах</span>
      </li>
      <li className={styles.stat}>
        <span className={styles.statValue}>74</span>
        <span className={styles.statLabel}>отзыва клиентов</span>
      </li>
      {/* TODO: confirm with client */}
      <li className={styles.stat}>
        <span className={styles.statValue}>6</span>
        <span className={styles.statLabel}>опытных мастеров</span>
      </li>
      {/* TODO: confirm with client */}
      <li className={styles.stat}>
        <span className={styles.statValue}>1000+</span>
        <span className={styles.statLabel}>довольных клиентов</span>
      </li>
    </ul>
  );
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2" /><path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" /></svg>;
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.brandName}>Трофик</span> — студия красоты, где можно
            просто быть собой
          </h1>
          <p className={styles.subtitle}>
            Создаём красоту. Возвращаем уверенность. Вдохновляем жить.
          </p>
          <div className={styles.actions}>
            <a href="#contacts" className={styles.ctaButton}>
              <span className={styles.ctaIcon}><CalendarIcon /></span>
              <span>Записаться</span>
              <span className={styles.ctaArrow} aria-hidden="true"><span className={styles.arrowGlyph}>→</span></span>
            </a>
            <a href="#services" className={styles.secondaryLink}>
              <span>Наши услуги</span>
              <span className={styles.secondaryArrow} aria-hidden="true"><span className={styles.arrowGlyph}>→</span></span>
            </a>
          </div>
          <HeroStats />
        </div>

        <figure className={styles.media}>
          {/* Marble arch behind the cut-out: shorter than the photo so the head
              rises above it; bottoms aligned so the cropped dress sits on the arch
              base at the bottom edge of the screen. CSS background — a missing
              texture file degrades to a gradient instead of a broken image. */}
          <div className={styles.goldOutline} aria-hidden="true" />
          <div className={styles.marble} aria-hidden="true" />
          <Image
            src="/images/ekaterina-hero.png"
            alt="Екатерина Трофимова, основатель и руководитель студии «Трофик»"
            width={1221}
            height={1400}
            priority
            sizes="(max-width: 767px) 80vw, 640px"
            className={styles.photo}
          />
          <figcaption className={styles.caption}>
            <span className={styles.captionName}>Екатерина Трофимова</span>
            <span className={styles.captionRole}>основатель и руководитель студии «Трофик»</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
