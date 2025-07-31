import ENVARS from "@/config/env";

export async function handleGetAllCategories() {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/category/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // optional: để không bị cache khi gọi từ server components
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: true,
        message: data.message || "Failed to fetch categories",
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
      message: error.message || "Error fetching categories",
    };
  }
}