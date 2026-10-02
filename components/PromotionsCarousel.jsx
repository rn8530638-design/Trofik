'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { DIKIDI_BOOKING_URL } from '@/lib/dikidi';
import styles from './Promotions.module.css';

function Arrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === 'previous' ? 'm14.5 5-7 7 7 7' : 'm9.5 5 7 7-7 7'} />
    </svg>
  );
}

export default function PromotionsCarousel({ promotions }) {
  const trackRef = useRef(null);

  if (!promotions.length) return <p className={styles.emptyState}>Скоро здесь появятся новые предложения.</p>;

  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(`.${styles.promoCard}`);
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    track.scrollBy({ left: direction * distance, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return (
    <div className={styles.carousel} aria-roledescription="carousel" aria-label="Акции студии">
      <button type="button" className={`${styles.carouselArrow} ${styles.carouselArrowPrevious}`} onClick={() => move(-1)} aria-label="Предыдущее предложение">
        <Arrow direction="previous" />
      </button>
      <ul ref={trackRef} className={styles.track}>
        {promotions.map((promotion) => (
          <li key={promotion.title} className={styles.promoCard}>
            <a className={styles.posterButton} href={DIKIDI_BOOKING_URL} target="_blank" rel="noopener noreferrer" aria-label={`${promotion.title} — записаться онлайн`}>
              <Image className={styles.cardImage} src={promotion.image} alt={promotion.alt} fill quality={90} sizes="(max-width: 767px) 84vw, 440px" />
              <span className={styles.cardShade} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <button type="button" className={`${styles.carouselArrow} ${styles.carouselArrowNext}`} onClick={() => move(1)} aria-label="Следующее предложение">
        <Arrow direction="next" />
      </button>
      <p className={styles.note}>Скидки не суммируются</p>
      <p className={styles.hint}>Нажмите на акцию, чтобы записаться, и укажите её в комментарии к записи</p>
    </div>
  );
}
