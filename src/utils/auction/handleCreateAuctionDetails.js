import ENVARS from "@/config/env";

export const handleCreateAuctionDetails = async ({
  auctionSessionId,
  productId,
  startingPrice,
  bidStep,
  endDate
}) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/auction/create-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        auctionSessionId,
        productId,
        startingPrice,
        bidStep,
        endDate
      })
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        success: false,
        message: data.message || "Tạo chi tiết đấu giá thất bại"
      };
    }

    return {
      success: true,
      message: data.message || "Tạo thành công",
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Lỗi kết nối đến server"
    };
  }
};
