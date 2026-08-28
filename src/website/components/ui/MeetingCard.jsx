import { CalendarDays, Clock3, MapPin, Users, CheckCircle2, CalendarClock } from "lucide-react";

/**
 * ==================================================
 * Meeting Card
 * ==================================================
 *
 * Renders a meeting card from real API data.
 * - Shows a status badge: "Upcoming" (green) or "Happened" (grey).
 * - Shows members and visitors count from _count.
 * - Hides the "Register Now" button for past meetings.
 *
 * Used In:
 * - Landing Page (MeetingsPreview)
 * - Meetings Page
 *
 * ==================================================
 */

const MeetingCard = ({ meeting }) => {
  const now = new Date();
  const meetingDate = new Date(meeting.meetingDate);
  const isUpcoming = meetingDate >= now;

  const formattedDate = meetingDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const membersCount =
    meeting._count?.meetingMembers ?? meeting.members ?? 0;
  const visitorsCount =
    meeting._count?.meetingVisitors ?? meeting.visitors ?? 0;

  const locationLabel =
    meeting.chapter?.city || meeting.location || "—";

  return (
    <div
      className="
        p-8
        rounded-3xl

        border
        border-zinc-800

        bg-zinc-900

        transition-all
        duration-300

        hover:border-[#0C831F]
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-black/20

        flex flex-col
      "
    >
      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        {isUpcoming ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-900/40 text-green-400 text-xs font-semibold border border-green-800">
            <CalendarClock size={12} />
            Upcoming
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-semibold border border-zinc-700">
            <CheckCircle2 size={12} />
            Happened
          </span>
        )}

        {meeting.chapter?.name && (
          <span className="text-xs text-zinc-500 border border-zinc-800 rounded-full px-2.5 py-1">
            {meeting.chapter.name}
          </span>
        )}
      </div>

      {/* Meeting Title */}
      <h3
        className="
          text-xl
          font-semibold
          leading-snug
        "
      >
        {meeting.title}
      </h3>

      {/* Meeting Info */}
      <div
        className="
          mt-5
          space-y-3
          flex-1
        "
      >
        <div className="flex items-center gap-3 text-zinc-400">
          <CalendarDays size={16} className="shrink-0 text-[#0C831F]" />
          <span className="text-sm">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <Clock3 size={16} className="shrink-0 text-[#0C831F]" />
          <span className="text-sm">
            {meeting.startTime} – {meeting.endTime}
          </span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <MapPin size={16} className="shrink-0 text-[#0C831F]" />
          <span className="text-sm truncate">{locationLabel}</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <Users size={16} className="shrink-0 text-[#0C831F]" />
          <span className="text-sm">
            {membersCount} Members • {visitorsCount} Visitors
          </span>
        </div>

        {meeting.meetingFee && (
          <div className="pt-1">
            <span className="text-[#0C831F] font-semibold text-sm">
              Registration Fee: ₹{Number(meeting.meetingFee).toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>

      {/* Register Button — only for upcoming meetings */}
      {isUpcoming && (
        <button
          className="
            mt-6
            w-full

            py-3

            rounded-xl

            bg-[#0C831F]
            hover:bg-[#0A6F1A]

            transition-colors

            font-medium
            text-sm
          "
          onClick={() => { window.location.href = "/register"; }}
        >
          Register Now
        </button>
      )}
    </div>
  );
};

export default MeetingCard;