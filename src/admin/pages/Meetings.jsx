import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { Plus, Pencil, Trash2, X, CalendarDays } from "lucide-react";
import {
  fetchMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "../services/meetingService";
import { fetchChapters } from "../services/chapterService";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    ACTIVE:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    INACTIVE: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    PENDING:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] || map.PENDING}`}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────
// Meeting Form Modal — Create & Edit
// ─────────────────────────────────────────────
const MeetingModal = ({ meeting, chapters, onClose, onSave }) => {
  const isEdit = !!meeting?.id;

  // ─── Format date for input[type=date] ───
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  const [form, setForm] = useState({
    chapterId:   meeting?.chapterId   || "",
    title:       meeting?.title       || "",
    description: meeting?.description || "",
    meetingDate: formatDateForInput(meeting?.meetingDate),
    startTime:   meeting?.startTime   || "",
    endTime:     meeting?.endTime     || "",
    address:     meeting?.address     || "",
    meetingFee:  meeting?.meetingFee  || "",
    agenda:      meeting?.agenda      || "",
    qr:          null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, qr: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ─── Basic validation ───
    if (!form.chapterId || !form.title || !form.meetingDate || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("chapterId", Number(form.chapterId));
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("meetingDate", form.meetingDate);
      payload.append("startTime", form.startTime);
      payload.append("endTime", form.endTime);
      payload.append("address", form.address);
      payload.append("meetingFee", form.meetingFee ? Number(form.meetingFee) : "");
      payload.append("agenda", form.agenda);
      if (form.qr) {
        payload.append("qr", form.qr);
      }

      if (isEdit) {
        await updateMeeting(meeting.id, payload);
        toast.success("Meeting updated successfully");
      } else {
        await createMeeting(payload);
        toast.success("Meeting created successfully");
      }
      onSave();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1b3d] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? "Edit Meeting" : "Create Meeting"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Chapter */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">
              Chapter *
            </label>
            <select
              name="chapterId"
              value={form.chapterId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
            >
              <option value="">Select Chapter</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.city}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">
              Meeting Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Weekly Business Networking Meeting"
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">
              Meeting Date *
            </label>
            <input
              type="date"
              name="meetingDate"
              value={form.meetingDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
            />
          </div>

          {/* Start + End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">
                Start Time *
              </label>
              <input
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                placeholder="7:00 AM"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">
                End Time *
              </label>
              <input
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                placeholder="9:00 AM"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">
              Venue Address *
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              placeholder="Hotel Suba International, Andheri East"
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition resize-none"
            />
          </div>

          {/* Fee */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">
              Meeting Fee (₹)
            </label>
            <input
              type="number"
              name="meetingFee"
              value={form.meetingFee}
              onChange={handleChange}
              placeholder="1000"
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
            />
          </div>

          {/* QR Code */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">
              QR Code Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0C831F] file:text-white"
            />
            {meeting?.meetingQrUrl && !form.qr && (
              <p className="text-xs text-[#6b7ea3] mt-2">
                Current QR will remain if no new file is selected.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="Brief description of the meeting"
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition resize-none"
            />
          </div>

          {/* Agenda */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">
              Agenda
            </label>
            <textarea
              name="agenda"
              value={form.agenda}
              onChange={handleChange}
              rows={3}
              placeholder="Meeting agenda details"
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-[#6b7ea3] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium transition"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Meetings Page
// ─────────────────────────────────────────────
const Meetings = () => {
  usePageTitle("Meetings");
  const [meetings, setMeetings] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // ─── Load meetings and chapters together ───
  const loadData = async () => {
    setLoading(true);
    try {
      const [meetingsRes, chaptersRes] = await Promise.all([
        fetchMeetings(),
        fetchChapters(),
      ]);
      setMeetings(meetingsRes.data.data);
      setChapters(chaptersRes.data.data);
    } catch {
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Open create modal ───
  const handleCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  // ─── Open edit modal ───
  const handleEdit = (meeting) => {
    setEditTarget(meeting);
    setModalOpen(true);
  };

  // ─── Deactivate meeting ───
  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this meeting?")) return;
    try {
      await deleteMeeting(id);
      toast.success("Meeting deactivated");
      loadData();
    } catch {
      toast.error("Failed to deactivate meeting");
    }
  };

  // ─── After save ───
  const handleSave = () => {
    setModalOpen(false);
    setEditTarget(null);
    loadData();
  };

  return (
    <>
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Meetings</h2>
            <p className="text-sm text-[#6b7ea3] mt-1">
              Manage MCN meetings
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium transition"
          >
            <Plus size={16} />
            Add Meeting
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-[#162040] border border-white/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#6b7ea3] text-sm">
              Loading meetings...
            </div>
          ) : meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <CalendarDays size={32} className="text-[#6b7ea3]" />
              <p className="text-[#6b7ea3] text-sm">No meetings yet</p>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
              >
                Create First Meeting
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Meeting</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Chapter</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Date & Time</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Fee</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {meetings.map((meeting) => (
                    <tr key={meeting.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{meeting.title}</p>
                        <p className="text-xs text-[#6b7ea3] mt-0.5 truncate max-w-[200px]">
                          {meeting.address}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">{meeting.chapter?.name}</p>
                        <p className="text-xs text-[#6b7ea3]">{meeting.chapter?.city}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">
                          {new Date(meeting.meetingDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-[#6b7ea3]">
                          {meeting.startTime} – {meeting.endTime}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">
                          {meeting.meetingFee ? `₹${meeting.meetingFee}` : "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={meeting.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(meeting)}
                            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          {meeting.status === "ACTIVE" && (
                            <button
                              onClick={() => handleDeactivate(meeting.id)}
                              className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Deactivate"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
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

      {/* ── Modal ── */}
      {modalOpen && (
        <MeetingModal
          meeting={editTarget}
          chapters={chapters}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default Meetings;