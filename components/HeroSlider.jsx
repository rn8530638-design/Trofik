'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './Hero.module.css';

const SLIDES = [
  { src: '/images/studio/studio-1.jpg', alt: 'Вход в студию красоты «ТрофиК», украшенный подсолнухами и гирляндами' },
  { src: '/images/studio/studio-2.jpg', alt: 'Ресепшен студии «ТрофиК» с зеркальной стеной' },
  { src: '/images/studio/studio-3.jpg', alt: 'Рабочее место визажиста с зеркалом с лампами на фоне мраморной стены' },
  { src: '/images/studio/studio-4.jpg', alt: 'Гримёрный столик с зеркалом и синим бархатным креслом в студии «ТрофиК»' },
  { src: '/images/studio/studio-5.jpg', alt: 'Маникюрный кабинет студии «ТрофиК»' },
  { src: '/images/studio/studio-6.jpg', alt: 'Кабинет для наращивания ресниц с синей кушеткой' },
  { src: '/images/studio/studio-7.jpg', alt: 'Золотые детали интерьера и визитки студии «ТрофиК»' },
];
const INTERVAL = 4500;

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % SLIDES.length), INTERVAL);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <figure
      className={styles.media}
      aria-roledescription="carousel"
      aria-label="Фотографии студии"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
            sizes="(max-width: 767px) 80vw, 460px"
            aria-hidden={index !== active}
            className={`${styles.slide} ${index === active ? styles.slideActive : ''}`}
          />
        ))}
        <div className={styles.slideShade} aria-hidden="true" />
        <div className={styles.dots}>
          {SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={`${styles.dot} ${index === active ? styles.dotActive : ''}`}
              onClick={() => setActive(index)}
              aria-label={`Фото ${index + 1} из ${SLIDES.length}`}
              aria-current={index === active}
            />
          ))}
        </div>
      </div>
    </figure>
  );
}
