import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BedDouble, CalendarCheck, Users, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Rooms', path: '/admin/rooms', icon: <BedDouble size={20} /> },
    { name: 'RoomsType', path: '/admin/room-types', icon: <BedDouble size={20} /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-brand-mist flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-brand-lake text-slate-100 border-r border-brand-lake-light/20 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-xl`}>
        <div className="h-16 flex items-center justify-center border-b border-brand-lake-light/25 px-4 bg-brand-lake/60">
          <Link
            to="/home"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <BedDouble size={22} className="text-brand-gold" />
            {isSidebarOpen && (
              <h1 className="text-xl font-bold font-serif tracking-widest text-brand-gold bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
                LAKESIDE
              </h1>
            )}
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-4.5 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-brand-gold/10 text-brand-gold font-semibold shadow-inner border-l-3 border-brand-gold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`transition-transform duration-200 ${isActive ? 'text-brand-gold' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </div>
                {isSidebarOpen && <span className="text-sm tracking-wide">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-brand-lake-light/25 bg-brand-lake/40">
          <button
            onClick={logout}
            className="flex items-center gap-3.5 text-slate-400 hover:text-red-400 w-full px-4.5 py-2.5 rounded-xl transition-colors group cursor-pointer"
          >
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
            {isSidebarOpen && <span className="font-medium text-sm tracking-wide">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shadow-sm">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-slate-500 hover:text-slate-800 transition-colors p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Hệ thống Admin</span>
              <span className="text-xs text-slate-400">LakeSide Resort & Spa</span>
            </div>
            <div className="flex items-center gap-3.5 border-l border-slate-100 pl-6">
              <div className="w-9 h-9 rounded-full bg-brand-lake text-brand-gold flex items-center justify-center font-bold text-sm shadow-md shadow-brand-lake/10 border border-brand-gold/20">
                {(user?.user_name || user?.email || 'A').charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-sm text-slate-700 tracking-wide">{user?.user_name || user?.email || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-auto bg-[#f8fafc]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;