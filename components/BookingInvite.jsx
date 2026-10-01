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
  // Высота плашки зависит от ширины экрана (на телефоне она в несколько строк), поэтому меряем её.
  const [cookieOffset, setCookieOffset] = useState(0);
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
      const cookieBanner = document.querySelector('aside[aria-label="Уведомление об использовании cookie"]');
      if (cookieBanner) setCookieOffset(window.innerHeight - cookieBanner.getBoundingClientRect().top);
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
      className={`${styles.card} ${isLeaving ? styles.isLeaving : ''}`}
      style={cookieOffset ? { '--cookie-offset': `${cookieOffset}px` } : undefined}
      aria-label="Приглашение записаться"
    >
      <button className={styles.close} type="button" onClick={close} aria-label="Закрыть">×</button>
      <p className={styles.eyebrow}>Онлайн-запись</p>
      <p className={styles.title}>Мастера <em>высшего класса</em></p>
      <p className={styles.text}>Выберите услугу и удобное время — это займёт пару минут.</p>
      <a className={styles.cta} href={DIKIDI_BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={close}>
        Записаться
        <span className={styles.arrow} aria-hidden="true">→</span>
      </a>
    </aside>
  );
}
