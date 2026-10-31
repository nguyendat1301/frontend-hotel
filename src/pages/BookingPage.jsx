import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Calendar, User, CreditCard, Phone, Mail,
  CheckCircle2, MapPin, Star, Info, X, ShieldCheck, Users,
  Plus, Minus, Trash2, BedDouble, AlertCircle, Sparkles
} from "lucide-react";
import Navbar from "../components/Home/HomeNavabar";
import Footer from "../components/Home/HomeFooter";
import { bookingService } from "../services/bookingService";
import { roomService } from "../services/roomService";
import Pay from "../components/BookingPages/Pay";
import DetailRoom from "../components/BookingPages/DetailRoom";
import { calculateDateNights, getTodayDateOnly } from "../utils/dateOnly";

const BookingPage = () => {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    id_card: "",
    check_in: "",
    check_out: ""
  });

  const [bookingSummary, setBookingSummary] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [dateChangeNotice, setDateChangeNotice] = useState("");

  // State cho Modal chi tiết
  const [viewingRoomDetail, setViewingRoomDetail] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchRoomTypes = async () => {
      try {
        const res = await roomService.getRoomTypes();
        setRoomTypes(res.data);
      } catch (err) {
        console.error("Lỗi tải loại phòng");
      }
    };

    setForm(prev => ({
      ...prev,
      full_name: user.user_name || "",
      email: user.email || "",
    }));
    fetchRoomTypes();
  }, [user, navigate]);

  const calculateNights = () => {
    if (!form.check_in || !form.check_out) return 1;
    const nights = calculateDateNights(form.check_in, form.check_out);
    if (nights === null || nights < 1) return 1;
    return nights;
  };

  const nights = calculateNights();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Khi người dùng thay đổi ngày nhận hoặc ngày trả phòng
    if (name === "check_in" || name === "check_out") {
      if (selectedRooms.length > 0) {
        setSelectedRooms([]);
        setDateChangeNotice("Bạn vừa thay đổi ngày lưu trú. Danh sách phòng đã chọn đã được đặt lại để bạn kiểm tra lại tính khả dụng.");
      }
      setAvailableRooms([]);
      setSearchAttempted(false);
      setAvailabilityMessage("");
    }
  };

  const calculateTotal = () => {
    const n = calculateNights();
    return selectedRooms.reduce((sum, r) => {
      const price = Number(r.price_per_night) || 0;
      return sum + price * n;
    }, 0);
  };

  const handleSearch = async () => {
    if (!form.check_in || !form.check_out) {
      return alert("Vui lòng chọn ngày nhận phòng và ngày trả phòng!");
    }
    if (form.check_in >= form.check_out) {
      return alert("Ngày nhận phòng phải trước ngày trả phòng!");
    }

    setDateChangeNotice("");
    setSearchAttempted(true);
    setAvailabilityMessage("");
    setLoading(true);

    try {
      // Truy vấn phòng trống (có lọc theo selectedType nếu người dùng chọn)
      const res = await roomService.getAvailableRooms(form.check_in, form.check_out, selectedType || undefined);
      const roomsData = Array.isArray(res.data) ? res.data : [];
      setAvailableRooms(roomsData);

      // Nếu đang có phòng đã chọn, kiểm tra xem phòng đó còn trống trong danh sách mới không
      if (selectedRooms.length > 0) {
        const stillAvailable = selectedRooms.filter(sr =>
          roomsData.some(ar => ar.id === sr.id)
        );
        if (stillAvailable.length !== selectedRooms.length) {
          setSelectedRooms(stillAvailable);
          alert("Một số phòng bạn chọn trước đó không còn trống trong thời gian mới và đã được loại bỏ.");
        }
      }

      if (roomsData.length === 0) {
        setAvailabilityMessage("Rất tiếc, không còn phòng trống trong khoảng thời gian này.");
      }
    } catch {
      setAvailableRooms([]);
      setAvailabilityMessage("Lỗi kết nối máy chủ khi kiểm tra phòng trống.");
    } finally {
      setLoading(false);
    }
  };

  // Thêm hoặc gỡ phòng khỏi danh sách đã chọn
  const toggleRoomSelection = (room) => {
    const exists = selectedRooms.find(r => r.id === room.id);
    if (exists) {
      setSelectedRooms(selectedRooms.filter(r => r.id !== room.id));
    } else {
      setSelectedRooms([
        ...selectedRooms,
        {
          ...room,
          subtotal: (Number(room.price_per_night) || 0) * nights,
        }
      ]);
    }
  };

  const removeSelectedRoom = (roomId) => {
    setSelectedRooms(selectedRooms.filter(r => r.id !== roomId));
  };

  const handleShowInvoice = () => {
    if (selectedRooms.length === 0) {
      return alert("Vui lòng chọn ít nhất một phòng trước khi tiếp tục!");
    }
    const total = calculateTotal();
    const updatedRooms = selectedRooms.map(r => ({
      ...r,
      subtotal: (Number(r.price_per_night) || 0) * nights
    }));

    setBookingSummary({
      total,
      nights,
      totalRooms: selectedRooms.length,
      rooms: updatedRooms
    });
    setPaymentAmount(Math.round(total / 2)); // Mặc định cọc 50%
  };

  const handleFinalBooking = async (method) => {
    try {
      const total = calculateTotal();
      const payload = {
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        id_card: form.id_card,
        check_in_date: form.check_in,
        check_out_date: form.check_out,
        rooms: selectedRooms.map(r => ({
          roomId: r.id
        })),
        payment_amount: paymentAmount,
        payment_method: method
      };

      const res = await bookingService.createBooking(payload);
      alert(`🎉 Đặt thành công ${res.data.total_rooms || selectedRooms.length} phòng! Mã đơn hàng: #${res.data.bookingId}. Chúng tôi đã gửi email xác nhận cho bạn.`);
      navigate("/my-bookings");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Lỗi khi xử lý đơn đặt phòng!");
    }
  };
  return (
    <div className="bg-[#f8fafc]">
      <Navbar />
      <div className="min-h-screen py-12 px-4 font-sans text-slate-900 pt-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

          {/* CỘT TRÁI & GIỮA: FORM, CHỌN HẠNG PHÒNG VÀ DANH SÁCH PHÒNG TRỐNG */}
          <div className="lg:col-span-2 space-y-6">

            {/* THÔNG TIN KHÁCH HÀNG & THỜI GIAN LƯU TRÚ */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                <User className="text-indigo-600" /> Thông tin đặt phòng & Thời gian lưu trú
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 ml-1">Họ và tên</label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 ml-1">Số CCCD / Passport</label>
                  <input
                    name="id_card"
                    value={form.id_card}
                    onChange={handleChange}
                    placeholder="012345678910"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 ml-1">Số điện thoại</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0987654321"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 ml-1">Địa chỉ Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-indigo-600 ml-1 flex items-center gap-1">
                    <Calendar size={14} /> Ngày nhận phòng
                  </label>
                  <input
                    type="date"
                    name="check_in"
                    value={form.check_in}
                    min={getTodayDateOnly()}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-indigo-100 bg-indigo-50/30 outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-rose-600 ml-1 flex items-center gap-1">
                    <Calendar size={14} /> Ngày trả phòng
                  </label>
                  <input
                    type="date"
                    name="check_out"
                    value={form.check_out}
                    min={form.check_in || getTodayDateOnly()}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 outline-none focus:ring-2 focus:ring-rose-500 font-medium cursor-pointer"
                  />
                </div>
              </div>

              {dateChangeNotice && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{dateChangeNotice}</span>
                </div>
              )}
            </div>

            {/* BỘ LỌC HẠNG PHÒNG */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                  <Star className="text-yellow-500" fill="currentColor" /> Chọn hạng phòng muốn xem
                </h2>
                {selectedType && (
                  <button
                    onClick={() => setSelectedType("")}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
                  >
                    Xem tất cả hạng phòng
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setSelectedType("")}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-center items-center text-center ${selectedType === ""
                    ? "border-indigo-600 bg-indigo-50/50 shadow-md"
                    : "border-slate-100 hover:border-indigo-200 bg-white"
                    }`}
                >
                  <Sparkles size={24} className={selectedType === "" ? "text-indigo-600" : "text-slate-400"} />
                  <p className="font-bold text-sm mt-2 text-slate-800">Tất cả hạng phòng</p>
                  <p className="text-xs text-slate-400 mt-0.5">Tìm kiếm toàn bộ phòng trống</p>
                </div>

                {roomTypes.map(type => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`relative p-3 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${selectedType === type.id
                      ? "border-indigo-600 bg-indigo-50/50 shadow-md"
                      : "border-slate-100 hover:border-indigo-200 bg-white"
                      }`}
                  >
                    <div className="relative h-28 mb-3 overflow-hidden rounded-xl">
                      <img src={type.image1} alt={type.room_name} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setViewingRoomDetail(type); }}
                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white transition-colors"
                        title="Xem chi tiết hạng phòng"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{type.room_name}</h3>
                        <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                          <Users size={12} /> Tối đa {type.max_guests} khách
                        </p>
                      </div>
                      <p className="text-indigo-600 font-bold text-xs text-right">
                        {Number(type.price_per_night).toLocaleString()}₫
                        <span className="block text-[9px] text-slate-400 font-normal">/ đêm</span>
                      </p>
                    </div>
                    {selectedType === type.id && (
                      <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-1 shadow-lg">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Kiểm tra phòng khả dụng ({nights} đêm)</>
                )}
              </button>
            </div>

            {/* DANH SÁCH CÁC PHÒNG KHẢ DỤNG ĐỂ CHỌN */}
            {searchAttempted && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                      <BedDouble className="text-emerald-500" /> Danh sách phòng trống
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Nhấp vào từng phòng để chọn hoặc bỏ chọn. Bạn có thể chọn nhiều phòng cùng lúc.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 w-fit">
                    {availableRooms.length} phòng khả dụng
                  </span>
                </div>

                {availableRooms.length > 0 ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {availableRooms.map(room => {
                      const isSelected = selectedRooms.some(r => r.id === room.id);
                      return (
                        <div
                          key={room.id}
                          onClick={() => toggleRoomSelection(room)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${isSelected
                            ? "border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20"
                            : "border-slate-200 hover:border-indigo-300 bg-white"
                            }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                                }`}>
                                Phòng {room.room_number}
                              </span>
                              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                {room.room_name}
                              </span>
                            </div>

                            <div className="text-xs text-slate-500 space-y-1 mt-3">
                              <p className="flex items-center gap-1">
                                <Users size={13} className="text-slate-400" /> Tối đa: <b>{room.max_guests} khách</b>
                              </p>
                              <p className="text-slate-800 font-bold">
                                {Number(room.price_per_night).toLocaleString()}₫ <span className="text-[10px] text-slate-400 font-normal">/ đêm</span>
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className={`text-xs font-bold flex items-center gap-1 ${isSelected ? "text-emerald-700" : "text-slate-400"
                              }`}>
                              {isSelected ? (
                                <>
                                  <CheckCircle2 size={15} className="text-emerald-600" /> Đã chọn
                                </>
                              ) : (
                                "+ Nhấn để chọn"
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingRoomDetail(room);
                              }}
                              className="text-slate-400 hover:text-indigo-600 p-1"
                              title="Xem chi tiết"
                            >
                              <Info size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-base font-semibold">{availabilityMessage || "Không tìm thấy phòng trống phù hợp."}</p>
                    <p className="text-xs mt-1">Hãy thử chọn khoảng thời gian khác hoặc kiểm tra hạng phòng khác.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: GIỎ PHÒNG ĐÃ CHỌN & TẠM TÍNH ĐƠN HÀNG */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-28 space-y-6">
              <div>
                <h2 className="text-xl font-bold flex items-center justify-between text-slate-800">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="text-indigo-600" /> Phòng đã chọn
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                    {selectedRooms.length} phòng
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Kỳ nghỉ: {nights} đêm ({form.check_in || "..."} → {form.check_out || "..."})
                </p>
              </div>

              {selectedRooms.length > 0 ? (
                <div className="space-y-4">
                  {/* Danh sách phòng đã chọn với số khách */}
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {selectedRooms.map((room) => {
                      const roomSubtotal = (Number(room.price_per_night) || 0) * nights;
                      return (
                        <div
                          key={room.id}
                          className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 relative group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">
                                Phòng {room.room_number} <span className="text-xs font-medium text-indigo-600">({room.room_name})</span>
                              </p>
                              <p className="text-xs text-slate-500">
                                {Number(room.price_per_night).toLocaleString()}₫ × {nights} đêm
                              </p>
                            </div>
                            <button
                              onClick={() => removeSelectedRoom(room.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="Bỏ phòng này"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="text-right text-xs font-bold text-emerald-600">
                            Thành tiền: {roomSubtotal.toLocaleString()}₫
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chi tiết tổng tiền */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Tổng số phòng:</span>
                      <span className="font-semibold text-slate-900">{selectedRooms.length} phòng</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Thời gian:</span>
                      <span className="font-semibold text-slate-900">{nights} đêm</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                      <span>Tổng tiền:</span>
                      <span className="text-indigo-600">{calculateTotal().toLocaleString()}₫</span>
                    </div>
                  </div>

                  <button
                    onClick={handleShowInvoice}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Tiến hành đặt phòng <ShieldCheck size={18} />
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center mx-auto">
                    <BedDouble size={28} />
                  </div>
                  <p className="text-slate-500 font-semibold text-sm">Chưa có phòng nào được chọn</p>
                  <p className="text-slate-400 text-xs px-2 leading-relaxed">
                    Vui lòng chọn ngày nhận/trả phòng, ấn <b>Kiểm tra phòng khả dụng</b> và tích chọn các phòng bạn muốn đặt.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* MODAL CHI TIẾT PHÒNG */}
        <DetailRoom
          viewingRoomDetail={viewingRoomDetail}
          setViewingRoomDetail={setViewingRoomDetail}
          setSelectedType={setSelectedType}
        />

        {/* MODAL THANH TOÁN (Hỗ trợ đặt nhiều phòng) */}
        <Pay
          bookingSummary={bookingSummary}
          form={form}
          selectedRooms={selectedRooms}
          paymentAmount={paymentAmount}
          setPaymentAmount={setPaymentAmount}
          onConfirm={handleFinalBooking}
          onClose={() => setBookingSummary(null)}
        />

      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;