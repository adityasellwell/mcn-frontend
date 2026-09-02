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

// ─── Add a member/visitor to a meeting's roster (e.g. a walk-in at the
// venue who wasn't already registered) ───
export const addMemberToMeeting = (meetingId, memberId) =>
  api.post("/meetingMember", { meetingId, memberId });

export const addVisitorToMeeting = (meetingId, visitorId) =>
  api.post("/meetingVisitor", { meetingId, visitorId });