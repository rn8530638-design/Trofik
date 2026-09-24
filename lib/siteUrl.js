// Боевой адрес сайта. Переменная серверная (без NEXT_PUBLIC_), поэтому читается
// во время запроса и её можно поменять на VPS без пересборки проекта.
// Используется в canonical, Open Graph, sitemap.xml и robots.txt.
const FALLBACK = 'https://trofik.ru';

export const siteUrl = (process.env.SITE_URL || FALLBACK).replace(/\/+$/, '');
