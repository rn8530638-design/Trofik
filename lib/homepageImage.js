import fs from 'node:fs';
import path from 'node:path';

// The bundled catalog samples are tiny gradient JPEGs, not studio photos.
// Keep uploaded images; render a themed cover for these known placeholders.
export function homepageImage(src) {
  if (!src || !/^\/images\/(catalog|service)-[a-z-]+\.jpg$/.test(src)) return src || '';
  try {
    return fs.statSync(path.join(process.cwd(), 'public', src)).size > 4096 ? src : '';
  } catch {
    return '';
  }
}
