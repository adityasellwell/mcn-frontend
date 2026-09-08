import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import { getPortalMe } from "../../services/portalAuthService";
import { getPortalReferrals } from "../../services/portalReferralService";
import { usePortalAuth } from "../../context/PortalAuthContext";
import StatCard from "../../admin/components/StatCard";
import { Building2, Briefcase, Tag, Award, ArrowUpRight, ArrowDownLeft, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  usePageTitle("Dashboard - MCN Portal");
  const { portalUser } = usePortalAuth();
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMember = portalUser?.role === "MEMBER";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPortalMe();
        setProfile(res.data.data.profile);

        // Fetch referrals for members only
        if (portalUser?.role === "MEMBER") {
          try {
            const refRes = await getPortalReferrals();
            setReferrals(refRes.data?.data || []);
          } catch {
            // non-fatal — dashboard still loads
          }
        }
      } catch {
        toast.error("Failed to load your profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [portalUser]);

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  // ─── Referral stats ───
  const given    = referrals.filter((r) => r.givenByMemberId === portalUser?.id);
  const received = referrals.filter((r) => r.receivedByMemberId === portalUser?.id);

  const totalGivenValue    = given.reduce((s, r) => s + Number(r.referralValue || 0), 0);
  const totalReceivedValue = received.reduce((s, r) => s + Number(r.referralValue || 0), 0);
  const totalCombined      = totalGivenValue + totalReceivedValue;

  const fmt = (n) =>
    n > 0 ? `₹${n.toLocaleString("en-IN")}` : "—";

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

      {/* ─── Member Referral Summary ─── */}
      {isMember && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-base">Referrals Summary</h3>
            <Link
              to="/portal/referrals"
              className="text-sm text-[#22C55E] hover:underline flex items-center gap-1"
            >
              View All →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Given */}
            <Link
              to="/portal/referrals"
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 flex items-start gap-4 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-wider">Referrals Given</p>
                <p className="text-white text-2xl font-bold mt-1">{given.length}</p>
                <p className="text-blue-400 text-sm mt-0.5">{fmt(totalGivenValue)}</p>
              </div>
            </Link>

            {/* Received */}
            <Link
              to="/portal/referrals"
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 flex items-start gap-4 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-wider">Referrals Received</p>
                <p className="text-white text-2xl font-bold mt-1">{received.length}</p>
                <p className="text-emerald-400 text-sm mt-0.5">{fmt(totalReceivedValue)}</p>
              </div>
            </Link>
          </div>

          {/* Total combined value */}
          {totalCombined > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
              <IndianRupee className="w-5 h-5 text-yellow-400 shrink-0" />
              <p className="text-zinc-300 text-sm">
                Total referral value:{" "}
                <span className="text-yellow-400 font-semibold">
                  ₹{totalCombined.toLocaleString("en-IN")}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

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
