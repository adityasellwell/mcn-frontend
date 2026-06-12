import api from "../../services/api";

// ─── Fetch all meetings ───
export const fetchMeetings = () =>
  api.get("/meeting");

// ─── Fetch single meeting ───
export const fetchMeetingById = (id) =>
  api.get(`/meeting/${id}`);

// ─── Create meeting ───
export const createMeeting = (data) =>
  api.post("/meeting", data);

// ─── Update meeting ───
export const updateMeeting = (id, data) =>
  api.put(`/meeting/${id}`, data);

// ─── Deactivate meeting ───
export const deleteMeeting = (id) =>
  api.delete(`/meeting/${id}`);