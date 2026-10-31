import { useEffect, useState, useCallback } from "react";
import { customerService } from "../../services/customerService";
import Create from "../../components/Customer/Create";
import Pagination from "../../components/common/Pagination";
import {
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  CalendarCheck
} from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    id_card: ""
  });

  const fetchCustomers = useCallback(async (page = 1, search = "") => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.append("search", search);

      const res = await customerService.getCustomers(params);

      // Backend trả về: { data: [...], pagination: { totalPages: ... } }
      setCustomers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Lỗi fetch customers:", err);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchCustomers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      setSearchQuery(searchInput.trim());
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const openModal = (customer = null) => {
    if (customer) {
      setEditingId(customer.id);
      setFormData({
        full_name: customer.full_name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        id_card: customer.id_card || ""
      });
    } else {
      setEditingId(null);
      setFormData({ full_name: "", email: "", phone: "", id_card: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await customerService.updateCustomer(editingId, formData);
      } else {
        await customerService.createCustomer(formData);
        setCurrentPage(1);
      }
      setIsModalOpen(false);
      fetchCustomers(currentPage, searchQuery);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await customerService.deleteCustomer(id);
      fetchCustomers(currentPage, searchQuery);
    } catch {
      alert("Không thể xóa khách hàng");
    }
  };

  return (
    <div className="p-0 font-sans text-slate-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-brand-lake tracking-tight font-serif">Quản lý khách hàng</h1>
          <p className="text-slate-500 text-sm mt-1">Trang {currentPage} trên tổng số {totalPages} trang</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm tên hoặc SĐT..."
            className="w-64 bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold transition-all"
          />
          <button
            onClick={() => openModal()}
            className="bg-brand-lake hover:bg-brand-lake-light text-brand-gold px-5 py-2.5 rounded-xl flex gap-2 items-center text-sm font-semibold shadow-md shadow-brand-lake/10 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={18} /> Thêm mới
          </button>
        </div>
      </div>

      {/* CUSTOMER LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {customers.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-gold/30 transition-all duration-300 relative group flex flex-col justify-between">

            <div>
              {/* Hiển thị Total Bookings ở góc trên bên phải dạng Badge */}
              <div className="absolute top-5 right-5 flex flex-col items-end">
                <span className="bg-brand-gold/10 text-brand-gold text-[9px] font-bold px-2 py-0.5 rounded-full uppercase mb-2 border border-brand-gold/20">
                  Lượt đặt phòng
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-150">
                  <CalendarCheck size={13} className="text-brand-lake" />
                  <span>{c.total_bookings || 0} lần</span>
                </div>
              </div>

              <div className="bg-brand-lake/5 w-11 h-11 rounded-xl flex items-center justify-center text-brand-gold mb-4 border border-brand-gold/10">
                <User size={22} />
              </div>

              <h3 className="font-bold text-lg text-brand-lake font-serif mb-1.5">{c.full_name}</h3>

              <div className="space-y-1.5 mb-5 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" /> <span className="font-medium text-slate-600">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2 italic">
                  <Mail size={14} className="text-slate-400" /> <span>{c.email || "Chưa cập nhật email"}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-4 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1.5 ml-auto">
                <button onClick={() => openModal(c)} className="p-2 hover:bg-brand-gold/10 hover:text-brand-gold text-slate-400 rounded-lg transition-colors cursor-pointer" title="Sửa">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-colors cursor-pointer" title="Xóa">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* MODAL */}
      <Create
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingId={editingId} />
    </div>
  );
};

export default Customers;