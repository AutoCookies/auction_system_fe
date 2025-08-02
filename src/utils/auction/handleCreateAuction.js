import ENVARS from "@/config/env";

export const handleCreateAuctionSession = async ({ description, timeAuction }) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/auction/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Đảm bảo gửi cookie nếu cần
      body: JSON.stringify({ description, timeAuction }),
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
