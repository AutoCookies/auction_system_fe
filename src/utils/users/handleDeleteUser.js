import ENVARS from "@/config/env";

export const handleDeleteUser = async (userId) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/user/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Xóa người dùng thất bại");
    }

    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
