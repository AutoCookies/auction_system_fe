import ENVARS from "@/config/env";

export async function handleCreateAuctionDetails({
  auctionSessionId,
  productId,
  startingPrice,
  bidStep,
  endDate,
  token,
}) {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/auction/create-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        auctionSessionId,
        productId,
        startingPrice,
        bidStep,
        endDate,
      }),
    });

    const data = await res.json();

    return res.ok && data.success
      ? {
          success: true,
          data: data.data,
          message: data.message,
        }
      : {
          success: false,
          message: data.message || "Lỗi không xác định",
        };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Không thể kết nối tới máy chủ",
    };
  }
}
