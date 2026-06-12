import { useEffect, useState } from "react";
import {
  Eye, CheckCircle, XCircle,
  Download, Search, Filter,
  X, ExternalLink
} from "lucide-react";
import {
  fetchApplications,
  fetchApplicationById,
  approveApplication,
  rejectApplication,
  exportApplications,
} from "../services/applicationService";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Status Badge Component
// ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    PENDING:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
        map[status] || map.PENDING
      }`}
    >
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────
// Type Badge Component
// ─────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const map = {
    MEMBER:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
    VISITOR: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    GUEST:   "bg-slate-500/10 text-slate-400 border-slate-500/20",
    OTHER:   "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
        map[type] || map.OTHER
      }`}
    >
      {type}
    </span>
  );
};

// ─────────────────────────────────────────────
// View Application Modal
// ─────────────────────────────────────────────
const ApplicationModal = ({ application, onClose, onApprove, onReject }) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1b3d] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Application Details
            </h2>
            <p className="text-xs text-[#6b7ea3] mt-0.5">
              Submitted on{" "}
              {new Date(application.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Status + Type Row */}
          <div className="flex items-center gap-3">
            <StatusBadge status={application.status} />
            <TypeBadge type={application.registrationType} />
          </div>

          {/* Personal Info */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
              Personal Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" value={application.fullName} />
              <Field label="Mobile" value={application.mobile} />
              <Field label="Email" value={application.email} />
              <Field label="Chapter" value={application.chapterName} />
            </div>
          </div>

          {/* Business Info */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
              Business Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company" value={application.companyName} />
              <Field label="Category" value={application.businessCategory} />
              <Field label="Address" value={application.address} />
              {application.website && (
                <Field label="Website" value={application.website} />
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
              Payment Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="UTR Number"
                value={application.utrNumber || "Not provided"}
              />
            </div>

            {/* Meeting Info */}
              {application.meetingId && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
                    Meeting
                  </p>
                  <Field label="Meeting ID" value={`#${application.meetingId}`} />
                </div>
              )}

            {/* Payment Screenshot */}
            {application.paymentScreenshot && (
              <div className="mt-3">
                <p className="text-xs text-[#6b7ea3] mb-2">
                  Payment Screenshot
                </p>
                <a
                  href={application.paymentScreenshot}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  <ExternalLink size={14} />
                  View Screenshot
                </a>
              </div>
            )}
          </div>
          {/* Referred By */}
          {application.referredBy && (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
                Referred By
              </p>
              <Field label="Referrer" value={application.referredBy} />
            </div>
          )}
        </div>

        {/* Social Profiles */}
          {application.socialProfiles &&
            Array.isArray(application.socialProfiles) &&
            application.socialProfiles.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#6b7ea3] font-medium mb-3">
                Social Profiles
              </p>
              <div className="space-y-2">
                {application.socialProfiles.map((profile, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-[#6b7ea3] w-20 shrink-0">
                      {profile.platform}
                    </span>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition truncate"
                    >
                      {profile.url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Modal Footer — Actions */}
        {application.status === "PENDING" && (
          <div className="flex items-center gap-3 p-6 border-t border-white/5">
            <button
              onClick={() => onApprove(application.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-sm font-medium transition"
            >
              <CheckCircle size={16} />
              Approve
            </button>
            <button
              onClick={() => onReject(application.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-sm font-medium transition"
            >
              <XCircle size={16} />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Field Helper Component
// ─────────────────────────────────────────────
const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-[#6b7ea3] mb-1">{label}</p>
    <p className="text-sm text-white">{value || "—"}</p>
  </div>
);

// ─────────────────────────────────────────────
// Main Applications Page
// ─────────────────────────────────────────────
const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ─── Filter State ───
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // ─── Load Applications ───
  const loadApplications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;

      const res = await fetchApplications(params);
      setApplications(res.data.data);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // Reload when filters change
  useEffect(() => {
    loadApplications();
  }, [statusFilter, typeFilter]);

  // ─── Search on Enter ───
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") loadApplications();
  };

  // ─── Open Modal ───
  const handleView = async (id) => {
    try {
      const res = await fetchApplicationById(id);
      setSelected(res.data.data);
    } catch {
      toast.error("Failed to load application details");
    }
  };

  // ─── Approve ───
  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await approveApplication(id);
      toast.success("Application approved");
      setSelected(null);
      loadApplications();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to approve"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Reject ───
  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      await rejectApplication(id);
      toast.success("Application rejected");
      setSelected(null);
      loadApplications();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to reject"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Export Excel ───
  const handleExport = async () => {
    try {
      const res = await exportApplications();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "applications.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export downloaded");
    } catch {
      toast.error("Export failed");
    }
  };

  // ─── Clear Filters ───
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
  };

  const hasFilters = search || statusFilter || typeFilter;

  return (
    <>
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Applications</h2>
            <p className="text-sm text-[#6b7ea3] mt-1">
              Manage registration applications
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#162040] hover:bg-[#1e2d55] border border-white/10 text-sm text-white font-medium transition"
          >
            <Download size={16} />
            Export Excel
          </button>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7ea3]"
            />
            <input
              type="text"
              placeholder="Search name, email, mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white placeholder-[#6b7ea3] focus:outline-none focus:border-white/20 transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#162040] border border-white/10 text-sm text-white focus:outline-none focus:border-white/20 transition"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
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
            <option value="GUEST">Guest</option>
          </select>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-[#6b7ea3] hover:text-white transition"
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
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-[#6b7ea3] text-sm">
              No applications found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">

                {/* Table Head */}
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">
                      Chapter
                    </th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-5 py-4 text-xs font-medium text-[#6b7ea3] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-white/5">
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-white font-medium">
                            {app.fullName}
                          </p>
                          <p className="text-xs text-[#6b7ea3] mt-0.5">
                            {app.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#a8b8d4]">
                        {app.mobile}
                      </td>
                      <td className="px-5 py-4 text-[#a8b8d4]">
                        {app.chapterName || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <TypeBadge type={app.registrationType} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-5 py-4 text-[#6b7ea3]">
                        {new Date(app.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          {/* View */}
                          <button
                            onClick={() => handleView(app.id)}
                            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Quick Approve */}
                          {app.status === "PENDING" && (
                            <button
                              onClick={() => handleApprove(app.id)}
                              disabled={actionLoading}
                              className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-emerald-400 hover:bg-emerald-500/10 transition"
                              title="Approve"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}

                          {/* Quick Reject */}
                          {app.status === "PENDING" && (
                            <button
                              onClick={() => handleReject(app.id)}
                              disabled={actionLoading}
                              className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Reject"
                            >
                              <XCircle size={15} />
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
      {selected && (
        <ApplicationModal
          application={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
};

export default Applications;