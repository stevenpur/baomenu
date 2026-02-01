// Main entry point
import './styles/main.css';
import { state } from './state.js';
import { setupAuthListener, updateUserInfo, signOut } from './auth.js';
import { showScreen, goBack } from './screens/navigation.js';
import { listenToRecipes, listenToUrgency, renderMenuItems } from './screens/customer.js';
import { listenToOrders, renderIngredientList } from './screens/chef.js';
import { renderRecipes } from './screens/manager.js';
import { listenToChat } from './components/chat.js';

// Role selection handler
function selectRole(role) {
    state.currentRole = role;
    if (state.currentUser) {
        navigateToRoleScreen(role);
    } else {
        const subtitles = {
            customer: '點餐登入',
            chef: '廚師登入',
            manager: '管理員登入'
        };
        document.getElementById('loginSubtitle').textContent = subtitles[role];
        showScreen('login');
    }
}

function navigateToRoleScreen(role) {
    updateUserInfo();

    if (role === 'customer') {
        showScreen('customer');
        listenToRecipes();
        listenToUrgency();
    } else if (role === 'chef') {
        showScreen('chef');
        listenToOrders();
        listenToRecipes();
        listenToUrgency();
        // Re-render ingredient list when recipes/urgency change
        setTimeout(renderIngredientList, 500);
    } else if (role === 'manager') {
        showScreen('manager');
        listenToRecipes();
        // Re-render recipes list when recipes change
        setTimeout(renderRecipes, 500);
    }

    listenToChat();
}

// Set up auth listener
setupAuthListener(navigateToRoleScreen);

// Watch for recipe/urgency changes to update ingredient list (chef) and recipe list (manager)
const originalRecipes = state.recipes;
Object.defineProperty(state, 'recipes', {
    get() { return originalRecipes; },
    set(val) {
        originalRecipes.length = 0;
        originalRecipes.push(...val);
        if (state.currentRole === 'chef') renderIngredientList();
        if (state.currentRole === 'manager') renderRecipes();
        if (state.currentRole === 'customer') renderMenuItems();
    }
});

// Export for onclick handlers in HTML
window.selectRole = selectRole;
window.goBack = goBack;

console.log('🦕 小恐龍廚房 loaded!');
