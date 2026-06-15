import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { Plus, Pencil, Trash2, X, Building2 } from "lucide-react";
import {
  fetchChapters,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../services/chapterService";
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
// Chapter Form Modal — Create & Edit
// ─────────────────────────────────────────────
const ChapterModal = ({ chapter, onClose, onSave }) => {
  const isEdit = !!chapter?.id;

  const [form, setForm] = useState({
    name:        chapter?.name        || "",
    city:        chapter?.city        || "",
    state:       chapter?.state       || "",
    meetingDay:  chapter?.meetingDay  || "",
    meetingTime: chapter?.meetingTime || "",
    address:     chapter?.address     || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ─── Basic validation ───
    if (!form.name || !form.city || !form.state || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateChapter(chapter.id, form);
        toast.success("Chapter updated successfully");
      } else {
        await createChapter(form);
        toast.success("Chapter created successfully");
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
      <div className="bg-[#0f1b3d] border border-white/10 rounded-2xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? "Edit Chapter" : "Create Chapter"}
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

          {/* Name */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">
              Chapter Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. MCN Mumbai"
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Mumbai"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">State *</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Maharashtra"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
          </div>

          {/* Meeting Day + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Meeting Day</label>
              <select
                name="meetingDay"
                value={form.meetingDay}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
              >
                <option value="">Select Day</option>
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Meeting Time</label>
              <input
                name="meetingTime"
                value={form.meetingTime}
                onChange={handleChange}
                placeholder="e.g. 7:00 AM"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Address *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              placeholder="Full address"
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
// Main Chapters Page
// ─────────────────────────────────────────────
const Chapters = () => {
  usePageTitle("Chapters");
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // ─── Load chapters ───
  const loadChapters = async () => {
    setLoading(true);
    try {
      const res = await fetchChapters();
      setChapters(res.data.data);
    } catch {
      toast.error("Failed to load chapters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChapters();
  }, []);

  // ─── Open create modal ───
  const handleCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  // ─── Open edit modal ───
  const handleEdit = (chapter) => {
    setEditTarget(chapter);
    setModalOpen(true);
  };

  // ─── Deactivate chapter ───
  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this chapter?")) return;
    try {
      await deleteChapter(id);
      toast.success("Chapter deactivated");
      loadChapters();
    } catch {
      toast.error("Failed to deactivate chapter");
    }
  };

  // ─── After save ───
  const handleSave = () => {
    setModalOpen(false);
    setEditTarget(null);
    loadChapters();
  };

  return (
    <>
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Chapters</h2>
            <p className="text-sm text-[#6b7ea3] mt-1">
              Manage MCN chapters
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium transition"
          >
            <Plus size={16} />
            Add Chapter
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-[#162040] border border-white/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#6b7ea3] text-sm">
              Loading chapters...
            </div>
          ) : chapters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Building2 size={32} className="text-[#6b7ea3]" />
              <p className="text-[#6b7ea3] text-sm">No chapters yet</p>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
              >
                Create First Chapter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Chapter</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Location</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Meeting</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {chapters.map((chapter) => (
                    <tr key={chapter.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{chapter.name}</p>
                        <p className="text-xs text-[#6b7ea3] mt-0.5">{chapter.address}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">{chapter.city}</p>
                        <p className="text-xs text-[#6b7ea3]">{chapter.state}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">{chapter.meetingDay || "—"}</p>
                        <p className="text-xs text-[#6b7ea3]">{chapter.meetingTime || ""}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={chapter.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(chapter)}
                            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          {chapter.status === "ACTIVE" && (
                            <button
                              onClick={() => handleDeactivate(chapter.id)}
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
        <ChapterModal
          chapter={editTarget}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default Chapters;