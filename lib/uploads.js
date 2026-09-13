import fs from 'node:fs';
import path from 'node:path';

// Vercel cannot write into the deployed project directory. Files in `/tmp` are
// temporary, but this prevents admin uploads from crashing the function.
export const uploadsDir = process.env.UPLOADS_DIR
  || (process.env.VERCEL ? path.join('/tmp', 'trofik-uploads') : path.join(process.cwd(), 'public', 'uploads'));

export function ensureUploadsDir() {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
