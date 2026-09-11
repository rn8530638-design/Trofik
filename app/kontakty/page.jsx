import ContactsPageForm from '@/components/ContactsPageForm';
import { contactDetails } from '@/lib/contactData';
import styles from './page.module.css';

function MapPinIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>; }
function BuildingIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M2 21h20M8 7h4M8 11h4M8 15h4M18 8v13" /></svg>; }
function DocumentIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5M10 12h5M10 16h5" /></svg>; }
function PhoneIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16.8v2.7a1.8 1.8 0 0 1-2 1.8A17.8 17.8 0 0 1 3 5a1.8 1.8 0 0 1 1.8-2H7.5a1.8 1.8 0 0 1 1.8 1.5l.5 2.7a1.8 1.8 0 0 1-.5 1.7l-1.1 1.1a14.4 14.4 0 0 0 5.8 5.8l1.1-1.1a1.8 1.8 0 0 1 1.7-.5l2.7.5a1.8 1.8 0 0 1 1.5 1.6Z" /></svg>; }
function ShareIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.6 6.8-4.1M8.6 13.4l6.8 4.1" /></svg>; }
function ClockIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>; }
function VkIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5c.12 5.08 2.65 8.13 7.08 8.13h.44v-2.91c1.64.16 2.87 1.34 3.37 2.91H17c-.64-2.32-2.3-3.61-3.34-4.1 1.04-.6 2.49-2.07 2.84-4.03h-2.75c-.46 1.59-1.75 3.06-3.28 3.2V7.5H7.72v5.6C6.17 12.55 4.23 10.97 4.14 7.5H3Z" /></svg>; }
function TelegramIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 4-3.1 15.1c-.23 1.06-.84 1.32-1.7.82l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.34-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19L6.02 13.02 1.4 11.58c-1-.31-1.02-1-.17-1.33L19.3 3.3C20.13 3 20.86 3.5 21 4Z" /></svg>; }

export const metadata = {
  title: 'Контакты — Студия красоты ТрофиК',
  description: 'Контакты студии красоты ТрофиК: Дубна, Дачная улица, 1 стр. 2. Маникюр, педикюр, брови, ресницы, макияж и запись.',
  alternates: { canonical: '/kontakty' },
};

export default function ContactsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.contacts} aria-labelledby="contacts-title">
        <div className={styles.container}>
          <span className={styles.marker} aria-hidden="true" />
          <h1 id="contacts-title" className={styles.title}>Контакты</h1>

          <div className={styles.formWrap}>
            <ContactsPageForm phoneHref={contactDetails.phoneHref} />
          </div>

          <div className={styles.mapWrap}>
            <iframe title="Студия красоты ТрофиК на Яндекс.Картах" src="https://yandex.ru/map-widget/v1/?ll=37.178781%2C56.742877&z=17&pt=37.178781,56.742877,pm2rdm" width="100%" height="420" frameBorder="0" />
          </div>
          <a className={styles.mapLink} href="https://yandex.ru/maps/org/trofik/11246302210/" target="_blank" rel="noopener noreferrer">Открыть на Яндекс.Картах <span aria-hidden="true">→</span></a>

          <div className={styles.zones}>
            <section className={styles.companyCard} aria-labelledby="company-title">
              <p id="company-title" className={styles.zoneLabel}>О компании</p>
              <div className={styles.detail}><span className={styles.icon}><MapPinIcon /></span><div><h2>Адрес студии</h2><p>{contactDetails.address}</p></div></div>
              {/* TODO: уточнить у клиента, отличается ли юридический адрес ИП от физического адреса студии — сейчас используется один и тот же адрес для обоих */}
              <div className={styles.detail}><span className={styles.icon}><BuildingIcon /></span><div><h2>Юридический адрес</h2><p>{contactDetails.address} <small>(совпадает с адресом студии)</small></p></div></div>
              <div className={styles.detail}><span className={styles.icon}><DocumentIcon /></span><div><h2>ОГРНИП</h2><p>324690000056447</p></div></div>
              <div className={styles.detail}><span className={styles.icon}><DocumentIcon /></span><div><h2>ИНН</h2><p>691008521875</p></div></div>
              <div className={styles.detail}><span className={styles.icon}><BuildingIcon /></span><div><h2>Индивидуальный предприниматель</h2><p>Трофимова Екатерина Андреевна</p></div></div>
              <div className={styles.detail}><span className={styles.icon}><PhoneIcon /></span><div><h2>Телефон</h2><a href={contactDetails.phoneHref}>{contactDetails.phone}</a></div></div>
              <div className={styles.detail}><span className={styles.icon}><ShareIcon /></span><div><h2>Соцсети</h2><div className={styles.socials}><a href="https://vk.ru/studio_trofik" target="_blank" rel="noopener noreferrer"><VkIcon />VK</a><a href="https://t.me/studiokr_trofik" target="_blank" rel="noopener noreferrer"><TelegramIcon />Telegram</a></div></div></div>
              <div className={styles.detail}><span className={styles.icon}><ClockIcon /></span><div><h2>Часы работы</h2><p>{contactDetails.hours.map((hour) => <span key={hour}>{hour}</span>)}</p></div></div>
              <a className={styles.callButton} href={contactDetails.phoneHref}><PhoneIcon />Позвонить</a>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
