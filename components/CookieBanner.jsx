'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const dismissTimer = useRef();

  useEffect(() => {
    if (!window.localStorage.getItem('cookie-consent')) setIsVisible(true);
    return () => window.clearTimeout(dismissTimer.current);
  }, []);

  function acceptCookies(consent) {
    window.localStorage.setItem('cookie-consent', consent);
    setIsLeaving(true);
    dismissTimer.current = window.setTimeout(() => setIsVisible(false), 250);
  }

  if (!isVisible) return null;

  return (
    <aside className={`${styles.banner} ${isLeaving ? styles.isLeaving : ''}`} aria-label="Уведомление об использовании cookie">
      {/* TODO: создать отдельную страницу политики конфиденциальности по ТЗ, раздел 3.7 */}
      <p>Мы используем файлы cookie, чтобы сайт работал корректно и был удобным для вас. <a href="/privacy-policy">Подробнее</a></p>
      <div className={styles.actions}>
        <button className={styles.essential} type="button" onClick={() => acceptCookies('essential')}>Принять обязательные</button>
        <button className={styles.all} type="button" onClick={() => acceptCookies('all')}>Принять все</button>
      </div>
    </aside>
  );
}
