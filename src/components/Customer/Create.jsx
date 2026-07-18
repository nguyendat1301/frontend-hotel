import { useEffect } from "react";
import { X } from "lucide-react";

const CustomerModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-brand-lake/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100/50">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-50 mb-6">
          <h2 className="font-bold text-xl text-brand-lake font-serif">
            {editingId ? "Cập nhật khách hàng" : "Đăng ký khách hàng mới"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Họ và tên
            </label>
            <input
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-gold rounded-xl px-3.5 py-2.5 outline-none text-slate-700 font-medium"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Số điện thoại
            </label>
            <input
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-gold rounded-xl px-3.5 py-2.5 outline-none text-slate-700 font-medium"
              placeholder="Ví dụ: 0987654321"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-gold rounded-xl px-3.5 py-2.5 outline-none text-slate-700 font-medium"
              placeholder="email@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              CCCD / Passport
            </label>
            <input
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-gold rounded-xl px-3.5 py-2.5 outline-none text-slate-700 font-medium"
              placeholder="Nhập số căn cước công dân..."
              value={formData.id_card}
              onChange={e => setFormData({ ...formData, id_card: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-50 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="bg-brand-lake hover:bg-brand-lake-light text-brand-gold px-5 py-2.5 rounded-xl font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              {editingId ? "Lưu thay đổi" : "Thêm khách hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
