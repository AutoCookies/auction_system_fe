import ENVARS from "@/config/env";

export async function handleGetAllAuctionSession({ page = 1, limit = 10 }) {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit
    });

    const res = await fetch(`${ENVARS.API_URL}/api/auction?${queryParams.toString()}`, {
      method: "GET",
      credentials: "include", // 👈 rất quan trọng để gửi cookie lên BE
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: true,
        message: data.message || "Lỗi không xác định"
      };
    }

    return {
      success: true,
      error: false,
      data: data.data,
      totalCount: data.totalCount,
      totalNoPage: data.totalNoPage,
      page: data.page,
      limit: data.limit,
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: error.message || "Đã có lỗi xảy ra khi gọi API"
    };
  }
}
