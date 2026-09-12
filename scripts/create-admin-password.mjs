import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const terminal = createInterface({ input, output });
const password = await terminal.question('Введите новый пароль администратора: ');
terminal.close();

if (password.length < 12) {
  console.error('Пароль должен содержать не менее 12 символов.');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64).toString('hex');
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}`);
