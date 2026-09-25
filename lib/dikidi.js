// Онлайн-запись ведётся в DIKIDI (кабинет Екатерины). Ссылка с параметром s=<id услуги>
// открывает виджет сразу на шаге «Дата и время» с выбранной услугой, минуя выбор из
// каталога. Формат параметров подтверждён в их виджете (newrecord2.js, функция make_url):
// p — путь шагов, o — раздел, s — id услуг через точку, m — мастер, d — дата-время.
export const DIKIDI_COMPANY_ID = '1846979';

// Виджет открывается на выборе услуги — для кнопок, где услуга ещё не выбрана.
export const DIKIDI_BOOKING_URL = `https://dikidi.app/${DIKIDI_COMPANY_ID}?p=2.pi-po-ssm&o=7`;

const serviceUrl = (serviceId) => `https://dikidi.app/${DIKIDI_COMPANY_ID}?p=3.pi-po-ssm-sd&o=7&s=${serviceId}`;

export function dikidiServiceUrl(serviceId) {
  return serviceUrl(serviceId);
}

// Ссылка для кнопки «Записаться» у позиции прайса: своя, если задана в админке,
// иначе общий виджет — клиент выберет услугу сам.
export function bookingUrlFor(item) {
  return item?.dikidi_link || DIKIDI_BOOKING_URL;
}

// В админку можно вставить либо готовую ссылку из DIKIDI, либо просто id услуги.
// Из ссылки, скопированной посреди записи, достаём id и собираем канонический адрес,
// чтобы не тащить в базу чужие шаги, дату и мастера.
export function normalizeDikidiLink(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (/^\d+$/.test(raw)) return serviceUrl(raw);

  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('Вставьте ссылку из DIKIDI или id услуги (только цифры).');
  }
  if (!/(^|\.)(dikidi\.(app|net|ru)|dkd\.su)$/.test(url.hostname)) {
    throw new Error('Ссылка должна вести на DIKIDI (dikidi.app или dkd.su).');
  }
  const services = url.searchParams.get('s');
  if (services && /^\d+(\.\d+)*$/.test(services)) return serviceUrl(services);
  return url.toString();
}
