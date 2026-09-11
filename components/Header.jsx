'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSectionNavigation = (event, href) => {
    setIsMenuOpen(false);

    if (window.location.pathname !== '/' || !href.startsWith('/#')) return;

    const sectionId = href.slice(2);
    const section = document.getElementById(sectionId);
    if (!section) return;

    event.preventDefault();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', href);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Трофик — на главную">
          Трофик
        </Link>

        <nav aria-label="Основное меню">
          <ul id="main-navigation" className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link} onClick={(event) => handleSectionNavigation(event, item.href)}>
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
        <button
          className={styles.menuButton}
          type="button"
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
