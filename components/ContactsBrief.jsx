import ContactsBriefForm from './ContactsBriefForm';
import { contactDetails, serviceOptions } from '@/lib/contactData';
import styles from './ContactsBrief.module.css';

const formCopy = {
  nameLabel: 'Имя',
  namePlaceholder: 'Ваше имя',
  phoneLabel: 'Телефон',
  phonePlaceholder: '+7 (___) ___-__-__',
  commentLabel: 'Комментарий',
  commentPlaceholder: 'Расскажите, что вас интересует',
  promotionCommentPrefix: 'Интересует акция',
  serviceLabel: 'Тип услуги',
  servicePlaceholder: 'Выберите услугу',
  services: serviceOptions,
  submit: 'Записаться',
  submitting: 'Отправка...',
  nameError: 'Укажите, пожалуйста, имя.',
  phoneRequiredError: 'Укажите, пожалуйста, телефон.',
  phoneFormatError: 'Введите номер телефона не менее чем из 10 цифр.',
  success: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
  requestError: 'Не удалось отправить заявку. Попробуйте позвонить нам напрямую.',
  heading: 'Оставьте заявку',
};

function MapPinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16.8v2.7a1.8 1.8 0 0 1-2 1.8A17.8 17.8 0 0 1 3 5a1.8 1.8 0 0 1 1.8-2H7.5a1.8 1.8 0 0 1 1.8 1.5l.5 2.7a1.8 1.8 0 0 1-.5 1.7l-1.1 1.1a14.4 14.4 0 0 0 5.8 5.8l1.1-1.1a1.8 1.8 0 0 1 1.7-.5l2.7.5a1.8 1.8 0 0 1 1.5 1.6Z" /></svg>;
}

function ShareIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.6 6.8-4.1M8.6 13.4l6.8 4.1" /></svg>;
}

function ClockIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>;
}

function VkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5c.12 5.08 2.65 8.13 7.08 8.13h.44v-2.91c1.64.16 2.87 1.34 3.37 2.91H17c-.64-2.32-2.3-3.61-3.34-4.1 1.04-.6 2.49-2.07 2.84-4.03h-2.75c-.46 1.59-1.75 3.06-3.28 3.2V7.5H7.72v5.6C6.17 12.55 4.23 10.97 4.14 7.5H3Z" /></svg>;
}

function TelegramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 4-3.1 15.1c-.23 1.06-.84 1.32-1.7.82l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.34-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19L6.02 13.02 1.4 11.58c-1-.31-1.02-1-.17-1.33L19.3 3.3C20.13 3 20.86 3.5 21 4Z" /></svg>;
}

export default function ContactsBrief() {
  return (
    <section id="contacts" className={styles.contacts} aria-labelledby="contacts-title">
      <div className={styles.container}>
        <span className={styles.marker} aria-hidden="true" />
        <h2 id="contacts-title" className={styles.title}>Ждём вас в гости</h2>
        <div className={styles.grid}>
          <div className={styles.info}>
            <div className={styles.item}>
              <span className={styles.infoIcon}><MapPinIcon /></span>
              <div className={styles.itemContent}><h3>Адрес</h3><p>{contactDetails.address}</p></div>
            </div>
            <div className={styles.item}>
              <span className={styles.infoIcon}><PhoneIcon /></span>
              <div className={styles.itemContent}><h3>Телефон</h3><a href={contactDetails.phoneHref}>{contactDetails.phone}</a></div>
            </div>
            <div className={styles.item}>
              <span className={styles.infoIcon}><ShareIcon /></span>
              <div className={styles.itemContent}>
                <h3>Мы в соцсетях</h3>
                <div className={styles.socials}>
                  <a href="https://vk.ru/studio_trofik" target="_blank" rel="noopener noreferrer"><VkIcon />VK</a>
                  <a href="https://t.me/studiokr_trofik" target="_blank" rel="noopener noreferrer"><TelegramIcon />Telegram</a>
                </div>
              </div>
            </div>
            <div className={styles.item}>
              <span className={styles.infoIcon}><ClockIcon /></span>
              <div className={styles.itemContent}><h3>Часы работы</h3><p>{contactDetails.hours.map((hour) => <span key={hour}>{hour}</span>)}</p></div>
            </div>
            <a className={styles.callButton} href={contactDetails.phoneHref}><PhoneIcon />Позвонить</a>
          </div>
          <ContactsBriefForm copy={formCopy} phoneHref={contactDetails.phoneHref} />
        </div>
      </div>
    </section>
  );
}
