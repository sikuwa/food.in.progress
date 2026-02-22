document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navIcon = document.getElementById('nav-icon');
    const overlay = document.getElementById('overlay-menu');

    // 1. MEHKI VHOD
    setTimeout(() => body.classList.add('page-loaded'), 100);

    // 2. NAVIGACIJA (Brez vmešavanja v animacijo križca)
    if (navIcon && overlay) {
        navIcon.addEventListener('click', () => {
            navIcon.classList.toggle('open');
            if (navIcon.classList.contains('open')) {
                overlay.style.width = "100%";
            } else {
                overlay.style.width = "0";
            }
        });
    }

    // 3. ANIMACIJA KARTIC (Prihod z leve)
    const cards = document.querySelectorAll('.card-wrapper');
    
    cards.forEach((card, index) => {
        // Začetni stil pred animacijo
        card.style.opacity = "0";
        card.style.transform = "translateX(-100px)";
        card.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
        
        // Zaporedni prihod (staggered effect)
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateX(0)";
        }, 400 + (index * 150)); 
    });
});