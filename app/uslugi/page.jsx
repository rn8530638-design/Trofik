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
          <div className={styles.intro}>
            <p>Мы собрали команду опытных мастеров, которым можно доверить свою красоту.</p>
            <p>Для нас важны не только профессионализм и аккуратность, но и то, как вы чувствуете себя у нас. Внимательно слушаем ваши пожелания, бережно относимся к вам и делаем всё, чтобы вы могли расслабиться и довериться результату.</p>
          </div>
          <CatalogTabs services={services} events={events} />
        </div>
      </section>
    </main>
  );
}
