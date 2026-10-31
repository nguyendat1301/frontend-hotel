import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const Hero = () => {
  const { user } = useAuth(); // Lấy thông tin user
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng

  const handleBookingClick = () => {
    if (!user) {
      navigate("/login"); // Chuyển sang trang đăng nhập nếu chưa đăng nhập
    } else {
      navigate("/booking"); // Chuyển sang trang đặt phòng nếu đã đăng nhập
    }
  };

  return (
    <div
      className="relative h-screen w-full flex items-center justify-center bg-gray-900"
      style={{
        backgroundImage: `url(/image/hotel-background.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
          Hanoi Luxury <span className="text-gold-400">Lakeside</span> Hotel
        </h1>

        <p className="text-lg md:text-xl mb-8 font-light tracking-widest uppercase">
          Experience serenity at West Lake
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {/* Sửa button này */}
          <button
            onClick={handleBookingClick}
            className="bg-white text-black hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300 px-8 py-3 font-bold uppercase tracking-wider"
          >
            Book Now
          </button>


        </div>
      </div>

      {/* Hiệu ứng cuộn xuống */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-12 bg-white/50 mx-auto"></div>
      </div>
    </div>
  );
};

export default Hero;