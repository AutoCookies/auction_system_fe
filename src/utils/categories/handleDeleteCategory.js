import ENVARS from "@/config/env";

export const handleDeleteCategory = async (categoryId) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/category/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ _id: categoryId })
    });

    const data = await res.json();

    return {
      success: res.ok && data.success,
      error: !res.ok || data.error,
      message: data.message || "Đã xảy ra lỗi",
      data: data.data || null
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: error.message || "Lỗi kết nối tới server",
      data: null
    };
  }
};
