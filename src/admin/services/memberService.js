import api from "../../services/api";

// ─── Fetch all members ───
export const fetchMembers = () =>
  api.get("/member");

// ─── Fetch single member ───
export const fetchMemberById = (id) =>
  api.get(`/member/${id}`);

// ─── Create member ───
export const createMember = (data) =>
  api.post("/member", data);

// ─── Update member ───
export const updateMember = (id, data) =>
  api.put(`/member/${id}`, data);

// ─── Update member status ───
export const updateMemberStatus = (id, status) =>
  api.patch(`/member/${id}/status`, { status });

// ─── Deactivate member ───
export const deleteMember = (id) =>
  api.delete(`/member/${id}`);