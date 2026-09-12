import PromotionsList from './PromotionsList';
import { getPromotions } from '@/lib/content';
import styles from './Promotions.module.css';

export default function Promotions() {
  const promotions = getPromotions().map((promotion) => ({
    ...promotion,
    expiryLabel: 'Срок действия:',
    ariaLabel: `Акция: ${promotion.title}. Нажмите, чтобы узнать подробности и перейти к записи.`,
  }));
  return (
    <section id="promotions" className={styles.promotions} aria-labelledby="promotions-title">
      <div className={styles.container}>
        <span className={styles.marker} aria-hidden="true" />
        <h2 className={styles.title} id="promotions-title">Сейчас в студии</h2>
        <PromotionsList promotions={promotions} />
      </div>
    </section>
  );
}
