'use client';

import { Children, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ServicesOverview.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {};

export default function ServiceCardsGrid({ children, action, heading }) {
  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const counterRef = useRef(null);
  const currentIndexRef = useRef(1);
  const count = Children.count(children);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      const homepageRoot = document.querySelector('.homepage-gradient');
      const setGradientOffset = (progress, distance) => {
        homepageRoot?.style.setProperty('--homepage-gradient-gsap-offset', `${Math.round(-progress * distance)}px`);
      };

      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const getDistance = () => Math.max(0, gridRef.current.scrollWidth - gridRef.current.clientWidth);

        gsap.to(gridRef.current, {
          x: () => -getDistance(),
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: rootRef.current,
            // Pin the heading with the cards below the fixed site header.
            start: 'top 148px',
            end: () => `+=${getDistance() + window.innerHeight * 0.45}`,
            pin: true,
            // The stage is a child of a flex column. Margin spacing keeps the
            // following section below the pinned gallery until it finishes.
            pinSpacing: 'margin',
            scrub: 0.2,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            // The gallery stays pinned while its cards travel sideways. Move
            // the single page background with that same progress so it keeps
            // evolving instead of appearing frozen behind the gallery.
            onUpdate: (self) => setGradientOffset(self.progress, 720),
          },
        });

        const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => window.cancelAnimationFrame(refreshId);
      });

      media.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const getDistance = () => {
          const grid = gridRef.current;
          const lastCard = grid.lastElementChild;
          const endInset = Number.parseFloat(getComputedStyle(grid).paddingRight) || 0;
          // Measure the final card explicitly: overflowing flex content does
          // not consistently include trailing padding in scrollWidth.
          return lastCard ? Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth + endInset - rootRef.current.clientWidth) : 0;
        };
        gsap.to(gridRef.current, {
          x: () => -getDistance(),
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 116px',
            end: () => `+=${Math.max(window.innerHeight, getDistance() * 0.68)}`,
            pin: true,
            pinSpacing: 'margin',
            scrub: 0.2,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setGradientOffset(self.progress, 360);
              const nextIndex = Math.round(self.progress * (count - 1)) + 1;
              if (counterRef.current && nextIndex !== currentIndexRef.current) {
                currentIndexRef.current = nextIndex;
                counterRef.current.textContent = String(nextIndex).padStart(2, '0');
              }
            },
          },
        });

        const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => window.cancelAnimationFrame(refreshId);
      });
    }, rootRef);

    return () => {
      document.querySelector('.homepage-gradient')?.style.removeProperty('--homepage-gradient-gsap-offset');
      ctx.revert();
    };
  }, [count]);

  return (
    <div ref={rootRef} className={styles.scrollStage}>
      {heading}
      <ul ref={gridRef} className={styles.grid}>
        {children}
      </ul>
      {action}
      <span className={styles.progress} aria-label={`Всего услуг: ${count}`}><span ref={counterRef}>01</span> / {String(count).padStart(2, '0')}</span>
    </div>
  );
}
