import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import {
  CheckCircle, XCircle, ExternalLink,
  CreditCard, Filter, X
} from "lucide-react";
import {
  fetchAllPayments,
  approveMemberPayment,
  rejectMemberPayment,
  approveVisitorPayment,
  rejectVisitorPayment,
} from "../services/paymentService";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Payment Status Badge
// ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    PENDING:   "bg-slate-500/10 text-slate-400 border-slate-500/20",
    SUBMITTED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    APPROVED:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED:  "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] || map.PENDING}`}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────
// Type Badge
// ─────────────────────────────────────────────
const TypeBadge = ({ type }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
    type === "MEMBER"
      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
      : "bg-purple-500/10 text-purple-400 border-purple-500/20"
  }`}>
    {type}
  </span>
);

// ─────────────────────────────────────────────
// Main Payments Page
// ─────────────────────────────────────────────
const Payments = () => {
  usePageTitle("Payments");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // ─── Load payments ───
  const loadPayments = async () => {
    setLoading(true);
    try {
      const res = await fetchAllPayments();
      setPayments(res.data.data);
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // ─── Approve payment ───
  const handleApprove = async (payment) => {
    if (!window.confirm("Approve this payment?")) return;
    setActionLoading(true);
    try {
      if (payment.paymentType === "MEMBER") {
        await approveMemberPayment(payment.id);
      } else {
        await approveVisitorPayment(payment.id);
      }
      toast.success("Payment approved");
      loadPayments();
    } catch {
      toast.error("Failed to approve payment");
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Reject payment ───
  const handleReject = async (payment) => {
    if (!window.confirm("Reject this payment?")) return;
    setActionLoading(true);
    try {
      if (payment.paymentType === "MEMBER") {
        await rejectMemberPayment(payment.id);
      } else {
        await rejectVisitorPayment(payment.id);
      }
      toast.success("Payment rejected");
      loadPayments();
    } catch {
      toast.error("Failed to reject payment");
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Get person name from payment ───
  const getPersonName = (payment) => {
    if (payment.paymentType === "MEMBER") {
      return `${payment.member?.firstName} ${payment.member?.lastName}`;
    }
    return `${payment.visitor?.firstName} ${payment.visitor?.lastName || ""}`;
  };

  // ─── Filter payments client-side ───
  const filtered = payments.filter((p) => {
    if (statusFilter && p.paymentStatus !== statusFilter) return false;
    if (typeFilter && p.paymentType !== typeFilter) return false;
    return true;
  });

  const hasFilters = statusFilter || typeFilter;

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Payments</h2>
          <p className="text-sm text-[#6b7ea3] mt-1">
            Review and manage member and visitor payments
          </p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
        >
          <option value="">All Types</option>
          <option value="MEMBER">Member</option>
          <option value="VISITOR">Visitor</option>
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={() => { setStatusFilter(""); setTypeFilter(""); }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-[#6b7ea3] hover:text-white transition"
          >
            <X size={14} />
            Clear
          </button>
        )}

        {/* Count */}
        <span className="ml-auto text-xs text-[#6b7ea3]">
          {filtered.length} payment{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#162040] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#6b7ea3] text-sm">
            Loading payments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CreditCard size={32} className="text-[#6b7ea3]" />
            <p className="text-[#6b7ea3] text-sm">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Person</th>
                  <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Meeting</th>
                  <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Type</th>
                  <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">UTR</th>
                  <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Screenshot</th>
                  <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((payment) => (
                  <tr key={`${payment.paymentType}-${payment.id}`} className="hover:bg-white/[0.02] transition-colors">

                    {/* Person */}
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{getPersonName(payment)}</p>
                      <p className="text-xs text-[#6b7ea3] mt-0.5">
                        {new Date(payment.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </td>

                    {/* Meeting */}
                    <td className="px-5 py-4">
                      <p className="text-[#a8b8d4]">{payment.meeting?.title || "—"}</p>
                      <p className="text-xs text-[#6b7ea3]">
                        {payment.meeting?.meetingDate
                          ? new Date(payment.meeting.meetingDate).toLocaleDateString("en-IN")
                          : ""}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <TypeBadge type={payment.paymentType} />
                    </td>

                    {/* UTR */}
                    <td className="px-5 py-4">
                      <p className="text-[#a8b8d4] font-mono text-xs">
                        {payment.utrNumber || "—"}
                      </p>
                    </td>

                    {/* Screenshot */}
                    <td className="px-5 py-4">
                      {payment.paymentScreenshot ? (
                        <a
                          href={payment.paymentScreenshot}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition"
                        >
                          <ExternalLink size={13} />
                          View
                        </a>
                      ) : (
                        <span className="text-xs text-[#6b7ea3]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={payment.paymentStatus} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      {payment.paymentStatus === "SUBMITTED" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(payment)}
                            disabled={actionLoading}
                            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-emerald-400 hover:bg-emerald-500/10 transition"
                            title="Approve"
                          >
                            <CheckCircle size={15} />
                          </button>
                          <button
                            onClick={() => handleReject(payment)}
                            disabled={actionLoading}
                            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Reject"
                          >
                            <XCircle size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;