import CatalogTabs from '@/components/CatalogTabs';
import PriceList from '@/components/PriceList';
import { getPriceGroups } from '@/lib/content';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Услуги и цены',
  description: 'Полный прайс студии «ТрофиК» в Дубне: маникюр, педикюр, брови, ресницы, ламинирование, макияж, причёски, мастер-классы и обучение.',
  alternates: { canonical: '/uslugi' },
};

// Цена хранится строкой («от 2 100 ₽»), а Schema.org ждёт число.
function priceValue(price) {
  const digits = String(price).replace(/[^\d]/g, '');
  return digits ? Number(digits) : null;
}

function offerCatalog(groups) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Услуги и цены студии красоты ТрофиК',
    itemListElement: groups.map((group) => ({
      '@type': 'OfferCatalog',
      name: group.title,
      itemListElement: [...group.main, ...group.extras].map((item) => {
        const value = priceValue(item.price);
        return {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: item.name, ...(item.description ? { description: item.description } : {}) },
          ...(value ? { price: value, priceCurrency: 'RUB' } : {}),
        };
      }),
    })),
  };
}

export default function ServicesPage() {
  const servicePrice = getPriceGroups({ category: 'services' });
  const eventPrice = getPriceGroups({ category: 'events' });

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
          <CatalogTabs
            servicesPrice={<PriceList groups={servicePrice} label="Услуги и цены" />}
            eventsPrice={<PriceList groups={eventPrice} label="Мероприятия и цены" note="Мастер-классы для компаний бронируются заранее через администратора студии." />}
          />
        </div>
      </section>
      {/* Названия редактируются в админке, поэтому «<» экранируется: иначе «</script>» в тексте разорвёт разметку. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalog([...servicePrice, ...eventPrice])).replace(/</g, '\\u003c') }}
      />
    </main>
  );
}
