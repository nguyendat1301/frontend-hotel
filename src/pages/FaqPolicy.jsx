import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Home/HomeNavabar';
import Footer from '../components/Home/HomeFooter';
import {
    HOTEL_KNOWLEDGE_CATEGORIES,
    HOTEL_KNOWLEDGE_ITEMS,
} from '../data/hotelKnowledge';
import {
    FiSearch,
    FiChevronDown,
    FiChevronUp,
    FiX,
    FiHelpCircle,
    FiShield,
    FiPhoneCall,
    FiMessageSquare,
    FiCalendar,
    FiCheckCircle,
} from 'react-icons/fi';

const FaqPolicy = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedIds, setExpandedIds] = useState(new Set(['faq-wifi', 'policy-cancellation']));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Lọc theo danh mục và từ khóa tìm kiếm
    const filteredItems = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();

        return HOTEL_KNOWLEDGE_ITEMS.filter((item) => {
            const matchCategory =
                selectedCategory === 'all' || item.category === selectedCategory;

            if (!matchCategory) return false;

            if (!query) return true;

            const matchTitle = item.title.toLowerCase().includes(query);
            const matchSummary = item.summary.toLowerCase().includes(query);
            const matchContent = item.content.toLowerCase().includes(query);
            const matchTags = item.tags?.some((t) => t.toLowerCase().includes(query));

            return matchTitle || matchSummary || matchContent || matchTags;
        });
    }, [selectedCategory, searchTerm]);

    // Đếm số lượng theo category
    const categoryCounts = useMemo(() => {
        const counts = { all: HOTEL_KNOWLEDGE_ITEMS.length };
        HOTEL_KNOWLEDGE_ITEMS.forEach((item) => {
            counts[item.category] = (counts[item.category] || 0) + 1;
        });
        return counts;
    }, []);

    const toggleItem = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const expandAll = () => {
        setExpandedIds(new Set(filteredItems.map((item) => item.id)));
    };

    const collapseAll = () => {
        setExpandedIds(new Set());
    };

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
            <Navbar />

            {/* ===== HERO BANNER ===== */}
            <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-black via-[#141414] to-[#0e0e0e]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative max-w-5xl mx-auto px-6 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs tracking-widest uppercase font-semibold">
                        <FiHelpCircle className="text-sm" />
                        Trung tâm Trợ giúp & Thông tin
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif text-white tracking-wide">
                        Hỏi Đáp & <span className="text-amber-400 font-light italic">Chính Sách</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-400 font-light leading-relaxed">
                        Mọi thông tin chi tiết về chính sách đặt phòng, hủy phòng, thủ tục nhận trả phòng và tiện ích dịch vụ chuẩn 5 sao tại LakeSide Hotel.
                    </p>

                    {/* Thanh tìm kiếm trực tiếp */}
                    <div className="max-w-2xl mx-auto pt-4">
                        <div className="relative flex items-center bg-[#1a1a1a] border border-white/10 rounded-full shadow-2xl p-2 focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                            <FiSearch className="text-gray-400 text-lg ml-4 mr-2" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm câu hỏi, chính sách, wifi, đưa đón, hủy phòng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent text-sm md:text-base text-white placeholder-gray-500 focus:outline-none pr-3"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="p-2 text-gray-400 hover:text-white transition"
                                    title="Xóa tìm kiếm"
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BODY CONTENT ===== */}
            <main className="max-w-5xl mx-auto px-6 pb-28">
                {/* Category Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 scrollbar-none border-b border-white/5">
                    {HOTEL_KNOWLEDGE_CATEGORIES.map((cat) => {
                        const count = categoryCounts[cat.key] || 0;
                        const isActive = selectedCategory === cat.key;

                        return (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`
                                    whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wider transition-all duration-300
                                    ${isActive
                                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-semibold'
                                        : 'bg-[#181818] text-gray-300 hover:bg-[#222] hover:text-white border border-white/5'
                                    }
                                `}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                                <span
                                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                                        isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-gray-400'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Subheader: Bộ đếm & Nút Thu/Phóng */}
                <div className="flex items-center justify-between mt-8 mb-6 text-xs text-gray-400">
                    <p>
                        Hiển thị <span className="text-amber-400 font-semibold">{filteredItems.length}</span> nội dung
                        {searchTerm && (
                            <span> khớp với từ khóa "<strong className="text-white">{searchTerm}</strong>"</span>
                        )}
                    </p>

                    {filteredItems.length > 0 && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={expandAll}
                                className="hover:text-amber-400 transition underline underline-offset-4"
                            >
                                Mở tất cả
                            </button>
                            <span>•</span>
                            <button
                                onClick={collapseAll}
                                className="hover:text-amber-400 transition underline underline-offset-4"
                            >
                                Thu gọn tất cả
                            </button>
                        </div>
                    )}
                </div>

                {/* Accordion List */}
                {filteredItems.length > 0 ? (
                    <div className="space-y-4">
                        {filteredItems.map((item) => {
                            const isExpanded = expandedIds.has(item.id);

                            return (
                                <div
                                    key={item.id}
                                    className={`
                                        rounded-2xl border transition-all duration-300 overflow-hidden
                                        ${isExpanded
                                            ? 'bg-[#161616] border-amber-500/40 shadow-xl shadow-amber-500/5'
                                            : 'bg-[#141414] border-white/5 hover:border-white/15'
                                        }
                                    `}
                                >
                                    {/* Question Header */}
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className="w-full flex items-start justify-between gap-4 p-5 md:p-6 text-left"
                                        aria-expanded={isExpanded}
                                    >
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/5 text-amber-400 border border-amber-500/20">
                                                    {item.categoryLabel}
                                                </span>
                                            </div>
                                            <h3 className="text-base md:text-lg font-medium text-white leading-snug">
                                                {item.title}
                                            </h3>
                                            {!isExpanded && (
                                                <p className="text-xs text-gray-400 line-clamp-1 font-light">
                                                    {item.summary}
                                                </p>
                                            )}
                                        </div>

                                        <div
                                            className={`
                                                mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300
                                                ${isExpanded
                                                    ? 'bg-amber-500 text-black rotate-180'
                                                    : 'bg-white/5 text-gray-400 hover:text-white'
                                                }
                                            `}
                                        >
                                            <FiChevronDown size={18} />
                                        </div>
                                    </button>

                                    {/* Answer Content */}
                                    {isExpanded && (
                                        <div className="px-5 pb-6 md:px-6 md:pb-6 pt-2 border-t border-white/5 animate-fade-in text-sm text-gray-300 leading-relaxed space-y-4">
                                            <div className="whitespace-pre-wrap font-light text-slate-300">
                                                {item.content}
                                            </div>

                                            {/* Tags */}
                                            {item.tags && item.tags.length > 0 && (
                                                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                                                    <span className="text-[11px] text-gray-500 mr-1">Chủ đề:</span>
                                                    {item.tags.map((t, idx) => (
                                                        <span
                                                            key={idx}
                                                            onClick={() => setSearchTerm(t)}
                                                            className="cursor-pointer text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition"
                                                        >
                                                            #{t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Trạng thái không có kết quả */
                    <div className="text-center py-20 px-6 bg-[#141414] rounded-3xl border border-white/5 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 text-gray-400 flex items-center justify-center mx-auto text-2xl">
                            🔍
                        </div>
                        <h3 className="text-lg font-medium text-white">
                            Không tìm thấy câu trả lời phù hợp
                        </h3>
                        <p className="text-xs text-gray-400 max-w-md mx-auto">
                            Rất tiếc chúng tôi chưa tìm thấy nội dung với từ khóa "<strong>{searchTerm}</strong>". Quý khách có thể thử từ khóa khác hoặc liên hệ bộ phận hỗ trợ khách hàng.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                            className="px-6 py-2.5 rounded-full bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition"
                        >
                            Xem toàn bộ câu hỏi
                        </button>
                    </div>
                )}

                {/* ===== BANNER HỖ TRỢ TRỰC TIẾP ===== */}
                <section className="mt-16 bg-gradient-to-r from-amber-900/30 via-[#1c1813] to-amber-950/20 border border-amber-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
                        <div className="md:col-span-2 space-y-3">
                            <span className="text-[10px] tracking-widest uppercase font-bold text-amber-400 flex items-center gap-1.5">
                                <FiMessageSquare /> Hỗ Trợ Khách Hàng 24/7
                            </span>
                            <h2 className="text-2xl md:text-3xl font-serif text-white">
                                Vẫn còn thắc mắc về kỳ nghỉ của bạn?
                            </h2>
                            <p className="text-sm text-gray-300 font-light leading-relaxed">
                                Trợ lý AI thông minh <strong className="text-amber-400">LakeSide AI</strong> luôn sẵn sàng giải đáp tức thì mọi yêu cầu về giá phòng, đặt phòng và tiện nghi qua nút chat ở góc phải màn hình.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                            <a
                                href="tel:+842434567890"
                                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
                            >
                                <FiPhoneCall /> Gọi Lễ Tân 24/7
                            </a>
                            <Link
                                to="/booking"
                                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium text-xs uppercase tracking-wider transition"
                            >
                                <FiCalendar /> Đặt Phòng Ngay
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default FaqPolicy;

