import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const ROOM_TYPES_ENDPOINT = "/room-types";
const PLACEHOLDER = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
const ROOMS_PER_PAGE = 3;

function getRoomImages(row) {
  const images = [row.image1, row.image2].filter(Boolean);
  return images.length > 0 ? images : [PLACEHOLDER];
}

/* ---- Card hiển thị từng loại phòng (Đã nâng cấp) ---- */
function RoomCard({ room }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const images = getRoomImages(room);
  const [imgIdx, setImgIdx] = useState(0);
  const hasMultiple = images.length > 1;

  const handleBookingClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/booking");
    }
  };

  return (
    <div className="group bg-white border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      {/* Khối Ảnh */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={images[imgIdx]}
          alt={room.room_name}

          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay gradient che nhẹ phía dưới để nổi bật text nếu cần */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />

        {/* Nút điều hướng ảnh (Glassmorphism style) */}
        {hasMultiple && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + images.length) % images.length); }}
              className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-black hover:bg-white transition-all shadow-md"
            >
              <span className="mb-0.5 mr-0.5">‹</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % images.length); }}
              className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-black hover:bg-white transition-all shadow-md"
            >
              <span className="mb-0.5 ml-0.5">›</span>
            </button>
          </div>
        )}

        {/* Badge giá góc trên */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold tracking-widest uppercase shadow-sm">
          Recommended
        </div>
      </div>

      {/* Thông tin phòng */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-sans font-medium text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
            {room.room_name}
          </h3>
          <div className="flex items-center text-xs text-slate-400">
            <span className="mr-1">👤</span> {room.max_guests}
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
          {room.description || "Trải nghiệm không gian nghỉ dưỡng sang trọng với đầy đủ tiện nghi hiện đại."}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Giá từ</span>
            <p className="text-lg font-semibold text-slate-900">
              {Number(room.price_per_night).toLocaleString("vi-VN")}₫
              <span className="text-xs font-normal text-slate-400 ml-1">/ đêm</span>
            </p>
          </div>

          <button
            onClick={handleBookingClick}
            className="relative overflow-hidden px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-emerald-700 active:scale-95"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

const Rooms = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(ROOM_TYPES_ENDPOINT);
      setRoomTypes(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const totalPages = Math.ceil(roomTypes.length / ROOMS_PER_PAGE);
  const visibleRooms = roomTypes.slice(page * ROOMS_PER_PAGE, (page + 1) * ROOMS_PER_PAGE);

  return (
    <section id="rooms" className="py-24 bg-[#fcfcfc]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header với Divider tinh tế */}
        <div className="relative mb-16 text-center">
          <span className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-xs">Accommodations</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-2 mb-4 text-slate-900">Rooms & Suites</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto"></div>

          {/* Navigation bên phải (Desktop) */}
          {totalPages > 1 && (
            <div className="hidden md:flex absolute right-0 bottom-0 gap-3">
              <button
                onClick={() => setPage(p => (p - 1 + totalPages) % totalPages)}
                className="w-12 h-12 border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"
              >
                ‹
              </button>
              <button
                onClick={() => setPage(p => (p + 1) % totalPages)}
                className="w-12 h-12 border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>

            {/* Pagination cho Mobile & Indicator */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`h-1.5 transition-all duration-300 ${i === page ? "w-8 bg-emerald-600" : "w-2 bg-slate-200"}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Trang {page + 1} / {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Rooms;