import {
  CalendarDays,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";

/**
 * ==================================================
 * Meeting Card
 * ==================================================
 *
 * Future:
 * Data will come from API.
 *
 * Used In:
 * - Landing Page
 * - Meetings Page
 * - Member Dashboard
 *
 * ==================================================
 */

const MeetingCard = ({
  meeting,
}) => {
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
      "
    >
      {/* Meeting Title */}

      <h3
        className="
          text-2xl
          font-semibold
        "
      >
        {meeting.title}
      </h3>

      {/* Meeting Info */}

      <div
        className="
          mt-6
          space-y-4
        "
      >
        <div className="flex items-center gap-3 text-zinc-400">
          <CalendarDays size={18} />
          <span>{meeting.date}</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <Clock3 size={18} />
          <span>{meeting.time}</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <MapPin size={18} />
          <span>{meeting.location}</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <Users size={18} />
          <span>
            {meeting.members} Members • {meeting.visitors} Visitors
          </span>
        </div>
      </div>

      {/* Button */}

      <button
        className="
          mt-8
          w-full

          py-3

          rounded-xl

          bg-[#0C831F]
          hover:bg-[#0A6F1A]

          transition-colors

          font-medium
        "
      
      onClick={() => { window.location.href = "/register"; }}
      >
        Register Now
      </button>
    </div>
  );
};

export default MeetingCard;