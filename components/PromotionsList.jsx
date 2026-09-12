'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Promotions.module.css';

const STAGE_DURATION = 350;
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {};

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PromotionsList({ promotions }) {
  const [expanded, setExpanded] = useState(() => promotions.map(() => false));
  const [tearing, setTearing] = useState(() => promotions.map(() => null));
  const listRef = useRef(null);
  const timers = useRef(new Set());
  const activeTickets = useRef(new Set());

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const tickets = gsap.utils.toArray('[data-promotion-ticket]');

        gsap.from(tickets, {
          autoAlpha: 0,
          y: 14,
          duration: 0.45,
          ease: 'power1.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 58%',
            once: true,
          },
        });
      });
    }, listRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => () => {
    timers.current.forEach(window.clearTimeout);
  }, []);

  const setStage = (index, stage) => {
    setTearing((current) => current.map((value, itemIndex) => (
      itemIndex === index ? stage : value
    )));
  };

  const setExpandedAt = (index, value) => {
    if (activeTickets.current.has(index)) return;
    setExpanded((current) => current.map((isExpanded, itemIndex) => (
      itemIndex === index ? value : isExpanded
    )));
  };

  const handleClick = (index) => {
    if (activeTickets.current.has(index)) return;
    if (!expanded[index]) {
      setExpandedAt(index, true);
      return;
    }
    activeTickets.current.add(index);
    setStage(index, 'stub');
  };

  // Start each clock after React commits its corresponding visual stage.
  useEffect(() => {
    const stageTimers = [];
    tearing.forEach((stage, index) => {
      if (stage !== 'stub' && stage !== 'body') return;
      const timer = window.setTimeout(() => {
        timers.current.delete(timer);
        if (stage === 'stub') {
          setStage(index, 'body');
        } else {
          setStage(index, 'done');
          const selectedPromotion = promotions[index];
          const promotionDetails = {
            title: selectedPromotion.title,
            description: selectedPromotion.description,
          };

          window.sessionStorage.setItem('selected-promotion', JSON.stringify(promotionDetails));
          window.dispatchEvent(new CustomEvent('promotion-selected', { detail: promotionDetails }));
          window.location.hash = '#contacts';
          document.getElementById('contacts')?.scrollIntoView({
            behavior: 'smooth', block: 'start',
          });
        }
      }, STAGE_DURATION);
      timers.current.add(timer);
      stageTimers.push(timer);
    });
    return () => stageTimers.forEach((timer) => {
      window.clearTimeout(timer);
      timers.current.delete(timer);
    });
  }, [promotions, tearing]);

  const areAllPromotionsSelected = tearing.length > 0 && tearing.every((stage) => stage === 'done');

  return (
    <div ref={listRef} className={styles.list}>
      {areAllPromotionsSelected ? (
        <p className={styles.emptyState} role="status">Акций пока что больше нет</p>
      ) : promotions.map((promotion, index) => {
        const isExpanded = expanded[index];
        const isTearing = tearing[index];
        const ticketClassName = [
          styles.ticket,
          isExpanded && styles.isExpanded,
          isTearing && styles.isTearing,
          isTearing === 'stub' && styles.isStubStage,
          (isTearing === 'body' || isTearing === 'done') && styles.isBodyFading,
          isTearing === 'done' && styles.isGone,
        ].filter(Boolean).join(' ');
        const ticketSlotClassName = [
          styles.ticketSlot,
          (isTearing === 'body' || isTearing === 'done') && styles.isCollapsing,
        ].filter(Boolean).join(' ');

        return (
          <div key={promotion.title} className={ticketSlotClassName} data-promotion-ticket>
            <button
              className={ticketClassName}
              type="button"
              style={{ '--tear-stage-duration': `${STAGE_DURATION}ms` }}
              aria-disabled={Boolean(isTearing)}
              aria-expanded={isExpanded}
              tabIndex={isTearing ? -1 : undefined}
              aria-label={promotion.ariaLabel}
              onClick={() => handleClick(index)}
            >
              <span className={styles.notchLeft} aria-hidden="true" />
              <span className={styles.notchRight} aria-hidden="true" />
              <span className={styles.ticketContent}>
                <span className={styles.mainBody}>
                  <span className={styles.ticketTitle}>{promotion.title}</span>
                  <span className={styles.details}>
                    <span className={styles.detailsInner}>
                      <strong className={styles.discount}>{promotion.discount}</strong>
                      <span className={styles.description}>{promotion.description}</span>
                      <span className={styles.selectionHint}>Нажмите ещё раз, чтобы выбрать</span>
                    </span>
                  </span>
                </span>
                <span className={[
                  styles.stub,
                  isTearing === 'stub' && styles.isStubDetaching,
                  (isTearing === 'body' || isTearing === 'done') && styles.isStubGone,
                ].filter(Boolean).join(' ')}>
                  <span className={styles.stubLabel}>{promotion.expiryLabel.split(' ')[0]}</span>
                  <span className={styles.expiry}>{promotion.expiry}</span>
                </span>
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
