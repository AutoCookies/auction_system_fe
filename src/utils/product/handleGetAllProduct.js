import ENVARS from "@/config/env";

export async function handleGetAllProducts({ page = 1, limit = 10 }) {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/product/list?page=${page}&limit=${limit}`);

    const data = await res.json();

    return res.ok && data.success
      ? data
      : {
          success: false,
          message: data.message || "Lỗi không xác định",
          data: [],
          totalCount: 0,
          totalNoPage: 1,
        };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Lỗi kết nối tới server",
      data: [],
      totalCount: 0,
      totalNoPage: 1,
    };
  }
}


