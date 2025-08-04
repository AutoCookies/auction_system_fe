import ENVARS from "@/config/env";

export const handleGetUserById = async (userId) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/user/${userId}/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // nếu cần gửi cookie (accessToken)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Không thể lấy thông tin người dùng");
    }

    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
