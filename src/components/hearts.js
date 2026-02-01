// Floating hearts animation
const hearts = ['💚', '💕', '❤️', '💗', '🤍'];
const dinosContainer = document.getElementById('dinosContainer');

export function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-dino';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (18 + Math.random() * 14) + 'px';
    dinosContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
}

export function celebrateWithHearts() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createFloatingHeart(
                Math.random() * window.innerWidth,
                window.innerHeight - 100 + Math.random() * 100
            );
        }, i * 150);
    }
}
