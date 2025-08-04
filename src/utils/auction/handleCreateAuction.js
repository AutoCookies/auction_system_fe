import ENVARS from "@/config/env";

export const handleCreateAuctionSession = async ({
  name,
  description,
  timeAuction,
  productId,
  startingPrice,
  endDate
}) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/auction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Nếu có cookie đăng nhập
      body: JSON.stringify({
        name,
        description,
        timeAuction,
        productId,
        startingPrice,
        endDate
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Tạo phiên đấu giá thất bại",
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || "Tạo phiên đấu giá thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Lỗi kết nối đến server",
    };
  }
};
