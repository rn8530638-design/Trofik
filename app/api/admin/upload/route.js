import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import { requireAdmin } from '@/lib/auth';
import { ensureUploadsDir, uploadsDir } from '@/lib/uploads';

export const runtime = 'nodejs';
const types = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function POST(request) {
  try {
    await requireAdmin();
    const file = (await request.formData()).get('file');
    if (!(file instanceof File) || !types[file.type]) throw new Error('Загрузите JPG, PNG или WebP-фото.');
    if (file.size > 8 * 1024 * 1024) throw new Error('Размер фото не должен превышать 8 МБ.');
    ensureUploadsDir();
    const filename = `${randomUUID()}.${types[file.type]}`;
    await fs.writeFile(path.join(/* turbopackIgnore: true */ uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ path: `/api/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json({ error: error.message === 'UNAUTHORIZED' ? 'Требуется вход.' : error.message || 'Не удалось загрузить фото.' }, { status: error.message === 'UNAUTHORIZED' ? 401 : 400 });
  }
}
