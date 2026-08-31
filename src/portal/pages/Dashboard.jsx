import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { getPortalMe } from "../../services/portalAuthService";
import { usePortalAuth } from "../../context/PortalAuthContext";
import StatCard from "../../admin/components/StatCard";
import { Building2, Briefcase, Tag, Award } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  usePageTitle("Dashboard - MCN Portal");
  const { portalUser } = usePortalAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPortalMe();
        setProfile(res.data.data.profile);
      } catch {
        toast.error("Failed to load your profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  const isMember = portalUser?.role === "MEMBER";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome, {profile?.firstName || portalUser?.name}
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          {isMember ? "Your MCN member overview" : "Your MCN visitor overview"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isMember ? (
          <>
            <StatCard title="Member Code" value={profile?.memberCode} icon={Award} color="blue" />
            <StatCard title="Chapter" value={profile?.chapter?.name} icon={Building2} color="green" />
            <StatCard title="Status" value={profile?.status} icon={Tag} color="purple" />
            <StatCard title="Company" value={profile?.companyName} icon={Briefcase} color="yellow" />
          </>
        ) : (
          <>
            <StatCard title="Status" value={profile?.status} icon={Tag} color="purple" />
            <StatCard title="Source" value={profile?.source} icon={Briefcase} color="blue" />
            <StatCard title="Company" value={profile?.companyName || "—"} icon={Building2} color="green" />
          </>
        )}
      </div>

      {!isMember && profile?.status !== "CONVERTED" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold">Ready to become a member?</h3>
            <p className="text-sm text-zinc-400 mt-1">
              Apply for full MCN membership to unlock referrals, chapter roles, and more.
            </p>
          </div>
          <a
            href={`/register?type=MEMBER`}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-[#0C831F] hover:bg-[#0A6F1A] text-white text-sm font-medium transition text-center"
          >
            Apply Now
          </a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
