import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Home/HomeNavabar";
import Footer from "../components/Home/HomeFooter";
import { roomService } from "../services/roomService";
import Loading from "./Loading";
import { useAuth } from "../hooks/useAuth.js";
import Pagination from "../components/common/Pagination";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";

/* ---- Card kết quả tìm kiếm ---- */
function SearchRoomCard({ room }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const images = room.images && room.images.length > 0 ? room.images : [PLACEHOLDER];
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
      {/* Ảnh */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={images[imgIdx]}
          alt={room.room_name || "Room"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badge số phòng trống */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${room.available_rooms > 0
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
              }`}
          >
            {room.available_rooms > 0
              ? `${room.available_rooms} phòng trống`
              : "Hết phòng"}
          </span>
        </div>

        {/* Nút prev / next */}
        {hasMultiple && (
          <>
            <button
              aria-label="Ảnh trước"
              onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              ‹
            </button>
            <button
              aria-label="Ảnh sau"
              onClick={() => setImgIdx((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              ›
            </button>

            {/* Dot indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? "bg-white" : "bg-white/50"
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thông tin */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{room.room_name}</h3>

        {room.description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{room.description}</p>
        )}

        <div className="flex items-center justify-between">
          {room.price_per_night != null && (
            <p className="text-lg font-bold text-emerald-600">
              {Number(room.price_per_night).toLocaleString("vi-VN")}₫
              <span className="text-sm font-normal text-gray-400"> / đêm</span>
            </p>
          )}

          {room.max_guests != null && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span>👤</span> Tối đa {room.max_guests} khách
            </p>
          )}
        </div>

        {/* Nút đặt phòng */}
        {room.available_rooms > 0 && (
          <button
            onClick={handleBookingClick}
            className="w-full mt-4 block text-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider text-sm transition-all duration-300 shadow-md hover:shadow-amber-500/30"
          >
            Đặt phòng ngay
          </button>
        )}
      </div>
    </div>
  );
}

/* ---- Trang kết quả tìm kiếm ---- */
const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const sort = searchParams.get("sort") || "";
  const requestedPage = Number(searchParams.get("page"));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!keyword) {
      setResults([]);
      setPagination({ currentPage: 1, totalPages: 0, totalItems: 0 });
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await roomService.getRoomTypesSearch(keyword, sort, page);
        if (!cancelled) {
          setResults(Array.isArray(res.data?.data) ? res.data.data : []);
          setPagination(res.data?.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
          });
          if (res.data?.pagination?.currentPage && res.data.pagination.currentPage !== page) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("page", String(res.data.pagination.currentPage));
            setSearchParams(nextParams, { replace: true });
          }
        }
      } catch {
        if (!cancelled) {
          setError("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.");
          setResults([]);
          setPagination({ currentPage: 1, totalPages: 0, totalItems: 0 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [keyword, sort, page, searchParams, setSearchParams]);

  const handleSortChange = (event) => {
    const nextParams = new URLSearchParams(searchParams);
    if (event.target.value) {
      nextParams.set("sort", event.target.value);
    } else {
      nextParams.delete("sort");
    }
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const handlePageChange = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div
        className="pt-24 pb-12 px-4"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-sans font-bold text-white mb-3 tracking-normal">
            Kết quả tìm kiếm
          </h1>
          {keyword && (
            <p className="text-white/70 text-lg">
              Từ khóa: <span className="text-amber-400 font-semibold">"{keyword}"</span>
            </p>
          )}
        </div>
      </div>

      {/* Nội dung */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Loading */}
        {loading && (
          <Loading />
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-500 text-lg font-medium">{error}</p>
            <Link
              to="/home"
              className="inline-block mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all"
            >
              Quay về trang chủ
            </Link>
          </div>
        )}

        {/* Không có từ khóa */}
        {!loading && !error && !keyword && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">
              Vui lòng nhập từ khóa để tìm kiếm phòng.
            </p>
            <Link
              to="/home"
              className="inline-block mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all"
            >
              Quay về trang chủ
            </Link>
          </div>
        )}

        {/* Không tìm thấy */}
        {!loading && !error && keyword && pagination.totalItems === 0 && (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">😔</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Không tìm thấy kết quả
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Không có phòng nào phù hợp với từ khóa{" "}
              <span className="font-semibold text-amber-600">"{keyword}"</span>.
              Hãy thử tìm kiếm với từ khóa khác.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/home"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all"
              >
                Quay về trang chủ
              </Link>
            </div>
          </div>
        )}

        {/* Hiển thị kết quả */}
        {!loading && !error && pagination.totalItems > 0 && (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-500 text-sm">
                Tìm thấy{" "}
                <span className="font-bold text-amber-600 text-base">
                  {pagination.totalItems}
                </span>{" "}
                loại phòng phù hợp
              </p>
              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                Sắp xếp theo giá
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="">Mặc định</option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                </select>
              </label>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((room) => (
                <SearchRoomCard key={room.id} room={room} />
              ))}
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
