import api from "../../services/api";

// ─── Get attendance for a meeting ───
export const fetchMeetingAttendance = (meetingId) =>
  api.get(`/attendance/meeting/${meetingId}`);

// ─── Mark member attendance ───
export const markMemberAttendance = (id, attendanceStatus) =>
  api.patch(`/attendance/member/${id}`, { attendanceStatus });

// ─── Mark visitor attendance ───
export const markVisitorAttendance = (id, attendanceStatus) =>
  api.patch(`/attendance/visitor/${id}`, { attendanceStatus });