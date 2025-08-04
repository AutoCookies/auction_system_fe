import ENVARS from "@/config/env";

export default async function handleDeleteAuctionSession(auctionSessionId) {
  try {
    const response = await fetch(`${ENVARS.API_URL}/api/auction/${auctionSessionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Lỗi khi xóa phiên đấu giá" };
    }

    return { success: true, message: "Phiên đấu giá đã được xóa thành công" };
  } catch (error) {
    console.error("Error deleting auction session:", error);
    return { success: false, message: "Lỗi kết nối đến máy chủ" };
  }
}