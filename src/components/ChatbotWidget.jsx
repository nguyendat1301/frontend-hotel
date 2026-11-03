import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { sendChatMessage } from '../services/chatbotService';

const WELCOME_MSG = {
    id: 'welcome',
    role: 'bot',
    text: '👋 Xin chào! Tôi là trợ lý AI của LakeSide Hotel. Tôi có thể giúp bạn về thông tin phòng, dịch vụ, đặt phòng và các tiện ích của khách sạn. Bạn cần hỗ trợ gì?',
};

const QUICK_QUESTIONS = [
    'Giờ check-in là mấy giờ?',
    'Khách sạn có những dịch vụ gì?',
    'Giá và sức chứa của các loại phòng thế nào?',
    'Chính sách hủy phòng như thế nào?',
    'Có dịch vụ đưa đón sân bay không?',
];

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([WELCOME_MSG]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showQuick, setShowQuick] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Tự scroll xuống cuối
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

    // Chuyển messages thành history format cho API
    const buildHistory = (msgs) => {
        return msgs
            .filter((m) => m.id !== 'welcome')
            .map((m) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
            }));
    };

    const handleSend = async (text) => {
        const messageText = (text || input).trim();
        if (!messageText || isLoading) return;

        setInput('');
        setShowQuick(false);

        const userMsg = { id: Date.now(), role: 'user', text: messageText };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const history = buildHistory([...messages, userMsg]);
            const answer = await sendChatMessage(
                messageText,
                history.slice(0, -1) // bỏ userMsg vừa thêm vào (đã ở param message)
            );
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: 'bot', text: answer },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: 'bot',
                    text: '⚠️ Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ lễ tân để được hỗ trợ.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`
                        flex flex-col bg-[#111] border border-white/10 rounded-2xl shadow-2xl
                        transition-all duration-300 overflow-hidden
                        ${isMinimized ? 'h-14 w-80' : 'w-80 h-[520px] sm:w-96'}
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
                                    {isLoading ? 'Đang trả lời...' : '● Trực tuyến'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMinimized((v) => !v)}
                                className="p-1.5 rounded-full hover:bg-black/20 transition text-black"
                                title={isMinimized ? 'Phóng to' : 'Thu nhỏ'}
                            >
                                <FiMinimize2 size={14} />
                            </button>
                            <button
                                onClick={handleClose}
                                className="p-1.5 rounded-full hover:bg-black/20 transition text-black"
                                title="Đóng"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Messages - ẩn khi minimize */}
                    {!isMinimized && (
                        <>
                            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.role === 'bot' && (
                                            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs shrink-0 mr-2 mt-0.5">
                                                🏨
                                            </div>
                                        )}
                                        <div
                                            className={`
                                                max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap
                                                ${msg.role === 'user'
                                                    ? 'bg-amber-500 text-black rounded-br-sm font-medium'
                                                    : 'bg-white/8 text-white/90 rounded-bl-sm border border-white/5'
                                                }
                                            `}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs shrink-0 mr-2 mt-0.5">
                                            🏨
                                        </div>
                                        <div className="bg-white/8 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                                            <div className="flex gap-1 items-center">
                                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Questions */}
                            {showQuick && (
                                <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
                                    {QUICK_QUESTIONS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => handleSend(q)}
                                            className="text-[10px] px-2.5 py-1 rounded-full border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input */}
                            <div className="px-3 pb-3 shrink-0">
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-amber-500/50 transition">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Nhập câu hỏi..."
                                        rows={1}
                                        className="flex-1 bg-transparent text-white text-xs placeholder-white/30 resize-none focus:outline-none max-h-24"
                                        style={{ lineHeight: '1.5' }}
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || isLoading}
                                        className="p-1.5 bg-amber-500 rounded-lg text-black hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
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

            {/* FAB Button */}
            <button
                onClick={isOpen ? handleClose : handleOpen}
                className={`
                    w-14 h-14 rounded-full shadow-2xl flex items-center justify-center
                    transition-all duration-300 hover:scale-110 active:scale-95
                    ${isOpen
                        ? 'bg-white/10 border border-white/20 text-white'
                        : 'bg-gradient-to-br from-amber-500 to-amber-600 text-black'
                    }
                `}
                title={isOpen ? 'Đóng chat' : 'Chat với AI'}
            >
                {isOpen ? <FiX size={22} /> : <FiMessageSquare size={22} />}

                {/* Pulse khi đóng */}
                {!isOpen && (
                    <span className="absolute w-14 h-14 rounded-full bg-amber-500/40 animate-ping" />
                )}
            </button>
        </div>
    );
}
