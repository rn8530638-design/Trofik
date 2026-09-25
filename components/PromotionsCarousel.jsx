'use client';

import Image from 'next/image';
import { useRef } from 'react';
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

  const choosePromotion = (promotion) => {
    const details = { title: promotion.title, description: promotion.description };
    try {
      window.sessionStorage.setItem('selected-promotion', JSON.stringify(details));
    } catch {
      // The live event also fills the form when storage is blocked.
    }
    window.dispatchEvent(new CustomEvent('promotion-selected', { detail: details }));
    document.getElementById('contacts')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <div className={styles.carousel} aria-roledescription="carousel" aria-label="Акции студии">
      <button type="button" className={`${styles.carouselArrow} ${styles.carouselArrowPrevious}`} onClick={() => move(-1)} aria-label="Предыдущее предложение">
        <Arrow direction="previous" />
      </button>
      <ul ref={trackRef} className={styles.track}>
        {promotions.map((promotion) => (
          <li key={promotion.title} className={`${styles.promoCard} ${promotion.image ? '' : styles.promoCardPlain}`}>
            {promotion.image && (
              <>
                <Image className={styles.cardImage} src={promotion.image} alt="" fill sizes="(max-width: 767px) 84vw, 600px" />
                <div className={styles.cardShade} aria-hidden="true" />
              </>
            )}
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Предложение студии</span>
              <h3>{promotion.title}</h3>
              <p className={styles.cardDiscount}>{promotion.discount}</p>
              <p className={styles.cardDescription}>{promotion.description}</p>
              <button type="button" className={styles.cardButton} onClick={() => choosePromotion(promotion)}>
                Выбрать предложение <span aria-hidden="true">→</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className={`${styles.carouselArrow} ${styles.carouselArrowNext}`} onClick={() => move(1)} aria-label="Следующее предложение">
        <Arrow direction="next" />
      </button>
      <p className={styles.scrollHint}>Листайте, чтобы посмотреть все предложения</p>
    </div>
  );
}
