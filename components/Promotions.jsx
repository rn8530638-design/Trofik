import PromotionsCarousel from './PromotionsCarousel';
import { getPromotions } from '@/lib/content';
import styles from './Promotions.module.css';


export default function Promotions() {
  const promotions = getPromotions()
    .filter((promotion) => promotion.image_path)
    .map((promotion) => ({ title: promotion.title, image: promotion.image_path, alt: promotion.description || promotion.title }));
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
