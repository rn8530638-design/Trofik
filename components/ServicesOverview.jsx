import Image from 'next/image';
import Link from 'next/link';
import ServiceCardsGrid from '@/components/ServiceCardsGrid';
import styles from './ServicesOverview.module.css';

// Cards rise in right-to-left: the last card starts first
const STAGGER_MS = 160;

{/* TODO: все цены и время исполнения — плейсхолдеры, требуют подтверждения от клиента перед публикацией */}
// TODO: фото service-*.jpg — плейсхолдеры, заменить на реальные фото работ от клиента
const SERVICES = [
  {
    key: 'manicure',
    name: 'Маникюр',
    description: 'Аккуратная обработка кутикулы, придание формы, покрытие гель-лаком, укрепление, дизайн по желанию.',
    duration: '~90 мин', // TODO: подтвердить у клиента
    price: 'от 2000 ₽', // TODO: подтвердить у клиента
  },
  {
    key: 'pedicure',
    name: 'Педикюр',
    description: 'Обработка стоп, удаление мозолей и натоптышей, покрытие гель-лаком.',
    duration: '~120 мин', // TODO: подтвердить у клиента
    price: 'от 2500 ₽', // TODO: подтвердить у клиента
  },
  {
    key: 'brows',
    name: 'Брови',
    description: 'Коррекция формы, окрашивание, ламинирование.',
    duration: '~60 мин', // TODO: подтвердить у клиента
    price: 'от 1200 ₽', // TODO: подтвердить у клиента
  },
  {
    key: 'lashes',
    name: 'Ресницы',
    description: 'Наращивание, ламинирование, окрашивание.',
    duration: '~90 мин', // TODO: подтвердить у клиента
    price: 'от 1800 ₽', // TODO: подтвердить у клиента
  },
  {
    key: 'makeup',
    name: 'Макияж',
    description: 'Дневной, вечерний, свадебный, фото-макияж.',
    duration: '~60 мин', // TODO: подтвердить у клиента
    price: 'от 2200 ₽', // TODO: подтвердить у клиента
  },
];

export default function ServicesOverview() {
  return (
    <section className={styles.services} aria-labelledby="services-title">
      <div className={styles.container}>
        <span className={styles.marker} aria-hidden="true" />
        <h2 id="services-title" className={styles.title}>
          Что мы делаем
        </h2>

        <ServiceCardsGrid>
          {SERVICES.map((service, index) => (
            <li
              key={service.key}
              className={styles.card}
              style={{ transitionDelay: `${(SERVICES.length - 1 - index) * STAGGER_MS}ms` }}
            >
              <div className={styles.photoWrap}>
                <Image
                  className={styles.photo}
                  src={`/images/service-${service.key}.jpg`}
                  alt={`${service.name} в студии ТрофиК`}
                  fill
                  sizes="(min-width: 1600px) 300px, 19vw"
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

        <Link href="/uslugi" className={styles.allButton}>
          Все услуги
        </Link>
      </div>
    </section>
  );
}
