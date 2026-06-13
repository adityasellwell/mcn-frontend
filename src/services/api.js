import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ─── Attach token ───
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mcn_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auto refresh ───
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        localStorage.setItem("mcn_token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("mcn_token");
        localStorage.removeItem("mcn_admin");
        window.location.href = "/admin";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;