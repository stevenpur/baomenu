// Authentication module
import { auth } from './firebase.js';
import { state, resetState } from './state.js';
import { showScreen } from './screens/navigation.js';

export function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(error => {
        console.error('Login error:', error);
        alert('登入失敗，請再試一次');
    });
}

export function signOut() {
    resetState();
    auth.signOut();
    showScreen('role');
}

export function updateUserInfo() {
    const html = `
        <img src="${state.currentUser.photoURL || 'https://via.placeholder.com/32'}" class="user-avatar" alt="avatar">
        <span class="user-name">${state.currentUser.displayName || state.currentUser.email}</span>
    `;
    ['customerUserInfo', 'chefUserInfo', 'managerUserInfo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    });
}

export function setupAuthListener(onAuthSuccess) {
    auth.onAuthStateChanged(user => {
        state.currentUser = user;
        if (user && state.currentRole) {
            onAuthSuccess(state.currentRole);
        }
    });
}

// Export for onclick handlers
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
