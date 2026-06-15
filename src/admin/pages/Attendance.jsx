import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { ClipboardCheck, Search } from "lucide-react";
import {
  fetchMeetingAttendance,
  markMemberAttendance,
  markVisitorAttendance,
} from "../services/attendanceService";
import { fetchMeetings } from "../services/meetingService";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Attendance Badge
// ─────────────────────────────────────────────
const AttendanceBadge = ({ status }) => {
  const map = {
    PRESENT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    ABSENT:  "bg-rose-500/10 text-rose-400 border-rose-500/20",
    LATE:    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };
  if (!status) return (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-500/10 text-slate-400 border-slate-500/20">
      Not Marked
    </span>
  );
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[status]}`}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────
// Main Attendance Page
// ─────────────────────────────────────────────
const Attendance = () => {
  usePageTitle("Attendance");
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [attendance, setAttendance] = useState({ members: [], visitors: [] });
  const [loading, setLoading] = useState(false);
  const [meetingsLoading, setMeetingsLoading] = useState(true);

  // ─── Load meetings for dropdown ───
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchMeetings();
        setMeetings(res.data.data);
      } catch {
        toast.error("Failed to load meetings");
      } finally {
        setMeetingsLoading(false);
      }
    };
    load();
  }, []);

  // ─── Load attendance when meeting selected ───
  const loadAttendance = async (meetingId) => {
    if (!meetingId) return;
    setLoading(true);
    try {
      const res = await fetchMeetingAttendance(meetingId);
      setAttendance(res.data.data);
    } catch {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingChange = (e) => {
    setSelectedMeetingId(e.target.value);
    loadAttendance(e.target.value);
  };

  // ─── Mark member attendance ───
  const handleMemberAttendance = async (id, status) => {
    try {
      await markMemberAttendance(id, status);
      toast.success("Attendance marked");
      loadAttendance(selectedMeetingId);
    } catch {
      toast.error("Failed to mark attendance");
    }
  };

  // ─── Mark visitor attendance ───
  const handleVisitorAttendance = async (id, status) => {
    try {
      await markVisitorAttendance(id, status);
      toast.success("Attendance marked");
      loadAttendance(selectedMeetingId);
    } catch {
      toast.error("Failed to mark attendance");
    }
  };

  const selectedMeeting = meetings.find(
    (m) => m.id === Number(selectedMeetingId)
  );

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-white">Attendance</h2>
        <p className="text-sm text-[#6b7ea3] mt-1">
          Mark and track meeting attendance
        </p>
      </div>

      {/* ── Meeting Selector ── */}
      <div className="bg-[#162040] border border-white/5 rounded-xl p-5">
        <label className="block text-xs text-[#6b7ea3] mb-2 uppercase tracking-wider">
          Select Meeting
        </label>
        <select
          value={selectedMeetingId}
          onChange={handleMeetingChange}
          className="w-full max-w-md px-4 py-2.5 rounded-xl bg-[#0f1b3d] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
        >
          <option value="">— Select a meeting —</option>
          {meetings.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title} — {new Date(m.meetingDate).toLocaleDateString("en-IN")}
            </option>
          ))}
        </select>

        {/* Selected Meeting Info */}
        {selectedMeeting && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#a8b8d4]">
            <span>📍 {selectedMeeting.address}</span>
            <span>🕒 {selectedMeeting.startTime} – {selectedMeeting.endTime}</span>
            <span>📅 {new Date(selectedMeeting.meetingDate).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric"
            })}</span>
          </div>
        )}
      </div>

      {/* ── Attendance Tables ── */}
      {selectedMeetingId && (
        loading ? (
          <div className="flex items-center justify-center py-16 text-[#6b7ea3] text-sm">
            Loading attendance...
          </div>
        ) : (
          <div className="space-y-6">

            {/* Members Table */}
            <div className="bg-[#162040] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Members ({attendance.members.length})
                </h3>
              </div>

              {attendance.members.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-[#6b7ea3] text-sm">
                  No members assigned to this meeting
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-5 py-3 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Member</th>
                        <th className="px-5 py-3 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Code</th>
                        <th className="px-5 py-3 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Mark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {attendance.members.map((mm) => (
                        <tr key={mm.id} className="hover:bg-white/[0.02]">
                          <td className="px-5 py-3 text-white">
                            {mm.member?.firstName} {mm.member?.lastName}
                          </td>
                          <td className="px-5 py-3">
                            <span className="font-mono text-xs text-[#6b7ea3]">
                              {mm.member?.memberCode}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <AttendanceBadge status={mm.attendanceStatus} />
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              {["PRESENT", "ABSENT", "LATE"].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleMemberAttendance(mm.id, s)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                                    mm.attendanceStatus === s
                                      ? s === "PRESENT"
                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                        : s === "ABSENT"
                                        ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                      : "bg-white/5 text-[#6b7ea3] border-white/10 hover:bg-white/10"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Visitors Table */}
            <div className="bg-[#162040] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Visitors ({attendance.visitors.length})
                </h3>
              </div>

              {attendance.visitors.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-[#6b7ea3] text-sm">
                  No visitors assigned to this meeting
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-5 py-3 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Visitor</th>
                        <th className="px-5 py-3 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Phone</th>
                        <th className="px-5 py-3 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Mark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {attendance.visitors.map((mv) => (
                        <tr key={mv.id} className="hover:bg-white/[0.02]">
                          <td className="px-5 py-3 text-white">
                            {mv.visitor?.firstName} {mv.visitor?.lastName || ""}
                          </td>
                          <td className="px-5 py-3 text-[#a8b8d4]">
                            {mv.visitor?.phone}
                          </td>
                          <td className="px-5 py-3">
                            <AttendanceBadge status={mv.attendanceStatus} />
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              {["PRESENT", "ABSENT", "LATE"].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleVisitorAttendance(mv.id, s)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                                    mv.attendanceStatus === s
                                      ? s === "PRESENT"
                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                        : s === "ABSENT"
                                        ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                      : "bg-white/5 text-[#6b7ea3] border-white/10 hover:bg-white/10"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* ── Empty State ── */}
      {!selectedMeetingId && !meetingsLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <ClipboardCheck size={40} className="text-[#6b7ea3]" />
          <p className="text-[#6b7ea3]">Select a meeting to view attendance</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;