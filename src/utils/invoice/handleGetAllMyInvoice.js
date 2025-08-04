import ENVARS from "@/config/env";

export const handleGetAllMyInvoice = async () => {
    try {
        const res = await fetch(`${ENVARS.API_URL}/api/invoice/my-invoices`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return { success: false, message: "Failed to fetch invoices" };
    }
}