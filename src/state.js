// Global application state
export const state = {
    currentRole: null,
    currentUser: null,
    selectedItems: [],
    recipes: [],
    ingredientUrgency: {},

    // Unsubscribe functions for Firebase listeners
    unsubscribers: {
        orders: null,
        chat: null,
        recipes: null,
        urgency: null
    }
};

// Clear all subscriptions
export function clearSubscriptions() {
    Object.keys(state.unsubscribers).forEach(key => {
        if (state.unsubscribers[key]) {
            state.unsubscribers[key]();
            state.unsubscribers[key] = null;
        }
    });
}

// Reset state on sign out
export function resetState() {
    state.currentRole = null;
    state.selectedItems = [];
    clearSubscriptions();
}
