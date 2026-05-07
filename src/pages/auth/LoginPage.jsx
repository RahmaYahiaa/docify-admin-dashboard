import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Mail,
  ArrowLeft,
  KeyRound,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { login, sendOtp, resetPassword } from "@/services/auth.service";
import { toast } from "sonner";

// ── Views ──
// 'login' | 'forgot' | 'reset'

export default function LoginPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Forgot / Reset form
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  // ── Handlers ──
  const handleLogin = async () => {
    setError("");
    if (!loginForm.email.trim()) return setError("Email is required");
    if (!loginForm.password.trim()) return setError("Password is required");

    setLoading(true);
    try {
      const res = await login(loginForm);
      const { user, token } = res.data.data;
      loginStore(
        {
          name: user.name || user.first_name + " " + (user.last_name || ""),
          email: user.email,
          role: user.role || "Admin",
        },
        token,
      );
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    }
    setLoading(false);
  };

  const handleSendOtp = async () => {
    setError("");
    if (!resetEmail.trim()) return setError("Email is required");

    setLoading(true);
    try {
      await sendOtp(resetEmail);
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setError("");
    if (!otp.trim()) return setError("OTP is required");
    if (!newPassword.trim()) return setError("Password is required");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);
    try {
      await resetPassword({
        email: resetEmail,
        otp,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      toast.success("Password reset successfully!");
      setView("login");
      setOtpSent(false);
      setResetEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (view === "login") handleLogin();
      else if (!otpSent) handleSendOtp();
      else handleResetPassword();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#0066CC] rounded-[10px] flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Docify Admin</h1>
          <p className="text-sm text-slate-500 mt-1">
            {view === "login"
              ? "Sign in to your admin account"
              : "Reset your password"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-8">
          {/* ── LOGIN VIEW ── */}
          {view === "login" && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-slate-900">
                Welcome back
              </h2>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <AlertCircle size={15} className="text-red-500 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@docify.com"
                  value={loginForm.email}
                  onChange={(e) => {
                    setLoginForm((p) => ({ ...p, email: e.target.value }));
                    setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    onClick={() => {
                      setView("forgot");
                      setError("");
                    }}
                    className="text-xs text-[#0066CC] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm((p) => ({ ...p, password: e.target.value }));
                      setError("");
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2.5 pr-10 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
                  />
                  <button
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={15} /> Sign In
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── FORGOT PASSWORD VIEW ── */}
          {view === "forgot" && (
            <div className="space-y-5">
              <button
                onClick={() => {
                  setView("login");
                  setError("");
                  setOtpSent(false);
                }}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft size={15} /> Back to login
              </button>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Reset Password
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {!otpSent
                    ? "Enter your email and we'll send you an OTP"
                    : "Enter the OTP sent to your email"}
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <AlertCircle size={15} className="text-red-500 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Step 1 — Email */}
              {!otpSent && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        placeholder="admin@docify.com"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          setError("");
                        }}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </>
              )}

              {/* Step 2 — OTP + New Password */}
              {otpSent && (
                <>
                  {/* OTP Sent Notice */}
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <CheckCircle
                      size={15}
                      className="text-green-500 shrink-0"
                    />
                    <p className="text-sm text-green-700">
                      OTP sent to{" "}
                      <span className="font-medium">{resetEmail}</span>
                    </p>
                  </div>

                  {/* OTP */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setError("");
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors tracking-widest text-center font-mono"
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Min 6 characters"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setError("");
                        }}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2.5 pr-10 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
                      />
                      <button
                        onClick={() => setShowNewPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setOtpSent(false);
                        setError("");
                      }}
                      className="flex-1 py-2.5 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50"
                    >
                      Resend OTP
                    </button>
                    <button
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <KeyRound size={14} /> Reset Password
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Docify Admin v1.0
        </p>
      </div>
    </div>
  );
}
