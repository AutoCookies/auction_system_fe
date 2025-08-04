import ENVARS from "@/config/env";

export const handleGetAllCategory = async () => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/category/all`, {
      method: "GET",
      credentials: "include", // để gửi cookie (nếu dùng auth qua cookie)
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Không thể lấy danh sách danh mục");
    }

    return {
      success: true,
      categories: data.data || [],
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Lỗi không xác định",
    };
  }
};
