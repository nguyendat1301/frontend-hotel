import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { FiSearch, FiX, FiUser, FiLogOut, FiBriefcase, FiSettings } from 'react-icons/fi'; // Cài react-icons

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  // Hiệu ứng đổi màu khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navBgColor = isScrolled || !isHomePage ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent';
  const textColor = 'text-white';
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
  const displayName = user?.user_name;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBgColor} ${textColor}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <Link to="/home" className="group">
          <span className="text-2xl font-serif font-bold tracking-[0.2em] text-white group-hover:text-amber-400 transition-colors">
            LAKESIDE
          </span>
          <div className="h-0.5 w-0 group-hover:w-full bg-amber-400 transition-all duration-300"></div>
        </Link>

        {/* Search Bar - Tinh gọn hơn */}
        <form onSubmit={handleSubmit} className="hidden lg:flex items-center flex-1 max-w-sm mx-10 relative group">
          <input
            type="text"
            placeholder="Tìm kiếm kỳ nghỉ..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-white/5 border border-white/20 text-white placeholder-white/40 rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:bg-white/10 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-2">
            {keyword && <FiX onClick={() => setKeyword('')} className="cursor-pointer text-white/40 hover:text-white" />}
            <button type="submit" className="p-1.5 bg-amber-500 rounded-full text-black hover:scale-110 transition-transform">
              <FiSearch size={14} />
            </button>
          </div>
        </form>

        {/* Menu Items */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/70">
            <Link to="/home" className={`hover:text-amber-400 transition ${location.pathname === '/home' ? 'text-amber-400' : ''}`}>Trang chủ</Link>
            <Link to="/about" className="hover:text-amber-400 transition">Về chúng tôi</Link>
          </div>

          {user ? (
            <div className="relative">
              {/* User Avatar & Name */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 p-1 pr-4 rounded-full transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center font-bold text-black text-xs">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] text-white/50 leading-none">Xin chào,</p>
                  <p className="text-xs font-bold text-amber-400">{displayName}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 mt-3 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                    {isAdmin && (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-xs text-white/80 hover:bg-white/5 hover:text-amber-400 transition">
                        <FiSettings /> ADMIN PANEL
                      </Link>
                    )}
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-xs text-white/80 hover:bg-white/5 hover:text-amber-400 transition">
                      <FiUser /> HỒ SƠ CỦA TÔI
                    </Link>
                    <Link to="/my-bookings" className="flex items-center gap-3 px-4 py-3 text-xs text-white/80 hover:bg-white/5 hover:text-amber-400 transition">
                      <FiBriefcase /> ĐƠN ĐẶT PHÒNG
                    </Link>
                    <hr className="border-white/5 my-1" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red-400 hover:bg-red-500/10 transition"
                    >
                      <FiLogOut /> ĐĂNG XUẤT
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="relative group px-6 py-2 overflow-hidden rounded-full bg-amber-500 font-bold text-[11px] tracking-widest text-black transition-all"
            >
              <span className="relative z-10">LOGIN</span>
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;