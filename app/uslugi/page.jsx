import CatalogTabs from '@/components/CatalogTabs';
import { getServices } from '@/lib/content';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Услуги — Студия красоты ТрофиК',
  description: 'Маникюр, педикюр, брови, ресницы, ламинирование, макияж, обучение мастеров в Дубне.',
  alternates: { canonical: '/uslugi' },
};

export default function ServicesPage() {
  const services = getServices({ category: 'services' });
  const events = getServices({ category: 'events' }).map((item) => ({ ...item, participants: item.duration }));

  return (
    <main className={styles.page}>
      <section className={styles.catalog} aria-labelledby="catalog-title">
        <div className={styles.container}>
          <span className={styles.marker} aria-hidden="true" />
          <h1 id="catalog-title" className={styles.title}>Наши услуги</h1>
          <p className={styles.intro}>Мы подберём уход и процедуры под ваши задачи. Все мастера — опытные специалисты, которые любят своё дело.</p>
          <CatalogTabs services={services} events={events} />
        </div>
      </section>
    </main>
  );
}
