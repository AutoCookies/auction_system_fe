import ENVARS from '@/config/env.js';

export async function handleRegister({ name, email, password }) {
  try {
    const response = await fetch(`${ENVARS.API_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Đăng ký thất bại');
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
