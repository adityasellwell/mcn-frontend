import api from "../../services/api";

// ─── Fetch all applications with optional filters ───
export const fetchApplications = (params) =>
  api.get("/application", { params });

// ─── Fetch single application by ID ───
export const fetchApplicationById = (id) =>
  api.get(`/application/${id}`);

// ─── Approve application ───
export const approveApplication = (id) =>
  api.put(`/application/${id}/approve`);

// ─── Reject application ───
export const rejectApplication = (id) =>
  api.put(`/application/${id}/reject`);

// ─── Export applications as Excel ───
export const exportApplications = () =>
  api.get("/application/export", { responseType: "blob" });