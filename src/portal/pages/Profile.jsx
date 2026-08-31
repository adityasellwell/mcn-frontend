import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { getPortalMe, updatePortalProfile } from "../../services/portalAuthService";
import { usePortalAuth } from "../../context/PortalAuthContext";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-zinc-500 mb-1">{label}</p>
    <p className="text-sm text-white">{value || "—"}</p>
  </div>
);

const Profile = () => {
  usePageTitle("My Profile - MCN Portal");
  const { portalUser } = usePortalAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Editable fields
  const [companyName, setCompanyName] = useState("");
  const [profession, setProfession] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPortalMe();
        const p = res.data.data.profile;
        setProfile(p);
        setCompanyName(p.companyName || "");
        setProfession(p.profession || "");
        setBusinessCategory(p.businessCategory || "");
        setWebsite(p.website || "");
      } catch {
        toast.error("Failed to load your profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const isMember = portalUser?.role === "MEMBER";
      const payload = isMember
        ? { companyName, profession, businessCategory, website }
        : { companyName, businessCategory };

      await updatePortalProfile(payload);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={32} className="animate-spin text-zinc-500" />
      </div>
    );
  }

  const isMember = portalUser?.role === "MEMBER";

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-white">My Profile</h2>
        <p className="text-sm text-zinc-400 mt-1">
          View your personal information and keep your business details up to date.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        {/* Personal Details (Read Only) */}
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-4">
            Personal Information (Read-only)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name" value={`${profile?.firstName || ""} ${profile?.lastName || ""}`.trim()} />
            <Field label="Email" value={profile?.email} />
            <Field label="Phone" value={profile?.phone} />
            {isMember && <Field label="Member Code" value={profile?.memberCode} />}
          </div>
        </div>

        <hr className="border-zinc-800" />

        {/* Business Details (Editable Form) */}
        <form onSubmit={handleSave} className="space-y-5">
          <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
            Business Details
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="
                  w-full bg-zinc-950 border border-zinc-800 rounded-xl
                  px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                  outline-none focus:border-[#0C831F]
                "
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Business Category</label>
              <input
                type="text"
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="
                  w-full bg-zinc-950 border border-zinc-800 rounded-xl
                  px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                  outline-none focus:border-[#0C831F]
                "
              />
            </div>

            {isMember && (
              <>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Profession</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="
                      w-full bg-zinc-950 border border-zinc-800 rounded-xl
                      px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                      outline-none focus:border-[#0C831F]
                    "
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Website</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="
                      w-full bg-zinc-950 border border-zinc-800 rounded-xl
                      px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                      outline-none focus:border-[#0C831F]
                    "
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updating}
              className="
                px-5 py-2.5 rounded-xl bg-[#0C831F] hover:bg-[#0A6F1A]
                text-white text-sm font-semibold transition
                flex items-center justify-center gap-2
              "
            >
              {updating && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>

        <hr className="border-zinc-800" />

        {/* Membership / Visitor Details (Read Only) */}
        {isMember ? (
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-4">
              Membership Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Chapter" value={profile?.chapter?.name} />
              <Field label="Status" value={profile?.status} />
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-4">
              Visitor Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Status" value={profile?.status} />
              <Field label="Source" value={profile?.source} />
              {profile?.referredByMember && (
                <Field
                  label="Referred By"
                  value={`${profile.referredByMember.firstName} ${profile.referredByMember.lastName || ""}`.trim()}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
