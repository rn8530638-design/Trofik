'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { DIKIDI_BOOKING_URL } from '@/lib/dikidi';
import styles from './BookingInvite.module.css';

const DELAY = 10000;
const STORAGE_KEY = 'booking-invite-closed';

export default function BookingInvite() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const closeButtonRef = useRef(null);
  const leaveTimer = useRef();

  useEffect(() => {
    let closed = false;
    try {
      closed = Boolean(window.sessionStorage.getItem(STORAGE_KEY));
    } catch {
      // Без sessionStorage баннер просто покажется один раз за загрузку страницы.
    }
    if (closed) return undefined;
    const timer = window.setTimeout(() => setIsVisible(true), DELAY);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(leaveTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  function close() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Отсутствие хранилища не должно мешать закрыть баннер.
    }
    setIsLeaving(true);
    leaveTimer.current = window.setTimeout(() => setIsVisible(false), 250);
  }

  if (!isVisible) return null;

  return (
    <div className={`${styles.overlay} ${isLeaving ? styles.isLeaving : ''}`} onClick={close}>
      <aside
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-invite-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button ref={closeButtonRef} className={styles.close} type="button" onClick={close} aria-label="Закрыть">×</button>
        <p className={styles.eyebrow}>Студия красоты ТрофиК</p>
        <h2 className={styles.title} id="booking-invite-title">Мастера высшего класса</h2>
        <p className={styles.text}>
          Маникюр, брови, ресницы, макияж и причёски — у мастеров с многолетним опытом
          и безупречным рейтингом. Выберите услугу и удобное время прямо сейчас.
        </p>
        <div className={styles.actions}>
          <a className={styles.cta} href={DIKIDI_BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={close}>
            Записаться
            <span className={styles.arrow} aria-hidden="true">→</span>
          </a>
          <Link className={styles.secondary} href="/uslugi" onClick={close}>Посмотреть услуги</Link>
        </div>
      </aside>
    </div>
  );
}
