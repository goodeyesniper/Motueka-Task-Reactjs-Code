export const API_BASE = "http://127.0.0.1:8000/api";

export const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
      Authorization: `Token ${token}`,
  };
};

// Auth for authenticated and non-authenticated users
export const authHeader1 = () => {
  const token = localStorage.getItem("token");
  return token && token !== "undefined"
      ? { Authorization: `Token ${token}` }
      : {};
};