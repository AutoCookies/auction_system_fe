import ENVARS from "@/config/env";

export async function checkAuth() {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/user/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || "Unauthorized" };
    }
  } catch (err) {
    return { success: false, message: "Không thể kết nối đến server" };
  }
}
