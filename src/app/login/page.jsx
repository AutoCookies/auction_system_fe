'use client';

import { useState } from 'react';
import styles from '@/styles/login/page.module.css';
import { handleLogin } from '@/utils/handleLogin';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/utils/checkAuth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        const result = await handleLogin({ email, password });

        if (result.success) {
            setSuccessMsg(result.message);

            // Gọi API checkAuth để lấy role
            const authResult = await checkAuth();

            if (authResult.success) {
                const role = authResult.user.role;

                setTimeout(() => {
                    if (role === 'ADMIN') {
                        router.push('/dashboard');
                    } else {
                        router.push('/home');
                    }
                }, 1000);
            } else {
                setErrorMsg('Không lấy được thông tin người dùng');
            }
        } else {
            setErrorMsg(result.message);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={onSubmit} className={styles.form}>
                <h2 className={styles.title}>Đăng Nhập</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />

                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />

                {errorMsg && <div className={styles.error}>{errorMsg}</div>}
                {successMsg && <div className={styles.success}>{successMsg}</div>}

                <button type="submit" className={styles.button}>Đăng nhập</button>

                <p className={styles.registerLink}>
                    Chưa có tài khoản?{' '}
                    <span onClick={() => router.push('/register')} className={styles.link}>
                        Đăng ký
                    </span>
                </p>
            </form>
        </div>
    );
}
