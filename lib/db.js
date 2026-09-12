import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const defaultPath = path.join(process.cwd(), 'data', 'trofik.sqlite');
const databasePath = process.env.DATABASE_PATH || defaultPath;

function createDatabase() {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new Database(databasePath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      description TEXT NOT NULL, duration TEXT NOT NULL DEFAULT '', price TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'services', show_home INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0, image_path TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, author TEXT NOT NULL,
      review_date TEXT NOT NULL DEFAULT '', rating INTEGER NOT NULL DEFAULT 5,
      source_url TEXT NOT NULL DEFAULT '', is_visible INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, discount TEXT NOT NULL,
      description TEXT NOT NULL, expiry TEXT NOT NULL, is_visible INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);
  seed(db);
  return db;
}

function seed(db) {
  if (db.prepare('SELECT COUNT(*) AS count FROM services').get().count === 0) {
    const insert = db.prepare('INSERT INTO services (slug, name, description, duration, price, category, show_home, sort_order, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const rows = [
      ['manicure', 'Маникюр', 'Аккуратная обработка кутикулы, аппаратная или классическая техника, покрытие гель-лаком с укреплением и стойким результатом на три недели.', '90 мин', 'от 2000 ₽', 'services', 1, 0, '/images/catalog-manicure.jpg'],
      ['pedicure', 'Педикюр', 'Полная обработка стоп, удаление мозолей и натоптышей, уход за кожей, аккуратное покрытие гель-лаком на длительный срок.', '120 мин', 'от 2500 ₽', 'services', 1, 1, '/images/catalog-pedicure.jpg'],
      ['brows', 'Брови', 'Коррекция формы под особенности лица, стойкое окрашивание хной или краской, ламинирование для естественного ухоженного взгляда.', '60 мин', 'от 1200 ₽', 'services', 1, 2, '/images/catalog-brows.jpg'],
      ['lashes', 'Ресницы', 'Наращивание классическое или объёмное, деликатное ламинирование, окрашивание — подчеркнём взгляд без ежедневного макияжа.', '90 мин', 'от 1800 ₽', 'services', 1, 3, '/images/catalog-lashes.jpg'],
      ['makeup', 'Макияж', 'Дневной, вечерний, свадебный или фото-макияж с учётом типа кожи и пожеланий — стойкий результат на весь день.', '60 мин', 'от 2200 ₽', 'services', 1, 4, '/images/catalog-makeup.jpg'],
      ['hairstyles', 'Причёски', 'Укладки на каждый день, вечерние и свадебные причёски любой сложности с использованием профессиональной косметики.', '60 мин', 'от 1800 ₽', 'services', 0, 5, '/images/catalog-hairstyles.jpg'],
      ['lamination', 'Ламинирование', 'Ламинирование бровей и ресниц для естественного объёма и формы без наращивания — эффект держится до месяца.', '60 мин', 'от 1500 ₽', 'services', 0, 6, '/images/catalog-lamination.jpg'],
      ['kids', 'Детские услуги', 'Маникюр, причёски и укладки для юных клиенток в комфортной атмосфере, бережно и с заботой о ребёнке.', '45 мин', 'от 1000 ₽', 'services', 0, 7, '/images/catalog-kids.jpg'],
      ['adults', 'Взрослые услуги', 'Полный комплекс основных процедур для взрослых клиентов — от маникюра до макияжа в одной студии.', '60–120 мин', 'от 1200 ₽', 'services', 0, 8, '/images/catalog-adults.jpg'],
      ['makeup-party-large', 'Мастер-класс по макияжу — Девичник/День рождения (5–6 человек)', 'Групповой мастер-класс по макияжу для компании подруг — весело, с профессиональными советами и приятной атмосферой.', '5–6 человек', '19 500 ₽', 'events', 0, 0, '/images/catalog-makeup-party-large.jpg'],
      ['makeup-party-small', 'Мастер-класс по макияжу — Девичник/День рождения (3–4 человека)', 'Компактный формат мастер-класса для небольшой компании — те же профессиональные техники макияжа в уютной обстановке.', '3–4 человека', '14 000 ₽', 'events', 0, 1, '/images/catalog-makeup-party-small.jpg'],
      ['kids-birthday', 'Детский мастер-класс на день рождения (до 12 лет)', 'Праздничный мастер-класс для именинника и друзей до 12 лет — простой грим и весёлые образы для детей.', '5–6 человек, до 12 лет', '14 000 ₽', 'events', 0, 2, '/images/catalog-kids-birthday.jpg'],
      ['training', 'Обучение мастерству', 'Курсы для начинающих мастеров по маникюру, педикюру, бровям, ресницам и другим направлениям — с сертификатом об окончании.', 'Индивидуально или в группе', 'цена по запросу', 'events', 0, 3, '/images/catalog-training.jpg'],
    ];
    const transaction = db.transaction(() => rows.forEach((row) => insert.run(...row)));
    transaction();
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM reviews').get().count === 0) {
    const insert = db.prepare('INSERT INTO reviews (text, author, review_date, rating, sort_order) VALUES (?, ?, ?, ?, ?)');
    [
      ['Очень понравилась быстрая и качественная работа мастера. Сам салон чистый, всегда вежливые и приятные на общение сотрудники!', 'Анна Кужлева', '9 сентября', 5, 0],
      ['Лучший сервис в городе! Быстрая запись, приветливый персонал, удобное кресло и потрясающий результат. Маникюр выглядит дорого и аккуратно. Мое однозначное место силы. Спасибо!', 'Аня И.', '21 мая', 5, 1],
      ['Делали образ на выпускной для дочери! Остались в полном восторге! Дочь переживала и волновалась, но мастер по визажу Екатерина настолько приятная и простая в общении, что все переживания сразу пропали, она сразу поняла, что нам нужно и угадала с образом на все 200%. Спасибо огромное, если нужен образ, то только к Екатерине!', 'Anastasia Kovaleva', '24 июня 2025', 5, 2],
      ['Очень понравилась студия! С первых минут чувствуешь отношение к клиенту! Была на маникюре, мастер Ольга привела в порядок мои ноготки, которые оставляли желать лучшего! Спасибо ей огромное, она профессионал своего дела! Также хочется отметить отличный сервис, предложили кофе с вкусняшками! Все в красивой посуде, все очень эстетично! Желаю вам успехов, приду ещё!', 'Оксана Бугаева', '7 июля 2025', 5, 3],
    ].forEach((row) => insert.run(...row));
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM promotions').get().count === 0) {
    const insert = db.prepare('INSERT INTO promotions (title, discount, description, expiry, sort_order) VALUES (?, ?, ?, ?, ?)');
    [
      ['Скидка на первый визит', '-15%', 'Скидка для новых клиентов на первое посещение студии. Действует на все виды услуг.', 'Бессрочно для новых клиентов', 0],
      ['Комплекс маникюр + педикюр', '-10%', 'При записи на маникюр и педикюр в один день — скидка на общую стоимость услуг.', 'До 31 декабря 2026', 1],
      ['Приведи подругу', '-500 ₽', 'Скидка для вас и вашей подруги при первом визите по рекомендации.', 'Бессрочно', 2],
      ['День рождения в ТрофиК', '-20%', 'Именинникам скидка на любую услугу в течение недели до и после дня рождения.', 'Бессрочно', 3],
    ].forEach((row) => insert.run(...row));
  }
}

const globalForDb = globalThis;
export const db = globalForDb.__trofikDb || createDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.__trofikDb = db;

export const normalizeRow = (row) => row && ({
  ...row,
  show_home: Boolean(row.show_home),
  is_visible: Boolean(row.is_visible),
});
