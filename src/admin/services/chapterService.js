import api from "../../services/api";

// ─── Fetch all chapters ───
export const fetchChapters = () =>
  api.get("/chapter");

// ─── Fetch single chapter ───
export const fetchChapterById = (id) =>
  api.get(`/chapter/${id}`);

// ─── Create chapter ───
export const createChapter = (data) =>
  api.post("/chapter", data);

// ─── Update chapter ───
export const updateChapter = (id, data) =>
  api.put(`/chapter/${id}`, data);

// ─── Deactivate chapter ───
export const deleteChapter = (id) =>
  api.delete(`/chapter/${id}`);