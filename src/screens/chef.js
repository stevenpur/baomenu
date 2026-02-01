// Chef screen - Orders and ingredient management
import { db } from '../firebase.js';
import { state } from '../state.js';

const ordersList = document.getElementById('ordersList');
const ingredientList = document.getElementById('ingredientList');

export function listenToOrders() {
    if (state.unsubscribers.orders) return;

    state.unsubscribers.orders = db.collection('orders')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            renderOrders(snapshot.docs);
        }, error => {
            console.error('Error listening to orders:', error);
        });
}

function renderOrders(docs) {
    if (docs.length === 0) {
        ordersList.innerHTML = `
            <div class="no-orders">
                <div class="no-orders-icon">🦕</div>
                <p>目前沒有訂單</p>
                <p style="font-size: 12px; margin-top: 5px;">等待中...</p>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = docs.map(doc => {
        const order = doc.data();
        const time = order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString('zh-TW') : '剛剛';
        const isPending = order.status === 'pending';

        return `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-from">👤 ${order.customerName || '匿名'}</span>
                    <span class="order-status ${order.status}">${isPending ? '待處理' : '已完成'}</span>
                </div>
                <div class="order-time">🕐 ${time}</div>
                <div class="order-items">
                    ${order.items.map(item => `<div class="order-item">🌿 ${item}</div>`).join('')}
                </div>
                ${order.notes ? `<div class="order-notes">📝 ${order.notes}</div>` : ''}
                ${isPending ? `<button class="btn complete-btn" onclick="completeOrder('${doc.id}')">標記完成 ✓</button>` : ''}
            </div>
        `;
    }).join('');
}

export async function completeOrder(orderId) {
    try {
        await db.collection('orders').doc(orderId).update({
            status: 'completed'
        });
    } catch (error) {
        console.error('Error completing order:', error);
    }
}

export function renderIngredientList() {
    const allIngredients = [...new Set(state.recipes.flatMap(r => r.ingredients || []))];

    if (allIngredients.length === 0) {
        ingredientList.innerHTML = '<p class="no-messages">還沒有食材（先新增食譜）</p>';
        return;
    }

    ingredientList.innerHTML = allIngredients.map(ingredient => {
        const urgency = state.ingredientUrgency[ingredient] || 'fresh';
        return `
            <div class="ingredient-item">
                <span class="ingredient-name">${ingredient}</span>
                <div class="urgency-buttons">
                    <button class="urgency-btn urgent ${urgency === 'urgent' ? 'active' : ''}"
                        onclick="setUrgency('${ingredient}', 'urgent')">🔴 今天用</button>
                    <button class="urgency-btn soon ${urgency === 'soon' ? 'active' : ''}"
                        onclick="setUrgency('${ingredient}', 'soon')">🟡 快用</button>
                    <button class="urgency-btn fresh ${urgency === 'fresh' ? 'active' : ''}"
                        onclick="setUrgency('${ingredient}', 'fresh')">🟢 新鮮</button>
                </div>
            </div>
        `;
    }).join('');
}

export async function setUrgency(ingredient, level) {
    try {
        await db.collection('settings').doc('ingredientUrgency').set({
            ...state.ingredientUrgency,
            [ingredient]: level
        }, { merge: true });
    } catch (error) {
        console.error('Error setting urgency:', error);
    }
}

// Export for onclick handlers
window.completeOrder = completeOrder;
window.setUrgency = setUrgency;
