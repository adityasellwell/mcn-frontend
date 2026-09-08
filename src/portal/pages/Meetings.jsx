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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950">
          <div>
            <h3 className="text-lg font-bold text-white leading-snug">
              {isAlreadyRegistered ? "Update Meeting Registration" : "Register for Meeting"}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{meeting.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Summary Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2 text-zinc-400">
              <CalendarDays size={14} className="text-[#22C55E]" />
              <span>{dateFormatted} ({meeting.startTime} – {meeting.endTime})</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin size={14} className="text-[#22C55E]" />
              <span className="truncate">{meeting.address || "Venue Details"}</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/80">
              <IndianRupee size={14} className="text-[#22C55E]" />
              <span className="font-semibold text-white">
                Registration Fee: <span className="text-[#22C55E]">₹{feeAmount.toLocaleString("en-IN")}</span>
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Payment Method <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "ONLINE"
                    ? "border-[#22C55E] bg-green-950/20 text-white"
                    : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="accent-[#22C55E] mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-white">Pay Now (Online)</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Scan QR & upload receipt/UTR</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "AT_VENUE"
                    ? "border-amber-500 bg-amber-950/20 text-white"
                    : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="AT_VENUE"
                  checked={paymentMethod === "AT_VENUE"}
                  onChange={() => setPaymentMethod("AT_VENUE")}
                  className="accent-amber-500 mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-white">Pay at Venue</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Bring cash on event day</p>
                </div>
              </label>
            </div>
          </div>

          {/* Pay Now Section */}
          {paymentMethod === "ONLINE" && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-zinc-400">Scan QR Code to pay ₹{feeAmount.toLocaleString("en-IN")}</p>
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="h-44 w-44 object-contain mx-auto rounded-lg border border-zinc-800 bg-white p-2"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">12-Digit UTR Number</label>
                <input
                  type="text"
                  placeholder="Enter UTR / Transaction ID"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-[#22C55E]"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Payment Screenshot</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files[0])}
                  className="w-full text-zinc-400 text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-200 file:cursor-pointer hover:file:bg-zinc-700"
                />
              </div>
            </div>
          )}

          {/* Pay at Venue Section */}
          {paymentMethod === "AT_VENUE" && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <Building2 size={16} />
                <span>Pay Cash at Venue</span>
              </div>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Your registration will be recorded. Please bring <strong>₹{feeAmount.toLocaleString("en-IN")}</strong> cash to the meeting venue.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#0C831F] hover:bg-[#0A6F1A] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
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
