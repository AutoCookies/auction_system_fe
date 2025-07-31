import ENVARS from "@/config/env.js";

export const handleCreateProduct = async ({ name, image, categoryId, price, description }) => {
    try {
        const res = await fetch(`${ENVARS.API_URL}/api/product/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // nếu cần cookie/session
            body: JSON.stringify({
                name,
                image,
                categoryId,
                price,
                description,
            }),
        });

        const data = await res.json();
        return data;
    } catch (error) {
        return {
            success: false,
            error: true,
            message: error.message || "Không thể tạo sản phẩm",
        };
    }
};
