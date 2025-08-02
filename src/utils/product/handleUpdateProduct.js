import ENVARS from "@/config/env";

export const handleUpdateProduct = async (productData) => {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/product/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // gửi cookie accessToken nếu có
      body: JSON.stringify(productData),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        success: false,
        message: data.message || "Cập nhật sản phẩm thất bại",
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || "Cập nhật thành công",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Lỗi không xác định",
    };
  }
};
