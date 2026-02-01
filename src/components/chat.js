// Chat component
import { db } from '../firebase.js';
import { state } from '../state.js';

const customerChatMessages = document.getElementById('customerChatMessages');
const chefChatMessages = document.getElementById('chefChatMessages');
const customerChatInput = document.getElementById('customerChatInput');
const chefChatInput = document.getElementById('chefChatInput');

export function listenToChat() {
    if (state.unsubscribers.chat) return;

    state.unsubscribers.chat = db.collection('messages')
        .orderBy('createdAt', 'asc')
        .onSnapshot(snapshot => {
            renderMessages(snapshot.docs);
        }, error => {
            console.error('Error listening to messages:', error);
        });
}

function renderMessages(docs) {
    if (docs.length === 0) {
        const emptyHTML = '<div class="no-messages">還沒有訊息</div>';
        customerChatMessages.innerHTML = emptyHTML;
        chefChatMessages.innerHTML = emptyHTML;
        return;
    }

    const messagesHTML = docs.map(doc => {
        const msg = doc.data();
        const time = msg.createdAt
            ? new Date(msg.createdAt.toDate()).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
            : '';
        const isSentByCurrentUser = msg.senderEmail === state.currentUser?.email;

        return `
            <div class="chat-message ${isSentByCurrentUser ? 'sent' : 'received'}">
                <div class="chat-message-header">${msg.senderRole === 'chef' ? '👨‍🍳 廚師' : '🍽️ 顧客'} ${msg.senderName || ''}</div>
                <div class="chat-message-text">${msg.text}</div>
                <div class="chat-message-time">${time}</div>
            </div>
        `;
    }).join('');

    customerChatMessages.innerHTML = messagesHTML;
    chefChatMessages.innerHTML = messagesHTML;

    customerChatMessages.scrollTop = customerChatMessages.scrollHeight;
    chefChatMessages.scrollTop = chefChatMessages.scrollHeight;
}

export async function sendMessage(role) {
    const input = role === 'customer' ? customerChatInput : chefChatInput;
    const text = input.value.trim();

    if (!text || !state.currentUser) return;

    try {
        await db.collection('messages').add({
            text: text,
            senderName: state.currentUser.displayName || state.currentUser.email,
            senderEmail: state.currentUser.email,
            senderRole: role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        input.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
        alert('訊息發送失敗');
    }
}

// Enter key to send message
customerChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage('customer');
});

chefChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage('chef');
});

// Export for onclick handlers
window.sendMessage = sendMessage;
