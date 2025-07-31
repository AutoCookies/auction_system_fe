import ENVARS from '@/config/env';

export async function handleLogin({ email, password }) {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/user/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
