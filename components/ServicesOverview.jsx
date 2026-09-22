import Image from 'next/image';
import Link from 'next/link';
import ServiceCardsGrid from '@/components/ServiceCardsGrid';
import { getServices } from '@/lib/content';
import { homepageImage } from '@/lib/homepageImage';
import styles from './ServicesOverview.module.css';

const SERVICE_ORDER = [
  { slug: 'makeup', label: 'Макияж' },
  { slug: 'hairstyles', label: 'Прически' },
  { slug: 'manicure', label: 'Маникюр' },
  { slug: 'pedicure', label: 'Педикюр' },
  { slug: 'lashes', label: 'Ресницы' },
  { slug: 'brows', label: 'Брови' },
  { slug: 'training', label: 'Обучение / Мастер-классы' },
];

export default function ServicesOverview() {
  const servicesBySlug = new Map(getServices().map((service) => [service.slug, service]));
  const services = SERVICE_ORDER
    .map(({ slug, label }) => {
      const service = servicesBySlug.get(slug);
      return service ? { ...service, label, cover: homepageImage(service.image_path) } : null;
    })
    .filter(Boolean);

  return (
    <section id="services" className={styles.services} aria-labelledby="services-title">
      <div className={styles.container}>
        <span className={styles.marker} aria-hidden="true" />
        <ServiceCardsGrid
          heading={(
            <h2 id="services-title" className={styles.title} data-services-title>
              Что мы делаем
            </h2>
          )}
          action={(
            <Link href="/uslugi" className={styles.allButton}>
              Все услуги
              <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          )}
        >
          {services.map((service) => (
            <li key={service.id} className={styles.card}>
              <div className={styles.photoWrap}>
                {service.slug === 'training' ? (
                  <div className={styles.trainingPlaceholder} aria-hidden="true">
                    <span className={styles.trainingMonogram}>Т</span>
                    <span className={styles.trainingCaption}>Академия красоты</span>
                  </div>
                ) : service.cover && <Image
                  className={styles.photo}
                  src={service.cover}
                  alt={`${service.name} в студии ТрофиК`}
                  fill
                  sizes="(max-width: 767px) 80vw, (min-width: 1600px) 460px, 30vw"
                />}
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{service.label}</h3>
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
