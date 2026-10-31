import { X, Users, BedDouble, Info, ImageIcon } from "lucide-react";

const FALLBACK_IMAGE = "https://via.placeholder.com/800x450?text=Room";

const DetailRoom = ({ viewingRoomDetail, setViewingRoomDetail, selectedRoom }) => {
    // Nếu cả 2 state đều trống thì không hiện modal
    if (!viewingRoomDetail && !selectedRoom) return null;

    // Xác định nguồn dữ liệu đang được sử dụng
    const data = selectedRoom || viewingRoomDetail;

    // --- LOGIC LẤY ẢNH ---
    // Kiểm tra tất cả các trường có thể chứa ảnh từ API của bạn
    const displayImage = 
        data.room_image ||                  // Ảnh trả về trực tiếp trong Booking
        data.image1 ||                      // Ảnh từ RoomType (trang BookingPage)
        data.room_type?.image1 ||           // Ảnh lồng trong room_type (trang MyBookings)
        data.room?.room_type?.image1;

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex justify-center items-center z-[100] p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 text-slate-900 animate-in fade-in zoom-in duration-300">
                
                {/* Header Image Section */}
                <div className="relative h-72 bg-slate-200">
                    {displayImage ? (
                        <img 
                            src={displayImage} 
                            className="w-full h-full object-cover" 
                            alt="Room" 
                            // Xử lý nếu link ảnh từ server bị lỗi
                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon size={48} />
                            <p className="text-xs mt-2">Không có hình ảnh</p>
                        </div>
                    )}
                    
                    {/* Nút đóng góc phải */}
                    <button
                        onClick={() => setViewingRoomDetail(null)}
                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all hover:rotate-90"
                    >
                        <X size={20} className="text-black" />
                    </button>
                </div>

                <div className="p-8">
                    {/* Phần nội dung tương tự như trước... */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold">
                                {data.room_number ? `Phòng ${data.room_number}` : (data.room_name || "Chi tiết phòng")}
                            </h2>
                            <p className="text-indigo-500 font-medium">{data.room_type_name || "Hạng sang"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-indigo-600">
                                {Number(data.total_price || data.price_per_night || 0).toLocaleString()}₫
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                            <Users className="text-indigo-500" size={20} />
                            <div>
                                <p className="text-[10px] uppercase text-slate-400 font-bold">Sức chứa</p>
                                <p className="text-sm font-semibold">{data.max_guests || 2} Người lớn</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                            <BedDouble className="text-indigo-500" size={20} />
                            <div>
                                <p className="text-[10px] uppercase text-slate-400 font-bold">Loại giường</p>
                                <p className="text-sm font-semibold">Giường đôi lớn</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold flex items-center gap-2 italic"><Info size={16}/> Mô tả</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {data.description || "Tận hưởng không gian nghỉ dưỡng tuyệt vời với dịch vụ đạt chuẩn quốc tế."}
                        </p>
                    </div>

                    <button
                        onClick={() => setViewingRoomDetail(null)}
                        className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailRoom;