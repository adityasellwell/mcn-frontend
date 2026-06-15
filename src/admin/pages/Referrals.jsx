import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { Plus, Trash2, X, GitMerge, ChevronDown } from "lucide-react";
import {
  fetchReferrals,
  fetchReferralStats,
  createReferral,
  updateReferralStatus,
  deleteReferral,
} from "../services/referralService";
import { fetchMembers } from "../services/memberService";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    OPEN:        "bg-blue-500/10 text-blue-400 border-blue-500/20",
    IN_PROGRESS: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    CLOSED:      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED:    "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] || map.OPEN}`}>
      {status.replace("_", " ")}
    </span>
  );
};

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────
const MiniStat = ({ label, value, color }) => (
  <div className="bg-[#162040] border border-white/5 rounded-xl p-4">
    <p className="text-xs text-[#6b7ea3] uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value ?? "—"}</p>
  </div>
);

// ─────────────────────────────────────────────
// Create Referral Modal
// ─────────────────────────────────────────────
const CreateModal = ({ members, onClose, onSave }) => {
  const [form, setForm] = useState({
    givenByMemberId:    "",
    receivedByMemberId: "",
    title:              "",
    description:        "",
    referralValue:      "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.givenByMemberId || !form.receivedByMemberId || !form.title) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.givenByMemberId === form.receivedByMemberId) {
      toast.error("Member cannot refer themselves");
      return;
    }

    setLoading(true);
    try {
      await createReferral({
        ...form,
        givenByMemberId:    Number(form.givenByMemberId),
        receivedByMemberId: Number(form.receivedByMemberId),
        referralValue:      form.referralValue ? Number(form.referralValue) : null,
      });
      toast.success("Referral created");
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
          <h2 className="text-lg font-semibold text-white">Create Referral</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Given By */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Given By *</label>
            <select
              name="givenByMemberId"
              value={form.givenByMemberId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
            >
              <option value="">Select Member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} — {m.memberCode}
                </option>
              ))}
            </select>
          </div>

          {/* Received By */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Received By *</label>
            <select
              name="receivedByMemberId"
              value={form.receivedByMemberId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
            >
              <option value="">Select Member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} — {m.memberCode}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Referral title"
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="Details about the referral"
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition resize-none"
            />
          </div>

          {/* Value */}
          <div>
            <label className="block text-xs text-[#6b7ea3] mb-1.5">Referral Value (₹)</label>
            <input
              type="number"
              name="referralValue"
              value={form.referralValue}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
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
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Referrals Page
// ─────────────────────────────────────────────
const Referrals = () => {
  usePageTitle("Referrals");
  const [referrals, setReferrals] = useState([]);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  // ─── Load data ───
  const loadData = async () => {
    setLoading(true);
    try {
      const [referralsRes, membersRes, statsRes] = await Promise.all([
        fetchReferrals(),
        fetchMembers(),
        fetchReferralStats(),
      ]);
      setReferrals(referralsRes.data.data);
      setMembers(membersRes.data.data);
      setStats(statsRes.data.data);
    } catch {
      toast.error("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Update status ───
  const handleStatusChange = async (id, status) => {
    try {
      await updateReferralStatus(id, status);
      toast.success("Status updated");
      loadData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ─── Delete referral ───
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this referral?")) return;
    try {
      await deleteReferral(id);
      toast.success("Referral deleted");
      loadData();
    } catch {
      toast.error("Failed to delete referral");
    }
  };

  // ─── Filter client-side ───
  const filtered = statusFilter
    ? referrals.filter((r) => r.status === statusFilter)
    : referrals;

  return (
    <>
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Referrals</h2>
            <p className="text-sm text-[#6b7ea3] mt-1">Track member referrals</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium transition"
          >
            <Plus size={16} />
            Add Referral
          </button>
        </div>

        {/* ── Stats Row ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MiniStat label="Total" value={stats.totalReferrals} color="text-white" />
            <MiniStat label="Open" value={stats.open} color="text-blue-400" />
            <MiniStat label="Closed" value={stats.closed} color="text-emerald-400" />
            <MiniStat label="Rejected" value={stats.rejected} color="text-rose-400" />
          </div>
        )}

        {/* ── Filter ── */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>
          {statusFilter && (
            <button
              onClick={() => setStatusFilter("")}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-[#6b7ea3] hover:text-white transition"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-[#162040] border border-white/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#6b7ea3] text-sm">
              Loading referrals...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <GitMerge size={32} className="text-[#6b7ea3]" />
              <p className="text-[#6b7ea3] text-sm">No referrals found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Title</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Given By</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Received By</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Value</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((referral) => (
                    <tr key={referral.id} className="hover:bg-white/[0.02] transition-colors">

                      {/* Title */}
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{referral.title}</p>
                        {referral.description && (
                          <p className="text-xs text-[#6b7ea3] mt-0.5 truncate max-w-[180px]">
                            {referral.description}
                          </p>
                        )}
                      </td>

                      {/* Given By */}
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">
                          {referral.givenByMember?.firstName} {referral.givenByMember?.lastName}
                        </p>
                        <p className="text-xs text-[#6b7ea3] font-mono">
                          {referral.givenByMember?.memberCode}
                        </p>
                      </td>

                      {/* Received By */}
                      <td className="px-5 py-4">
                        <p className="text-[#a8b8d4]">
                          {referral.receivedByMember?.firstName} {referral.receivedByMember?.lastName}
                        </p>
                        <p className="text-xs text-[#6b7ea3] font-mono">
                          {referral.receivedByMember?.memberCode}
                        </p>
                      </td>

                      {/* Value */}
                      <td className="px-5 py-4 text-[#a8b8d4]">
                        {referral.referralValue ? `₹${referral.referralValue}` : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={referral.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          {/* Status Dropdown */}
                          <select
                            value={referral.status}
                            onChange={(e) => handleStatusChange(referral.id, e.target.value)}
                            className="px-2 py-1.5 rounded-lg bg-[#0f1b3d] border border-white/10 text-xs text-white focus:outline-none transition"
                          >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="CLOSED">Closed</option>
                            <option value="REJECTED">Rejected</option>
                          </select>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(referral.id)}
                            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete"
                          >
                            <Trash2 size={15} />
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

      {/* ── Create Modal ── */}
      {modalOpen && (
        <CreateModal
          members={members}
          onClose={() => setModalOpen(false)}
          onSave={() => { setModalOpen(false); loadData(); }}
        />
      )}
    </>
  );
};

export default Referrals;