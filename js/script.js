document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navIcon = document.getElementById('nav-icon');
    const overlay = document.getElementById('overlay-menu');
    const dots = document.querySelectorAll('.dot');
    const container = document.querySelector('.sections-container');
    const sections = document.querySelectorAll('.v-section');

    let current = 0;
    let moving = false;
    let startY = 0;
    let isDragging = false;

    // 1. MEHKI VHOD
    setTimeout(() => body.classList.add('page-loaded'), 100);

    // 2. GLAVNA FUNKCIJA ZA POSODABLJANJE (Desktop & Mobile Snap)
    function update(idx) {
        if (moving || idx < 0 || idx >= sections.length) return;
        moving = true;
        current = idx;

        // Premik kontejnerja
        const yOffset = -idx * 100;
        container.style.transition = "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
        container.style.transform = `translate3d(0, ${yOffset}vh, 0)`;
        
        // Posodobitev pika navigacije (samo če obstajajo)
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));

        setTimeout(() => { moving = false; }, 800);
    }

    // 3. MOBILE TOUCH LOGIKA
    if (window.innerWidth <= 991) {
        container.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
            isDragging = true;
            container.style.transition = "none";
        }, { passive: true });

        container.addEventListener('touchmove', e => {
            if (!isDragging || moving) return;
            let currentY = e.touches[0].clientY;
            let diff = currentY - startY;

            // Če smo na vrhu (Intro) in vlečemo dol, ne delamo nič
            if (!body.classList.contains('scrolled') && diff > 0) return;

            // Prepreči scroll brskalnika med snapom
            if (e.cancelable) e.preventDefault();

            let moveY = -current * 100 + (diff / window.innerHeight * 100);
            container.style.transform = `translate3d(0, ${moveY}vh, 0)`;
        }, { passive: false });

        container.addEventListener('touchend', e => {
            if (!isDragging) return;
            isDragging = false;
            let diff = e.changedTouches[0].clientY - startY;

            if (Math.abs(diff) > 60) {
                if (diff < 0) { // Vlečemo gor -> Gremo dol
                    if (!body.classList.contains('scrolled')) {
                        body.classList.add('scrolled');
                        current = 0; // Prva sekcija po intru
                    } else if (current < sections.length - 1) {
                        current++;
                    }
                } else { // Vlečemo dol -> Gremo gor
                    if (current === 0 && body.classList.contains('scrolled')) {
                        body.classList.remove('scrolled');
                    } else if (current > 0) {
                        current--;
                    }
                }
            }
            update(current);
        });
    }

    // 4. DESKTOP WHEEL
    window.addEventListener('wheel', e => {
        if (window.innerWidth <= 991 || moving) return;
        if (!body.classList.contains('scrolled')) {
            if (e.deltaY > 0) { body.classList.add('scrolled'); update(0); }
        } else {
            if (e.deltaY > 0) update(current + 1);
            else if (e.deltaY < 0) {
                if (current === 0) body.classList.remove('scrolled');
                else update(current - 1);
            }
        }
    }, { passive: true });

    // 5. NAVIGACIJA
    if (navIcon) {
        navIcon.addEventListener('click', () => {
            navIcon.classList.toggle('open');
            overlay.style.width = navIcon.classList.contains('open') ? "100%" : "0";
        });
    }
});
