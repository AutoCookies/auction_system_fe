import ENVARS from "@/config/env";

export const handleGetInvoiceById = async (invoiceId) => {
    const response = await fetch(`${ENVARS.API_URL}/api/invoice/${invoiceId}/get`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // nếu bạn dùng cookie để xác thực
    });

    if (!response.ok) {
        throw new Error("Không thể lấy hóa đơn");
    }

    const data = await response.json();
    return data;
};