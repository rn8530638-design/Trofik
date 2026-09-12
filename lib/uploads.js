import fs from 'node:fs';
import path from 'node:path';

export const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads');

export function ensureUploadsDir() {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
