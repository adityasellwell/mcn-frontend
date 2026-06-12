import api from "../../services/api";

// ─── Fetch all referrals ───
export const fetchReferrals = () =>
  api.get("/referral");

// ─── Fetch referral stats ───
export const fetchReferralStats = () =>
  api.get("/referral/stats");

// ─── Create referral ───
export const createReferral = (data) =>
  api.post("/referral", data);

// ─── Update referral status ───
export const updateReferralStatus = (id, status) =>
  api.patch(`/referral/${id}/status`, { status });

// ─── Delete referral ───
export const deleteReferral = (id) =>
  api.delete(`/referral/${id}`);