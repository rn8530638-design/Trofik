import Image from 'next/image';
import styles from './CatalogCard.module.css';

export default function CatalogCard({ item, type }) {
  const secondaryLabel = type === 'services' ? 'Длительность' : 'Участники';
  const secondaryValue = type === 'services' ? item.duration : item.participants;
  const typeLabel = type === 'services' ? 'услуги' : 'мероприятия';

  function rememberSelectedService() {
    try {
      window.sessionStorage.setItem('selected-service', item.name);
    } catch {
      // The contact form still remains available if storage is unavailable.
    }
  }

  return (
    <article className={`${styles.card} ${type === 'events' ? styles.eventCard : ''}`} tabIndex="0" aria-label={`${item.name}, ${typeLabel}`}>
      <div className={styles.photoWrap}>
        <Image className={styles.photo} src={item.image_path || `/images/catalog-${item.slug}.jpg`} alt={`${item.name} в студии ТрофиК`} fill sizes="(min-width: 1024px) 370px, 100vw" />
      </div>
      <div className={styles.content}>
        <h2 className={styles.name}>{item.name}</h2>
        <p className={styles.price}>{item.price}</p>
        <p className={styles.secondary}><span>{secondaryLabel}</span>{secondaryValue}</p>
        <p className={styles.description}>{item.description}</p>
        <a className={styles.bookingLink} href="/kontakty" onClick={rememberSelectedService}>Записаться</a>
      </div>
    </article>
  );
}
