'use client';

import { Children, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SectionTransitions.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {};

export default function SectionTransitions({ children }) {
  const rootRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const panels = gsap.utils.toArray('[data-section-transition]');

        panels.forEach((panel) => {
          gsap.fromTo(panel,
            { yPercent: 16 },
            {
              yPercent: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top bottom',
                end: 'top 56%',
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            });
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={styles.stack}>
      {Children.toArray(children).map((child, index) => (
        <div key={index} className={styles.panel} data-section-transition>
          {child}
        </div>
      ))}
    </div>
  );
}
