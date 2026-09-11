import Image from 'next/image';
import Link from 'next/link';
import ServiceCardsGrid from '@/components/ServiceCardsGrid';
import styles from './ServicesOverview.module.css';

// Cards rise in right-to-left: the last card starts first
const STAGGER_MS = 160;

const iconProps = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const ICONS = {
  // Nail polish bottle
  manicure: (
    <svg {...iconProps}>
      <path d="M10 2h4v5h-4z" />
      <path d="M8.5 7h7l1 3v9a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-9z" />
      <path d="M9.5 14h5" />
    </svg>
  ),
  // Footprint
  pedicure: (
    <svg {...iconProps}>
      <path d="M8 21c-2.2 0-3.5-1.8-3.2-4.2.3-2.2 1-4.3 1-6.8C5.8 7.5 7.2 6 9 6s3 1.6 2.8 4.2c-.2 2.8-1 4.6-.6 6.8.4 2.3-.9 4-3.2 4z" />
      <circle cx="13.5" cy="4.5" r="1.2" />
      <circle cx="16.3" cy="6.3" r="1" />
      <circle cx="18.2" cy="8.8" r="0.9" />
      <circle cx="19.2" cy="11.8" r="0.8" />
    </svg>
  ),
  // Brow arch over an eye
  brows: (
    <svg {...iconProps}>
      <path d="M3 9c3-3.5 9-4.5 15-2l3 1.5" />
      <path d="M4 16c2.5-2.6 5.2-3.8 8-3.8s5.5 1.2 8 3.8c-2.5 2.6-5.2 3.8-8 3.8S6.5 18.6 4 16z" />
      <circle cx="12" cy="16" r="1.8" />
    </svg>
  ),
  // Closed eye with lashes
  lashes: (
    <svg {...iconProps}>
      <path d="M3 10c2.6 3.2 5.6 4.8 9 4.8s6.4-1.6 9-4.8" />
      <path d="M12 14.8V19" />
      <path d="M7.5 13.6 6 17.5" />
      <path d="M16.5 13.6 18 17.5" />
      <path d="M4.6 12 2.8 15" />
      <path d="M19.4 12l1.8 3" />
    </svg>
  ),
  // Makeup brush
  makeup: (
    <svg {...iconProps}>
      <path d="M14.5 9.5 20 4" />
      <path d="M13 8l3 3" />
      <path d="M13 8c-2 0-4.5 1.2-6 3.5-1.6 2.5-2 5.6-3 8.5 2.9-1 6-1.4 8.5-3 2.3-1.5 3.5-4 3.5-6z" />
    </svg>
  ),
};

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
                  sizes="(min-width: 1480px) 270px, 18vw"
                />
                <span className={styles.icon}>{ICONS[service.key]}</span>
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
