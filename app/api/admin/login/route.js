import { NextResponse } from 'next/server';
import { createSession, verifyCredentials } from '@/lib/auth';

// Защита от подбора пароля: не больше 5 неудачных попыток с одного IP за 15 минут.
// Хранится в памяти процесса — под PM2 один инстанс, этого достаточно.
const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const fails = new Map();

function clientIp(request) {
  return request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

export async function POST(request) {
  const ip = clientIp(request);
  const now = Date.now();
  for (const [key, entry] of fails) if (entry.until < now) fails.delete(key);
  const entry = fails.get(ip);
  if (entry?.count >= MAX_FAILS) {
    return NextResponse.json({ error: 'Слишком много попыток. Попробуйте через 15 минут.' }, {
      status: 429, headers: { 'Retry-After': String(Math.ceil((entry.until - now) / 1000)) },
    });
  }
  try {
    const { username = '', password = '' } = await request.json();
    if (typeof username !== 'string' || typeof password !== 'string' || !verifyCredentials(username, password)) {
      fails.set(ip, { count: (entry?.count || 0) + 1, until: now + WINDOW_MS });
      return NextResponse.json({ error: 'Неверный логин или пароль.' }, { status: 401 });
    }
    fails.delete(ip);
    await createSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Вход пока не настроен на сервере.' }, { status: 503 });
  }
}
