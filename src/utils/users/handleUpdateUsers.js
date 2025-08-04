import ENVARS from "@/config/env";

export const handleUpdateUser = async (userId, updatedData) => {
  try {
    const response = await fetch(`${ENVARS.API_URL}/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // nếu cần gửi cookie (accessToken)
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Cập nhật người dùng thất bại");
    }

    return {
      success: true,
      user: data.user,
      message: data.message || "Cập nhật thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Lỗi không xác định",
    };
  }
};
