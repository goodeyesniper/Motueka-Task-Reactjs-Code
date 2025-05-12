import { API_BASE, authHeader1 } from '../api/config';

// Fetch task detail by ID
export const fetchTaskDetail = async (taskId) => {
  const response = await fetch(`${API_BASE}/posts/${taskId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader1(),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};

// Fetch all offers for a task
export const fetchOfferDetail = async (taskId) => {
  const response = await fetch(`${API_BASE}/posts/${taskId}/offers/list/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader1(),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};

// Submit a new offer
export const submitOffer = async (taskId, message) => {
    const token = localStorage.getItem("token");

    // Check if user is authenticated before proceeding
    if (!token) {
        throw new Error("User not authenticated");
    }

    try {
        const response = await fetch(`${API_BASE}/posts/${taskId}/offers/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader1(), // Include authentication header
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error submitting offer:", error);
        throw error;
    }
};

// Fetch authors of offers
export const fetchOfferAuthors = async (taskId) => {
  const response = await fetch(`${API_BASE}/posts/${taskId}/offer-authors/`, {
    method: "GET",
    headers: authHeader1(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};

// Assign a task to a username
export const assignTask = async (taskId, username) => {
  const response = await fetch(`${API_BASE}/posts/${taskId}/assign/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader1(),
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};
