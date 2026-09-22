import PromotionsCarousel from './PromotionsCarousel';
import { getPromotions } from '@/lib/content';
import { homepageImage } from '@/lib/homepageImage';
import styles from './Promotions.module.css';

export default function Promotions() {
  const promotionImages = [
    '/images/catalog-makeup.jpg',
    '/images/catalog-hairstyles.jpg',
    '/images/catalog-manicure.jpg',
    '/images/catalog-lashes.jpg',
    '/images/catalog-brows.jpg',
  ];
  const promotions = [
    ...getPromotions(),
    {
      title: 'Подарочный сертификат',
      discount: 'для особенного дня',
      description: 'Красивый повод подарить время для себя и заботу о близком человеке.',
      expiry: 'в студии',
    },
  ].slice(0, 5).map((promotion, index) => ({
    ...promotion,
    image: homepageImage(promotionImages[index]),
  }));
  return (
    <section id="promotions" className={styles.promotions} aria-labelledby="promotions-title">
      <div className={styles.container}>
        <span className={styles.marker} aria-hidden="true" />
        <h2 className={styles.title} id="promotions-title">Сейчас в студии</h2>
        <PromotionsCarousel promotions={promotions} />
      </div>
    </section>
  );
}
