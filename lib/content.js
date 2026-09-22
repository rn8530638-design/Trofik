import { db, normalizeRow } from './db';

export function getServices({ homeOnly = false, category } = {}) {
  let query = 'SELECT * FROM services';
  const clauses = [];
  const params = [];
  if (homeOnly) clauses.push('show_home = 1');
  if (category) {
    clauses.push('category = ?');
    params.push(category);
  }
  if (clauses.length) query += ` WHERE ${clauses.join(' AND ')}`;
  query += ' ORDER BY sort_order, id';
  return db.prepare(query).all(...params).map(normalizeRow);
}

export function getReviews() {
  return db.prepare('SELECT * FROM reviews WHERE is_visible = 1 ORDER BY sort_order, id').all().map(normalizeRow);
}

export function getPromotions() {
  return db.prepare('SELECT * FROM promotions WHERE is_visible = 1 ORDER BY sort_order, id').all().map(normalizeRow);
}

export function getBlogPosts({ includeUnpublished = false } = {}) {
  const query = includeUnpublished
    ? 'SELECT * FROM blog_posts ORDER BY sort_order, id'
    : 'SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY sort_order, id';
  return db.prepare(query).all().map(normalizeRow);
}

export function getBlogPostBySlug(slug) {
  return normalizeRow(db.prepare('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1').get(slug));
}
