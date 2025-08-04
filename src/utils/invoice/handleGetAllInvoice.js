import ENVARS from "@/config/env";

export const handleGetAllInvoice = async () => {
    const response = await fetch(`${ENVARS.API_URL}/api/invoice`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch invoices");
    }
    
    const data = await response.json();
    return data;
}