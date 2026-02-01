// Screen navigation
import { state } from '../state.js';

const screens = {
    role: document.getElementById('roleScreen'),
    login: document.getElementById('loginScreen'),
    customer: document.getElementById('customerScreen'),
    chef: document.getElementById('chefScreen'),
    manager: document.getElementById('managerScreen')
};

export function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

export function goBack() {
    state.currentRole = null;
    showScreen('role');
}

// Export for onclick handlers
window.goBack = goBack;
