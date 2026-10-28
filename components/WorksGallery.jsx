'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './Works.module.css';

const TILE_CLASS = { wide: styles.tileWide, large: styles.tileLarge };
// Обычная плитка — четверть сетки на ПК и половина на телефоне; широкая и крупная — вдвое больше.
// На телефоне вычитаем поля страницы и зазор, иначе браузер берёт кадр на ступень крупнее.
const TILE_SIZES = {
  normal: '(max-width: 767px) calc(50vw - 30px), 320px',
  wide: '(max-width: 767px) calc(100vw - 48px), 640px',
  large: '(max-width: 767px) calc(100vw - 48px), 640px',
};
const SWIPE_DISTANCE = 50;

export default function WorksGallery({ works }) {
  const dialogRef = useRef(null);
  const touchStartRef = useRef(null);
  const [current, setCurrent] = useState(null);
  const work = current === null ? null : works[current];

  const step = (direction) => setCurrent((index) => (index + direction + works.length) % works.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (current === null) {
      if (dialog.open) dialog.close();
      return undefined;
    }
    if (!dialog.open) dialog.showModal();
    // Страница под просмотром не прокручивается.
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, [current]);

  function onKeyDown(event) {
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
  }

  function onTouchEnd(event) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (start === null) return;
    const distance = event.changedTouches[0].clientX - start;
    if (Math.abs(distance) > SWIPE_DISTANCE) step(distance < 0 ? 1 : -1);
  }

  return (
    <>
      <ul className={styles.grid}>
        {works.map((item, index) => (
          <li key={item.id} className={`${styles.tile} ${TILE_CLASS[item.tile] || ''}`}>
            <button type="button" className={styles.tileButton} onClick={() => setCurrent(index)} aria-label={`Открыть фото: ${item.caption || item.alt}`}>
              <Image className={styles.tileImage} src={item.src} alt={item.alt} fill sizes={TILE_SIZES[item.tile] || TILE_SIZES.normal} />
              {item.caption && <span className={styles.caption}>{item.caption}</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label="Просмотр фото"
        onClose={() => setCurrent(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setCurrent(null); }}
        onKeyDown={onKeyDown}
        onTouchStart={(event) => { touchStartRef.current = event.touches[0].clientX; }}
        onTouchEnd={onTouchEnd}
      >
        {work && (
          <>
            <figure className={styles.viewer}>
              <div className={styles.viewerFrame}>
                <Image key={work.src} className={styles.viewerImage} src={work.src} alt={work.alt} fill sizes="100vw" />
              </div>
              <figcaption className={styles.viewerCaption}>
                {work.caption && <span>{work.caption}</span>}
                <span className={styles.counter}>{current + 1} / {works.length}</span>
              </figcaption>
            </figure>
            <button type="button" className={styles.close} onClick={() => setCurrent(null)} aria-label="Закрыть">×</button>
            {works.length > 1 && (
              <>
                <button type="button" className={`${styles.arrow} ${styles.arrowPrevious}`} onClick={() => step(-1)} aria-label="Предыдущее фото">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
                </button>
                <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => step(1)} aria-label="Следующее фото">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
