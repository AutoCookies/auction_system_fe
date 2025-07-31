import ENVARS from "@/config/env";

export const handleCreateCategory = async ({ name, description }) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/category/add-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();

    return {
      success: res.ok && data.success,
      error: !res.ok || data.error,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: error.message || "Lỗi khi tạo danh mục.",
    };
  }
};
