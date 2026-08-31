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
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";

const Meetings = () => {
  usePageTitle("My Meetings - MCN Portal");
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [submittingPaymentId, setSubmittingPaymentId] = useState(null);
  const [showPaymentFormId, setShowPaymentFormId] = useState(null);

  // Payment form state
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleRegister = async (meetingId) => {
    try {
      setRegisteringId(meetingId);
      const res = await registerPortalMeeting(meetingId);
      toast.success(res.data?.message || "Registered successfully!");
      await loadMeetings();
      setShowPaymentFormId(meetingId); // Open payment form directly after registration
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setRegisteringId(null);
    }
  };

  const handlePaymentSubmit = async (e, meetingId) => {
    e.preventDefault();

    if (!screenshot && !utrNumber.trim()) {
      toast.error("Please upload a payment screenshot or enter a UTR number");
      return;
    }

    const formData = new FormData();
    if (screenshot) {
      formData.append("paymentScreenshot", screenshot);
    }
    if (utrNumber.trim()) {
      formData.append("utrNumber", utrNumber.trim());
    }

    try {
      setSubmittingPaymentId(meetingId);
      const res = await uploadPortalMeetingPayment(meetingId, formData);
      toast.success(res.data?.message || "Payment proof submitted successfully!");
      setUtrNumber("");
      setScreenshot(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowPaymentFormId(null);
      await loadMeetings();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit payment proof");
    } finally {
      setSubmittingPaymentId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={32} className="animate-spin text-zinc-500" />
      </div>
    );
  }

  const now = new Date();
  const upcomingMeetings = meetings.filter((m) => new Date(m.meetingDate) >= now);
  const pastMeetings = meetings.filter((m) => new Date(m.meetingDate) < now);

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            Payment Pending
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
            Payment Submitted
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 border border-green-500/30 text-green-400">
            Payment Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400">
            Payment Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getAttendanceBadge = (status) => {
    switch (status) {
      case "PRESENT":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 border border-green-500/30 text-green-400">
            Present
          </span>
        );
      case "ABSENT":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400">
            Absent
          </span>
        );
      case "LATE":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            Late
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-500">
            No Attendance Marked
          </span>
        );
    }
  };

  const renderMeetingCard = (meeting, isUpcoming) => {
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
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-white leading-tight">
              {meeting.title}
            </h3>
            {isRegistered && getPaymentStatusBadge(reg.paymentStatus)}
          </div>

          <div className="space-y-2.5 text-sm text-zinc-400">
            <div className="flex items-center gap-2.5">
              <CalendarDays size={16} className="text-[#0C831F]" />
              <span>{dateFormatted}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock3 size={16} className="text-[#0C831F]" />
              <span>
                {meeting.startTime} – {meeting.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={16} className="text-[#0C831F]" />
              <span className="truncate">{meeting.address}</span>
            </div>
            {meeting.meetingFee && (
              <div className="text-zinc-300 font-medium pt-1">
                Fee: <span className="text-[#0C831F]">₹{Number(meeting.meetingFee)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic CTAs */}
        <div className="pt-2">
          {isUpcoming ? (
            !isRegistered ? (
              <button
                onClick={() => handleRegister(meeting.id)}
                disabled={registeringId === meeting.id}
                className="
                  w-full py-2.5 rounded-xl
                  bg-[#0C831F] hover:bg-[#0A6F1A]
                  disabled:opacity-60 disabled:cursor-not-allowed
                  text-white font-medium text-sm transition-all
                  flex items-center justify-center gap-2
                "
              >
                {registeringId === meeting.id && <Loader2 size={16} className="animate-spin" />}
                Register & Pay
              </button>
            ) : (
              /* Payment Upload Form Toggle */
              <div className="space-y-3">
                {reg.paymentStatus !== "APPROVED" && reg.paymentStatus !== "SUBMITTED" && (
                  <>
                    <button
                      onClick={() =>
                        setShowPaymentFormId(showPaymentFormId === meeting.id ? null : meeting.id)
                      }
                      className="
                        w-full py-2 rounded-xl border border-zinc-700
                        hover:bg-zinc-800 text-zinc-300 text-sm font-medium
                        transition flex items-center justify-center gap-2
                      "
                    >
                      <Upload size={14} />
                      {reg.paymentStatus === "REJECTED" ? "Re-upload Payment" : "Submit Payment Details"}
                    </button>

                    {showPaymentFormId === meeting.id && (
                      <form
                        onSubmit={(e) => handlePaymentSubmit(e, meeting.id)}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 mt-2 space-y-4"
                      >
                        <div className="text-center space-y-1">
                          <p className="text-xs text-zinc-500">Scan QR to pay ₹{Number(meeting.meetingFee || 1000)}</p>
                          <img src={qrImage} alt="QR code" className="h-40 w-40 object-contain mx-auto rounded-lg" />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-500 mb-1">UTR Number</label>
                          <input
                            type="text"
                            placeholder="12-digit UTR Number"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
                            className="
                              w-full bg-zinc-900 border border-zinc-700 rounded-lg
                              px-3 py-1.5 text-xs text-white placeholder:text-zinc-600
                              outline-none focus:border-[#0C831F]
                            "
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-500 mb-1">Screenshot</label>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setScreenshot(e.target.files[0])}
                            className="
                              w-full text-zinc-400 text-xs
                              file:mr-2 file:py-1 file:px-3
                              file:rounded-md file:border-0 file:text-xs
                              file:bg-zinc-800 file:text-zinc-300 file:cursor-pointer
                              file:hover:bg-zinc-700
                            "
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingPaymentId === meeting.id}
                          className="
                            w-full py-2 bg-[#0C831F] hover:bg-[#0A6F1A]
                            text-white text-xs font-semibold rounded-lg transition
                            flex items-center justify-center gap-1.5
                          "
                        >
                          {submittingPaymentId === meeting.id && <Loader2 size={12} className="animate-spin" />}
                          Submit Proof
                        </button>
                      </form>
                    )}
                  </>
                )}
                {reg.paymentStatus === "SUBMITTED" && (
                  <p className="text-xs text-zinc-500 text-center font-medium italic pt-1">
                    Proof submitted. Awaiting admin verification.
                  </p>
                )}
                {reg.paymentStatus === "APPROVED" && (
                  <div className="flex items-center gap-1.5 text-green-500 justify-center py-1">
                    <CheckCircle size={14} />
                    <span className="text-xs font-medium">Verified for Meeting</span>
                  </div>
                )}
              </div>
            )
          ) : (
            /* Past Meetings Attendance Badge */
            <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-800/50">
              <span className="text-zinc-500 font-medium">Attendance:</span>
              {isRegistered ? getAttendanceBadge(reg.attendanceStatus) : (
                <span className="text-zinc-600 font-medium">Not Registered</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Meetings &amp; Events</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Register for chapter events, upload payment details, and view your attendance records.
        </p>
      </div>

      {/* Upcoming meetings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">
          Upcoming Meetings
        </h3>
        {upcomingMeetings.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-sm">
            No upcoming meetings scheduled for your chapter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMeetings.map((m) => renderMeetingCard(m, true))}
          </div>
        )}
      </div>

      {/* Past meetings */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">
          Past Meetings History
        </h3>
        {pastMeetings.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-sm">
            No past meetings found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastMeetings.map((m) => renderMeetingCard(m, false))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
