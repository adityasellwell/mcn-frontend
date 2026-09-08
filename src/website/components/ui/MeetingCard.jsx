import { useState } from "react";
import {
  CalendarDays, Clock3, MapPin, Users,
  CheckCircle2, CalendarClock, ChevronDown, ChevronUp,
  IndianRupee, FileText, Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Meeting Card — used on both the Meetings page and MeetingsPreview.
 * Shows status badge, date, time, venue, fee.
 * Expandable "View Details" section reveals description + agenda.
 * "Register Now" goes to /register with the meeting pre-selected.
 */
const MeetingCard = ({ meeting }) => {
  const [open, setOpen] = useState(false);

  const now = new Date();
  const meetingDate = new Date(meeting.meetingDate);
  const isUpcoming = meetingDate >= now;

  const formattedDate = meetingDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  });

  const membersCount  = meeting._count?.meetingMembers  ?? meeting.members  ?? 0;
  const visitorsCount = meeting._count?.meetingVisitors ?? meeting.visitors ?? 0;
  const totalAttendees = membersCount + visitorsCount;

  const chapterName = meeting.chapter?.name || null;
  const venueCity   = meeting.chapter?.city || null;
  const venue       = meeting.address || venueCity || "—";

  const registerUrl = meeting.id
    ? `/register?meetingId=${meeting.id}`
    : "/register";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`
        rounded-3xl border transition-all duration-300
        flex flex-col
        ${isUpcoming
          ? "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:border-[#0C831F] hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 opacity-80 hover:opacity-100"
        }
      `}
    >
      {/* Card Body */}
      <div className="p-6 flex flex-col gap-4 flex-1">

        {/* Status + Chapter row */}
        <div className="flex items-center gap-2 flex-wrap">
          {isUpcoming ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-semibold border border-green-300 dark:border-green-800">
              <CalendarClock size={11} />
              Upcoming
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-semibold border border-zinc-200 dark:border-zinc-700">
              <CheckCircle2 size={11} />
              Happened
            </span>
          )}
          {chapterName && (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-full px-2.5 py-1">
              <Building2 size={10} />
              {chapterName}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-snug">
          {meeting.title}
        </h3>

        {/* Short description preview */}
        {meeting.description && !open && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {meeting.description}
          </p>
        )}

        {/* Info rows */}
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
            <CalendarDays size={15} className="shrink-0 mt-0.5 text-[#0C831F]" />
            <span className="text-sm">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <Clock3 size={15} className="shrink-0 text-[#0C831F]" />
            <span className="text-sm">{meeting.startTime} – {meeting.endTime}</span>
          </div>

          <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
            <MapPin size={15} className="shrink-0 mt-0.5 text-[#0C831F]" />
            <span className="text-sm">{venue}</span>
          </div>

          {totalAttendees > 0 && (
            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
              <Users size={15} className="shrink-0 text-[#0C831F]" />
              <span className="text-sm">
                {membersCount} {membersCount === 1 ? "Member" : "Members"}
                {visitorsCount > 0 && ` · ${visitorsCount} ${visitorsCount === 1 ? "Visitor" : "Visitors"}`}
              </span>
            </div>
          )}

          {meeting.meetingFee && (
            <div className="flex items-center gap-3">
              <IndianRupee size={15} className="shrink-0 text-[#0C831F]" />
              <span className="text-sm font-semibold text-[#0C831F]">
                Registration Fee: ₹{Number(meeting.meetingFee).toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>

        {/* Expandable details */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-4">
                {meeting.description && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold mb-1.5">
                      About This Meeting
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                      {meeting.description}
                    </p>
                  </div>
                )}

                {meeting.agenda && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold mb-1.5 flex items-center gap-1">
                      <FileText size={11} />
                      Agenda
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                      {meeting.agenda}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-6 flex flex-col gap-3">
        {/* View Details toggle */}
        {(meeting.description || meeting.agenda) && (
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm font-medium transition-all"
          >
            {open ? (
              <>Hide Details <ChevronUp size={15} /></>
            ) : (
              <>View Details <ChevronDown size={15} /></>
            )}
          </button>
        )}

        {/* Register Now — only for upcoming */}
        {isUpcoming && (
          <motion.a
            href={registerUrl}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-[#0C831F] hover:bg-[#0A6F1A] transition-colors font-medium text-white text-sm text-center block"
          >
            Register Now →
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

export default MeetingCard;