// Modal component
const modal = document.getElementById('modal');
const orderSummary = document.getElementById('orderSummary');
const closeModalBtn = document.getElementById('closeModal');

export function showModal(items, notesText) {
    let summaryHTML = items.map(item =>
        `<div class="order-summary-item">🌿 ${item}</div>`
    ).join('');

    if (notesText) {
        summaryHTML += `<div class="order-summary-note">« ${notesText} »</div>`;
    }

    orderSummary.innerHTML = summaryHTML;
    modal.classList.add('active');
}

export function hideModal() {
    modal.classList.remove('active');
}

// Close modal on button click
closeModalBtn.addEventListener('click', hideModal);

// Close modal on overlay click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
});

// Export callback setter for when modal closes
let onCloseCallback = null;

export function setOnCloseCallback(callback) {
    onCloseCallback = callback;
}

closeModalBtn.addEventListener('click', () => {
    if (onCloseCallback) onCloseCallback();
});
