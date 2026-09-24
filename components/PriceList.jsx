import Image from 'next/image';
import styles from './PriceList.module.css';

function Row({ item }) {
  return (
    <li className={styles.row}>
      <div className={styles.rowText}>
        <p className={styles.rowName}>{item.name}</p>
        {item.description && <p className={styles.rowDescription}>{item.description}</p>}
      </div>
      {item.duration && <p className={styles.rowDuration}>{item.duration}</p>}
      <p className={styles.rowPrice}>{item.price}</p>
    </li>
  );
}

export default function PriceList({ groups, title = 'Прайс-лист', note, id }) {
  if (!groups.length) return null;

  return (
    <section className={styles.price} aria-labelledby={id} id={id ? undefined : 'price'}>
      <div className={styles.head}>
        <span className={styles.marker} aria-hidden="true" />
        <h2 className={styles.title} id={id}>{title}</h2>
        {note && <p className={styles.note}>{note}</p>}
      </div>

      {groups.map((group) => (
        <article className={styles.group} key={group.slug}>
          <header className={styles.groupHead}>
            {group.image && (
              <div className={styles.groupPhoto}>
                <Image src={group.image} alt={`${group.title} в студии ТрофиК`} fill sizes="84px" />
              </div>
            )}
            <h3 className={styles.groupTitle}>{group.title}</h3>
          </header>

          <ul className={styles.rows}>
            {group.main.map((item) => <Row key={item.id} item={item} />)}
          </ul>

          {group.extras.length > 0 && (
            <details className={styles.extras}>
              <summary className={styles.extrasSummary}>Дополнительно <span>({group.extras.length})</span></summary>
              <ul className={styles.rows}>
                {group.extras.map((item) => <Row key={item.id} item={item} />)}
              </ul>
            </details>
          )}
        </article>
      ))}
    </section>
  );
}
