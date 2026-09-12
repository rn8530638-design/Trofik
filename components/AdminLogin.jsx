'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Admin.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setPending(true); setError('');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: form.get('username'), password: form.get('password') }) });
    setPending(false);
    if (!response.ok) return setError((await response.json()).error || 'Не удалось войти.');
    router.push('/admin'); router.refresh();
  }

  return (
    <main className={styles.loginPage}>
      <form className={styles.loginCard} onSubmit={submit}>
        <p className={styles.eyebrow}>ТРОФИК</p>
        <h1>Панель управления</h1>
        <p className={styles.loginLead}>Войдите, чтобы обновлять содержимое сайта.</p>
        <label>Логин<input name="username" autoComplete="username" required /></label>
        <label>Пароль<input name="password" type="password" autoComplete="current-password" required /></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.primaryButton} disabled={pending}>{pending ? 'Входим…' : 'Войти'}</button>
        <a className={styles.backLink} href="/">← Вернуться на сайт</a>
      </form>
    </main>
  );
}
