'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './Hero.module.css';

const SLIDES = [
  { src: '/images/studio/studio-1.jpg', caption: 'Вход в студию', alt: 'Вход в студию красоты «ТрофиК», украшенный подсолнухами и гирляндами' },
  { src: '/images/studio/studio-2.jpg', caption: 'Ресепшен', alt: 'Ресепшен студии «ТрофиК» с зеркальной стеной' },
  { src: '/images/studio/studio-3.jpg', caption: 'Зона визажа', alt: 'Рабочее место визажиста с зеркалом с лампами на фоне мраморной стены' },
  { src: '/images/studio/studio-4.jpg', caption: 'Рабочее место мастера', alt: 'Гримёрный столик с зеркалом и синим бархатным креслом в студии «ТрофиК»' },
  { src: '/images/studio/studio-5.jpg', caption: 'Кабинет маникюра', alt: 'Маникюрный кабинет студии «ТрофиК»' },
  { src: '/images/studio/studio-6.jpg', caption: 'Кабинет ресниц', alt: 'Кабинет для наращивания ресниц с синей кушеткой' },
  { src: '/images/studio/studio-7.jpg', caption: 'Атмосфера студии', alt: 'Золотые детали интерьера и визитки студии «ТрофиК»' },
];
const INTERVAL = 6000;
const pad = (number) => String(number).padStart(2, '0');

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // cycle перезапускает и таймер, и полоску прогресса при любой смене кадра или снятии паузы.
  const [cycle, setCycle] = useState(0);
  const [mounted, setMounted] = useState(false);

  const go = (index) => {
    setActive((index + SLIDES.length) % SLIDES.length);
    setCycle((value) => value + 1);
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setTimeout(() => go(active + 1), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [paused, cycle, active]);

  return (
    <figure
      className={styles.media}
      style={{ '--slide-ms': `${INTERVAL}ms` }}
      aria-roledescription="carousel"
      aria-label="Фотографии студии"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setCycle((value) => value + 1); }}
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
      <div className={styles.deskControls}>
        <span className={styles.counter} aria-hidden="true"><b>{pad(active + 1)}</b> / {pad(SLIDES.length)}</span>
        <span className={styles.progress} aria-hidden="true">
          <span key={cycle} className={styles.progressFill} style={{ animationPlayState: paused ? 'paused' : 'running' }} />
        </span>
        <button type="button" className={styles.arrow} onClick={() => go(active - 1)} aria-label="Предыдущее фото">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5-7 7 7 7" /></svg>
        </button>
        <button type="button" className={styles.arrow} onClick={() => go(active + 1)} aria-label="Следующее фото">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5 7 7-7 7" /></svg>
        </button>
      </div>
    </figure>
  );
}
