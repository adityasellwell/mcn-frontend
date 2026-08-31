import portalApi from "./portalApi";

export const requestPortalOtp = (email) =>
  portalApi.post("/portal/auth/request-otp", { email });

export const verifyPortalOtp = (email, code) =>
  portalApi.post("/portal/auth/verify-otp", { email, code });

export const logoutPortal = () => portalApi.post("/portal/auth/logout");

export const getPortalMe = () => portalApi.get("/portal/auth/me");

export const updatePortalProfile = (data) => portalApi.patch("/portal/profile", data);
