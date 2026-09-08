import { useEffect, useState, useRef } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import {
  getPortalMeetings,
  registerPortalMeeting,
  uploadPortalMeetingPayment,
} from "../../services/portalMeetingService";
import qrImage from "../../assets/images/qr.png";
import {
  CalendarDays,
  Clock3,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
  Upload,
  X,
  CreditCard,
  Building2,
  IndianRupee,
  CheckCircle2,
  CalendarClock
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Modal for registering for a meeting & selecting payment method (Online vs Pay at Venue)
 */
const MeetingModal = ({ meeting, onClose, onSuccess }) => {
  const reg = meeting.registration;
  const isAlreadyRegistered = !!reg;

  const [paymentMethod, setPaymentMethod] = useState(
    reg?.utrNumber === "AT_VENUE" ? "AT_VENUE" : "ONLINE"
  );
  const [utrNumber, setUtrNumber] = useState(
    reg?.utrNumber && reg.utrNumber !== "AT_VENUE" ? reg.utrNumber : ""
  );
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const feeAmount = meeting.meetingFee ? Number(meeting.meetingFee) : 1000;
  const dateFormatted = new Date(meeting.meetingDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === "ONLINE" && !screenshot && !utrNumber.trim()) {
      toast.error("Please upload a payment screenshot or enter a UTR number");
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Register if not registered yet
      if (!isAlreadyRegistered) {
        await registerPortalMeeting(meeting.id);
      }

      // Step 2: Upload payment method/proof
      const formData = new FormData();
      formData.append("paymentMethod", paymentMethod);

      if (paymentMethod === "ONLINE") {
        if (screenshot) formData.append("paymentScreenshot", screenshot);
        if (utrNumber.trim()) formData.append("utrNumber", utrNumber.trim());
      }

      const res = await uploadPortalMeetingPayment(meeting.id, formData);
      toast.success(res.data?.message || "Registration updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to complete registration");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg sm:max-w-xl lg:max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0C831F]/15 text-[#22C55E] flex items-center justify-center font-bold text-sm shrink-0">
              <CalendarClock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-snug">
                {isAlreadyRegistered ? "Update Meeting Registration" : "Register for Meeting"}
              </h3>
              <p className="text-xs text-zinc-400">
                {meeting.chapter?.name ? `${meeting.chapter.name} · ` : ""}Event Details &amp; Registration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Detailed Meeting Info Card */}
          <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {meeting.chapter?.name && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold mb-2">
                    <Building2 size={12} className="text-[#22C55E]" />
                    {meeting.chapter.name}
                  </span>
                )}
                <h4 className="text-xl font-bold text-white leading-snug">{meeting.title}</h4>
              </div>
              <div className="bg-[#0C831F]/15 border border-[#0C831F]/30 rounded-xl px-3.5 py-1.5 text-right">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Registration Fee</p>
                <p className="text-lg font-bold text-[#22C55E]">₹{feeAmount.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Event Time & Location Grid */}
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-zinc-300 pt-2 border-t border-zinc-800/80">
              <div className="flex items-start gap-2.5">
                <CalendarDays size={16} className="text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-500 font-medium">Date &amp; Day</p>
                  <p className="text-zinc-200 font-semibold text-sm">{dateFormatted}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock3 size={16} className="text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-500 font-medium">Meeting Time</p>
                  <p className="text-zinc-200 font-semibold text-sm">{meeting.startTime} – {meeting.endTime}</p>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-2.5 pt-1">
                <MapPin size={16} className="text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-500 font-medium">Venue Address</p>
                  <p className="text-zinc-200 font-semibold text-sm leading-relaxed">{meeting.address || "Venue details will be shared soon."}</p>
                </div>
              </div>
            </div>

            {/* Description & Agenda if available */}
            {meeting.description && (
              <div className="pt-3 border-t border-zinc-800/80 space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">About Event</p>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">{meeting.description}</p>
              </div>
            )}

            {meeting.agenda && (
              <div className="pt-2 space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Event Agenda</p>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">{meeting.agenda}</p>
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Select How You Wish To Pay <span className="text-red-400">*</span>
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "ONLINE"
                    ? "border-[#22C55E] bg-green-950/30 text-white shadow-lg shadow-green-950/20"
                    : "border-zinc-800 bg-zinc-950/90 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="accent-[#22C55E] mt-1 w-4 h-4 shrink-0"
                />
                <div>
                  <p className="text-sm font-bold text-white">Pay Now (Online)</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Scan QR Code &amp; upload receipt or UTR number</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "AT_VENUE"
                    ? "border-amber-500 bg-amber-950/30 text-white shadow-lg shadow-amber-950/20"
                    : "border-zinc-800 bg-zinc-950/90 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="AT_VENUE"
                  checked={paymentMethod === "AT_VENUE"}
                  onChange={() => setPaymentMethod("AT_VENUE")}
                  className="accent-amber-500 mt-1 w-4 h-4 shrink-0"
                />
                <div>
                  <p className="text-sm font-bold text-white">Pay at Venue</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Pay ₹{feeAmount.toLocaleString("en-IN")} cash at the event venue</p>
                </div>
              </label>
            </div>
          </div>

          {/* Pay Now Inputs */}
          {paymentMethod === "ONLINE" && (
            <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 space-y-5">
              <div className="text-center space-y-2">
                <p className="text-xs text-zinc-300 font-medium">Scan QR Code to pay <span className="text-[#22C55E] font-bold">₹{feeAmount.toLocaleString("en-IN")}</span></p>
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="h-48 w-48 object-contain mx-auto rounded-xl border border-zinc-700 bg-white p-2.5 shadow-md"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">12-Digit UTR Number</label>
                  <input
                    type="text"
                    placeholder="Enter UTR / Txn ID"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-[#22C55E] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Payment Screenshot</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files[0])}
                    className="w-full text-zinc-400 text-xs file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-200 file:cursor-pointer hover:file:bg-zinc-700 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pay at Venue Confirmation */}
          {paymentMethod === "AT_VENUE" && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Building2 size={18} />
                <span>Pay Cash at Venue</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Your registration will be recorded. Please carry <strong>₹{feeAmount.toLocaleString("en-IN")}</strong> cash on the meeting day ({dateFormatted}).
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#0C831F] hover:bg-[#0A6F1A] disabled:opacity-60 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-green-950/40 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {paymentMethod === "ONLINE"
              ? isAlreadyRegistered ? "Submit Payment Proof" : "Register & Submit Payment Proof"
              : isAlreadyRegistered ? "Confirm Pay at Venue" : "Register & Pay at Venue"
            }
          </button>
        </form>
      </div>
    </div>
  );
};

const Meetings = () => {
  usePageTitle("My Meetings - MCN Portal");
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const res = await getPortalMeetings();
      setMeetings(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={32} className="animate-spin text-[#22C55E]" />
      </div>
    );
  }

  const now = new Date();
  const upcomingMeetings = meetings.filter((m) => new Date(m.meetingDate) >= now);
  const pastMeetings     = meetings.filter((m) => new Date(m.meetingDate) <  now);

  const getPaymentBadge = (reg) => {
    if (!reg) return null;
    if (reg.utrNumber === "AT_VENUE" && reg.paymentStatus === "PENDING") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">
          Pay at Venue (Pending)
        </span>
      );
    }
    switch (reg.paymentStatus) {
      case "PENDING":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            Payment Pending
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
            Proof Submitted
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
            <CheckCircle size={12} />
            Payment Verified
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400">
            Payment Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const renderCard = (meeting, isUpcoming) => {
    const reg = meeting.registration;
    const isRegistered = !!reg;
    const dateFormatted = new Date(meeting.meetingDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <div
        key={meeting.id}
        className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white leading-tight">{meeting.title}</h3>
            {getPaymentBadge(reg)}
          </div>

          <div className="space-y-2 text-sm text-zinc-400">
            <div className="flex items-center gap-2.5">
              <CalendarDays size={15} className="text-[#22C55E]" />
              <span>{dateFormatted}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock3 size={15} className="text-[#22C55E]" />
              <span>{meeting.startTime} – {meeting.endTime}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={15} className="text-[#22C55E]" />
              <span className="truncate">{meeting.address || "Venue TBA"}</span>
            </div>
            {meeting.meetingFee && (
              <div className="text-zinc-300 font-semibold pt-1 text-sm">
                Fee: <span className="text-[#22C55E]">₹{Number(meeting.meetingFee).toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isUpcoming ? (
            !isRegistered ? (
              <button
                onClick={() => setSelectedMeeting(meeting)}
                className="w-full py-2.5 bg-[#0C831F] hover:bg-[#0A6F1A] text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <CalendarClock size={16} />
                Register for Meeting
              </button>
            ) : (
              <div className="space-y-2">
                {reg.paymentStatus === "APPROVED" ? (
                  <div className="flex items-center justify-center gap-2 py-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 size={16} />
                    Registered &amp; Verified
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedMeeting(meeting)}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl border border-zinc-700 transition flex items-center justify-center gap-2"
                  >
                    <Upload size={14} />
                    {reg.paymentStatus === "REJECTED"
                      ? "Re-upload Payment Details"
                      : reg.paymentStatus === "SUBMITTED"
                      ? "Update Payment Proof"
                      : "Complete Payment / Choose Method"}
                  </button>
                )}
              </div>
            )
          ) : (
            <div className="text-xs text-zinc-500 text-center py-2 border-t border-zinc-800/80">
              {isRegistered ? "Registered (Past Event)" : "Not Registered"}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">My Meetings &amp; Events</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Register for chapter events, choose your payment method, and track registration status.
        </p>
      </div>

      {/* Upcoming */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center justify-between">
          <span>Upcoming Meetings</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-950/40 text-green-400 border border-green-800 font-normal">
            {upcomingMeetings.length} Scheduled
          </span>
        </h3>
        {upcomingMeetings.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-sm">
            No upcoming meetings scheduled for your chapter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMeetings.map((m) => renderCard(m, true))}
          </div>
        )}
      </div>

      {/* Past */}
      {pastMeetings.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">
            Past Meetings History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastMeetings.map((m) => renderCard(m, false))}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedMeeting && (
        <MeetingModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          onSuccess={loadMeetings}
        />
      )}
    </div>
  );
};

export default Meetings;
