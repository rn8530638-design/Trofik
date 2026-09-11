import ReviewsCarousel from '@/components/ReviewsCarousel';
import styles from './Reviews.module.css';

const YANDEX_REVIEWS_URL = 'https://yandex.ru/maps/org/trofik/11246302210/reviews/';

// Real reviews from the studio's Yandex Maps listing (5.0, 85 ratings), provided by the client
const REVIEWS = [
  {
    text: 'Очень понравилась быстрая и качественная работа мастера. Сам салон чистый, всегда вежливые и приятные на общение сотрудники!',
    author: 'Анна Кужлева',
    date: '9 сентября',
  },
  {
    text: 'Лучший сервис в городе! Быстрая запись, приветливый персонал, удобное кресло и потрясающий результат. Маникюр выглядит дорого и аккуратно. Мое однозначное место силы. Спасибо!',
    author: 'Аня И.',
    date: '21 мая',
  },
  {
    text: 'Делали образ на выпускной для дочери! Остались в полном восторге! Дочь переживала и волновалась, но мастер по визажу Екатерина настолько приятная и простая в общении, что все переживания сразу пропали, она сразу поняла, что нам нужно и угадала с образом на все 200%. Спасибо огромное, если нужен образ, то только к Екатерине!',
    author: 'Anastasia Kovaleva',
    date: '24 июня 2025',
  },
  {
    text: 'Очень понравилась студия! С первых минут чувствуешь отношение к клиенту! Была на маникюре, мастер Ольга привела в порядок мои ноготки, которые оставляли желать лучшего! Спасибо ей огромное, она профессионал своего дела! Также хочется отметить отличный сервис, предложили кофе с вкусняшками! Все в красивой посуде, все очень эстетично! Желаю вам успехов, приду ещё!',
    author: 'Оксана Бугаева',
    date: '7 июля 2025',
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className={styles.reviews} aria-labelledby="reviews-title">
      <div className={styles.container}>
        <span className={styles.marker} aria-hidden="true" />
        <h2 id="reviews-title" className={styles.title}>
          Что говорят наши клиенты
        </h2>

        <ReviewsCarousel>
          {REVIEWS.map((review) => (
            <figure key={review.author} className={styles.review}>
              <div className={styles.stars} role="img" aria-label="Оценка 5 из 5">
                ★★★★★
              </div>
              <blockquote className={styles.text}>
                <p>{review.text}</p>
              </blockquote>
              <figcaption className={styles.caption}>
                <span className={styles.author}>{review.author}</span>
                <span className={styles.date}>{review.date}</span>
              </figcaption>
            </figure>
          ))}
        </ReviewsCarousel>

        <a className={styles.source} href={YANDEX_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
          <span className={styles.sourceRating}>★ 5.0</span> · 85 оценок на Яндекс.Картах
        </a>
      </div>
    </section>
  );
}
