'use client';

import { useState } from 'react';
import { handleRegister } from '@/utils/handleRegister';
import styles from '@/styles/register/page.module.css';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState(null);
  const router = useRouter();

  const isFormValid =
    form.name.trim() &&
    form.email.trim() &&
    form.password &&
    form.password === form.confirmPassword;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const result = await handleRegister({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    setStatus(result);
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <h2 className={styles.title}>Đăng ký</h2>

      <input
        type="text"
        placeholder="Tên"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={styles.input}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Nhập lại mật khẩu"
        value={form.confirmPassword}
        onChange={(e) =>
          setForm({ ...form, confirmPassword: e.target.value })
        }
        className={styles.input}
        required
      />

      {form.confirmPassword &&
        form.password !== form.confirmPassword && (
          <p className={styles.error}>🔒 Mật khẩu không khớp</p>
        )}

      <button type="submit" className={styles.button} disabled={!isFormValid}>
        Đăng ký
      </button>

      {status && (
        <p className={status.success ? styles.success : styles.error}>
          {status.message}
        </p>
      )}

      <p className={styles.loginLink}>
        Đã có tài khoản?{' '}
        <span onClick={() => router.push('/login')} className={styles.link}>
          Đăng nhập
        </span>
      </p>
    </form>
  );
}
