import PriceCard from './PriceCard';
import PriceGroupPicker from './PriceGroupPicker';
import styles from './PriceList.module.css';

export default function PriceList({ groups, title, note, label, id }) {
  if (!groups.length) return null;

  return (
    <section className={styles.price} {...(title ? { 'aria-labelledby': id } : { 'aria-label': label })}>
      {(title || note) && (
        <div className={styles.head}>
          {title && <><span className={styles.marker} aria-hidden="true" /><h2 className={styles.title} id={id}>{title}</h2></>}
          {note && <p className={styles.note}>{note}</p>}
        </div>
      )}

      <PriceGroupPicker options={groups.map((group) => ({ slug: group.slug, title: group.title }))}>
      {groups.map((group) => (
        <section className={styles.group} key={group.slug} aria-labelledby={`group-${group.slug}`}>
          <header className={styles.groupHead}>
            <h2 className={styles.groupTitle} id={`group-${group.slug}`}>{group.title}</h2>
          </header>

          <div className={styles.grid}>
            {group.main.map((item) => <PriceCard key={item.id} item={item} />)}
          </div>

          {group.extras.length > 0 && (
            <details className={styles.extras}>
              <summary className={styles.extrasSummary}>Дополнительно <span>({group.extras.length})</span></summary>
              <ul className={styles.extrasList}>
                {group.extras.map((item) => (
                  <li className={styles.extrasRow} key={item.id}>
                    <div className={styles.extrasText}>
                      <p className={styles.extrasName}>{item.name}</p>
                      {item.description && <p className={styles.extrasDescription}>{item.description}</p>}
                    </div>
                    {item.duration && <p className={styles.extrasDuration}>{item.duration}</p>}
                    <p className={styles.extrasPrice}>{item.price}</p>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      ))}
      </PriceGroupPicker>
    </section>
  );
}
