import ENVARS from "@/config/env";

export async function handleGetAuctionSessionsByCategory(categoryId, token) {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/auction/by-category/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Đảm bảo cookie được gửi đi
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Lỗi khi lấy phiên đấu giá");
    }

    return {
      success: true,
      sessions: data.sessions || [],
    };
  } catch (error) {
    console.error("handleGetAuctionSessionsByCategory error:", error);
    return {
      success: false,
      message: error.message || "Đã xảy ra lỗi",
    };
  }
}