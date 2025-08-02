import ENVARS from "@/config/env";

export async function handleDeleteProduct(productId) {
  try {
    const res = await fetch(`${ENVARS.API_URL}/api/product/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ _id: productId }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Xóa sản phẩm thất bại",
      };
    }

    return {
      success: true,
      message: data.message || "Xóa sản phẩm thành công",
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Lỗi kết nối máy chủ",
    };
  }
}
