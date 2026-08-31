import axios from "axios";

// ─── Separate axios instance for the Member/Visitor portal — deliberately
// not sharing services/api.js, since that instance's 401-refresh handler
// is hard-wired to the admin refresh endpoint and redirects failures to
// /admin. This one talks to the portal's own auth endpoints and redirect
// target, so admin and portal sessions never interfere with each other. ───
const portalApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

portalApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("mcn_portal_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

portalApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/portal/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        localStorage.setItem("mcn_portal_token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return portalApi(originalRequest);
      } catch (err) {
        localStorage.removeItem("mcn_portal_token");
        localStorage.removeItem("mcn_portal_user");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default portalApi;
