'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './Hero.module.css';

const INTERVAL = 6000;
const pad = (number) => String(number).padStart(2, '0');

export default function HeroSlider({ slides: SLIDES }) {
  const [active, setActive] = useState(0);
  // cycle перезапускает таймер при ручной смене кадра.
  const [cycle, setCycle] = useState(0);
  const [mounted, setMounted] = useState(false);

  const go = (index) => {
    setActive((index + SLIDES.length) % SLIDES.length);
    setCycle((value) => value + 1);
  };

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const setHeight = () => root.style.setProperty('--hero-h', `${window.innerHeight}px`);
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setTimeout(() => go(active + 1), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [cycle, active]);

  return (
    <figure
      className={styles.media}
      style={{ '--slide-ms': `${INTERVAL}ms` }}
      aria-roledescription="carousel"
      aria-label="Фотографии студии"
    >
      <div className={styles.goldFrame} aria-hidden="true" />
      <div className={styles.slides}>
        {SLIDES.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 767px) 80vw, 50vw"
            aria-hidden={index !== active}
            className={`${styles.slide} ${index === active ? styles.slideActive : ''} ${index === active && mounted ? styles.slideZoom : ''}`}
          />
        ))}
        <div className={styles.slideShade} aria-hidden="true" />
        <div className={styles.dots}>
          {SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={`${styles.dot} ${index === active ? styles.dotActive : ''}`}
              onClick={() => go(index)}
              aria-label={`Фото ${index + 1} из ${SLIDES.length}`}
              aria-current={index === active}
            />
          ))}
        </div>
      </div>
      <div className={styles.deskCaption} aria-hidden="true">{SLIDES[active].caption}</div>
      <div className={styles.deskControls} aria-hidden="true">
        <span className={styles.counter}><b>{pad(active + 1)}</b> / {pad(SLIDES.length)}</span>
      </div>
    </figure>
  );
}
