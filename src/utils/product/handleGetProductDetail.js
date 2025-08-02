import ENVARS from "@/config/env";

export async function handleGetProductDetail(productId) {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/product/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // để gửi cookie nếu dùng auth qua cookie
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        success: false,
        error: true,
        message: data.message || "Failed to fetch product details",
      };
    }

    return {
      success: true,
      error: false,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: error.message || "Error fetching product details",
    };
  }
}
