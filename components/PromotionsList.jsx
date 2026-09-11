'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Promotions.module.css';

const STAGE_DURATION = 350;

export default function PromotionsList({ promotions }) {
  const [expanded, setExpanded] = useState(() => promotions.map(() => false));
  const [tearing, setTearing] = useState(() => promotions.map(() => null));
  const timers = useRef(new Set());
  const activeTickets = useRef(new Set());

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

  return (
    <div className={styles.list}>
      {promotions.map((promotion, index) => {
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
          <div key={promotion.title} className={ticketSlotClassName}>
            <button
              className={ticketClassName}
              type="button"
              style={{ '--tear-stage-duration': `${STAGE_DURATION}ms` }}
              aria-disabled={Boolean(isTearing)}
              tabIndex={isTearing ? -1 : undefined}
              aria-label={promotion.ariaLabel}
              onMouseEnter={() => setExpandedAt(index, true)}
              onMouseLeave={() => setExpandedAt(index, false)}
              onFocus={() => setExpandedAt(index, true)}
              onBlur={() => setExpandedAt(index, false)}
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
