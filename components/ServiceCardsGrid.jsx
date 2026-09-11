'use client';

import { useEffect, useRef } from 'react';
import styles from './ServicesOverview.module.css';

// Only toggles a class for the entrance transition — cards are always in the server HTML.
export default function ServiceCardsGrid({ children }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const cards = gridRef.current?.children;
    if (!cards?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.isVisible);
          observer.unobserve(entry.target); // animate once
        });
      },
      { threshold: 0.2 },
    );

    Array.from(cards).forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={gridRef} className={styles.grid}>
      {children}
    </ul>
  );
}
