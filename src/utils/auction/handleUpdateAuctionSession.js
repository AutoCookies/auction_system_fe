import ENVARS from "@/config/env";

export const handleUpdateAuctionSession = async (auctionSessionId, updateData) => {
  try {
    const response = await fetch(`${ENVARS.API_URL}/api/auction/${auctionSessionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // gửi cookie nếu cần xác thực
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Cập nhật phiên đấu giá thất bại",
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || "Cập nhật phiên đấu giá thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Lỗi kết nối đến server",
    };
  }
};
