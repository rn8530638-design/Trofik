'use client';

import { useEffect, useRef, useState } from 'react';
import { DIKIDI_BOOKING_URL } from '@/lib/dikidi';
import styles from './BookingInvite.module.css';

const DELAY = 10000;
const STORAGE_KEY = 'booking-invite-closed';

export default function BookingInvite() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const leaveTimer = useRef();

  // Показываем, когда выполнены оба условия: человек провёл на сайте 10 секунд
  // и уже ответил на плашку cookie — чтобы два окна не лезли одновременно.
  useEffect(() => {
    let closed = false;
    let hasConsent = false;
    try {
      closed = Boolean(window.sessionStorage.getItem(STORAGE_KEY));
      hasConsent = Boolean(window.localStorage.getItem('cookie-consent'));
    } catch {
      // Без хранилища баннер просто покажется один раз за загрузку страницы.
    }
    if (closed) return undefined;

    let isTimeUp = false;
    const showIfReady = () => { if (isTimeUp && hasConsent) setIsVisible(true); };
    const handleConsent = () => { hasConsent = true; showIfReady(); };
    const timer = window.setTimeout(() => { isTimeUp = true; showIfReady(); }, DELAY);
    window.addEventListener('cookie-consent-given', handleConsent);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(leaveTimer.current);
      window.removeEventListener('cookie-consent-given', handleConsent);
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
      className={`${styles.card} ${isLeaving ? styles.isLeaving : ''}`}      aria-label="Приглашение записаться"
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
