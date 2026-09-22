import ReviewsCarousel from '@/components/ReviewsCarousel';
import ReviewExcerpt from '@/components/ReviewExcerpt';
import { getReviews } from '@/lib/content';
import styles from './Reviews.module.css';

const YANDEX_REVIEWS_URL = 'https://yandex.ru/maps/org/trofik/11246302210/reviews/';

function initialsFor(author) {
  return author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function Reviews() {
  const reviews = getReviews();
  return (
    <section id="reviews" className={styles.reviews} aria-labelledby="reviews-title">
      <div className={styles.container}>
        <div className={styles.panel}>
          <span className={styles.marker} aria-hidden="true" />
          <h2 id="reviews-title" className={styles.title}>
            Что говорят наши клиенты
          </h2>

          <ReviewsCarousel>
            {reviews.map((review) => (
              <figure key={review.id} className={styles.review}>
                <figcaption className={styles.caption}>
                  <span className={styles.avatar} aria-hidden="true">{initialsFor(review.author)}</span>
                  <span className={styles.identity}>
                    <span className={styles.author}>{review.author}</span>
                    <span className={styles.date}>{review.review_date}</span>
                  </span>
                  <span className={styles.stars} role="img" aria-label={`Оценка ${review.rating} из 5`}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </figcaption>
                <ReviewExcerpt text={review.text} />
              </figure>
            ))}
          </ReviewsCarousel>

          <a className={styles.source} href={YANDEX_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
            <span className={styles.sourceRating}>★ 5.0</span> · 85 оценок на Яндекс.Картах
          </a>
        </div>
      </div>
    </section>
  );
}
