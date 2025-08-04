import ENVARS from "@/config/env";

export async function handleCreateBid({ auctionSessionId, amount }) {
  console.log("Creating bid for session:", auctionSessionId, "with amount:", amount);

  const res = await fetch(`${ENVARS.API_URL}/api/bid`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ auctionSessionId, amount }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: true,
      message: data.message || "Tạo bid thất bại",
    };
  }

  return {
    success: true,
    error: false,
    data: data.data,
  };
}
