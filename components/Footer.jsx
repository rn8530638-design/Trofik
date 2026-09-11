import styles from './Footer.module.css';

function VkIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5c.12 5.08 2.65 8.13 7.08 8.13h.44v-2.91c1.64.16 2.87 1.34 3.37 2.91H17c-.64-2.32-2.3-3.61-3.34-4.1 1.04-.6 2.49-2.07 2.84-4.03h-2.75c-.46 1.59-1.75 3.06-3.28 3.2V7.5H7.72v5.6C6.17 12.55 4.23 10.97 4.14 7.5H3Z" /></svg>; }
function TelegramIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 4-3.1 15.1c-.23 1.06-.84 1.32-1.7.82l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.34-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19L6.02 13.02 1.4 11.58c-1-.31-1.02-1-.17-1.33L19.3 3.3C20.13 3 20.86 3.5 21 4Z" /></svg>; }

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <a className={styles.logo} href="/" aria-label="ТрофиК — на главную">ТрофиК</a>
          <nav aria-label="Меню в подвале">
            <ul className={styles.nav}>
              <li><a href="#about">О студии</a></li><li><a href="/uslugi">Услуги</a></li><li><a href="#reviews">Отзывы</a></li><li><a href="#promotions">Акции</a></li><li><a href="#contacts">Контакты</a></li>
            </ul>
          </nav>
          <div className={styles.socials}>
            <a href="https://vk.ru/studio_trofik" target="_blank" rel="noopener noreferrer" aria-label="ТрофиК во ВКонтакте"><VkIcon /></a>
            <a href="https://t.me/studiokr_trofik" target="_blank" rel="noopener noreferrer" aria-label="ТрофиК в Telegram"><TelegramIcon /></a>
          </div>
        </div>
        <div className={styles.legal}>
          <span>© 2026 Студия красоты «ТрофиК». Все права защищены.</span>
          {/* TODO: создать отдельную страницу политики конфиденциальности по ТЗ, раздел 3.7 */}
          <a href="/privacy-policy">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}
