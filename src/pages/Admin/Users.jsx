import { useEffect, useState, useCallback } from "react";
import { Edit, UserX, UserMinus, Plus, KeyRound, ChevronLeft, ChevronRight } from "lucide-react";
import UserModal from "../../components/Admin/UserModal";
import Pagination from "../../components/common/Pagination";
import { userService } from "../../services/userService";
import Loading from "../Loading";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        user_name: "", email: "", password: "", role_user: "user", status_user: "active"
    });

    // State cho phân trang
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1
    });
    const [loading, setLoading] = useState(false);
    const limit = 6;

    // Hàm lấy dữ liệu (sử dụng useCallback để tránh tạo lại hàm không cần thiết)
    const fetchUsers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await userService.getUsers(page, limit);
            setUsers(res.data.data);
            setPagination({
                currentPage: res.data.pagination.currentPage,
                totalPages: res.data.pagination.totalPages
            });
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(1);
    }, [fetchUsers]);

    // Các hàm xử lý giữ nguyên logic của bạn
    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({ user_name: "", email: "", password: "", role_user: "user", status_user: "active" });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user) => {
        setEditingId(user.id);
        setFormData({ ...user, password: "" });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
            try {
                await userService.deleteUser(id);
                // Load lại trang hiện tại sau khi xóa
                fetchUsers(pagination.currentPage);
                alert("Đã xóa thành công!");
            } catch (err) {
                alert("Không thể xóa người dùng này.");
            }
        }
    };

    const handleDeleteTrue = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn?")) {
            try {
                await userService.forceDeleteUser(id);
                // Load lại trang hiện tại sau khi xóa
                fetchUsers(pagination.currentPage);
                alert("Đã xóa vĩnh viễn!");
            } catch (err) {
                alert("Không thể xóa người dùng này.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await userService.updateUser(editingId, formData);
            } else {
                await userService.createUser(formData);
            }
            setIsModalOpen(false);
            fetchUsers(pagination.currentPage);
        } catch (err) {
            alert("Lỗi: " + err.response?.data?.message);
        }
    };

    const handleResetPassword = async (user) => {
        const randomPassword = Math.random().toString(36).slice(-8);
        if (window.confirm(`Cấp mật khẩu mới cho [${user.user_name}]: ${randomPassword}`)) {
            try {
                await userService.updatePassword(user.id, randomPassword);
                alert(`Thành công! Mật khẩu mới là: ${randomPassword}`);
            } catch (err) {
                alert("Lỗi khi đặt lại mật khẩu!");
            }
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-0 max-w-7xl mx-auto font-sans text-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-lake font-serif tracking-tight">Quản lý tài khoản</h1>
                    <p className="text-slate-500 text-sm mt-1">Danh sách nhân sự quản trị hệ thống LakeSide</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="bg-brand-lake hover:bg-brand-lake-light text-brand-gold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-brand-lake/10 active:scale-95 cursor-pointer font-semibold text-sm"
                >
                    <Plus size={18} /> Thêm tài khoản
                </button>
            </div>

            <div className="space-y-3.5 mb-8">
                {users.map((u) => (
                    <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:border-brand-gold/30 transition-all duration-300 gap-4 group">
                        <div className="flex-1">
                            <h3 className="font-bold text-base text-brand-lake font-serif tracking-wide">{u.user_name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                        </div>

                        <div className="flex items-center gap-6 sm:flex-1 justify-start sm:justify-center">
                            <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-full text-slate-600 uppercase tracking-wider">
                                {u.role_user}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${u.status_user === 'ACTIVE' ? 'bg-brand-pine' : 'bg-rose-500'}`}></span>
                                <span className="text-sm font-semibold text-slate-600">
                                    {u.status_user === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity justify-end">
                            <button onClick={() => handleResetPassword(u)} className="p-2 hover:bg-amber-50 hover:text-amber-600 text-slate-400 rounded-lg transition-colors cursor-pointer" title="Cấp mật khẩu mới"><KeyRound size={16} /></button>
                            <button onClick={() => handleOpenEdit(u)} className="p-2 hover:bg-brand-gold/10 hover:text-brand-gold text-slate-400 rounded-lg transition-colors cursor-pointer" title="Sửa"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(u.id)} className="p-2 hover:bg-amber-50 hover:text-amber-500 text-slate-400 rounded-lg transition-colors cursor-pointer" title="Khóa/Xóa mềm"><UserMinus size={16} /></button>
                            <button onClick={() => handleDeleteTrue(u.id)} className="p-2 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-colors cursor-pointer" title="Xóa vĩnh viễn"><UserX size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* THANH PHÂN TRANG (PAGINATION) */}
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={fetchUsers}
            />

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!editingId}
            />
        </div>
    );
};

export default Users;