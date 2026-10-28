import WorksGallery from './WorksGallery';
import { getWorks } from '@/lib/content';
import styles from './Works.module.css';

export default function Works() {
  const works = getWorks().map((work) => ({
    id: work.id,
    src: work.image_path,
    caption: work.caption,
    alt: work.alt || work.caption || 'Работа мастера студии красоты «ТрофиК»',
    tile: work.tile,
  }));
  if (!works.length) return null;

  return (
    <section id="works" className={styles.works} aria-labelledby="works-title">
      <div className={styles.container}>
        <span className={styles.marker} aria-hidden="true" />
        <h2 className={styles.title} id="works-title">Наши работы</h2>
        <p className={styles.lead}>Макияж, брови, ресницы и маникюр — фото работ наших мастеров.</p>
        <WorksGallery works={works} />
      </div>
    </section>
  );
}
