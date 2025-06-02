const isDevelopment = import.meta.env.MODE === "development";

export const API_BASE = isDevelopment
  ? import.meta.env.VITE_API_BASE_URL_LOCAL
  : import.meta.env.VITE_API_BASE_URL_DEPLOY;

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