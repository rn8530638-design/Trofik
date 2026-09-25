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
    const pinnedBackground = document.querySelector('.homepage-pinned-background');
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      const holdDuringGallery = (tween) => {
        if (!pinnedBackground) return;
        const pin = tween.scrollTrigger;
        const fadeInLength = 500;
        const fadeOutLength = 650;
        const updateOpacity = (self) => {
          const scroll = self.scroll();
          const fadeIn = Math.min(1, Math.max(0, (scroll - pin.start + fadeInLength) / fadeInLength));
          const fadeOut = Math.min(1, Math.max(0, (pin.end + fadeOutLength - scroll) / fadeOutLength));
          pinnedBackground.style.opacity = String(Math.min(fadeIn, fadeOut));
        };
        ScrollTrigger.create({
          start: () => pin.start - fadeInLength,
          end: () => pin.end + fadeOutLength,
          onUpdate: updateOpacity,
          onRefresh: updateOpacity,
        });
      };

      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        // scrollWidth у переполненного флекса не учитывает правый padding,
        // поэтому последняя карточка доезжала вплотную к краю экрана.
        const getDistance = () => {
          const grid = gridRef.current;
          const lastCard = grid.lastElementChild;
          const endInset = Number.parseFloat(getComputedStyle(grid).paddingRight) || 0;
          return lastCard ? Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth + endInset - grid.clientWidth) : 0;
        };

        const tween = gsap.to(gridRef.current, {
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
          },
        });
        holdDuringGallery(tween);

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
        const tween = gsap.to(gridRef.current, {
          x: () => -getDistance(),
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 116px',
            // Длиннее путь прокрутки на ту же ширину карусели — лента едет
            // заметно спокойнее; scrub сглаживает рывки пальца.
            end: () => `+=${Math.max(window.innerHeight * 1.25, getDistance() * 1.4)}`,
            pin: true,
            pinSpacing: 'margin',
            scrub: 0.6,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextIndex = Math.round(self.progress * (count - 1)) + 1;
              if (counterRef.current && nextIndex !== currentIndexRef.current) {
                currentIndexRef.current = nextIndex;
                counterRef.current.textContent = String(nextIndex).padStart(2, '0');
              }
            },
          },
        });
        holdDuringGallery(tween);

        const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => window.cancelAnimationFrame(refreshId);
      });
    }, rootRef);

    return () => {
      if (pinnedBackground) pinnedBackground.style.opacity = '';
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
