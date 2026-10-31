import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/userService";
import {
    User,
    Mail,
    Lock,
    CheckCircle,
    AlertCircle,
    Loader2
} from "lucide-react";
import { createElement } from "react";

// Component InputField tách riêng ra ngoài
const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {createElement(Icon, { size: 18 })}
        </div>

        <input
            {...props}
            className="
                w-full
                pl-10
                pr-4
                py-3
                border
                border-gray-200
                rounded-xl
                bg-gray-50
                focus:bg-white
                focus:ring-2
                focus:ring-indigo-500
                focus:border-transparent
                outline-none
                transition-all
            "
        />
    </div>
);

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        user_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Validate
        if (
            !form.user_name ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }

        try {
            setLoading(true);

            const res = await authService.register({
                user_name: form.user_name,
                email: form.email,
                password: form.password
            });

            setMessage(
                res?.data?.message ||
                "Đăng ký thành công! Đang chuyển hướng..."
            );

            // Reset form
            setForm({
                user_name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            // Redirect
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Có lỗi xảy ra"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        Tạo tài khoản
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Tham gia cùng chúng tôi ngay hôm nay
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    <InputField
                        icon={User}
                        type="text"
                        name="user_name"
                        placeholder="Tên người dùng"
                        value={form.user_name}
                        onChange={handleChange}
                    />

                    <InputField
                        icon={Mail}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <InputField
                        icon={Lock}
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <InputField
                        icon={Lock}
                        type="password"
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            font-semibold
                            py-3
                            rounded-xl
                            shadow-lg
                            shadow-indigo-200
                            transition-all
                            active:scale-95
                            disabled:opacity-70
                            disabled:cursor-not-allowed
                            flex
                            justify-center
                            items-center
                            gap-2
                        "
                    >
                        {loading ? (
                            <>
                                <Loader2
                                    className="animate-spin"
                                    size={20}
                                />
                                Đang xử lý...
                            </>
                        ) : (
                            "Đăng ký"
                        )}
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <div className="mt-4 flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg border border-red-100">
                        <AlertCircle size={18} />
                        <span className="text-sm font-medium">
                            {error}
                        </span>
                    </div>
                )}

                {/* Success */}
                {message && (
                    <div className="mt-4 flex items-center gap-2 bg-green-50 text-green-600 p-3 rounded-lg border border-green-100">
                        <CheckCircle size={18} />
                        <span className="text-sm font-medium">
                            {message}
                        </span>
                    </div>
                )}

                {/* Footer */}
                <p className="text-center mt-8 text-gray-600 text-sm">
                    Đã có tài khoản?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-600 font-bold hover:underline"
                    >
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;