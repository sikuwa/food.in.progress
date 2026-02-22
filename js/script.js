document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navIcon = document.getElementById('nav-icon');
    const overlay = document.getElementById('overlay-menu');
    const dots = document.querySelectorAll('.dot');
    const container = document.querySelector('.sections-container');
    const sections = document.querySelectorAll('.v-section');
    const bgLayers = document.querySelectorAll('.bg-layer');

    let current = 0;
    let moving = false;
    let startY = 0;
    let isDragging = false;

    // 1. MEHKI VHOD
    setTimeout(() => body.classList.add('page-loaded'), 100);

    // 2. GLAVNA FUNKCIJA ZA PREMIK
    function update(idx) {
        if (moving || idx < 0 || idx >= sections.length) return;
        moving = true;
        current = idx;

        const yOffset = -idx * 100;
        container.style.transition = "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)";
        container.style.transform = `translate3d(0, ${yOffset}vh, 0)`;
        
        // Pike in ozadja (samo če obstajajo)
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        if (window.innerWidth > 991) {
            bgLayers.forEach((l, i) => l.classList.toggle('active', i === idx));
        }

        setTimeout(() => { moving = false; }, 800);
    }

    // 3. MOBILNI SNAP (Touch)
    if (window.innerWidth <= 991) {
        window.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
            isDragging = true;
            if (body.classList.contains('scrolled')) {
                container.style.transition = "none";
            }
        }, { passive: true });

        window.addEventListener('touchmove', e => {
            if (!isDragging || moving) return;
            let currentY = e.touches[0].clientY;
            let diff = startY - currentY; // Pozitivno = vlečemo GOR

            if (!body.classList.contains('scrolled')) {
                if (diff > 60) {
                    body.classList.add('scrolled');
                    isDragging = false;
                    update(0);
                }
                return;
            }

            if (e.cancelable) e.preventDefault();
            let moveY = -current * 100 - (diff / window.innerHeight * 100);
            container.style.transform = `translate3d(0, ${moveY}vh, 0)`;
        }, { passive: false });

        window.addEventListener('touchend', e => {
            if (!isDragging || !body.classList.contains('scrolled')) return;
            isDragging = false;
            let diff = startY - e.changedTouches[0].clientY;

            if (Math.abs(diff) > 70) {
                if (diff > 0 && current < sections.length - 1) current++;
                else if (diff < 0) {
                    if (current === 0) body.classList.remove('scrolled');
                    else current--;
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
            if (e.deltaY > 0) { if (current < sections.length - 1) update(current + 1); }
            else if (e.deltaY < 0) {
                if (current === 0) body.classList.remove('scrolled');
                else update(current - 1);
            }
        }
    }, { passive: true });

    // 5. KLIK NA PIKE (Desktop)
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (window.innerWidth <= 991) return;
            const target = parseInt(dot.getAttribute('data-index'));
            if (!body.classList.contains('scrolled')) body.classList.add('scrolled');
            update(target);
        });
    });

    // 6. HAMBURGER
    if (navIcon && overlay) {
        navIcon.addEventListener('click', () => {
            navIcon.classList.toggle('open');
            overlay.style.width = navIcon.classList.contains('open') ? "100%" : "0";
        });
    }
});
