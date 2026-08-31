import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { usePortalAuth } from "../../context/PortalAuthContext";
import {
  getPortalReferrals,
  createPortalReferral,
  getPortalMembers,
} from "../../services/portalReferralService";
import {
  Handshake,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  IndianRupee,
  Plus,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const Referrals = () => {
  usePageTitle("My Referrals - MCN Portal");
  const { portalUser } = usePortalAuth();
  const [referrals, setReferrals] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // New referral form state
  const [receivedByMemberId, setReceivedByMemberId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [referralValue, setReferralValue] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [refRes, memRes] = await Promise.all([
        getPortalReferrals(),
        getPortalMembers(),
      ]);
      setReferrals(refRes.data?.data || []);
      setMembers(memRes.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load referrals or member list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receivedByMemberId) {
      toast.error("Please select a member to refer to");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a referral title");
      return;
    }

    try {
      setSubmitting(true);
      await createPortalReferral({
        receivedByMemberId,
        title: title.trim(),
        description: description.trim() || undefined,
        referralValue: referralValue ? parseFloat(referralValue) : undefined,
      });

      toast.success("Referral submitted successfully!");
      // Reset form
      setReceivedByMemberId("");
      setTitle("");
      setDescription("");
      setReferralValue("");
      setShowModal(false);

      // Reload list
      const refRes = await getPortalReferrals();
      setReferrals(refRes.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit referral");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={32} className="animate-spin text-zinc-500" />
      </div>
    );
  }

  const myId = portalUser?.id;
  const givenReferrals = referrals.filter((r) => r.givenByMemberId === myId);
  const receivedReferrals = referrals.filter((r) => r.receivedByMemberId === myId);

  const renderReferralCard = (ref, type) => {
    const dateFormatted = new Date(ref.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const isGiven = type === "given";
    const memberName = isGiven
      ? `${ref.receivedByMember?.firstName} ${ref.receivedByMember?.lastName || ""}`.trim()
      : `${ref.givenByMember?.firstName} ${ref.givenByMember?.lastName || ""}`.trim();

    return (
      <div
        key={ref.id}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 flex flex-col justify-between"
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-white leading-snug">{ref.title}</h4>
            {isGiven ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
                <ArrowUpRight size={13} />
                Given
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-blue-400 font-semibold bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full shrink-0">
                <ArrowDownLeft size={13} />
                Received
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-500">
            {isGiven ? "To:" : "From:"}{" "}
            <span className="text-zinc-300 font-medium">{memberName}</span>
          </p>

          {ref.description && <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{ref.description}</p>}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>{dateFormatted}</span>
          </div>
          {ref.referralValue && (
            <div className="flex items-center gap-0.5 text-zinc-300 font-semibold">
              <IndianRupee size={12} className="text-[#0C831F]" />
              <span>{ref.referralValue.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Business Referrals</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Give referrals to fellow members and track referrals received within the community.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="
            shrink-0 flex items-center justify-center gap-2
            px-4 py-2.5 rounded-xl bg-[#0C831F] hover:bg-[#0A6F1A]
            text-white text-sm font-semibold transition shadow-lg shadow-[#0C831F]/10
          "
        >
          <Plus size={16} />
          Give a Referral
        </button>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Given Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
            <ArrowUpRight size={18} className="text-emerald-400" />
            Referrals Given ({givenReferrals.length})
          </h3>
          {givenReferrals.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-sm">
              You haven't given any referrals yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {givenReferrals.map((r) => renderReferralCard(r, "given"))}
            </div>
          )}
        </div>

        {/* Received Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
            <ArrowDownLeft size={18} className="text-blue-400" />
            Referrals Received ({receivedReferrals.length})
          </h3>
          {receivedReferrals.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-sm">
              No referrals received yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {receivedReferrals.map((r) => renderReferralCard(r, "received"))}
            </div>
          )}
        </div>
      </div>

      {/* Give a Referral Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Handshake size={20} className="text-[#0C831F]" />
                Give a Referral
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
                  Select Member <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={receivedByMemberId}
                  onChange={(e) => setReceivedByMemberId(e.target.value)}
                  className="
                    w-full bg-zinc-950 border border-zinc-800 rounded-xl
                    px-4 py-2.5 text-sm text-white outline-none focus:border-[#0C831F]
                  "
                >
                  <option value="">Choose a Member</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName || ""} ({m.memberCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
                  Referral Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Website development project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="
                    w-full bg-zinc-950 border border-zinc-800 rounded-xl
                    px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                    outline-none focus:border-[#0C831F]
                  "
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
                  Estimated Value <span className="text-zinc-500">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                    ₹
                  </div>
                  <input
                    type="number"
                    placeholder="Estimated deal value"
                    value={referralValue}
                    onChange={(e) => setReferralValue(e.target.value)}
                    className="
                      w-full bg-zinc-950 border border-zinc-800 rounded-xl
                      pl-8 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                      outline-none focus:border-[#0C831F]
                    "
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
                  Description <span className="text-zinc-500">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide any relevant details about the referral opportunity..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="
                    w-full bg-zinc-950 border border-zinc-800 rounded-xl
                    px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                    outline-none focus:border-[#0C831F] resize-none
                  "
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="
                    px-5 py-2.5 text-sm font-semibold rounded-xl
                    border border-zinc-800 hover:bg-zinc-800 text-zinc-400 transition
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    px-5 py-2.5 text-sm font-semibold rounded-xl
                    bg-[#0C831F] hover:bg-[#0A6F1A] text-white transition
                    flex items-center justify-center gap-1.5
                  "
                >
                  {submitting && <Loader2 size={15} className="animate-spin" />}
                  Submit Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;
