import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import usePageTitle from "../../hooks/usePageTitle";
import { requestPortalOtp, verifyPortalOtp } from "../../services/portalAuthService";
import { usePortalAuth } from "../../context/PortalAuthContext";
import toast from "react-hot-toast";

const Login = () => {
  usePageTitle("Login - MCN");
  const navigate = useNavigate();
  const { login } = usePortalAuth();

  const [step, setStep] = useState("email"); // "email" | "code"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await requestPortalOtp(email.trim());
      toast.success(res.data.message || "Login code sent to your email");
      setStep("code");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Couldn't send a login code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Enter the code sent to your email");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyPortalOtp(email.trim(), code.trim());
      const { user, role, accessToken } = res.data.data;
      login({ ...user, role }, accessToken);
      toast.success("Welcome back!");
      navigate("/portal/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Incorrect or expired code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        w-full
        max-w-md
        p-8
        rounded-3xl
        border
        border-zinc-200
        dark:border-zinc-800
        bg-zinc-50
        dark:bg-zinc-900
      "
    >
      <h1 className="text-3xl font-bold text-center text-zinc-900 dark:text-white">
        Welcome Back
      </h1>

      <p className="mt-3 text-center text-zinc-500 dark:text-zinc-500">
        {step === "email"
          ? "Login to your MCN member portal"
          : `Enter the code sent to ${email}`}
      </p>

      {step === "email" ? (
        <form onSubmit={handleRequestOtp} className="mt-8 space-y-4">
          <input
            required
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950
              border border-zinc-200 dark:border-zinc-800
              focus:border-[#0C831F] outline-none text-zinc-900 dark:text-white
              placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors
            "
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl
              bg-[#0C831F] hover:bg-[#0A6F1A]
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-300 text-white font-medium
            "
          >
            {loading ? "Sending..." : "Send Login Code"}
          </motion.button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4">
          <input
            required
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="
              w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950
              border border-zinc-200 dark:border-zinc-800
              focus:border-[#0C831F] outline-none text-zinc-900 dark:text-white
              placeholder-zinc-400 dark:placeholder-zinc-600
              text-center text-2xl tracking-[0.5em] transition-colors
            "
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl
              bg-[#0C831F] hover:bg-[#0A6F1A]
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-300 text-white font-medium
            "
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </motion.button>

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
            }}
            className="w-full text-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition"
          >
            Use a different email
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <Link to="/register" className="text-[#22C55E] hover:underline font-medium">
          Become A Member
        </Link>
      </div>
    </motion.div>
  );
};

export default Login;
