'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ServicesOverview.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {};

export default function ServiceCardsGrid({ children, action }) {
  const rootRef = useRef(null);
  const gridRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const getDistance = () => {
          const rightInset = Number.parseFloat(getComputedStyle(gridRef.current).paddingRight) || 0;
          return Math.max(0, gridRef.current.scrollWidth - rootRef.current.clientWidth + rightInset);
        };

        gsap.to(gridRef.current, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            // Keep the horizontally pinned gallery in the visual centre of the
            // viewport instead of directly beneath the fixed header.
            start: 'center center',
            end: () => `+=${getDistance() + window.innerHeight * 0.45}`,
            pin: true,
            // The stage is a child of a flex column. Margin spacing keeps the
            // following section below the pinned gallery until it finishes.
            pinSpacing: 'margin',
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => window.cancelAnimationFrame(refreshId);
      });

      media.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const title = rootRef.current.parentElement?.querySelector('[data-services-title]');
        const getDistance = () => {
          const rightInset = Number.parseFloat(getComputedStyle(gridRef.current).paddingRight) || 0;
          return Math.max(0, gridRef.current.scrollWidth - rootRef.current.clientWidth + rightInset);
        };
        const showTitle = () => {
          if (title) gsap.to(title, { autoAlpha: 1, y: 0, duration: 0.18, overwrite: 'auto' });
        };
        const hideTitle = () => {
          if (title) gsap.to(title, { autoAlpha: 0, y: -12, duration: 0.18, overwrite: 'auto' });
        };

        // Keep the phone experience identical to the desktop gallery: the
        // section pins while the vertical scroll moves the cards horizontally.
        // The heading remains during this sequence, then leaves with it.
        gsap.to(gridRef.current, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'center center',
            end: () => `+=${getDistance() + window.innerHeight * 0.45}`,
            pin: true,
            pinSpacing: 'margin',
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: showTitle,
            onEnterBack: showTitle,
            onLeaveBack: showTitle,
            onLeave: hideTitle,
          },
        });

        const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => window.cancelAnimationFrame(refreshId);
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={styles.scrollStage}>
      <ul ref={gridRef} className={styles.grid}>
        {children}
      </ul>
      {action}
    </div>
  );
}
