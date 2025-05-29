import { API_BASE, authHeader1 } from "./config";

export async function fetchUserNotifications(username) {
    if (!username) {
        console.warn("Warning: Attempted to fetch notifications with an undefined username!");
        return [];
    }

  try {
    const response = await fetch(`${API_BASE}/notifications/?username=${username}`, {
      headers: {
        ...authHeader1(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}