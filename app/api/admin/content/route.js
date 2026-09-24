import { NextResponse } from 'next/server';
import { db, normalizeRow } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { priceGroupSlugs } from '@/lib/priceGroups';

const tables = {
  services: {
    fields: ['slug', 'name', 'description', 'duration', 'price', 'category', 'show_home', 'sort_order', 'image_path'],
    required: ['name', 'description', 'price', 'category'],
  },
  price_items: {
    fields: ['group_slug', 'name', 'description', 'duration', 'price', 'is_extra', 'sort_order', 'image_path'],
    required: ['group_slug', 'name', 'price'],
  },
  reviews: {
    fields: ['text', 'author', 'review_date', 'rating', 'source_url', 'is_visible', 'sort_order'],
    required: ['text', 'author'],
  },
  promotions: {
    fields: ['title', 'discount', 'description', 'expiry', 'is_visible', 'sort_order'],
    required: ['title', 'discount', 'description', 'expiry'],
  },
  blog_posts: {
    fields: ['slug', 'title', 'excerpt', 'content', 'category', 'read_time', 'image_path', 'is_published', 'sort_order'],
    required: ['title', 'excerpt', 'content', 'category'],
  },
};

function tableFrom(url) {
  const collection = new URL(url).searchParams.get('collection');
  return tables[collection] ? collection : null;
}

function cleanValue(field, value) {
  if (field === 'show_home' || field === 'is_visible' || field === 'is_published' || field === 'is_extra') return value ? 1 : 0;
  if (field === 'sort_order') return Number.isFinite(Number(value)) ? Number(value) : 0;
  if (field === 'rating') return Math.min(5, Math.max(1, Number(value) || 5));
  return typeof value === 'string' ? value.trim() : '';
}

const transliteration = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .split('')
    .map((character) => transliteration[character] ?? character)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

function uniquePostSlug(requestedSlug, title, currentId) {
  const base = slugify(requestedSlug || title) || 'statya';
  let candidate = base;
  let suffix = 2;
  const exists = db.prepare('SELECT id FROM blog_posts WHERE slug = ? AND id != ?');
  while (exists.get(candidate, Number(currentId) || 0)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function cleanPayload(table, input) {
  const schema = tables[table];
  const payload = {};
  schema.fields.forEach((field) => { payload[field] = cleanValue(field, input[field]); });
  if (table === 'services') {
    payload.category = payload.category === 'events' ? 'events' : 'services';
    payload.slug = payload.slug || `${payload.name.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-|-$/g, '')}-${Date.now()}`;
  }
  if (table === 'price_items' && !priceGroupSlugs.includes(payload.group_slug)) {
    throw new Error('Выберите группу прайса.');
  }
  if (table === 'blog_posts') {
    payload.slug = uniquePostSlug(input.slug, payload.title, input.id);
  }
  const missing = schema.required.find((field) => !payload[field]);
  if (missing) throw new Error(`Заполните поле: ${missing}.`);
  return payload;
}

export async function GET(request) {
  try {
    await requireAdmin();
    const table = tableFrom(request.url);
    if (!table) return NextResponse.json({ error: 'Неизвестный раздел.' }, { status: 400 });
    return NextResponse.json({ items: db.prepare(`SELECT * FROM ${table} ORDER BY sort_order, id`).all().map(normalizeRow) });
  } catch {
    return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    const table = tableFrom(request.url);
    if (!table) throw new Error('Неизвестный раздел.');
    const payload = cleanPayload(table, await request.json());
    const fields = Object.keys(payload);
    const result = db.prepare(`INSERT INTO ${table} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`).run(...fields.map((field) => payload[field]));
    return NextResponse.json({ item: normalizeRow(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(result.lastInsertRowid)) });
  } catch (error) {
    return NextResponse.json({ error: error.message === 'UNAUTHORIZED' ? 'Требуется вход.' : error.message || 'Не удалось сохранить.' }, { status: error.message === 'UNAUTHORIZED' ? 401 : 400 });
  }
}

export async function PUT(request) {
  try {
    await requireAdmin();
    const table = tableFrom(request.url);
    const input = await request.json();
    if (!table || !input.id) throw new Error('Карточка не найдена.');
    const payload = cleanPayload(table, input);
    const fields = Object.keys(payload);
    db.prepare(`UPDATE ${table} SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id = ?`).run(...fields.map((field) => payload[field]), input.id);
    return NextResponse.json({ item: normalizeRow(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(input.id)) });
  } catch (error) {
    return NextResponse.json({ error: error.message === 'UNAUTHORIZED' ? 'Требуется вход.' : error.message || 'Не удалось сохранить.' }, { status: error.message === 'UNAUTHORIZED' ? 401 : 400 });
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin();
    const table = tableFrom(request.url);
    const id = Number(new URL(request.url).searchParams.get('id'));
    if (!table || !id) throw new Error('Карточка не найдена.');
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message === 'UNAUTHORIZED' ? 'Требуется вход.' : 'Не удалось удалить.' }, { status: error.message === 'UNAUTHORIZED' ? 401 : 400 });
  }
}
