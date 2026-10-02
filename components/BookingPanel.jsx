import { DIKIDI_BOOKING_URL } from '@/lib/dikidi';
import { contactDetails } from '@/lib/contactData';
import styles from './BookingPanel.module.css';

const steps = [
  { title: 'Выберите услугу', text: 'Маникюр, педикюр, брови, ресницы и другие' },
  { title: 'Выберите мастера и время', text: 'Видно только свободные окошки' },
  { title: 'Подтвердите по SMS', text: 'Номер телефона вводится один раз' },
];

export default function BookingPanel() {
  return (
    <div className={styles.panel}>
      <p className={styles.eyebrow}>Онлайн-запись</p>
      <h3 className={styles.heading}>Запишитесь за пару минут</h3>
      <ol className={styles.steps}>
        {steps.map((step) => (
          <li key={step.title}>
            <span className={styles.stepTitle}>{step.title}</span>
            <span className={styles.stepText}>{step.text}</span>
          </li>
        ))}
      </ol>
      <a className={styles.cta} href={DIKIDI_BOOKING_URL} target="_blank" rel="noopener noreferrer">
        Записаться онлайн
        <span aria-hidden="true">→</span>
      </a>
      <p className={styles.note}>Откроется страница записи в сервисе DIKIDI. Если у вас есть акция — укажите её в комментарии к записи.</p>
      <div className={styles.or}><span>или</span></div>
      <a className={styles.phone} href={contactDetails.phoneHref}>{contactDetails.phone}</a>
      <p className={styles.hours}>{contactDetails.hours.join(' · ')}</p>
    </div>
  );
}
