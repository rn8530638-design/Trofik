import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import priceSource from './priceSource.json';
import dikidiServices from './dikidiServices.json';
import { dikidiServiceUrl } from './dikidi';

// Vercel's deployed filesystem is read-only. `/tmp` is writable there, but it
// is ephemeral, so persistent production data should eventually move to an
// external database. This fallback keeps the public site renderable meanwhile.
const defaultPath = process.env.VERCEL
  ? path.join('/tmp', 'trofik.sqlite')
  : path.join(process.cwd(), 'data', 'trofik.sqlite');
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
    CREATE TABLE IF NOT EXISTS price_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT, group_slug TEXT NOT NULL, name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '', duration TEXT NOT NULL DEFAULT '', price TEXT NOT NULL,
      is_extra INTEGER NOT NULL DEFAULT 0, sort_order INTEGER NOT NULL DEFAULT 0,
      image_path TEXT NOT NULL DEFAULT '', dikidi_link TEXT NOT NULL DEFAULT ''
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
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '', read_time TEXT NOT NULL DEFAULT '',
      image_path TEXT NOT NULL DEFAULT '', is_published INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  migrate(db);
  seed(db);
  return db;
}

// Базы, созданные до появления записи через DIKIDI, догоняют схему без пересоздания.
function migrate(db) {
  const columns = db.prepare('PRAGMA table_info(price_items)').all().map((column) => column.name);
  if (!columns.includes('dikidi_link')) {
    db.exec("ALTER TABLE price_items ADD COLUMN dikidi_link TEXT NOT NULL DEFAULT ''");
    fillDikidiLinks(db);
  }
}

// Ссылка на запись берётся из сверенной карты lib/dikidiServices.json по названию позиции.
// Заполняем только пустые поля, чтобы не перетирать то, что задано в админке.
function fillDikidiLinks(db) {
  const update = db.prepare('UPDATE price_items SET dikidi_link = ? WHERE id = ?');
  const rows = db.prepare("SELECT id, name FROM price_items WHERE dikidi_link = ''").all();
  db.transaction(() => {
    rows.forEach((row) => {
      const serviceId = dikidiServices.services[row.name];
      if (serviceId) update.run(dikidiServiceUrl(serviceId), row.id);
    });
  })();
}

function seed(db) {
  if (db.prepare('SELECT COUNT(*) AS count FROM services').get().count === 0) {
    const insert = db.prepare('INSERT INTO services (slug, name, description, duration, price, category, show_home, sort_order, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const rows = [
      ['manicure', 'Маникюр', 'Аккуратная обработка кутикулы, аппаратная или классическая техника, покрытие гель-лаком с укреплением и стойким результатом на три недели.', '90 мин', 'от 800 ₽', 'services', 1, 2, '/images/catalog-manicure.jpg'],
      ['pedicure', 'Педикюр', 'Полная обработка стоп, удаление мозолей и натоптышей, уход за кожей, аккуратное покрытие гель-лаком на длительный срок.', '120 мин', 'от 1 700 ₽', 'services', 1, 3, '/images/catalog-pedicure.jpg'],
      ['brows', 'Брови', 'Коррекция формы под особенности лица, стойкое окрашивание хной или краской, ламинирование для естественного ухоженного взгляда.', '60 мин', 'от 500 ₽', 'services', 1, 5, '/images/catalog-brows.jpg'],
      ['lashes', 'Ресницы', 'Наращивание классическое или объёмное, деликатное ламинирование, окрашивание — подчеркнём взгляд без ежедневного макияжа.', '90 мин', 'от 2 000 ₽', 'services', 1, 4, '/images/catalog-lashes.jpg'],
      ['makeup', 'Макияж', 'Дневной, вечерний, свадебный или фото-макияж с учётом типа кожи и пожеланий — стойкий результат на весь день.', '60 мин', 'от 3 000 ₽', 'services', 1, 0, '/images/catalog-makeup.jpg'],
      ['hairstyles', 'Прически', 'Укладки на каждый день, вечерние и свадебные прически любой сложности с использованием профессиональной косметики.', '60 мин', 'от 3 500 ₽', 'services', 1, 1, '/images/catalog-hairstyles.jpg'],
      ['lamination', 'Ламинирование', 'Ламинирование бровей и ресниц для естественного объёма и формы без наращивания — эффект держится до месяца.', '60 мин', 'от 1 500 ₽', 'services', 0, 10, '/images/catalog-lamination.jpg'],
      ['kids', 'Детские услуги', 'Маникюр, причёски и укладки для юных клиенток в комфортной атмосфере, бережно и с заботой о ребёнке.', '45 мин', 'от 500 ₽', 'services', 0, 11, '/images/catalog-kids.jpg'],
      ['adults', 'Взрослые услуги', 'Полный комплекс основных процедур для взрослых клиентов — от маникюра до макияжа в одной студии.', '60–120 мин', 'от 700 ₽', 'services', 0, 12, '/images/catalog-adults.jpg'],
      ['makeup-party-large', 'Мастер-класс по макияжу — Девичник/День рождения (5–6 человек)', 'Групповой мастер-класс по макияжу для компании подруг — весело, с профессиональными советами и приятной атмосферой.', '5–6 человек', '19 500 ₽', 'events', 0, 7, '/images/catalog-makeup-party-large.jpg'],
      ['makeup-party-small', 'Мастер-класс по макияжу — Девичник/День рождения (3–4 человека)', 'Компактный формат мастер-класса для небольшой компании — те же профессиональные техники макияжа в уютной обстановке.', '3–4 человека', '14 000 ₽', 'events', 0, 8, '/images/catalog-makeup-party-small.jpg'],
      ['kids-birthday', 'Детский мастер-класс на день рождения (до 12 лет)', 'Праздничный мастер-класс для именинника и друзей до 12 лет — простой грим и весёлые образы для детей.', '5–6 человек, до 12 лет', '14 000 ₽', 'events', 0, 9, '/images/catalog-kids-birthday.jpg'],
      ['training', 'Обучение / Мастер-классы', 'Курсы для начинающих мастеров по маникюру, педикюру, бровям, ресницам и другим направлениям — с сертификатом об окончании.', 'Индивидуально или в группе', 'цена по запросу', 'events', 1, 6, '/images/catalog-training.jpg'],
    ];
    const transaction = db.transaction(() => rows.forEach((row) => insert.run(...row)));
    transaction();
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM price_items').get().count === 0) {
    // Прайс выгружен из DIKIDI (см. lib/priceSource.json). Дальше он редактируется в админке.
    const insert = db.prepare('INSERT INTO price_items (group_slug, name, description, duration, price, is_extra, sort_order, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const transaction = db.transaction(() => {
      priceSource.groups.forEach((group) => {
        let order = 0;
        [...group.items, ...group.extras].forEach((item, index) => {
          const isExtra = index >= group.items.length ? 1 : 0;
          insert.run(group.slug, item.name, item.description || '', item.duration || '', item.price, isExtra, order, item.image || '');
          order += 1;
        });
      });
    });
    transaction();
    fillDikidiLinks(db);
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM reviews').get().count === 0) {
    const insert = db.prepare('INSERT INTO reviews (text, author, review_date, rating, sort_order) VALUES (?, ?, ?, ?, ?)');
    [
      ['Доброе утро. Нашла в городе Дубна место, где можно себя почувствовать принцессой. Шикарный салон, очень приятная атмосфера — вышла из салона будто полностью перезагрузилась. Получила массу удовольствия. Для меня были сделаны макияж и маникюр. Макияж получился достаточно натуральным и держался целый день. Впервые у меня не запачкался шарф и рубашка, значит, очень качественная косметика. Это очень важно, когда у тебя встреча и ты выглядишь шикарно. Маникюр получился нежным, мастер учла все нюансы. У меня кутикула очень тоненькая, и всегда доводили до крови — это первый салон, где такого не произошло. Благодарна за внимание и проведённое удовольствие. Процветания салону.', 'Марина Палик', '30 января', 5, 0],
      ['Добрый вечер, сегодня посетила данный салон. Очень приятная и уютная атмосфера, девушка-администратор великолепная: сразу встретила меня с теплом и уважением, повесила куртку, предложила и помогла надеть её. В салоне вкусно пахнет. Особое внимание уделю мастеру, которая делала мне реснички, — Гюзель. Очень приятная и красивая девушка, с осторожностью подходила к своей работе, не забывая о заботе о клиенте. Само место явно заслуживает 5 звёзд 😍😍😍 Я осталась довольна.', 'Svetlana Pyatashkova', '1 декабря 2025 г.', 5, 1],
      ['Потрясающий салон красоты!!! ❤️ Хочу поделиться своими впечатлениями о посещении этого милого и красивого салона. Атмосфера невероятно уютная и расслабляющая, стильный интерьер. Профессионализм мастеров на высоте. Огромное спасибо Катюше за душевный приём и ценные советы. 🥰 Мастеру Олечке — за замечательный маникюр и педикюр! Я получила именно тот результат, который хотела!!! Спасибо салону «ТрофиК» за возможность снова почувствовать себя счастливой красоткой!!!', 'Надежда С.', '29 июля 2025 г.', 5, 2],
      ['Добрый день, была в данной студии, очень всё понравилось! Давно я не встречала такой хороший сервис. Собирали на юбилей, согласовала за доплату подготовку платья: отпарили, повесили. Делала полный образ на юбилей — макияж и причёску. Собирали 3 часа, каждые 30 минут предлагали чай-кофе, интересовались моими пожеланиями. Макияж и локоны продержались очень достойно, на лице не ощущалось тяжести. Спасибо большое за ваш сервис и работу, приду ещё!', 'Аня Ширяева', '10 июля 2025', 5, 3],
      ['Регулярно хожу туда на маникюр и педикюр, всё очень нравится: и качество работы, и сервис. Вчера делали дочке 12 лет гигиенический маникюр, ей тоже всё понравилось. Особенно приятно, что чай/кофе предлагают в нормальной красивой посуде, а не в одноразовых стаканчиках.', 'Юлия Столярова', '26 ноября 2025 г.', 5, 4],
      ['Однозначно 5 звёзд из 5-ти Екатерине за вечерний образ. Мастер учла все пожелания по причёске, макияжу, использует только натуральную, профессиональную косметику. Очень вежливая, внимательная, аккуратная, компетентная, клиентоориентированная, пунктуальная. В свою очередь я на мероприятии получила много комплиментов благодаря Екатерине. Рекомендую всем девушкам, кто хочет выглядеть безупречно!', 'Катерина Денисова', '25 октября 2025', 5, 5],
      ['Проведение мастер-класса по макияжу 🔥! Подруга пригласила на день рождения в салон «ТрофиК», где для нас был организован мастер-класс. Очень уютная атмосфера, работники салона очень клиентоориентированы, помогли с организацией, мастер шутила, использовали качественную косметику. Мне очень понравилось, хочу ещё раз на такой день рождения. Очень советую провести его в этом салоне.', 'Ирина Боровая', '7 августа', 5, 6],
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
  if (db.prepare('SELECT COUNT(*) AS count FROM blog_posts').get().count === 0) {
    const insert = db.prepare('INSERT INTO blog_posts (slug, title, excerpt, content, category, read_time, image_path, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    [
      ['makiyazh-v-kotorom-vy-ostaetes-soboy', 'Макияж, в котором вы остаетесь собой', 'Как подготовить кожу и сформулировать пожелания, чтобы образ выглядел естественно и уверенно.', 'Красивый образ начинается с ощущения себя. Перед визитом достаточно рассказать мастеру о событии, любимой текстуре и том, какой результат хочется увидеть в зеркале.\n\nМы подберём оттенки и степень покрытия так, чтобы макияж подчеркнул ваши черты и оставался комфортным весь день.', 'Макияж', '4 минуты', '/images/catalog-makeup.jpg', 1, 0],
      ['kak-prodlit-akkuratnost-manikyura', 'Как продлить аккуратность маникюра', 'Несколько простых привычек, которые помогают покрытию оставаться красивым дольше.', 'Бережное отношение к покрытию и регулярный уход за кутикулой помогают маникюру выглядеть свежо между визитами.\n\nИспользуйте перчатки для домашних дел и масло для кутикулы — это небольшая забота с заметным результатом.', 'Маникюр', '3 минуты', '/images/catalog-manicure.jpg', 1, 1],
      ['pricheska-k-sobytiyu-s-chego-nachat', 'Прическа к событию: с чего начать', 'На что обратить внимание при подготовке к образу для праздника или съёмки.', 'Поделитесь с мастером референсами, временем мероприятия и особенностями наряда. Так мы заранее продумываем форму, стойкость и детали образа.\n\nЧистые сухие волосы и немного времени перед визитом — всё, что нужно для красивого старта.', 'Прически', '5 минут', '/images/catalog-hairstyles.jpg', 1, 2],
      ['brovi-i-resnicy-berezhnyy-uhod', 'Брови и ресницы: бережный уход', 'Как сохранить ухоженный и естественный результат между визитами в студию.', 'Мягкое очищение и отсутствие агрессивных средств в первые сутки после процедуры помогают сохранить выразительный результат.\n\nЕсли появятся вопросы по домашнему уходу, мы всегда подскажем комфортный ритуал именно для вас.', 'Уход', '4 минуты', '/images/catalog-brows.jpg', 1, 3],
      ['vremya-dlya-sebya-chast-podgotovki', 'Время для себя — часть подготовки', 'Почему красота начинается не только с результата, но и с атмосферы самого визита.', 'Важное событие становится спокойнее, когда в подготовке есть место для паузы.\n\nВ ТрофиК мы бережно собираем образ и настроение: чтобы вы успели выдохнуть, почувствовать заботу и выйти к своему дню уверенной в себе.', 'Вдохновение', '2 минуты', '/images/catalog-lashes.jpg', 1, 4],
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
  is_extra: Boolean(row.is_extra),
});
