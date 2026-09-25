import Image from 'next/image';
import { bookingUrlFor } from '@/lib/dikidi';
import styles from './PriceCard.module.css';

export default function PriceCard({ item, priority = false }) {
  return (
    <article className={styles.card}>
      <div className={`${styles.photoWrap} ${item.image_path ? '' : styles.photoEmpty}`}>
        {item.image_path
          ? <Image className={styles.photo} src={item.image_path} alt={`${item.name} в студии ТрофиК`} fill sizes="(min-width: 1024px) 330px, 100vw" priority={priority} />
          : <span className={styles.monogram} aria-hidden="true">Т</span>}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{item.name}</h3>
        {item.description && <p className={styles.description}>{item.description}</p>}
        <div className={styles.meta}>
          <p className={styles.price}>{item.price}</p>
          {item.duration && <p className={styles.duration}>{item.duration}</p>}
        </div>
        <a
          className={styles.bookingLink}
          href={bookingUrlFor(item)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Записаться
        </a>
      </div>
    </article>
  );
}
