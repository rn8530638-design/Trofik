import Link from 'next/link';
import styles from './Header.module.css';

// Section links return to the appropriate point on the homepage; catalog and contacts have dedicated pages.
const NAV = [
  { href: '/#about', label: 'О студии' },
  { href: '/uslugi', label: 'Услуги' },
  { href: '/#reviews', label: 'Отзывы' },
  { href: '/#promotions', label: 'Акции' },
  { href: '/kontakty', label: 'Контакты' },
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
                <Link href={item.href} className={styles.link}>
                  <span className={styles.linkFlip}>
                    <span className={styles.linkFace}>{item.label}</span>
                    <span className={styles.linkFaceBack} aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a href="/#contacts" className={styles.cta}>
          Записаться
        </a>
      </div>
    </header>
  );
}
