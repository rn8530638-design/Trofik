'use client';

import { useId, useState } from 'react';
import styles from './Reviews.module.css';

export default function ReviewExcerpt({ text }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const textSize = text.length > 600 ? styles.textLong : text.length < 360 ? styles.textShort : styles.textMedium;
  return (
    <blockquote className={styles.text}>
      <p id={id} className={`${expanded ? styles.textExpanded : styles.textCollapsed} ${textSize}`}>{text}</p>
      <button type="button" className={styles.readMore} onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-controls={id}>
        {expanded ? 'Свернуть' : 'Читать полностью'}
      </button>
    </blockquote>
  );
}
