import { useEffect, useState } from "react";
import { Plus, Pencil, Eye, UserX, X, Users } from "lucide-react";
import {
  fetchMembers,
  fetchMemberById,
  createMember,
  updateMember,
  updateMemberStatus,
} from "../services/memberService";
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
// Field Helper
// ─────────────────────────────────────────────
const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-[#6b7ea3] mb-1">{label}</p>
    <p className="text-sm text-white">{value || "—"}</p>
  </div>
);

// ─────────────────────────────────────────────
// View Member Modal
// ─────────────────────────────────────────────
const ViewModal = ({ member, onClose, onStatusChange }) => {
  if (!member) return null;

  const handleDeactivate = async () => {
    if (!window.confirm("Deactivate this member?")) return;
    try {
      await updateMemberStatus(member.id, "INACTIVE");
      toast.success("Member deactivated");
      onStatusChange();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleActivate = async () => {
    try {
      await updateMemberStatus(member.id, "ACTIVE");
      toast.success("Member activated");
      onStatusChange();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1b3d] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {member.firstName} {member.lastName}
            </h2>
            <p className="text-xs text-[#6b7ea3] mt-0.5">{member.memberCode}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Status */}
          <div className="flex items-center gap-3">
            <StatusBadge status={member.status} />
            <span className="text-xs text-[#6b7ea3]">
              {member.chapter?.name} — {member.chapter?.city}
            </span>
          </div>

          {/* Personal */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
              Personal Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" value={member.firstName} />
              <Field label="Last Name" value={member.lastName} />
              <Field label="Email" value={member.email} />
              <Field label="Phone" value={member.phone} />
            </div>
          </div>

          {/* Business */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
              Business Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company" value={member.companyName} />
              <Field label="Profession" value={member.profession} />
              <Field label="Category" value={member.businessCategory} />
              <Field label="Website" value={member.website} />
            </div>
          </div>

          {/* Membership */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
              Membership
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Member Code" value={member.memberCode} />
              <Field label="Chapter" value={member.chapter?.name} />
              <Field
                label="Start Date"
                value={member.membershipStart
                  ? new Date(member.membershipStart).toLocaleDateString("en-IN")
                  : null}
              />
              <Field
                label="Expiry Date"
                value={member.membershipExpiry
                  ? new Date(member.membershipExpiry).toLocaleDateString("en-IN")
                  : null}
              />
            </div>
          </div>

          {/* Chapter Roles */}
          {member.chapterRoles?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
                Chapter Roles
              </p>
              <div className="flex flex-wrap gap-2">
                {member.chapterRoles.map((r) => (
                  <span key={r.id} className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {r.role.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-white/5">
          {member.status === "ACTIVE" ? (
            <button
              onClick={handleDeactivate}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-sm font-medium transition"
            >
              <UserX size={16} />
              Deactivate
            </button>
          ) : (
            <button
              onClick={handleActivate}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-sm font-medium transition"
            >
              Activate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Member Form Modal — Create & Edit
// ─────────────────────────────────────────────
const MemberModal = ({ member, chapters, onClose, onSave }) => {
  const isEdit = !!member?.id;

  const [form, setForm] = useState({
    chapterId:        member?.chapterId        || "",
    firstName:        member?.firstName        || "",
    lastName:         member?.lastName         || "",
    email:            member?.email            || "",
    phone:            member?.phone            || "",
    companyName:      member?.companyName      || "",
    profession:       member?.profession       || "",
    businessCategory: member?.businessCategory || "",
    website:          member?.website          || "",
    membershipStart:  member?.membershipStart
      ? new Date(member.membershipStart).toISOString().split("T")[0]
      : "",
    membershipExpiry: member?.membershipExpiry
      ? new Date(member.membershipExpiry).toISOString().split("T")[0]
      : "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ─── Validation ───
    if (!form.chapterId || !form.firstName || !form.email || !form.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        chapterId: Number(form.chapterId),
        membershipStart:  form.membershipStart  || null,
        membershipExpiry: form.membershipExpiry || null,
        website:          form.website          || null,
      };

      if (isEdit) {
        await updateMember(member.id, payload);
        toast.success("Member updated successfully");
      } else {
        await createMember(payload);
        toast.success("Member created successfully");
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
            {isEdit ? "Edit Member" : "Create Member"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Chapter */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Chapter *</label>
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
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Email *</label>
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
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Company *</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Acme Pvt Ltd"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Profession *</label>
              <input
                name="profession"
                value={form.profession}
                onChange={handleChange}
                placeholder="Consultant"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
          </div>

          {/* Business Category + Website */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Business Category *</label>
              <input
                name="businessCategory"
                value={form.businessCategory}
                onChange={handleChange}
                placeholder="Finance"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Website</label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
              />
            </div>
          </div>

          {/* Membership Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Membership Start</label>
              <input
                type="date"
                name="membershipStart"
                value={form.membershipStart}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b7ea3] mb-1.5">Membership Expiry</label>
              <input
                type="date"
                name="membershipExpiry"
                value={form.membershipExpiry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
              />
            </div>
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
// Main Members Page
// ─────────────────────────────────────────────
const Members = () => {
  const [members, setMembers] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTarget, setViewTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ─── Load members and chapters ───
  const loadData = async () => {
    setLoading(true);
    try {
      const [membersRes, chaptersRes] = await Promise.all([
        fetchMembers(),
        fetchChapters(),
      ]);
      setMembers(membersRes.data.data);
      setChapters(chaptersRes.data.data);
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Open view modal ───
  const handleView = async (id) => {
    try {
      const res = await fetchMemberById(id);
      setViewTarget(res.data.data);
    } catch {
      toast.error("Failed to load member details");
    }
  };

  // ─── Open edit modal ───
  const handleEdit = (member) => {
    setEditTarget(member);
    setModalOpen(true);
  };

  // ─── After form save ───
  const handleSave = () => {
    setModalOpen(false);
    setEditTarget(null);
    loadData();
  };

  // ─── After status change in view modal ───
  const handleStatusChange = () => {
    setViewTarget(null);
    loadData();
  };

  return (
    <>
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Members</h2>
            <p className="text-sm text-[#6b7ea3] mt-1">Manage MCN members</p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium transition"
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-[#162040] border border-white/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#6b7ea3] text-sm">
              Loading members...
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Users size={32} className="text-[#6b7ea3]" />
              <p className="text-[#6b7ea3] text-sm">No members yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Member</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Code</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Chapter</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Business</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-[#6b7ea3] mt-0.5">{member.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-[#a8b8d4] font-mono">
                          {member.memberCode}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">{member.chapter?.name}</p>
                        <p className="text-xs text-[#6b7ea3]">{member.chapter?.city}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">{member.companyName}</p>
                        <p className="text-xs text-[#6b7ea3]">{member.businessCategory}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(member.id)}
                            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleEdit(member)}
                            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
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
          member={viewTarget}
          onClose={() => setViewTarget(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <MemberModal
          member={editTarget}
          chapters={chapters}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default Members;