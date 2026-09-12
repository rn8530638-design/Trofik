import Image from 'next/image';
import Link from 'next/link';
import ServiceCardsGrid from '@/components/ServiceCardsGrid';
import { getServices } from '@/lib/content';
import styles from './ServicesOverview.module.css';

const STAGGER_MS = 160;

export default function ServicesOverview() {
  const services = getServices({ homeOnly: true, category: 'services' });
  return (
    <section id="services" className={styles.services} aria-labelledby="services-title">
      <div className={styles.container}>
        <span className={styles.marker} aria-hidden="true" />
        <h2 id="services-title" className={styles.title} data-services-title>
          Что мы делаем
        </h2>

        <ServiceCardsGrid
          action={(
            <Link href="/uslugi" className={styles.allButton}>
              Все услуги
              <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          )}
        >
          {services.map((service, index) => (
            <li
              key={service.id}
              className={styles.card}
              style={{ transitionDelay: `${(services.length - 1 - index) * STAGGER_MS}ms` }}
            >
              <div className={styles.photoWrap}>
                <Image
                  className={styles.photo}
                  src={service.image_path || '/images/service-manicure.jpg'}
                  alt={`${service.name} в студии ТрофиК`}
                  fill
                  sizes="(max-width: 767px) 80vw, (min-width: 1600px) 460px, 30vw"
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{service.name}</h3>
                <p className={styles.description}>{service.description}</p>
                <p className={styles.duration}>{service.duration}</p>
                <p className={styles.price}>{service.price}</p>
              </div>
            </li>
          ))}
        </ServiceCardsGrid>

      </div>
    </section>
  );
}
