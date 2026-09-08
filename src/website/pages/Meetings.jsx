import { useState, useEffect } from "react";
import { Loader2, CalendarOff, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import usePageTitle from "../../hooks/usePageTitle";
import Container from "../components/ui/Container";
import MeetingCard from "../components/ui/MeetingCard";
import Layout from "../layouts/Layout";
import { getWebsiteMeetings } from "../../services/meetingService";

const Meetings = () => {
  usePageTitle("Meetings & Events — Muslim Community Network");
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const response = await getWebsiteMeetings();
        setMeetings(response.data || response || []);
      } catch (err) {
        console.error("MeetingsPage: failed to load meetings", err);
      } finally {
        setLoading(false);
      }
    };
    loadMeetings();
  }, []);

  const now = new Date();
  const upcomingMeetings = meetings.filter((m) => new Date(m.meetingDate) >= now);
  const pastMeetings     = meetings.filter((m) => new Date(m.meetingDate) <  now);

  return (
    <Layout>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#0C831F]/5 blur-3xl" />
        </div>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 max-w-3xl mx-auto"
          >
            <span className="text-sm uppercase tracking-[0.3em] text-[#0C831F] font-semibold">
              Events Directory
            </span>
            <h1 className="mt-4 text-4xl lg:text-6xl font-bold text-zinc-900 dark:text-white leading-tight">
              Community Meetings
            </h1>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Grow your business connections, exchange referrals, and explore MCN chapter events.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0C831F]" />
                {upcomingMeetings.length} Upcoming
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                {pastMeetings.length} Past
              </span>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* ── Content ── */}
      <div className="py-14 bg-white dark:bg-zinc-950 min-h-[50vh]">
        <Container>
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-zinc-500">
              <Loader2 size={30} className="animate-spin text-[#0C831F]" />
              <span>Loading meetings...</span>
            </div>
          ) : (
            <div className="space-y-16">

              {/* ── Upcoming ── */}
              <section>
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="text-[#0C831F]" size={22} />
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                      Upcoming Events
                    </h2>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                    upcomingMeetings.length > 0
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700"
                  }`}>
                    {upcomingMeetings.length} Scheduled
                  </span>
                </div>

                {upcomingMeetings.length === 0 ? (
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-12 text-center">
                    <CalendarOff size={40} className="mx-auto mb-4 text-zinc-400" />
                    <p className="font-semibold text-zinc-600 dark:text-zinc-300">No upcoming events right now</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Please check back later or <a href="/contact" className="text-[#0C831F] hover:underline">contact us</a> for schedule updates.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingMeetings.map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </div>
                )}
              </section>

              {/* ── Past ── */}
              {pastMeetings.length > 0 && (
                <section>
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                      Past Meetings
                    </h2>
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 font-medium">
                      {pastMeetings.length} Events
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pastMeetings.map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default Meetings;
