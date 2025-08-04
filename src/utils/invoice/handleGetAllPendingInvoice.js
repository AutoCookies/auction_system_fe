import ENVARS from "@/config/env";

export const handleGetAllPendingInvoice = async () => {
    const response = await fetch(`${ENVARS.API_URL}/api/invoice/pending`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch pending invoices");
    }
    
    const data = await response.json();
    return data;
}