import PromotionsList from './PromotionsList';
import styles from './Promotions.module.css';

// TODO: все акции — временный плейсхолдер-контент. Реальные названия, размеры скидок, описания и сроки действия должна прислать Екатерина (см. ТЗ, блок "Акции"). Не публиковать эти плейсхолдеры на боевом сайте без подтверждения от клиента.
const promotionsData = [
  {
    title: 'Скидка на первый визит',
    discount: '-15%',
    description: 'Скидка для новых клиентов на первое посещение студии. Действует на все виды услуг.',
    expiry: 'Бессрочно для новых клиентов',
    expiryLabel: 'Срок действия:',
    ariaLabel: 'Акция: Скидка на первый визит. Нажмите, чтобы узнать подробности и перейти к записи.',
  },
  {
    title: 'Комплекс маникюр + педикюр',
    discount: '-10%',
    description: 'При записи на маникюр и педикюр в один день — скидка на общую стоимость услуг.',
    expiry: 'До 31 декабря 2026',
    expiryLabel: 'Срок действия:',
    ariaLabel: 'Акция: Комплекс маникюр + педикюр. Нажмите, чтобы узнать подробности и перейти к записи.',
  },
  {
    title: 'Приведи подругу',
    discount: '-500 ₽',
    description: 'Скидка для вас и вашей подруги при первом визите по рекомендации.',
    expiry: 'Бессрочно',
    expiryLabel: 'Срок действия:',
    ariaLabel: 'Акция: Приведи подругу. Нажмите, чтобы узнать подробности и перейти к записи.',
  },
  {
    title: 'День рождения в ТрофиК',
    discount: '-20%',
    description: 'Именинникам скидка на любую услугу в течение недели до и после дня рождения.',
    expiry: 'Бессрочно',
    expiryLabel: 'Срок действия:',
    ariaLabel: 'Акция: День рождения в ТрофиК. Нажмите, чтобы узнать подробности и перейти к записи.',
  },
];

export default function Promotions() {
  return (
    <section id="promotions" className={styles.promotions} aria-labelledby="promotions-title">
      <div className={styles.container}>
        <span className={styles.marker} aria-hidden="true" />
        <h2 className={styles.title} id="promotions-title">Сейчас в студии</h2>
        <PromotionsList promotions={promotionsData} />
      </div>
    </section>
  );
}
