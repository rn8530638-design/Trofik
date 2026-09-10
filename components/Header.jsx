import Link from 'next/link';
import styles from './Header.module.css';

// Sections are not built yet — plain anchors on the homepage for now
const NAV = [
  { href: '#about', label: 'О студии' },
  { href: '#services', label: 'Услуги' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#promo', label: 'Акции' },
  { href: '#contacts', label: 'Контакты' },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Трофик — на главную">
          Трофик
        </Link>

        <nav aria-label="Основное меню">
          <ul className={styles.nav}>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#booking" className={styles.cta}>
          Записаться
        </a>
      </div>
    </header>
  );
}
