document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const container = document.querySelector('.sections-container');
    const dots = document.querySelectorAll('.dot');
    const navIcon = document.getElementById('nav-icon');
    const overlay = document.getElementById('overlay-menu');
    const bgLayers = document.querySelectorAll('.bg-layer');

    let currentSection = 0;
    let isMoving = false;

    /* ==================================== */
    /* 1. Funkcija za preklop sekcij in ozadij */
    /* ==================================== */
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

    /* ==================================== */
    /* 2. Wheel event */
    /* ==================================== */
    window.addEventListener('wheel', (e) => {
        if (isMoving) return;

        // Intro v scrolled
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

    /* ==================================== */
    /* 3. Hamburger menu */
    /* ==================================== */
    navIcon.addEventListener('click', () => {
        navIcon.classList.toggle('open');
        overlay.style.width = navIcon.classList.contains('open') ? "100%" : "0";
    });

    /* ==================================== */
    /* 4. Klik na pike in overlay povezave */
    /* ==================================== */
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

    /* ==================================== */
    /* 5. TOUCH SWIPE LOGIKA */
    /* ==================================== */
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    container.addEventListener('touchstart', e => {
        if (isMoving) return;
        startY = e.touches[0].clientY;
        isDragging = true;
        document.body.classList.add('swiping');
    });

    container.addEventListener('touchmove', e => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        container.style.transform = `translateY(${-currentSection * 100 + diff / window.innerHeight * 100}vh)`;
    });

    container.addEventListener('touchend', e => {
        if (!isDragging) return;
        isDragging = false;
        const diff = currentY - startY;

        if (diff > 50 && currentSection > 0) {
            updateSection(currentSection - 1);
        } else if (diff < -50 && currentSection < dots.length - 1) {
            updateSection(currentSection + 1);
        } else {
            // reset na trenutno sekcijo, če premik ni dovolj
            container.style.transform = `translateY(-${currentSection * 100}vh)`;
        }

        document.body.classList.remove('swiping');
    });

    /* Optional: prevent vertical scroll bounce on mobile */
    container.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
});