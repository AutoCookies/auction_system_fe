import ENVARS from "@/config/env";

export const handleGetAllPaidInvoice = async () => {
    const response = await fetch(`${ENVARS.API_URL}/api/invoice/paid`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch paid invoices");
    }
    
    const data = await response.json();
    return data;
}