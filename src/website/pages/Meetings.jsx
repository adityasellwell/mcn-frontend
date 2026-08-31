import { useState, useEffect } from "react";
import { Loader2, CalendarOff } from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";
import Container from "../components/ui/Container";
import MeetingCard from "../components/ui/MeetingCard";
import Layout from "../layouts/Layout";
import { getWebsiteMeetings } from "../../services/meetingService";

const Meetings = () => {
  usePageTitle("MCN Meetings & Events");
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
  // Upcoming: meetingDate is in the future
  const upcomingMeetings = meetings.filter(
    (m) => new Date(m.meetingDate) >= now
  );
  // Past: meetingDate is in the past
  const pastMeetings = meetings.filter(
    (m) => new Date(m.meetingDate) < now
  );

  return (
    <Layout>
      <div className="py-12 bg-white dark:bg-zinc-950 min-h-screen">
        <Container>
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm uppercase tracking-[0.3em] text-[#0C831F] font-semibold">
              Events Directory
            </span>
            <h1 className="mt-4 text-4xl lg:text-6xl font-bold text-zinc-900 dark:text-white leading-tight">
              Community Meetings
            </h1>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
              Grow your business connections, exchange referrals, and explore chapter events scheduled in your area.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-zinc-500">
              <Loader2 size={32} className="animate-spin text-[#0C831F]" />
              <span>Loading meetings...</span>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Upcoming Meetings */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center justify-between">
                  <span>Upcoming Events</span>
                  <span className="text-xs bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20">
                    {upcomingMeetings.length} Scheduled
                  </span>
                </h2>

                {upcomingMeetings.length === 0 ? (
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 text-center text-zinc-500 dark:text-zinc-400">
                    <CalendarOff size={40} className="mx-auto mb-3 text-zinc-400" />
                    <p className="font-medium">No upcoming events at this moment.</p>
                    <p className="text-sm mt-1">Please check back later or contact admin for schedule inquiries.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {upcomingMeetings.map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </div>
                )}
              </div>

              {/* Past Meetings */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center justify-between">
                  <span>Past Meetings History</span>
                  <span className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700">
                    {pastMeetings.length} Events
                  </span>
                </h2>

                {pastMeetings.length === 0 ? (
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 text-center text-zinc-500">
                    <p className="font-medium">No past events recorded in the history.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {pastMeetings.map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default Meetings;
