import { useState, useRef, useEffect, useCallback } from 'react';
import { FiMessageSquare, FiX, FiSend, FiMinimize2, FiBook } from 'react-icons/fi';
import { sendChatMessage } from '../services/chatbotService';

// ============================================================
// CONSTANTS
// ============================================================

const WELCOME_MSG = {
    id: 'welcome',
    role: 'bot',
    text: '👋 Xin chào! Tôi là trợ lý AI của LakeSide Hotel.\nTôi có thể giúp bạn tra cứu phòng trống theo ngày thực tế, tìm hiểu giá phòng, dịch vụ, chính sách và tiện ích của khách sạn.\n\nBạn cần hỗ trợ gì?',
    sources: [],
};

const QUICK_QUESTIONS = [
    '📅 Còn phòng trống từ ngày mai không?',
    '🛏️ Giá và sức chứa các loại phòng?',
    '🕐 Giờ nhận phòng là mấy giờ?',
    '🏊 Khách sạn có những dịch vụ gì?',
    '❌ Chính sách hủy phòng thế nào?',
    '✈️ Có dịch vụ đưa đón sân bay không?',
];

// Phân loại màu badge cho sources
const CATEGORY_COLORS = {
    faq:     'bg-blue-500/20 text-blue-300 border-blue-500/30',
    policy:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
    room:    'bg-amber-500/20 text-amber-300 border-amber-500/30',
    service: 'bg-green-500/20 text-green-300 border-green-500/30',
    contact: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const CATEGORY_LABELS = {
    faq:     'FAQ',
    policy:  'Chính sách',
    room:    'Phòng nghỉ',
    service: 'Dịch vụ',
    contact: 'Liên hệ',
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** Bubble tin nhắn */
function MessageBubble({ msg }) {
    const isUser = msg.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
            {/* Avatar bot */}
            {!isUser && (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    🏨
                </div>
            )}

            <div className="flex flex-col gap-1 max-w-[78%]">
                {/* Nội dung tin nhắn */}
                <div
                    className={`
                        rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap
                        ${isUser
                            ? 'bg-amber-500 text-black rounded-br-sm font-medium'
                            : 'bg-white/8 text-white/90 rounded-bl-sm border border-white/5'
                        }
                    `}
                >
                    {msg.text}
                </div>

                {/* Sources badges (chỉ hiển thị cho bot) */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1 pl-1">
                        <FiBook size={9} className="text-white/30 mt-0.5 shrink-0" />
                        {msg.sources.map((src, i) => (
                            <span
                                key={i}
                                className={`text-[9px] px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[src.category] || 'bg-white/10 text-white/50 border-white/10'}`}
                            >
                                {CATEGORY_LABELS[src.category] || src.category}: {src.title}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/** Typing indicator (3 chấm nhảy) */
function TypingIndicator() {
    return (
        <div className="flex justify-start gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs shrink-0 mt-0.5">
                🏨
            </div>
            <div className="bg-white/8 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                    {[0, 150, 300].map((delay) => (
                        <span
                            key={delay}
                            className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${delay}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([WELCOME_MSG]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showQuick, setShowQuick] = useState(true);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // sessionId cố định cho tab này (dùng để theo dõi phiên)
    const sessionId = useRef(`session_${Date.now()}`);

    // Scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isMinimized]);

    // Focus input khi mở chat
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

    /**
     * Chuyển messages thành history format cho Gemini API.
     * Bỏ welcome message, chỉ lấy 10 lượt gần nhất.
     */
    const buildHistory = useCallback((msgs) => {
        return msgs
            .filter((m) => m.id !== 'welcome')
            .slice(-10)
            .map((m) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
            }));
    }, []);

    /**
     * Gửi câu hỏi (từ input hoặc quick question).
     */
    const handleSend = useCallback(async (overrideText) => {
        const messageText = (overrideText || input).trim();
        if (!messageText || isLoading) return;

        setInput('');
        setShowQuick(false);

        // Thêm tin nhắn user ngay lập tức (optimistic UI)
        const userMsg = {
            id: Date.now(),
            role: 'user',
            text: messageText,
            sources: [],
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            // Lấy history (không bao gồm userMsg vừa thêm, vì nó đã ở param message)
            const history = buildHistory(messages);

            const data = await sendChatMessage(
                messageText,
                history,
                sessionId.current
            );

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: 'bot',
                    text: data.answer,
                    sources: data.sources || [],
                },
            ]);
        } catch (error) {
            const status = error.response?.status;
            let errorText;

            if (status === 503) {
                errorText = '⚠️ Dịch vụ AI đang tạm thời quá tải. Vui lòng thử lại sau ít phút hoặc liên hệ lễ tân: 1800-xxxx';
            } else if (status === 504) {
                errorText = '⚠️ Phản hồi mất quá lâu. Vui lòng thử lại hoặc đặt câu hỏi ngắn hơn.';
            } else if (status === 400) {
                errorText = '⚠️ Câu hỏi không hợp lệ. Vui lòng nhập lại.';
            } else if (status === 429) {
                errorText = '⚠️ Bạn đã gửi quá nhiều câu hỏi. Vui lòng chờ vài phút rồi thử lại.';
            } else {
                errorText = '⚠️ Đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ lễ tân để được hỗ trợ trực tiếp.';
            }

            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: 'bot', text: errorText, sources: [] },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, buildHistory]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

            {/* ===== CHAT WINDOW ===== */}
            {isOpen && (
                <div
                    className={`
                        flex flex-col bg-[#111] border border-white/10 rounded-2xl shadow-2xl
                        transition-all duration-300 overflow-hidden
                        ${isMinimized ? 'h-14 w-80' : 'w-80 sm:w-96 h-[540px]'}
                    `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center text-sm">
                                🏨
                            </div>
                            <div>
                                <p className="text-xs font-bold text-black leading-none">LakeSide AI</p>
                                <p className="text-[10px] text-black/70 leading-none mt-0.5">
                                    {isLoading ? '● Đang trả lời...' : '● Trực tuyến'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMinimized((v) => !v)}
                                className="p-1.5 rounded-full hover:bg-black/20 transition text-black"
                                title={isMinimized ? 'Phóng to' : 'Thu nhỏ'}
                                aria-label={isMinimized ? 'Phóng to chat' : 'Thu nhỏ chat'}
                            >
                                <FiMinimize2 size={14} />
                            </button>
                            <button
                                onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                                className="p-1.5 rounded-full hover:bg-black/20 transition text-black"
                                title="Đóng"
                                aria-label="Đóng chatbot"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Body (ẩn khi minimize) */}
                    {!isMinimized && (
                        <>
                            {/* Danh sách tin nhắn */}
                            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                                {messages.map((msg) => (
                                    <MessageBubble key={msg.id} msg={msg} />
                                ))}

                                {isLoading && <TypingIndicator />}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Questions – chỉ hiện khi chưa gửi câu hỏi */}
                            {showQuick && (
                                <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
                                    {QUICK_QUESTIONS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => handleSend(q)}
                                            disabled={isLoading}
                                            className="text-[10px] px-2.5 py-1 rounded-full border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 disabled:opacity-50 transition"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input area */}
                            <div className="px-3 pb-3 shrink-0">
                                <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-amber-500/50 transition">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Nhập câu hỏi... (Enter để gửi)"
                                        rows={1}
                                        maxLength={1000}
                                        className="flex-1 bg-transparent text-white text-xs placeholder-white/30 resize-none focus:outline-none max-h-24"
                                        style={{ lineHeight: '1.6' }}
                                        aria-label="Nhập câu hỏi"
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || isLoading}
                                        className="p-1.5 bg-amber-500 rounded-lg text-black hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 mb-0.5"
                                        aria-label="Gửi câu hỏi"
                                    >
                                        <FiSend size={13} />
                                    </button>
                                </div>
                                <p className="text-center text-[9px] text-white/20 mt-1.5">
                                    Powered by Gemini AI · LakeSide Hotel
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ===== FAB BUTTON ===== */}
            <div className="relative">
                {/* Pulse animation khi đóng */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-amber-500/40 animate-ping" />
                )}
                <button
                    onClick={() => {
                        setIsOpen((v) => !v);
                        setIsMinimized(false);
                    }}
                    className={`
                        relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center
                        transition-all duration-300 hover:scale-110 active:scale-95
                        ${isOpen
                            ? 'bg-white/10 border border-white/20 text-white'
                            : 'bg-gradient-to-br from-amber-500 to-amber-600 text-black'
                        }
                    `}
                    title={isOpen ? 'Đóng chat' : 'Chat với AI hỗ trợ'}
                    aria-label={isOpen ? 'Đóng chatbot' : 'Mở chatbot'}
                >
                    {isOpen ? <FiX size={22} /> : <FiMessageSquare size={22} />}
                </button>
            </div>
        </div>
    );
}
