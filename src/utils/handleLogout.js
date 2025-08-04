import ENVARS from "@/config/env";

export async function handleLogout() {
  try {
    const response = await fetch(`${ENVARS.API_URL}/api/user/logout`, {
      method: "POST",
      credentials: "include", // rất quan trọng để gửi cookie
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Logout failed");
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Logout error:", error.message);
    return { success: false, message: error.message };
  }
}
