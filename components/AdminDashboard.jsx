'use client';

import { useEffect, useState } from 'react';
import { PRICE_GROUPS } from '@/lib/priceGroups';
import styles from './Admin.module.css';

const sections = {
  services: { label: 'Услуги', singular: 'услугу', collection: 'services', category: 'services', description: 'Карточки для блока «Что мы делаем» на главной. Отмеченные галочкой показываются на главной в порядке, заданном стрелками. Полный прайс студии — в разделе «Прайс».' },
  events: { label: 'Мероприятия', singular: 'мероприятие', collection: 'services', category: 'events', description: 'Мастер-классы, праздники и обучение. Отмеченные галочкой попадают в блок «Что мы делаем» на главной.' },
  price: { label: 'Прайс', singular: 'позицию', collection: 'price_items', description: 'Карточки услуг на странице «Услуги»: цена, описание, фото, порядок и ссылка на запись в DIKIDI. Выберите группу, чтобы увидеть её позиции.' },
  reviews: { label: 'Отзывы', singular: 'отзыв', collection: 'reviews', description: 'Сохранённые изменения сразу появятся на сайте.' },
  promotions: { label: 'Акции', singular: 'акцию', collection: 'promotions', description: 'Сохранённые изменения сразу появятся на сайте.' },
  blog: { label: 'Блог', singular: 'статью', collection: 'blog_posts', description: 'Создавайте статьи — после публикации они сразу доступны по адресу /blog/название-статьи.' },
};

const blank = {
  services: { name: '', description: '', duration: '', price: '', category: 'services', show_home: false, image_path: '' },
  price: { group_slug: PRICE_GROUPS[0].slug, name: '', description: '', duration: '', price: '', is_extra: false, image_path: '', dikidi_link: '' },
  reviews: { text: '', author: '', review_date: '', rating: 5, source_url: '', is_visible: true },
  promotions: { title: '', discount: '', description: '', expiry: '', is_visible: true },
  blog: { title: '', slug: '', excerpt: '', content: '', category: '', read_time: '', image_path: '', is_published: true },
};

const isServiceSection = (section) => ['services', 'events'].includes(section);
const labelFor = (item, section) => section === 'reviews' ? item.author : section === 'promotions' || section === 'blog' ? item.title : item.name;
const groupTitle = (slug) => PRICE_GROUPS.find((group) => group.slug === slug)?.title || slug;

export default function AdminDashboard() {
  const [section, setSection] = useState('services');
  const [priceGroup, setPriceGroup] = useState(PRICE_GROUPS[0].slug);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const settings = sections[section];

  async function load(current = section) {
    const currentSettings = sections[current];
    setLoading(true);
    const response = await fetch(`/api/admin/content?collection=${currentSettings.collection}`);
    if (response.ok) {
      let nextItems = (await response.json()).items;
      if (currentSettings.category) nextItems = nextItems.filter((item) => item.category === currentSettings.category);
      if (currentSettings.homeOnly) nextItems = nextItems.filter((item) => item.show_home);
      if (current === 'price') nextItems = nextItems.filter((item) => item.group_slug === priceGroup);
      setItems(nextItems);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, [section, priceGroup]);

  function createItem() {
    if (section === 'price') return setEditing({ ...blank.price, group_slug: priceGroup });
    if (!isServiceSection(section)) return setEditing(blank[section]);
    setEditing({ ...blank.services, category: settings.category, show_home: Boolean(settings.homeOnly) });
  }
  function changeSection(next) { setSection(next); setEditing(null); setMessage(''); }
  async function remove(item) {
    if (!window.confirm(`Удалить ${settings.singular} «${labelFor(item, section)}»? Это действие нельзя отменить.`)) return;
    const response = await fetch(`/api/admin/content?collection=${settings.collection}&id=${item.id}`, { method: 'DELETE' });
    if (response.ok) { setMessage('Удалено.'); load(); }
  }
  async function logout() { await fetch('/api/admin/logout', { method: 'POST' }); window.location.assign('/admin/login'); }
  async function move(item, direction) {
    const neighbor = items[items.indexOf(item) + direction];
    if (!neighbor) return;
    await Promise.all([item, neighbor].map((entry, index) => fetch(`/api/admin/content?collection=${settings.collection}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...entry, sort_order: index ? item.sort_order : neighbor.sort_order }) })));
    load();
  }

  return <main className={styles.dashboard}>
    <header className={styles.topbar}><a href="/" className={styles.brand}>ТРОФИК <span>Админ-панель</span></a><button className={styles.logout} onClick={logout}>Выйти</button></header>
    <div className={styles.shell}>
      <nav className={styles.nav} aria-label="Разделы админ-панели">{Object.entries(sections).map(([key, value]) => <button key={key} className={section === key ? styles.navActive : ''} onClick={() => changeSection(key)}>{value.label}</button>)}</nav>
      <section className={styles.content}>
        <div className={styles.pageTitle}><div><p className={styles.eyebrow}>УПРАВЛЕНИЕ САЙТОМ</p><h1>{settings.label}</h1><p>{settings.description}</p>{section === 'price' && <label className={styles.groupPicker}>Группа<select value={priceGroup} onChange={(e) => { setPriceGroup(e.target.value); setEditing(null); }}>{PRICE_GROUPS.map((group) => <option key={group.slug} value={group.slug}>{group.title}</option>)}</select></label>}</div><button className={styles.primaryButton} onClick={createItem}>+ Добавить</button></div>
        {message && <p className={styles.success} role="status">{message}</p>}
        {editing && <Editor section={section} initial={editing} onCancel={() => setEditing(null)} onSave={() => { setEditing(null); setMessage('Изменения сохранены.'); load(); }} />}
        <div className={styles.list} aria-busy={loading}>{loading ? <p>Загрузка…</p> : items.length === 0 ? <p className={styles.empty}>Здесь пока ничего нет. Добавьте первую карточку.</p> : items.map((item, index) => <article className={styles.item} key={item.id}>
          {(isServiceSection(section) || section === 'price') && <img src={item.image_path || '/images/service-manicure.jpg'} alt="" />}
          <div className={styles.itemText}><h2>{labelFor(item, section)}</h2><p>{section === 'reviews' ? item.text : section === 'promotions' ? `${item.discount} · ${item.expiry}` : section === 'blog' ? `${item.category} · /blog/${item.slug}` : section === 'price' ? `${item.price}${item.duration ? ` · ${item.duration}` : ''}` : `${item.price} · ${item.category === 'events' ? `${item.duration} участников` : item.duration}`}</p><div className={styles.tags}>{isServiceSection(section) && item.show_home && <span>На главной</span>}{section === 'price' && item.is_extra && <span>Дополнительная</span>}{section === 'price' && !item.dikidi_link && <span>Без ссылки на запись</span>}{section === 'blog' ? !item.is_published && <span>Черновик</span> : !isServiceSection(section) && section !== 'price' && !item.is_visible && <span>Скрыто</span>}</div></div>
          <div className={styles.itemActions}>{section === 'blog' && item.is_published && <a className={styles.openLink} href={`/blog/${item.slug}`} target="_blank" rel="noreferrer">Открыть</a>}<button onClick={() => move(item, -1)} disabled={!index} aria-label="Переместить выше">↑</button><button onClick={() => move(item, 1)} disabled={index === items.length - 1} aria-label="Переместить ниже">↓</button><button onClick={() => setEditing(item)}>Изменить</button><button className={styles.delete} onClick={() => remove(item)}>Удалить</button></div>
        </article>)}</div>
      </section>
    </div>
  </main>;
}

function Editor({ section, initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const services = isServiceSection(section);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  async function upload(file) {
    if (!file) return;
    setPending(true); setError(''); const data = new FormData(); data.append('file', file);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: data }); setPending(false);
    if (!response.ok) return setError((await response.json()).error || 'Не удалось загрузить фото.');
    set('image_path', (await response.json()).path);
  }
  async function submit(event) {
    event.preventDefault(); setPending(true); setError('');
    const collection = sections[section].collection;
    const response = await fetch(`/api/admin/content?collection=${collection}`, { method: form.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); setPending(false);
    if (!response.ok) return setError((await response.json()).error || 'Не удалось сохранить.');
    onSave();
  }
  return <form className={styles.editor} onSubmit={submit}>
    <div className={styles.editorHeader}><h2>{form.id ? 'Редактирование' : 'Новая карточка'}</h2><button type="button" className={styles.close} onClick={onCancel}>×</button></div>
    {services && <><label>Название *<input value={form.name} onChange={(e) => set('name', e.target.value)} required /></label><label>Фото *<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload(e.target.files[0])} />{form.image_path && <img className={styles.preview} src={form.image_path} alt="Предпросмотр" />}</label><label>Описание *<textarea value={form.description} onChange={(e) => set('description', e.target.value)} required /></label><label>{form.category === 'events' ? 'Участники' : 'Длительность'}<input value={form.duration} onChange={(e) => set('duration', e.target.value)} /></label><label>Цена *<input value={form.price} onChange={(e) => set('price', e.target.value)} required /></label><label className={styles.check}><input type="checkbox" checked={form.show_home} onChange={(e) => set('show_home', e.target.checked)} /> Показывать в блоке «Что мы делаем» на главной</label></>}
    {section === 'price' && <><label>Группа *<select value={form.group_slug} onChange={(e) => set('group_slug', e.target.value)} required>{PRICE_GROUPS.map((group) => <option key={group.slug} value={group.slug}>{group.title}</option>)}</select></label><label>Название *<input value={form.name} onChange={(e) => set('name', e.target.value)} required /></label><label>Фото<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload(e.target.files[0])} />{form.image_path && <img className={styles.preview} src={form.image_path} alt="Предпросмотр" />}</label><label>Длительность<input value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="Например, 1 ч 30 м" /></label><label>Цена *<input value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="Например, 2 500 ₽" required /></label><label className={styles.fullWidth}>Описание<textarea value={form.description} onChange={(e) => set('description', e.target.value)} /><small>Короткая пояснительная строка под названием. Можно оставить пустым.</small></label><label className={styles.fullWidth}>Ссылка на запись в DIKIDI<input value={form.dikidi_link || ''} onChange={(e) => set('dikidi_link', e.target.value)} placeholder="https://dikidi.app/1846979?p=3.pi-po-ssm-sd&o=7&s=20079480" /><small>Кнопка «Записаться» у этой позиции откроет DIKIDI сразу на выборе даты и времени. Можно вставить ссылку из DIKIDI или просто id услуги — адрес соберётся сам. Если оставить пустым, кнопка откроет общий виджет записи студии.</small></label><label className={styles.check}><input type="checkbox" checked={form.is_extra} onChange={(e) => set('is_extra', e.target.checked)} /> Дополнительная услуга — попадёт в свёрнутый блок «Дополнительно»</label></>}
    {section === 'reviews' && <><label>Автор *<input value={form.author} onChange={(e) => set('author', e.target.value)} required /></label><label>Дата<input value={form.review_date} onChange={(e) => set('review_date', e.target.value)} /></label><label>Оценка<select value={form.rating} onChange={(e) => set('rating', e.target.value)}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} из 5</option>)}</select></label><label>Текст *<textarea value={form.text} onChange={(e) => set('text', e.target.value)} required /></label><label>Ссылка на источник<input type="url" value={form.source_url} onChange={(e) => set('source_url', e.target.value)} /></label><label className={styles.check}><input type="checkbox" checked={form.is_visible} onChange={(e) => set('is_visible', e.target.checked)} /> Показывать на сайте</label></>}
    {section === 'promotions' && <><label>Название *<input value={form.title} onChange={(e) => set('title', e.target.value)} required /></label><label>Скидка *<input value={form.discount} onChange={(e) => set('discount', e.target.value)} required /></label><label>Срок действия *<input value={form.expiry} onChange={(e) => set('expiry', e.target.value)} required /></label><label>Описание *<textarea value={form.description} onChange={(e) => set('description', e.target.value)} required /></label><label className={styles.check}><input type="checkbox" checked={form.is_visible} onChange={(e) => set('is_visible', e.target.checked)} /> Показывать на сайте</label></>}
    {section === 'blog' && <><label>Заголовок *<input value={form.title} onChange={(e) => set('title', e.target.value)} required /></label><label>Адрес статьи<input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="создастся-автоматически" /><small>Можно оставить пустым — адрес сформируется из заголовка.</small></label><label>Категория *<input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Например, Макияж" required /></label><label>Время чтения<input value={form.read_time} onChange={(e) => set('read_time', e.target.value)} placeholder="Например, 4 минуты" /></label><label>Обложка<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload(e.target.files[0])} />{form.image_path && <img className={styles.preview} src={form.image_path} alt="Предпросмотр обложки" />}</label><label>Краткое описание *<textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} required /></label><label className={styles.fullWidth}>Текст статьи *<textarea value={form.content} onChange={(e) => set('content', e.target.value)} required /><small>Разделяйте абзацы пустой строкой.</small></label><label className={styles.check}><input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} /> Опубликовать на сайте</label></>}
    {error && <p className={styles.error} role="alert">{error}</p>}<div className={styles.formActions}><button type="button" onClick={onCancel}>Отмена</button><button className={styles.primaryButton} disabled={pending}>{pending ? 'Сохраняем…' : 'Сохранить'}</button></div>
  </form>;
}
