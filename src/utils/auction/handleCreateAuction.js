export async function handleCreateAuctionSession({ sessionCode, timeAuction, token }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auction/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // Cần token từ user đăng nhập
      },
      body: JSON.stringify({
        sessionCode,
        timeAuction
      })
    });

    const data = await response.json();

    return {
      success: response.ok && !data.error,
      message: data.message || "Có lỗi xảy ra",
      data: data.data || null,
      error: data.error || false
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Request failed",
      error: true
    };
  }
}
