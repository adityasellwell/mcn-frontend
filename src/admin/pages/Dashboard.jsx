import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import {
  Users, UserCheck, Building2, CalendarDays,
  GitMerge, ClipboardList, CreditCard,
} from "lucide-react";
import StatCard from "../components/StatCard";
import {
  fetchDashboardOverview,
  fetchRecentApplications,
  fetchUpcomingMeetings,
} from "../services/dashboardService";
import toast from "react-hot-toast";

const Dashboard = () => {
  usePageTitle("Dashboard");
  const [overview, setOverview] = useState(null);
  const [applications, setApplications] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [o, a, m] = await Promise.all([
          fetchDashboardOverview(),
          fetchRecentApplications(),
          fetchUpcomingMeetings(),
        ]);
        setOverview(o.data.data);
        setApplications(a.data.data);
        setMeetings(m.data.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6b7ea3]">
        Loading dashboard...
      </div>
    );
  }

  const stats = [
    { title: "Total Members", value: overview?.totalMembers, icon: Users, color: "blue" },
    { title: "Total Visitors", value: overview?.totalVisitors, icon: UserCheck, color: "green" },
    { title: "Chapters", value: overview?.totalChapters, icon: Building2, color: "purple" },
    { title: "Meetings", value: overview?.totalMeetings, icon: CalendarDays, color: "yellow" },
    { title: "Referrals", value: overview?.totalReferrals, icon: GitMerge, color: "blue" },
    { title: "Pending Applications", value: overview?.pendingApplications, icon: ClipboardList, color: "red" },
    { title: "Pending Payments", value: overview?.pendingPayments, icon: CreditCard, color: "yellow" },
  ];

  return (
    <div className="space-y-8">

      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-sm text-[#6b7ea3] mt-1">
          Welcome back. Here's what's happening.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-[#0f1b3d] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
          Recent Applications
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-[#6b7ea3] border-b border-white/5">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Mobile</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#6b7ea3]">
                    No applications yet
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-white font-medium">{app.fullName}</td>
                    <td className="py-3 text-[#a8b8d4]">{app.mobile}</td>
                    <td className="py-3 text-[#a8b8d4]">{app.registrationType}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#6b7ea3]">
                      {new Date(app.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="bg-[#0f1b3d] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
          Upcoming Meetings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-[#6b7ea3] border-b border-white/5">
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Chapter</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Venue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {meetings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-[#6b7ea3]">
                    No upcoming meetings
                  </td>
                </tr>
              ) : (
                meetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-white font-medium">{meeting.title}</td>
                    <td className="py-3 text-[#a8b8d4]">{meeting.chapter?.name}</td>
                    <td className="py-3 text-[#6b7ea3]">
                      {new Date(meeting.meetingDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 text-[#a8b8d4]">{meeting.venue}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;