import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { Plus, Eye, Pencil, Trash2, X, UserCheck, ArrowRightLeft } from "lucide-react";
import {
  fetchVisitors,
  fetchVisitorById,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  convertVisitor,
} from "../services/visitorService";
import { fetchChapters } from "../services/chapterService";
import { fetchMembers } from "../services/memberService";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    LEAD:              "bg-slate-500/10 text-slate-400 border-slate-500/20",
    INVITED:           "bg-blue-500/10 text-blue-400 border-blue-500/20",
    REGISTERED:        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    PAYMENT_SUBMITTED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    PAID:              "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    ATTENDED:          "bg-purple-500/10 text-purple-400 border-purple-500/20",
    CONVERTED:         "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED:          "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] || map.LEAD}`}>
      {status.replace("_", " ")}
    </span>
  );
};

// ─────────────────────────────────────────────
// Field Helper
// ─────────────────────────────────────────────
const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-[#6b7ea3] mb-1">{label}</p>
    <p className="text-sm text-white">{value || "—"}</p>
  </div>
);

// ─────────────────────────────────────────────
// Convert Modal — Select Chapter
// ─────────────────────────────────────────────
const ConvertModal = ({ visitor, chapters, onClose, onConverted }) => {
  const [chapterId, setChapterId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!chapterId) {
      toast.error("Please select a chapter");
      return;
    }
    setLoading(true);
    try {
      await convertVisitor(visitor.id, chapterId);
      toast.success("Visitor converted to member");
      onConverted();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1b3d] border border-white/10 rounded-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-lg font-semibold text-white">Convert to Member</h2>
            <p className="text-xs text-[#6b7ea3] mt-0.5">
              {visitor.firstName} {visitor.lastName}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">
              Select Chapter *
            </label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
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

          <p className="text-xs text-[#6b7ea3]">
            This will create a new member record and mark the visitor as converted.
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-[#6b7ea3] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConvert}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium transition"
            >
              {loading ? "Converting..." : "Convert"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// View Visitor Modal
// ─────────────────────────────────────────────
const ViewModal = ({ visitor, chapters, onClose, onConvert, onDelete }) => {
  if (!visitor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1b3d] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {visitor.firstName} {visitor.lastName || ""}
            </h2>
            <p className="text-xs text-[#6b7ea3] mt-0.5">
              Source: {visitor.source}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Status */}
          <StatusBadge status={visitor.status} />

          {/* Personal */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
              Personal Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" value={visitor.firstName} />
              <Field label="Last Name" value={visitor.lastName} />
              <Field label="Email" value={visitor.email} />
              <Field label="Phone" value={visitor.phone} />
            </div>
          </div>

          {/* Business */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
              Business Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company" value={visitor.companyName} />
              <Field label="Profession" value={visitor.profession} />
              <Field label="Category" value={visitor.businessCategory} />
            </div>
          </div>

          {/* Referral */}
          {visitor.referredByMember && (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
                Referred By
              </p>
              <Field
                label="Member"
                value={`${visitor.referredByMember.firstName} ${visitor.referredByMember.lastName}`}
              />
            </div>
          )}

          {/* Notes */}
          {visitor.notes && (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
                Notes
              </p>
              <p className="text-sm text-white">{visitor.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {visitor.status !== "CONVERTED" && (
          <div className="flex items-center gap-3 p-6 border-t border-white/5">
            <button
              onClick={() => onConvert(visitor)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-sm font-medium transition"
            >
              <ArrowRightLeft size={16} />
              Convert to Member
            </button>
            <button
              onClick={() => onDelete(visitor.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-sm font-medium transition"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Visitor Form Modal — Create & Edit
// ─────────────────────────────────────────────
const VisitorModal = ({ visitor, members, onClose, onSave }) => {
  const isEdit = !!visitor?.id;

  const [form, setForm] = useState({
    firstName:        visitor?.firstName        || "",
    lastName:         visitor?.lastName         || "",
    email:            visitor?.email            || "",
    phone:            visitor?.phone            || "",
    companyName:      visitor?.companyName      || "",
    profession:       visitor?.profession       || "",
    businessCategory: visitor?.businessCategory || "",
    source:           visitor?.source           || "ADMIN",
    referredByMemberId: visitor?.referredByMemberId || "",
    notes:            visitor?.notes            || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.phone) {
      toast.error("First name and phone are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        referredByMemberId: form.referredByMemberId
          ? Number(form.referredByMemberId)
          : null,
      };

      if (isEdit) {
        await updateVisitor(visitor.id, payload);
        toast.success("Visitor updated");
      } else {
        await createVisitor(payload);
        toast.success("Visitor created");
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
            {isEdit ? "Edit Visitor" : "Add Visitor"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">First Name *</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Phone *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
          </div>

          {/* Company + Profession */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Company</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Acme Pvt Ltd"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Profession</label>
              <input
                name="profession"
                value={form.profession}
                onChange={handleChange}
                placeholder="Consultant"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
          </div>

          {/* Business Category */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Business Category</label>
            <input
              name="businessCategory"
              value={form.businessCategory}
              onChange={handleChange}
              placeholder="Finance"
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
            />
          </div>

          {/* Source */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Source</label>
            <select
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
            >
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
              <option value="WEBSITE">Website</option>
            </select>
          </div>

          {/* Referred By Member */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Referred By Member</label>
            <select
              name="referredByMemberId"
              value={form.referredByMemberId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
            >
              <option value="">None</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} — {m.memberCode}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional notes"
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
// Main Visitors Page
// ─────────────────────────────────────────────
const Visitors = () => {
  usePageTitle("Visitors");
  const [visitors, setVisitors] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTarget, setViewTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [convertTarget, setConvertTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ─── Load all data ───
  const loadData = async () => {
    setLoading(true);
    try {
      const [visitorsRes, chaptersRes, membersRes] = await Promise.all([
        fetchVisitors(),
        fetchChapters(),
        fetchMembers(),
      ]);
      setVisitors(visitorsRes.data.data);
      setChapters(chaptersRes.data.data);
      setMembers(membersRes.data.data);
    } catch {
      toast.error("Failed to load visitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── View visitor ───
  const handleView = async (id) => {
    try {
      const res = await fetchVisitorById(id);
      setViewTarget(res.data.data);
    } catch {
      toast.error("Failed to load visitor");
    }
  };

  // ─── Delete visitor ───
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this visitor?")) return;
    try {
      await deleteVisitor(id);
      toast.success("Visitor deleted");
      setViewTarget(null);
      loadData();
    } catch {
      toast.error("Failed to delete visitor");
    }
  };

  // ─── Open convert modal ───
  const handleConvert = (visitor) => {
    setViewTarget(null);
    setConvertTarget(visitor);
  };

  // ─── After conversion ───
  const handleConverted = () => {
    setConvertTarget(null);
    loadData();
  };

  // ─── After form save ───
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
            <h2 className="text-2xl font-bold text-white">Visitors</h2>
            <p className="text-sm text-[#6b7ea3] mt-1">Manage MCN visitors</p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium transition"
          >
            <Plus size={16} />
            Add Visitor
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-[#162040] border border-white/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#6b7ea3] text-sm">
              Loading visitors...
            </div>
          ) : visitors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <UserCheck size={32} className="text-[#6b7ea3]" />
              <p className="text-[#6b7ea3] text-sm">No visitors yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Visitor</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Contact</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Business</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Source</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {visitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">
                          {visitor.firstName} {visitor.lastName || ""}
                        </p>
                        <p className="text-xs text-[#6b7ea3] mt-0.5">
                          {new Date(visitor.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">{visitor.phone}</p>
                        <p className="text-xs text-[#6b7ea3]">{visitor.email || "—"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">{visitor.companyName || "—"}</p>
                        <p className="text-xs text-[#6b7ea3]">{visitor.businessCategory || "—"}</p>
                      </td>
                      <td className="px-5 py-4 text-[#a8b8d4]">
                        {visitor.source}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={visitor.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* View */}
                          <button
                            onClick={() => handleView(visitor.id)}
                            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => { setEditTarget(visitor); setModalOpen(true); }}
                            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          {/* Convert */}
                          {visitor.status !== "CONVERTED" && (
                            <button
                              onClick={() => setConvertTarget(visitor)}
                              className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-emerald-400 hover:bg-emerald-500/10 transition"
                              title="Convert to Member"
                            >
                              <ArrowRightLeft size={15} />
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

      {/* ── View Modal ── */}
      {viewTarget && (
        <ViewModal
          visitor={viewTarget}
          chapters={chapters}
          onClose={() => setViewTarget(null)}
          onConvert={handleConvert}
          onDelete={handleDelete}
        />
      )}

      {/* ── Convert Modal ── */}
      {convertTarget && (
        <ConvertModal
          visitor={convertTarget}
          chapters={chapters}
          onClose={() => setConvertTarget(null)}
          onConverted={handleConverted}
        />
      )}

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <VisitorModal
          visitor={editTarget}
          members={members}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default Visitors;