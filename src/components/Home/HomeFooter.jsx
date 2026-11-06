import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTripadvisor } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Cột 1: Giới thiệu */}
        <div className="space-y-4 md:col-span-1">
          <h3 className="text-xl font-serif font-bold tracking-widest uppercase text-amber-400">
            LakeSide Hotel
          </h3>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light">
            Nơi giao thoa giữa vẻ đẹp cổ điển của Hà Nội và sự tiện nghi hiện đại. 
            Tận hưởng kỳ nghỉ dưỡng tuyệt vời bên bờ Hồ Tây thơ mộng.
          </p>
        </div>

        {/* Cột 2: Khám phá & Chính sách */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">
            Khám Phá
          </h4>
          <ul className="text-gray-400 text-xs md:text-sm space-y-2.5 font-light">
            <li>
              <Link to="/home" className="hover:text-amber-400 transition-colors">Trang chủ</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-amber-400 transition-colors">Về chúng tôi</Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-amber-400 transition-colors">Đặt phòng nghỉ</Link>
            </li>
            <li>
              <Link to="/faq-policy" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span>Hỏi đáp & Chính sách</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-medium">FAQ</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">
            Liên Hệ
          </h4>
          <ul className="text-gray-400 text-xs md:text-sm space-y-2 font-light">
            <li>123 Đường Xuân Diệu, Quận Tây Hồ, Hà Nội</li>
            <li>Hotline: +84 (0) 24 3456 7890</li>
            <li>Email: info@lakesidehotel.vn</li>
            <li>Lễ tân trực 24/7</li>
          </ul>
        </div>

        {/* Cột 4: Mạng xã hội & Newsletter */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">
            Theo Dõi
          </h4>
          <div className="flex space-x-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all">
              <FaFacebookF size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all">
              <FaInstagram size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all">
              <FaTripadvisor size={16} />
            </a>
          </div>
          <div className="pt-2">
            <p className="text-[11px] text-gray-400 mb-2 font-light">Đăng ký nhận ưu đãi phòng mùa hè:</p>
            <input 
              type="email" 
              placeholder="Nhập email của bạn..." 
              className="bg-white/5 border border-white/15 px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 w-full rounded-lg"
            />
          </div>
        </div>

      </div>

      {/* Dòng bản quyền */}
      <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-500 tracking-widest uppercase">
        <p>© 2026 Hanoi Luxury Lakeside Hotel. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
