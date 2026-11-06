import api from './api.jsx';

/**
 * Gửi câu hỏi đến chatbot AI.
 *
 * @param {string} message    - Câu hỏi người dùng
 * @param {Array}  history    - Lịch sử hội thoại [{role, parts:[{text}]}]
 * @param {string} sessionId  - ID phiên (optional, dùng để đối chiếu response)
 * @returns {Promise<{ answer: string, sources: Array, intent: string }>}
 */
export async function sendChatMessage(message, history = [], sessionId = null) {
    const response = await api.post('/chatbot', {
        message,
        history,
        sessionId,
    });
    return response.data;
}
