// Customer screen - Menu and ordering
import { db } from '../firebase.js';
import { state } from '../state.js';
import { createFloatingHeart, celebrateWithHearts } from '../components/hearts.js';
import { showModal, setOnCloseCallback } from '../components/modal.js';

const menuItemsContainer = document.getElementById('menuItemsContainer');
const orderBtn = document.getElementById('orderBtn');
const notes = document.getElementById('notes');

export function listenToRecipes() {
    if (state.unsubscribers.recipes) return;

    state.unsubscribers.recipes = db.collection('recipes')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            state.recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderMenuItems();
        }, error => {
            console.error('Error listening to recipes:', error);
        });
}

export function listenToUrgency() {
    if (state.unsubscribers.urgency) return;

    state.unsubscribers.urgency = db.collection('settings').doc('ingredientUrgency')
        .onSnapshot(doc => {
            state.ingredientUrgency = doc.exists ? doc.data() : {};
            renderMenuItems();
        }, error => {
            console.error('Error listening to urgency:', error);
        });
}

export function renderMenuItems() {
    if (state.recipes.length === 0) {
        menuItemsContainer.innerHTML = `
            <div class="no-orders">
                <div class="no-orders-icon">🍳</div>
                <p>還沒有菜單</p>
                <p style="font-size: 12px; margin-top: 5px;">請先在「管理食譜」新增</p>
            </div>
        `;
        return;
    }

    menuItemsContainer.innerHTML = state.recipes.map((recipe, index) => {
        const urgentIngredient = recipe.ingredients?.find(i => state.ingredientUrgency[i] === 'urgent');
        const soonIngredient = recipe.ingredients?.find(i => state.ingredientUrgency[i] === 'soon');

        let badge = '';
        if (urgentIngredient) {
            badge = `<span class="urgency-badge urgent">今天吃我！</span>`;
        } else if (soonIngredient) {
            badge = `<span class="urgency-badge soon">推薦</span>`;
        }

        return `
            <div class="menu-item" data-item="${recipe.name}" data-id="${recipe.id}">
                <span class="item-number">${String(index + 1).padStart(2, '0')}</span>
                <div class="item-content">
                    <div class="item-header">
                        <span class="item-name">${recipe.name}</span>
                        ${badge}
                        <span class="item-dots"></span>
                    </div>
                    <div class="item-english">${recipe.englishName || ''}</div>
                    <div class="item-ingredients">🥬 ${recipe.ingredients?.join(', ') || ''}</div>
                </div>
                <span class="check-mark">🦕</span>
            </div>
        `;
    }).join('');

    // Attach click listeners
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', handleMenuItemClick);
    });
}

function handleMenuItemClick(e) {
    const item = e.currentTarget;
    item.classList.toggle('selected');
    const itemName = item.dataset.item;

    if (item.classList.contains('selected')) {
        state.selectedItems.push(itemName);
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createFloatingHeart(
                    e.clientX + (Math.random() - 0.5) * 40,
                    e.clientY
                );
            }, i * 100);
        }
    } else {
        state.selectedItems = state.selectedItems.filter(i => i !== itemName);
    }

    updateOrderButton();
}

function updateOrderButton() {
    if (state.selectedItems.length > 0) {
        orderBtn.disabled = false;
        orderBtn.textContent = `送出訂單 — ${state.selectedItems.length} 道餐點 🦕`;
    } else {
        orderBtn.disabled = true;
        orderBtn.textContent = '請選擇餐點';
    }
}

async function submitOrder() {
    if (state.selectedItems.length === 0 || !state.currentUser) return;

    try {
        await db.collection('orders').add({
            items: state.selectedItems,
            notes: notes.value.trim() || '',
            customerName: state.currentUser.displayName || state.currentUser.email,
            customerEmail: state.currentUser.email,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showModal(state.selectedItems, notes.value.trim());
        celebrateWithHearts();

    } catch (error) {
        console.error('Order error:', error);
        alert('訂單送出失敗，請再試一次');
    }
}

function resetOrder() {
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('selected'));
    state.selectedItems = [];
    notes.value = '';
    updateOrderButton();
}

// Set up event listeners
orderBtn.addEventListener('click', submitOrder);
setOnCloseCallback(resetOrder);
