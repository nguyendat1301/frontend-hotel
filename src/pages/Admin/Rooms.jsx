import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import {
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Pagination from "../../components/common/Pagination";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    room_number: "",
    room_type_id: "",
    status: "available"
  });

  // ================= FETCH ROOMS =================
  const fetchRooms = useCallback(async (page = 1, search = "") => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) {
      params.append("search", search);
    }
    const res = await api.get(`/rooms?${params.toString()}`);
    return res.data;
  }, []);

  // ================= FETCH ROOM TYPES =================
  const fetchRoomTypes = useCallback(async () => {
    const res = await api.get("/room-types");
    return res.data;
  }, []);

  useEffect(() => {
    let active = true;
    fetchRooms(currentPage, searchQuery)
      .then((result) => {
        if (!active) return;
        setRooms(result.data);
        setTotalPages(result.pagination.totalPages);
      })
      .catch((err) => console.error("Lỗi fetch rooms:", err));

    return () => {
      active = false;
    };
  }, [currentPage, searchQuery, fetchRooms]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      setSearchQuery(searchInput.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    fetchRoomTypes()
      .then((data) => {
        if (active) setRoomTypes(data);
      })
      .catch((err) => console.error("Lỗi fetch room types:", err));

    return () => {
      active = false;
    };
  }, [fetchRoomTypes]);

  const refreshRooms = async (page = 1, search = "") => {
    try {
      const result = await fetchRooms(page, search);
      setRooms(result.data);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      console.error("Lỗi fetch rooms:", err);
    }
  };

  // ================= OPEN MODAL =================
  const openModal = (room = null) => {
    if (room) {
      setEditingId(room.id);
      setFormData({
        room_number: room.room_number,
        room_type_id: room.room_type_id,
        status: room.status || "available"
      });
    } else {
      setEditingId(null);
      setFormData({
        room_number: "",
        room_type_id: "",
        status: "available"
      });
    }
    setIsModalOpen(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(
          `/rooms/${editingId}`,
          formData
        );
      } else {
        await api.post(
          "/rooms",
          formData
        );
        setCurrentPage(1); // về trang đầu
      }

      setIsModalOpen(false);
      await refreshRooms(currentPage, searchQuery);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;

    try {
      await api.delete(`/rooms/${id}`);

      if (rooms.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        await refreshRooms(currentPage, searchQuery);
      }
    } catch {
      alert("Không thể xóa");
    }
  };

  return (
    <div className="p-0 font-sans text-slate-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-brand-lake tracking-tight font-serif">
            Quản lý phòng
          </h1>
          <p className="text-slate-500 text-sm mt-1">Trang {currentPage} trên tổng số {totalPages} trang</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo số phòng..."
            className="w-56 bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold transition-all"
          />
          <button
            onClick={() => openModal()}
            className="bg-brand-lake hover:bg-brand-lake-light text-brand-gold px-5 py-2.5 rounded-xl flex gap-2 items-center text-sm font-semibold shadow-md shadow-brand-lake/10 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={18} /> Thêm phòng
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {rooms.map(r => (
          <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-gold/30 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-lg text-brand-lake tracking-tight">
                  Phòng {r.room_number}
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${r.status === "available"
                  ? "bg-brand-pine/5 text-brand-pine border-brand-pine/20"
                  : r.status === "occupied"
                    ? "bg-amber-50 text-amber-700 border-amber-200/50"
                    : "bg-red-50 text-red-700 border-red-200/40"
                  }`}>
                  {r.status === "available" ? "Sẵn sàng" : r.status === "occupied" ? "Đang có khách" : "Bảo trì"}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-400 mt-2 tracking-wide uppercase">
                Loại phòng
              </p>
              <p className="text-sm font-bold text-slate-700 mt-0.5 font-serif">
                {r.room_name}
              </p>
            </div>

            {/* ACTION */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-slate-50 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(r)} className="p-2 hover:bg-brand-gold/10 hover:text-brand-gold text-slate-400 rounded-lg transition-colors cursor-pointer" title="Sửa">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(r.id)} className="p-2 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-colors cursor-pointer" title="Xóa">
                <Trash2 size={16} />
              </button>
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
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-brand-lake/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-100/50">

            <h2 className="mb-5 font-bold text-xl text-brand-lake font-serif border-b border-slate-50 pb-3">
              {editingId ? "Sửa phòng nghỉ" : "Thêm phòng nghỉ"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Số phòng</label>
                <input
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-gold rounded-xl px-3.5 py-2.5 outline-none text-slate-700 font-semibold"
                  placeholder="Ví dụ: 301"
                  value={formData.room_number}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      room_number: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Loại phòng nghỉ</label>
                <select
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-gold rounded-xl px-3 py-2.5 outline-none text-slate-600 cursor-pointer"
                  value={formData.room_type_id}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      room_type_id: e.target.value
                    })
                  }
                  required
                >
                  <option value="">Chọn loại phòng</option>
                  {roomTypes.map(rt => (
                    <option key={rt.id} value={rt.id}>
                      {rt.room_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Trạng thái phòng</label>
                <select
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-gold rounded-xl px-3 py-2.5 outline-none text-slate-600 cursor-pointer"
                  value={formData.status}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      status: e.target.value
                    })
                  }
                >
                  <option value="available">Sẵn sàng (Available)</option>
                  <option value="maintenance">Bảo trì (Maintenance)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-50 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4.5 py-2.5 text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="bg-brand-lake hover:bg-brand-lake-light text-brand-gold px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Rooms;