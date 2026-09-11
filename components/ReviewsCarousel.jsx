'use client';

import { Children, useEffect, useRef, useState } from 'react';
import styles from './Reviews.module.css';

const EXIT_DURATION = 560;
const ENTER_DURATION = 620;

function Chevron({ direction }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

// Only the active index lives here — every review stays in the DOM (server HTML) for SEO.
export default function ReviewsCarousel({ children }) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState(null);
  const [entering, setEntering] = useState(false);
  const [direction, setDirection] = useState(1);
  const transitionTimer = useRef(null);
  const isTransitioning = useRef(false);

  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  const goTo = (nextIndex, nextDirection) => {
    if (nextIndex === active || isTransitioning.current) return;
    isTransitioning.current = true;
    setExiting(active);
    setDirection(nextDirection);
    transitionTimer.current = window.setTimeout(() => {
      setExiting(null);
      setActive(nextIndex);
      setEntering(true);
      transitionTimer.current = window.setTimeout(() => {
        setEntering(false);
        isTransitioning.current = false;
      }, ENTER_DURATION);
    }, EXIT_DURATION);
  };

  const go = (step) => goTo((active + step + count) % count, step);

  return (
    <div className={styles.carousel}>
      <div className={styles.stage}>
        <button type="button" className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => go(-1)} aria-label="Предыдущий отзыв">
          <Chevron direction="left" />
        </button>

        {/* All slides share one grid cell, so the review area is as tall as the longest review. */}
        <div className={styles.card}>
          {slides.map((slide, i) => (
            <div
              key={i}
              className={[
                styles.slide,
                i === active && styles.slideActive,
                i === active && entering && (direction > 0 ? styles.slideEnterForward : styles.slideEnterBackward),
                i === exiting && styles.slideExiting,
                i === exiting && (direction > 0 ? styles.slideExitForward : styles.slideExitBackward),
              ].filter(Boolean).join(' ')}
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
            onClick={() => goTo(i, i > active ? 1 : -1)}
            aria-label={`Показать отзыв ${i + 1} из ${count}`}
            aria-current={i === active ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
