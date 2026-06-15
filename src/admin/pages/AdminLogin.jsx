import { useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginAdmin } from "../services/authService";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const AdminLogin = () => {
  usePageTitle("Admin Login");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    toast.error("Please fill in all fields");
    return;
  }

  setLoading(true);
  try {
    const res = await loginAdmin(form);

    // Backend returns: { success, data: { admin, accessToken } }
    const { admin, accessToken } = res.data.data;

    // Store in context + localStorage
    login(admin, accessToken);

    toast.success("Welcome back!");
    navigate("/admin/dashboard");
  } catch (err) {
    const message =
      err?.response?.data?.message || "Login failed. Please try again.";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#0C831F] shadow-lg shadow-[#0C831F]/30 mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">MCN Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your admin account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@mcn.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0C831F] focus:bg-white focus:ring-1 focus:ring-[#0C831F]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0C831F] focus:bg-white focus:ring-1 focus:ring-[#0C831F]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0C831F] hover:bg-[#0A6F1A] text-white font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-[#0C831F]/20"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          MCN Admin Panel · Restricted Access
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;