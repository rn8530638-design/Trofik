'use client';

import { Children, useState } from 'react';
import styles from './Reviews.module.css';

function Chevron({ direction }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

// Only the active index lives here — every review stays in the DOM (server HTML) for SEO.
export default function ReviewsCarousel({ children }) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);

  const go = (step) => setActive((i) => (i + step + count) % count);

  return (
    <div className={styles.carousel}>
      <div className={styles.stage}>
        <button type="button" className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => go(-1)} aria-label="Предыдущий отзыв">
          <Chevron direction="left" />
        </button>

        {/* All slides share one grid cell, so the card is as tall as the longest review — no height jumps */}
        <div className={styles.card}>
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
              aria-hidden={i !== active}
            >
              {slide}
            </div>
          ))}
        </div>

        <button type="button" className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => go(1)} aria-label="Следующий отзыв">
          <Chevron direction="right" />
        </button>
      </div>

      <p className={styles.srOnly} aria-live="polite">
        {`Отзыв ${active + 1} из ${count}`}
      </p>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Показать отзыв ${i + 1} из ${count}`}
            aria-current={i === active ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
