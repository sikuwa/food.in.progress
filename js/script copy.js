document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const container = document.querySelector('.sections-container');
    const dots = document.querySelectorAll('.dot');
    const navIcon = document.getElementById('nav-icon');
    const overlay = document.getElementById('overlay-menu');
    const bgLayers = document.querySelectorAll('.bg-layer');
    
    let currentSection = 0;
    let isMoving = false;

    // Funkcija za preklop sekcij in ozadij
    function updateSection(index) {
        if (index < 0 || index >= dots.length) return;
        
        isMoving = true;
        currentSection = index;
        container.style.transform = `translateY(-${index * 100}vh)`;
        
        // Pike
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');

        // Zoom & Opacity preklop slik
        bgLayers.forEach(lyr => lyr.classList.remove('active'));
        if (index === 1) bgLayers[0].classList.add('active');
        if (index === 3) bgLayers[1].classList.add('active');
        
        setTimeout(() => { isMoving = false; }, 1000);
    }

    // Wheel event
    window.addEventListener('wheel', (e) => {
        if (isMoving) return;

        // Intro v Scrolled prehod
        if (!body.classList.contains('scrolled')) {
            if (e.deltaY > 0) {
                body.classList.add('scrolled');
                isMoving = true;
                setTimeout(() => isMoving = false, 1100);
            }
            return;
        }

        // Navigacija med sekcijami
        if (e.deltaY > 0) {
            updateSection(currentSection + 1);
        } else if (e.deltaY < 0) {
            if (currentSection === 0) {
                body.classList.remove('scrolled');
                isMoving = true;
                setTimeout(() => isMoving = false, 1100);
            } else {
                updateSection(currentSection - 1);
            }
        }
    });

    // Meni (Hamburger)
    navIcon.addEventListener('click', () => {
        navIcon.classList.toggle('open');
        overlay.style.width = navIcon.classList.contains('open') ? "100%" : "0";
    });

    // Kliki na pike in povezave v meniju
    document.querySelectorAll('.dot, .overlay-content a').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const idx = parseInt(el.dataset.index || el.dataset.target);
            
            if (!isNaN(idx)) {
                if (!body.classList.contains('scrolled')) body.classList.add('scrolled');
                updateSection(idx);
                navIcon.classList.remove('open');
                overlay.style.width = "0";
            }
        });
    });
});