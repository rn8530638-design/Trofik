import Link from 'next/link';
import { DIKIDI_BOOKING_URL } from '@/lib/dikidi';
import styles from './not-found.module.css';

// Лампочки по периметру зеркала, как у визажного стола в студии: по арке и по бокам.
// Арка — полукруг радиусом в половину ширины, высота зеркала 4/3 ширины.
const BULBS = [
  ...[180, 150, 120, 90, 60, 30, 0].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return { left: `${50 + 50 * Math.cos(rad)}%`, top: `${((1 - Math.sin(rad)) * 0.5 * 100) / (4 / 3)}%` };
  }),
  ...[56, 75, 94].flatMap((y) => [{ left: '0', top: `${y}%` }, { left: '100%', top: `${y}%` }]),
];

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.mirror} aria-hidden="true">
          {BULBS.map((bulb, index) => (
            <span key={index} className={styles.bulb} style={{ ...bulb, '--delay': `${(index * 0.37) % 2.4}s` }} />
          ))}
          <div className={styles.glass}>
            <span className={styles.code}>404</span>
          </div>
        </div>

        <div className={styles.text}>
          <p className={styles.eyebrow}>Ошибка 404</p>
          <h1 className={styles.title}>Свет мой, зеркальце, скажи…</h1>
          <p className={styles.lead}>…где эта страница? Зеркало молчит.</p>
          <p className={styles.lead}>Зато точно знает, где вас сделают ещё красивее.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={DIKIDI_BOOKING_URL} target="_blank" rel="noopener noreferrer">
              Записаться <span aria-hidden="true">→</span>
            </a>
            <Link className={styles.secondary} href="/">На главную</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
