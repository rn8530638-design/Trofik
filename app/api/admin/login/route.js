import { NextResponse } from 'next/server';
import { createSession, verifyCredentials } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username = '', password = '' } = await request.json();
    if (!verifyCredentials(username, password)) {
      return NextResponse.json({ error: 'Неверный логин или пароль.' }, { status: 401 });
    }
    await createSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Вход пока не настроен на сервере.' }, { status: 503 });
  }
}
