import ENVARS from "@/config/env.js";

export const handleUpdateCategory = async ({ _id, name, description }) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/category/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ _id, name, description }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: true,
      message: error.message || "Không thể cập nhật danh mục",
    };
  }
};
