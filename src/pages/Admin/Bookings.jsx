import { useEffect, useState, useCallback } from "react";
import { bookingService } from "../../services/bookingService";
import Pagination from "../../components/common/Pagination";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  Calendar,
  Filter
} from "lucide-react";
import Update from "../../components/BookingPages/Update";

import BookingTable from "../../components/BookingPages/BookingTable";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({ status: "BOOKED", payFull: false });

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    check_in: "",
    check_out: "",
    id_card: ""
  });

  const [searchInput, setSearchInput] = useState("");

  // ================= FETCH =================
  const fetchBookings = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await bookingService.getBookings({
        params: { page, limit, ...filters }
      });
      setBookings(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, fetchBookings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  // ================= ACTION =================
  const openModal = (booking) => {
    setEditingBooking(booking);
    setFormData({ status: booking.status, payFull: false });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookingService.updateStatus(editingBooking.id, { status: formData.status });

      if (formData.payFull && Number(editingBooking?.remaining_amount) > 0) {
        await bookingService.payFull(editingBooking.id, { payment_method: "cash" });
      }
      setIsModalOpen(false);
      fetchBookings(currentPage);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa booking này?")) return;
    try {
      await bookingService.deleteBooking(id);
      fetchBookings(currentPage);
    } catch {
      alert("Không thể xóa");
    }
  };

  const handleReset = () => {
    setFilters({ status: "", search: "", check_in: "", check_out: "", id_card: "" });
    setSearchInput("");
    setCurrentPage(1);
  };


  return (
    <div className="p-0 font-sans text-slate-700">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-lake tracking-tight font-serif">
            Quản lý Đặt phòng
          </h1>
          <p className="text-slate-500 text-sm mt-1">Hiển thị {bookings.length} kết quả trên trang {currentPage}</p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-brand-gold hover:border-brand-gold/30 hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer font-medium text-sm"
        >
          <RotateCcw size={16} /> <span>Làm mới bộ lọc</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">

        {/* FILTER BAR */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[280px] relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-gold transition-colors" size={18} />
            <input
              placeholder="Tìm tên khách, số phòng..."
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200/80 focus:ring-2 focus:ring-brand-gold rounded-xl pl-11 pr-4 py-2.5 transition-all outline-none text-sm text-slate-700"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <select
                className="appearance-none bg-slate-50 border-none ring-1 ring-slate-200/80 focus:ring-2 focus:ring-brand-gold rounded-xl pl-10 pr-9 py-2.5 outline-none text-sm text-slate-600 cursor-pointer"
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="BOOKED">Chờ nhận phòng</option>
                <option value="checked_in">Đã nhận phòng</option>
                <option value="checked_out">Đã trả phòng</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 ring-1 ring-slate-200/80 rounded-xl px-3.5 py-1">
              <Calendar size={15} className="text-slate-400" />
              <input
                type="date"
                className="bg-transparent border-none focus:ring-0 text-sm p-1.5 outline-none text-slate-600 cursor-pointer"
                value={filters.check_in}
                onChange={e => setFilters({ ...filters, check_in: e.target.value })}
              />
              <span className="text-slate-300">|</span>
              <input
                type="date"
                className="bg-transparent border-none focus:ring-0 text-sm p-1.5 outline-none text-slate-600 cursor-pointer"
                value={filters.check_out}
                onChange={e => setFilters({ ...filters, check_out: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <BookingTable
          bookings={bookings}
          loading={loading}
          limit={6}
          onEdit={openModal}
          onDelete={handleDelete}
        />

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* MODERN MODAL */}
        <Update
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingBooking={editingBooking}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit} />
      </div >
    </div>
  );

}
export default Bookings;