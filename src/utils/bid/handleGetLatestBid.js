import ENVARS from "@/config/env";

export const handleGetLatestBid = async (auctionSessionId) => {
  try {
    const res = await fetch(
      `${ENVARS.API_URL}/api/bid/${auctionSessionId}`,
      {
        method: "GET",
        credentials: "include", // Để gửi cookie cho xác thực
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch latest bid");
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
