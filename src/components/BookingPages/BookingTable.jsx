import React from "react";
import { Edit, Trash2, DoorOpen, Search } from "lucide-react";

const BookingTable = ({ bookings, loading, limit, onEdit, onDelete }) => {
  // Hàm phụ trợ style (giữ nguyên logic của bạn)
  const getStatusStyle = (status) => {
    const styles = {
      BOOKED: "bg-amber-50 text-amber-600 border-amber-200/50",
      checked_in: "bg-brand-pine/5 text-brand-pine border-brand-pine/20",
      checked_out: "bg-slate-50 text-slate-400 border-slate-200/50",
    };
    return styles[status] || "bg-gray-50 text-gray-500 border-gray-200/50";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="p-6 border-b border-slate-50 animate-pulse">
            <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-20 text-center">
        <div className="flex flex-col items-center opacity-40">
          <Search size={44} className="mb-3 text-slate-300" />
          <p className="text-base font-semibold text-slate-500">Không tìm thấy dữ liệu phù hợp</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="p-5">Khách hàng</th>
              <th className="p-5">Phòng</th>
              <th className="p-5">Thời gian</th>
              <th className="p-5">Trạng thái</th>
              <th className="p-5">Thanh toán</th>
              <th className="p-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-600 text-sm">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-sm border border-brand-gold/20">
                      {b.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{b.full_name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">ID: #{b.id.toString().slice(-4)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <DoorOpen size={15} className="text-slate-400 shrink-0" />
                      <span className="font-semibold text-brand-lake">
                        {b.rooms && b.rooms.length > 1
                          ? `${b.rooms.length} phòng (${b.room_number})`
                          : `Phòng ${b.room_number}`}
                      </span>
                    </div>
                    {b.rooms && b.rooms.length > 1 && (
                      <span className="text-[11px] text-slate-400 pl-6">
                        {b.rooms.map(r => `P.${r.room_number}`).join(" • ")}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-5 text-sm">
                  <div className="flex flex-col text-slate-600">
                    <span className="font-medium">{new Date(b.check_in_date).toLocaleDateString("vi-VN")}</span>
                    <span className="text-slate-400 text-xs mt-0.5">đến {new Date(b.check_out_date).toLocaleDateString("vi-VN")}</span>
                  </div>
                </td>
                <td className="p-5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(b.status)}`}>
                    {b.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-5">
                  <div className="text-sm">
                    <p className="font-bold text-brand-lake">{(Number(b.paid_amount) || 0).toLocaleString()}₫</p>
                    <p className="text-xs text-slate-400 mt-0.5">Còn lại: {(Number(b.remaining_amount) || 0).toLocaleString()}₫</p>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(b)} className="p-2 hover:bg-brand-gold/10 hover:text-brand-gold text-slate-400 rounded-lg transition-colors cursor-pointer" title="Cập nhật">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(b.id)} className="p-2 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-colors cursor-pointer" title="Xóa">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;