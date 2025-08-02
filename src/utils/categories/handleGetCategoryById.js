import ENVARS from "@/config/env";

export const handleGetCategoryById = async (categoryId) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/category/get-by-id?categoryId=${categoryId}`, {
      method: "GET", 
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        success: false,
        message: data.message || "Lỗi khi lấy danh mục",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Lỗi không xác định",
    };
  }
};      
