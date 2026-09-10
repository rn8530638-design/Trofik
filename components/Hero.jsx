import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Image
            src="/images/logo.png"
            alt="Студия красоты ТрофиК"
            width={60}
            height={60}
            className={styles.logo}
            priority
          />
          <h1 className={styles.title}>ТРОФиК — студия красоты, где можно просто быть собой</h1>
          <p className={styles.subtitle}>
            Создаём красоту. Возвращаем уверенность. Вдохновляем жить.
          </p>
          <a href="#booking" className={styles.ctaButton}>
            Записаться
          </a>
        </div>

        <figure className={styles.media}>
          <div className={styles.photoWrap}>
            {/* Marble arch sits behind the cut-out figure: shorter than the photo so
                the head rises above it, bottom edges aligned so the cropped dress
                lands on the arch base. CSS background — a missing texture file
                degrades to a gradient instead of a broken image. */}
            <div className={styles.goldOutline} aria-hidden="true" />
            <div className={styles.marble} aria-hidden="true" />
            <Image
              src="/images/ekaterina-hero.png"
              alt="Екатерина Трофимова, основатель и руководитель студии «ТрофиК»"
              width={1221}
              height={1400}
              priority
              sizes="(max-width: 767px) 90vw, (max-width: 1023px) 380px, 500px"
              className={styles.photo}
            />
          </div>
          <figcaption className={styles.caption}>
            Екатерина Трофимова, основатель и руководитель студии «ТрофиК»
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
