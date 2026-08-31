import { useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { invitePortalVisitor } from "../../services/portalReferralService";
import { UserPlus, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const Invite = () => {
  usePageTitle("Invite Someone - MCN Portal");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await invitePortalVisitor({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        phone: phone.trim(),
        email: email.trim() || undefined,
        companyName: companyName.trim() || undefined,
        businessCategory: businessCategory.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      toast.success(res.data?.message || "Invitation sent successfully!");
      
      // Reset form
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setCompanyName("");
      setBusinessCategory("");
      setNotes("");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to send invitation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Invite a Visitor</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Know someone who would benefit from MCN? Invite them to attend a chapter meeting as a visitor.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <UserPlus size={18} className="text-[#0C831F]" />
          Visitor Details
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="
                  w-full bg-zinc-950 border border-zinc-800 rounded-xl
                  px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                  outline-none focus:border-[#0C831F]
                "
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
                Last Name <span className="text-zinc-500">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="
                  w-full bg-zinc-950 border border-zinc-800 rounded-xl
                  px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                  outline-none focus:border-[#0C831F]
                "
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="
                  w-full bg-zinc-950 border border-zinc-800 rounded-xl
                  px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                  outline-none focus:border-[#0C831F]
                "
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
                Email Address <span className="text-zinc-500">(Optional)</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full bg-zinc-950 border border-zinc-800 rounded-xl
                  px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                  outline-none focus:border-[#0C831F]
                "
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
                Company Name <span className="text-zinc-500">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Company Name"
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
              <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
                Business Category <span className="text-zinc-500">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Graphic Design, Real Estate"
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="
                  w-full bg-zinc-950 border border-zinc-800 rounded-xl
                  px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                  outline-none focus:border-[#0C831F]
                "
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
              Notes <span className="text-zinc-500">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Any additional details or message for the visitor..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="
                w-full bg-zinc-950 border border-zinc-800 rounded-xl
                px-4 py-2.5 text-sm text-white placeholder:text-zinc-600
                outline-none focus:border-[#0C831F] resize-none
              "
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="
                px-6 py-2.5 rounded-xl bg-[#0C831F] hover:bg-[#0A6F1A]
                text-white text-sm font-semibold transition
                flex items-center justify-center gap-2
              "
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Invite;
