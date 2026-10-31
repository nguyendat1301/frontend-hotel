import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../components/Home/HomeNavabar";
import Footer from "../components/Home/HomeFooter";
import { userService } from "../services/userService";
import {
  User, Lock, ShieldCheck,
  Loader2, CheckCircle2, AlertCircle,
  KeyRound, Mail, BadgeCheck
} from "lucide-react";

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    role_user: "",
    status_user: "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    if (user?.id) {
      userService.getProfile()
        .then((res) => {
          setFormData({
            user_name: res.data.user_name || "",
            email: res.data.email || "",
            role_user: res.data.role_user || user.role_user || "user",
            status_user: res.data.status_user || user.status_user || "active",
          });
        })
        .catch(() => setError("Không tải được thông tin người dùng"));
    }
  }, [user]);

  const passwordCheck = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password);
  };

  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*]/.test(pwd)) score++;
    return score;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setMessage("");
    setError("");

    try {
      await userService.updateProfile(formData);
      updateUserData({ user_name: formData.user_name, email: formData.email });
      setMessage("Cập nhật thông tin thành công!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoadingProfile(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPwdMessage("");
    setPwdError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwdError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!passwordCheck(passwordData.newPassword)) {
      setPwdError("Mật khẩu cần ít nhất 8 ký tự, 1 chữ hoa, 1 số và 1 ký tự đặc biệt");
      return;
    }

    setLoadingPassword(true);
    try {
      await userService.updatePassword(user.id, passwordData.newPassword);
      setPwdMessage("Đổi mật khẩu thành công!");
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setPwdMessage(""), 3000);
    } catch (err) {
      setPwdError(err.response?.data?.message || "Lỗi đổi mật khẩu");
    } finally {
      setLoadingPassword(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const strength = getPasswordStrength(passwordData.newPassword);
  const strengthColors = ["bg-gray-200", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-5xl mx-auto pt-32 pb-20 px-6">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-10 p-2">
          <div className="h-20 w-20 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200">
            {formData.user_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{formData.user_name}</h1>
            <div className="flex items-center gap-2 text-slate-500 mt-1">
              <Mail size={16} />
              <span>{formData.email}</span>
              <span className="mx-2 text-slate-300">|</span>
              <BadgeCheck size={16} className="text-blue-500" />
              <span className="capitalize">{formData.role_user}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Main Info Card */}
          <div className="lg:col-span-7 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Thông tin cá nhân</h2>
            </div>

            <form onSubmit={submitProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Họ và tên</label>
                <input
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                  placeholder="Nhập tên của bạn"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Địa chỉ Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                  placeholder="name@company.com"
                />
              </div>

              {message && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <CheckCircle2 size={20} /> <span className="text-sm font-medium">{message}</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={20} /> <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loadingProfile}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loadingProfile ? <Loader2 className="animate-spin" size={20} /> : "Lưu thay đổi"}
              </button>
            </form>
          </div>

          {/* Password Card */}
          <div className="lg:col-span-5 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <KeyRound size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Bảo mật</h2>
            </div>

            <form onSubmit={submitPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Mật khẩu mới</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all outline-none"
                  placeholder="••••••••"
                />

                {/* Dynamic Strength Meter */}
                <div className="pt-1">
                  <div className="flex justify-between mb-1 px-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Độ mạnh</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{strength * 25}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${strengthColors[strength]}`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>

              {pwdMessage && (
                <div className="text-emerald-600 text-sm font-medium flex items-center gap-2 bg-emerald-50 p-3 rounded-lg">
                  <CheckCircle2 size={16} /> {pwdMessage}
                </div>
              )}

              {pwdError && (
                <div className="text-red-600 text-sm font-medium flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} /> {pwdError}
                </div>
              )}

              <button
                type="submit"
                disabled={loadingPassword}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loadingPassword ? <Loader2 className="animate-spin" size={20} /> : "Cập nhật mật khẩu"}
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;