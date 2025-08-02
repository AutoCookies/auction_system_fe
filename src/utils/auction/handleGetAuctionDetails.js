import ENVARS from "@/config/env";

export const handleGetAuctionDetails = async (sessionCode) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/auction/details`, {
      method: "POST", // vì controller của bạn đang nhận req.body
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionCode }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        success: false,
        message: data.message || "Lỗi khi lấy chi tiết phiên đấu giá",
      };
    }

    const { auctionSession, details } = data;

    // Nếu phiên đấu giá không có chi tiết
    if (!details || details.length === 0) {
      return {
        success: true,
        auctionSession,
        details: [],
        message: "Phiên đấu giá chưa có sản phẩm nào.",
      };
    }

    return {
      success: true,
      auctionSession,
      details,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || "Đã xảy ra lỗi khi gọi API",
    };
  }
};
