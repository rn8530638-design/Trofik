'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { DIKIDI_BOOKING_URL } from '@/lib/dikidi';
import styles from './Header.module.css';

// Section links return to the appropriate point on the homepage; catalog and contacts have dedicated pages.
const NAV = [
  { href: '/#about', label: 'О студии' },
  { href: '/uslugi', label: 'Услуги' },
  { href: '/#reviews', label: 'Отзывы' },
  { href: '/#promotions', label: 'Акции' },
  { href: '/blog', label: 'Блог' },
  { href: '/kontakty', label: 'Контакты' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      setIsScrolled(currentScrollY > 16);

      if (currentScrollY <= 16 || scrollDelta < -8) {
        setIsHeaderVisible(true);
      } else if (scrollDelta > 8 && !isMenuOpen) {
        setIsHeaderVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  // Открытое меню закрывается касанием вне шапки и клавишей Esc.
  const headerRef = useRef(null);
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setIsMenuOpen(false);
    };
    const handleKeyDown = (event) => { if (event.key === 'Escape') setIsMenuOpen(false); };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

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
    <header ref={headerRef} className={`${styles.header} ${isHeaderVisible ? '' : styles.headerHidden} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="ТрофиК — на главную" />
        <nav aria-label="Основное меню">
          <ul id="main-navigation" className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.link}
                  aria-current={!item.href.startsWith('/#') && pathname.startsWith(item.href) ? 'page' : undefined}
                  onClick={(event) => handleSectionNavigation(event, item.href)}
                >
                  <span className={styles.linkFlip}>
                    <span className={styles.linkFace}>{item.label}</span>
                    <span className={styles.linkFaceBack} aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                  <svg className={styles.flourish} viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 8.5C18 3 30 10.5 46 6.5S78 2.5 98 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a href={DIKIDI_BOOKING_URL} className={styles.cta} target="_blank" rel="noopener noreferrer">
          Записаться
          <span className={styles.ctaArrow} aria-hidden="true">→</span>
        </a>
        <button
          className={styles.menuButton}
          type="button"
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => {
            setIsHeaderVisible(true);
            setIsMenuOpen((isOpen) => !isOpen);
          }}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
