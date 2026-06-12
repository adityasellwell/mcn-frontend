import api from "../../services/api";

// ─── Fetch all visitors ───
export const fetchVisitors = () =>
  api.get("/visitor");

// ─── Fetch single visitor ───
export const fetchVisitorById = (id) =>
  api.get(`/visitor/${id}`);

// ─── Create visitor ───
export const createVisitor = (data) =>
  api.post("/visitor", data);

// ─── Update visitor ───
export const updateVisitor = (id, data) =>
  api.put(`/visitor/${id}`, data);

// ─── Delete visitor ───
export const deleteVisitor = (id) =>
  api.delete(`/visitor/${id}`);

// ─── Convert visitor to member ───
export const convertVisitor = (id, chapterId) =>
  api.post(`/visitor/${id}/convert`, { chapterId });