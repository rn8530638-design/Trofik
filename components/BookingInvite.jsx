'use client';

import { useEffect, useRef, useState } from 'react';
import { DIKIDI_BOOKING_URL } from '@/lib/dikidi';
import styles from './BookingInvite.module.css';

const DELAY = 10000;
const STORAGE_KEY = 'booking-invite-closed';

export default function BookingInvite() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  // Плашка cookie занимает низ экрана — пока она видна, поднимаем баннер над ней.
  const [isAboveCookies, setIsAboveCookies] = useState(false);
  const leaveTimer = useRef();

  useEffect(() => {
    let closed = false;
    try {
      closed = Boolean(window.sessionStorage.getItem(STORAGE_KEY));
    } catch {
      // Без sessionStorage баннер просто покажется один раз за загрузку страницы.
    }
    if (closed) return undefined;
    const timer = window.setTimeout(() => {
      try {
        setIsAboveCookies(!window.localStorage.getItem('cookie-consent'));
      } catch {
        setIsAboveCookies(true);
      }
      setIsVisible(true);
    }, DELAY);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(leaveTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;
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
    <aside
      className={`${styles.card} ${isAboveCookies ? styles.aboveCookies : ''} ${isLeaving ? styles.isLeaving : ''}`}
      aria-label="Приглашение записаться"
    >
      <button className={styles.close} type="button" onClick={close} aria-label="Закрыть">×</button>
      <p className={styles.title}>Мастера высшего класса</p>
      <a className={styles.cta} href={DIKIDI_BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={close}>
        Записаться
        <span className={styles.arrow} aria-hidden="true">→</span>
      </a>
    </aside>
  );
}
