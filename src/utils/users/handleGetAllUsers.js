import ENVARS from "@/config/env";

export async function handleGetAllUsers() {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/user`, {
      method: "GET",
      credentials: "include", // gửi cookie
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, users: data.users };
    } else {
      return { success: false, message: data.message || "Lỗi khi lấy danh sách người dùng" };
    }
  } catch (err) {
    return { success: false, message: "Không thể kết nối đến máy chủ" };
  }
}
