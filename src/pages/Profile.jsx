import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../components/Home/HomeNavabar";
import Footer from "../components/Home/HomeFooter";
import { userService } from "../services/userService";

const initialFormData = {
  user_name: "",
  email: "",
  role_user: "",
  status_user: "",
};

const initialPasswordData = {
  newPassword: "",
  confirmPassword: "",
};

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [passwordData, setPasswordData] = useState(initialPasswordData);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [profileRequest, setProfileRequest] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");
  const [pwdError, setPwdError] = useState("");

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setLoadingProfile(false);
      return undefined;
    }

    let isMounted = true;
    setLoadingProfile(true);
    setError("");

    const loadProfile = async () => {
      try {
        const response = await userService.getProfile();
        if (!isMounted) return;

        const profile = response.data;
        setFormData({
          user_name: profile.user_name || "",
          email: profile.email || "",
          role_user: profile.role_user || user.role_user || "user",
          status_user: profile.status_user || user.status_user || "active",
        });
      } catch {
        if (isMounted) setError("Không thể tải hồ sơ. Hãy thử tải lại thông tin.");
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [userId, profileRequest, user?.role_user, user?.status_user]);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!message) return undefined;
    const timeout = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timeout);
  }, [message]);

  useEffect(() => {
    if (!pwdMessage) return undefined;
    const timeout = setTimeout(() => setPwdMessage(""), 4000);
    return () => clearTimeout(timeout);
  }, [pwdMessage]);

  const passwordCheck = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password);

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    return [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*]/.test(password),
    ].filter(Boolean).length;
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((previous) => ({ ...previous, [name]: value }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setMessage("");
    setError("");

    try {
      await userService.updateProfile({
        user_name: formData.user_name,
        email: formData.email,
      });
      updateUserData({ user_name: formData.user_name, email: formData.email });
      setMessage("Đã lưu thông tin hồ sơ.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể lưu hồ sơ. Hãy thử lại.");
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    setPwdMessage("");
    setPwdError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwdError("Hai mật khẩu chưa khớp. Hãy kiểm tra lại.");
      return;
    }

    if (!passwordCheck(passwordData.newPassword)) {
      setPwdError("Mật khẩu cần 8 ký tự, gồm chữ hoa, chữ số và ký tự đặc biệt.");
      return;
    }

    setLoadingPassword(true);
    try {
      await userService.updatePassword(userId, passwordData.newPassword);
      setPwdMessage("Đã đổi mật khẩu.");
      setPasswordData(initialPasswordData);
    } catch (requestError) {
      setPwdError(requestError.response?.data?.message || "Không thể đổi mật khẩu. Hãy thử lại.");
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!user) return null;

  const strength = getPasswordStrength(passwordData.newPassword);
  const strengthColors = [
    "bg-slate-200",
    "bg-rose-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-emerald-600",
  ];
  const isActive = formData.status_user?.toLowerCase() === "active";

  return (
    <div className="min-h-screen bg-[#f3f6f9] text-[#173247]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 lg:pt-36">
        <header className="relative mb-8 overflow-hidden bg-[#0b253a] px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-[#c29a5b]/30" />
          <div className="absolute -right-2 -top-10 h-44 w-44 rounded-full border border-[#c29a5b]/20" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#e5c38c]/60 bg-[#163e5e] font-serif text-3xl text-[#e5c38c]">
              {(formData.user_name || user.user_name || "K").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-sm text-[#e5c38c]">Không gian của bạn</p>
              <h1 className="font-serif text-3xl sm:text-4xl">
                {formData.user_name || user.user_name || "Hồ sơ cá nhân"}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/75">
                <span className="flex min-w-0 items-center gap-2">
                  <Mail size={15} className="shrink-0 text-[#e5c38c]" />
                  <span className="truncate">{formData.email || user.email}</span>
                </span>
                <span className="flex items-center gap-2">
                  <BadgeCheck size={16} className="text-[#e5c38c]" />
                  <span className="capitalize">{formData.role_user || "Khách hàng"}</span>
                </span>
                {formData.status_user && (
                  <span className={`flex items-center gap-2 ${isActive ? "text-emerald-200" : "text-amber-200"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-300" : "bg-amber-300"}`} />
                    {isActive ? "Tài khoản đang hoạt động" : "Tài khoản cần được hỗ trợ"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {loadingProfile ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 bg-white" role="status">
            <Loader2 className="animate-spin text-[#c29a5b]" size={28} />
            <p className="text-sm text-slate-600">Đang tải hồ sơ...</p>
          </div>
        ) : error && !formData.email && !formData.user_name ? (
          <div className="flex flex-col items-start gap-4 border border-rose-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-rose-800" role="alert">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setProfileRequest((attempt) => attempt + 1)}
              className="font-semibold text-[#0b253a] underline decoration-[#c29a5b] underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b253a]"
            >
              Tải lại thông tin
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 flex items-start gap-3 border border-rose-200 bg-rose-50 p-4 text-rose-800" role="alert">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <section className="border border-slate-200 bg-white p-6 sm:p-8">
                <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#f3f6f9] text-[#0b4a57]">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-[#0b253a]">Thông tin cá nhân</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Cập nhật tên và email dùng cho các lần đặt phòng.
                    </p>
                  </div>
                </div>

                <form onSubmit={submitProfile} className="space-y-5">
                  <div>
                    <label htmlFor="user_name" className="mb-2 block text-sm font-semibold text-slate-700">
                      Họ và tên
                    </label>
                    <input
                      id="user_name"
                      name="user_name"
                      autoComplete="name"
                      value={formData.user_name}
                      onChange={handleProfileChange}
                      required
                      className="w-full border border-slate-300 bg-white px-4 py-3 text-[#173247] outline-none transition focus:border-[#0b4a57] focus:ring-2 focus:ring-[#0b4a57]/15"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                      Địa chỉ email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      required
                      className="w-full border border-slate-300 bg-white px-4 py-3 text-[#173247] outline-none transition focus:border-[#0b4a57] focus:ring-2 focus:ring-[#0b4a57]/15"
                      placeholder="ten@email.com"
                    />
                  </div>

                  {message && (
                    <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
                      <CheckCircle2 size={19} className="shrink-0" />
                      <span>{message}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#0b253a] px-6 py-3 font-semibold text-white transition hover:bg-[#163e5e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c29a5b] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {savingProfile && <Loader2 className="animate-spin" size={18} />}
                    {savingProfile ? "Đang lưu..." : "Lưu thông tin"}
                  </button>
                </form>
              </section>

              <section className="border border-slate-200 bg-white p-6 sm:p-8">
                <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#faf5eb] text-[#8b682f]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-[#0b253a]">Bảo mật</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Chọn mật khẩu mạnh để bảo vệ tài khoản của bạn.
                    </p>
                  </div>
                </div>

                <form onSubmit={submitPassword} className="space-y-5">
                  <div>
                    <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                      Mật khẩu mới
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      autoComplete="new-password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full border border-slate-300 bg-white px-4 py-3 text-[#173247] outline-none transition focus:border-[#8b682f] focus:ring-2 focus:ring-[#c29a5b]/20"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <div className="mt-3" aria-label={`Độ mạnh mật khẩu: ${strength} trên 4`}>
                      <div className="mb-2 flex justify-between text-xs text-slate-500">
                        <span>Độ mạnh mật khẩu</span>
                        <span>{strength}/4</span>
                      </div>
                      <div className="flex gap-1" aria-hidden="true">
                        {[1, 2, 3, 4].map((level) => (
                          <span
                            key={level}
                            className={`h-1.5 flex-1 ${level <= strength ? strengthColors[strength] : "bg-slate-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Tối thiểu 8 ký tự, có chữ hoa, chữ số và ký tự đặc biệt.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                      Nhập lại mật khẩu mới
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full border border-slate-300 bg-white px-4 py-3 text-[#173247] outline-none transition focus:border-[#8b682f] focus:ring-2 focus:ring-[#c29a5b]/20"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>

                  {pwdMessage && (
                    <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
                      <CheckCircle2 size={19} className="shrink-0" />
                      <span>{pwdMessage}</span>
                    </div>
                  )}

                  {pwdError && (
                    <div className="flex items-start gap-3 border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" role="alert">
                      <AlertCircle size={19} className="mt-0.5 shrink-0" />
                      <span>{pwdError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#c29a5b] px-6 py-3 font-semibold text-[#0b253a] transition hover:bg-[#e5c38c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b253a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingPassword && <Loader2 className="animate-spin" size={18} />}
                    {!loadingPassword && <KeyRound size={17} />}
                    {loadingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
                  </button>
                </form>
              </section>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
