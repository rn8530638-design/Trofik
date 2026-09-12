import ReviewsCarousel from '@/components/ReviewsCarousel';
import { getReviews } from '@/lib/content';
import styles from './Reviews.module.css';

const YANDEX_REVIEWS_URL = 'https://yandex.ru/maps/org/trofik/11246302210/reviews/';

export default function Reviews() {
  const reviews = getReviews();
  return (
    <section id="reviews" className={styles.reviews} aria-labelledby="reviews-title">
      <div className={styles.container}>
        <span className={styles.marker} aria-hidden="true" />
        <h2 id="reviews-title" className={styles.title}>
          Что говорят наши клиенты
        </h2>

        <ReviewsCarousel>
          {reviews.map((review) => (
            <figure key={review.id} className={styles.review}>
              <div className={styles.stars} role="img" aria-label={`Оценка ${review.rating} из 5`}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <blockquote className={styles.text}>
                <p>{review.text}</p>
              </blockquote>
              <figcaption className={styles.caption}>
                <span className={styles.author}>{review.author}</span>
                <span className={styles.date}>{review.review_date}</span>
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
