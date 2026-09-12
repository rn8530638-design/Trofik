import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadsDir } from '@/lib/uploads';

const mimeTypes = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

export async function GET(_request, { params }) {
  const { filename } = await params;
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/i.test(filename)) return new Response('Not found', { status: 404 });
  try {
    const extension = path.extname(filename).toLowerCase();
    const image = await fs.readFile(path.join(/* turbopackIgnore: true */ uploadsDir, filename));
    return new Response(image, { headers: { 'Content-Type': mimeTypes[extension], 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
