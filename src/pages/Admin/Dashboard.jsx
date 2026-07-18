import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  CalendarCheck,
  DollarSign,
  HandCoins,
  ReceiptText,
  TrendingUp,
  ArrowUpRight,
  Users
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import Loading from "../Loading";



const formatXAxis = (tickItem) => {
  const date = new Date(tickItem);
  return `${date.getDate()}/${date.getMonth() + 1}`; // Trả về dạng 20/3
};
// Helper: Định dạng tiền tệ
const formatCurrency = (value) =>
  `${(Number(value) || 0).toLocaleString("vi-VN")}₫`;


const StatCard = ({ title, value, note, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-md hover:border-brand-gold/30 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl transition-all duration-300 ${color}`}>{icon}</div>
      <div className="bg-slate-50 p-1.5 rounded-lg group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors">
        <ArrowUpRight size={16} className="text-slate-400 group-hover:text-brand-gold transition-colors" />
      </div>
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-bold text-brand-lake mt-1.5 tracking-tight font-sans">{value}</h3>
      {note && <p className="text-xs text-slate-400 mt-2 font-medium">{note}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [rangeDays, setRangeDays] = useState(30);
  const [report, setReport] = useState({
    summary: {},
    trend: [],
    recent_bookings: [],
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          "/bookings/dashboard/report",
          { params: { days: rangeDays } }
        );
        setReport(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [rangeDays]);

  const { summary, trend, recent_bookings: recentBookings } = report;

  // Tính toán công suất phòng
  const occupancyRate = useMemo(() => {
    const total = Number(summary.total_rooms) || 0;
    if (!total) return 0;
    return Math.round(((Number(summary.occupied_rooms) || 0) / total) * 100);
  }, [summary]);

  return (
    <div className="p-0 space-y-8 font-sans">
      {loading && <Loading />}

      {!loading && (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-lake tracking-tight font-serif">Quản trị LakeSide</h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Báo cáo tình hình kinh doanh hệ thống nghỉ dưỡng</p>
            </div>

            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setRangeDays(days)}
                  className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${rangeDays === days
                    ? "bg-brand-lake text-brand-gold shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {days} NGÀY
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng Booking"
              value={Number(summary.total_bookings || 0).toLocaleString()}
              note={`Đang lưu trú: ${summary.checked_in_count || 0}`}
              icon={<CalendarCheck size={20} />}
              color="bg-brand-lake/5 text-brand-lake"
            />
            <StatCard
              title="Doanh thu dự kiến"
              value={formatCurrency(summary.total_revenue)}
              note={`Trung bình: ${formatCurrency(summary.avg_booking_value)}`}
              icon={<DollarSign size={20} />}
              color="bg-brand-gold/10 text-brand-gold"
            />
            <StatCard
              title="Thực thu"
              value={formatCurrency(summary.collected_revenue)}
              note={`Còn nợ: ${formatCurrency(summary.outstanding_revenue)}`}
              icon={<HandCoins size={20} />}
              color="bg-brand-pine/10 text-brand-pine"
            />
            <StatCard
              title="Công suất phòng"
              value={`${occupancyRate}%`}
              note={`Trống: ${summary.available_rooms || 0} / ${summary.total_rooms || 0} phòng`}
              icon={<BedDouble size={20} />}
              color="bg-amber-500/10 text-amber-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Area Chart: Revenue Trend */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100/80 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-brand-lake font-serif">Xu hướng thực thu</h2>
                <TrendingUp size={20} className="text-brand-gold" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c29a5b" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#c29a5b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxis}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                      labelFormatter={(value) => {
                        const d = new Date(value);
                        return `Ngày ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                      }}
                      formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="collected_revenue"
                      stroke="#c29a5b"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Bookings count */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100/80 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-brand-lake font-serif">Lượng đặt phòng</h2>
                <Users size={20} className="text-brand-lake" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxis}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      dy={10}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
                      }}
                      labelFormatter={(value) => {
                        const d = new Date(value);
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        const year = d.getFullYear();
                        return `Ngày ${day}/${month}/${year}`;
                      }}
                      formatter={(value) => [`${value} phòng`, "Số phòng đặt"]}
                    />
                    <Bar dataKey="booking_count" radius={[4, 4, 0, 0]}>
                      {trend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === trend.length - 1 ? '#0b253a' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-brand-lake font-serif">Giao dịch gần đây</h2>
              <button
                onClick={() => navigate('/admin/bookings')}
                className="text-brand-gold hover:text-brand-gold-light font-bold text-xs tracking-wider uppercase transition-colors hover:underline cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/60 text-left text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                    <th className="px-8 py-4">Khách hàng</th>
                    <th className="px-8 py-4">Phòng</th>
                    <th className="px-8 py-4">Trạng thái</th>
                    <th className="px-8 py-4 text-right">Tổng thanh toán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-semibold text-slate-700 text-sm">{booking.full_name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">ID: #{booking.id}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="bg-brand-lake/5 text-brand-lake px-2.5 py-1 rounded-md text-xs font-semibold">
                          Phòng {booking.room_number}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-brand-lake text-sm">
                        {formatCurrency(booking.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component phụ cho Badge trạng thái
const StatusBadge = ({ status }) => {
  const config = {
    booked: "bg-blue-50 text-blue-600 border border-blue-100/60",
    checked_in: "bg-brand-pine/5 text-brand-pine border border-brand-pine/20",
    checked_out: "bg-slate-50 text-slate-500 border border-slate-200/50",
    cancelled: "bg-red-50 text-red-600 border border-red-100/60",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config[status] || config.booked}`}>
      {status.replace("_", " ")}
    </span>
  );
};

export default Dashboard;