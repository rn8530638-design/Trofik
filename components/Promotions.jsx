import PromotionsCarousel from './PromotionsCarousel';
import styles from './Promotions.module.css';

const promotions = [
  {
    title: '−500 ₽ на первое посещение',
    description: 'Скидка 500 ₽ на первое посещение по промокоду «ЗАБОТА».',
    image: '/images/promo/promo-500.jpg',
    alt: '−500 руб. на первое посещение по промокоду «ЗАБОТА»',
  },
  {
    title: 'Подарок ко дню рождения',
    description: 'За две недели до и две недели после Дня Рождения действует скидка 500 ₽.',
    image: '/images/promo/promo-birthday.jpg',
    alt: 'Подарок ко дню рождения: за две недели до и после Дня Рождения действует скидка 500 руб.',
  },
  {
    title: 'Приведи подругу',
    description: 'Приведите подругу, которой у нас не было, и получите скидку 30% на следующую услугу. Подруга получит скидку 10% на первый визит.',
    image: '/images/promo/promo-friend.jpg',
    alt: 'Приведи подругу, которой у нас не было — получи 30% скидку на следующую услугу, подруга получит 10% на первый визит',
  },
  {
    title: 'Планируйте красоту заранее',
    description: 'Выбирайте готовый комплекс услуг и записывайтесь на них в удобные даты — все услуги комплекса со скидкой 10%.',
    image: '/images/promo/promo-plan.jpg',
    alt: 'Планируйте красоту заранее — экономьте 10% на готовом комплексе услуг',
  },
  {
    title: 'Подарочный сертификат',
    description: 'Сертификат на любую сумму — на праздник или просто без повода.',
    image: '/images/promo/promo-certificate.jpg',
    alt: 'Подарочный сертификат студии «Трофик» на любую сумму',
  },
];

export default function Promotions() {
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
