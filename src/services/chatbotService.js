import api from './api.jsx';

/**
 * Gửi tin nhắn đến chatbot AI
 * @param {string} message - Nội dung tin nhắn
 * @param {Array} history - Lịch sử hội thoại [{role, parts:[{text}]}]
 * @returns {Promise<string>} Câu trả lời từ AI
 */
export async function sendChatMessage(message, history = []) {
    const response = await api.post('/api/chatbot', { message, history });
    return response.data.answer;
}

