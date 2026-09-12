import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'trofik_admin_session';
const MAX_AGE = 60 * 60 * 12;

function config() {
  const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !ADMIN_SESSION_SECRET) {
    throw new Error('Админ-доступ не настроен: заполните ADMIN_USERNAME, ADMIN_PASSWORD_HASH и ADMIN_SESSION_SECRET.');
  }
  return { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET };
}

function sign(value, secret) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function passwordMatches(password, encoded) {
  const [algorithm, salt, expected] = encoded.split(':');
  if (algorithm !== 'scrypt' || !salt || !expected) return false;
  const actual = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}

export function verifyCredentials(username, password) {
  const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH } = config();
  return username === ADMIN_USERNAME && passwordMatches(password, ADMIN_PASSWORD_HASH);
}

export async function createSession() {
  const { ADMIN_USERNAME, ADMIN_SESSION_SECRET } = config();
  const expires = Date.now() + MAX_AGE * 1000;
  const value = `${ADMIN_USERNAME}.${expires}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${value}.${sign(value, ADMIN_SESSION_SECRET)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export async function isAuthenticated() {
  try {
    const { ADMIN_USERNAME, ADMIN_SESSION_SECRET } = config();
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return false;
    const [username, expires, signature] = token.split('.');
    const value = `${username}.${expires}`;
    const expected = sign(value, ADMIN_SESSION_SECRET);
    return username === ADMIN_USERNAME && Number(expires) > Date.now()
      && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!await isAuthenticated()) throw new Error('UNAUTHORIZED');
}
