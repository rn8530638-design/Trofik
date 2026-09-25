'use client';

import { Children, cloneElement, useEffect, useRef, useState } from 'react';
import styles from './PriceGroupPicker.module.css';

// Прайс длинный, поэтому направление выбирается списком, а не прокруткой:
// секции приходят готовой серверной разметкой, здесь переключается видимая.
const ALL = 'all';

export default function PriceGroupPicker({ options, children, label = 'Направление' }) {
  // ALL показывает весь прайс сразу, число — одно направление.
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const choose = (index) => {
    setActiveIndex(index);
    setIsOpen(false);
  };

  return (
    <>
      <div className={styles.picker} ref={rootRef}>
        <span className={styles.label}>{label}</span>
        <button
          type="button"
          className={styles.trigger}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>{activeIndex === ALL ? 'Все направления' : options[activeIndex]?.title}</span>
          <span className={styles.caret} aria-hidden="true" />
        </button>

        {isOpen && (
          <ul className={styles.menu} role="listbox" aria-label={label}>
            <li>
              <button
                type="button"
                role="option"
                aria-selected={activeIndex === ALL}
                className={`${styles.option} ${activeIndex === ALL ? styles.optionActive : ''}`}
                onClick={() => choose(ALL)}
              >
                Все направления
              </button>
            </li>
            {options.map((option, index) => (
              <li key={option.slug}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`${styles.option} ${index === activeIndex ? styles.optionActive : ''}`}
                  onClick={() => choose(index)}
                >
                  {option.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {Children.map(children, (child, index) => (
        child && typeof child === 'object'
          ? cloneElement(child, { 'data-active': activeIndex === ALL || index === activeIndex ? 'true' : 'false' })
          : child
      ))}
    </>
  );
}
