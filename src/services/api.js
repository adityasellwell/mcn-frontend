import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // sends httpOnly refresh token cookie
});

// ─── Attach access token to every request ───
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mcn_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auto-refresh access token on 401 ───
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint — uses httpOnly cookie automatically
        const res = await axios.post(
          "http://localhost:5000/api/admin/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        // Store new access token
        localStorage.setItem("mcn_token", newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear storage and redirect to login
        localStorage.removeItem("mcn_token");
        localStorage.removeItem("mcn_admin");
        window.location.href = "/admin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;