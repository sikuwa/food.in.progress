document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navIcon = document.getElementById('nav-icon');
    const overlay = document.getElementById('overlay-menu');
    const dots = document.querySelectorAll('.dot');
    const container = document.querySelector('.sections-container');
    const bgLayers = document.querySelectorAll('.bg-layer');
    const sections = document.querySelectorAll('.v-section');

    let current = 0;
    let moving = false;
    let startY = 0;
    let isDragging = false;

    // 1. MEHKI VHOD
    setTimeout(() => body.classList.add('page-loaded'), 100);

    // 2. POSODABLJANJE SEKCIJ (Desktop)
    function update(idx) {
        if (window.innerWidth <= 991 || moving) return;
        if (idx < 0 || idx >= dots.length) return;
        
        moving = true;
        current = idx;

        if (container) {
            container.style.transform = `translate3d(0, -${idx * 100}vh, 0)`;
        }
        
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');

        bgLayers.forEach(l => l.classList.remove('active'));
        if (bgLayers[idx]) bgLayers[idx].classList.add('active');

        document.querySelectorAll('.btn-premium').forEach(b => b.classList.remove('visible'));
        const activeBtn = sections[idx]?.querySelector('.btn-premium');
        
        setTimeout(() => {
            if (activeBtn) activeBtn.classList.add('visible');
            moving = false;
        }, 800);
    }

    // 3. MOBILNI SNAP & TOUCH (Brez zatikanja)
    if (window.innerWidth <= 991) {
        container.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
            isDragging = true;
            container.style.transition = "none"; 
        }, { passive: true });

        container.addEventListener('touchmove', e => {
            if (!isDragging) return;
            
            let currentY = e.touches[0].clientY;
            let diff = currentY - startY;

            // Če smo na vrhu in vlečemo dol, ne blokiramo intro logotipa
            if (!body.classList.contains('scrolled') && diff > 0) return;

            // Ključno: Preprečimo tresenje brskalnika
            if (e.cancelable) e.preventDefault();

            let moveY = -current * 100 + (diff / window.innerHeight * 100);
            // Translate3d uporabi GPU za gladko drsenje slik
            container.style.transform = `translate3d(0, ${moveY}vh, 0)`;
        }, { passive: false });

        container.addEventListener('touchend', e => {
            if (!isDragging) return;
            isDragging = false;
            
            let endY = e.changedTouches[0].clientY;
            let diff = endY - startY;

            container.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";

            if (Math.abs(diff) > 60) {
                if (diff < 0 && current < sections.length - 1) {
                    if (!body.classList.contains('scrolled')) {
                        body.classList.add('scrolled');
                    } else {
                        current++;
                    }
                } else if (diff > 0) {
                    if (current === 0) {
                        body.classList.remove('scrolled');
                    } else {
                        current--;
                    }
                }
            }
            container.style.transform = `translate3d(0, -${current * 100}vh, 0)`;
        });
    }

    // 4. DESKTOP DOGODKI (Wheel & Dots)
    window.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 991 || moving) return;
        if (!body.classList.contains('scrolled')) {
            if (e.deltaY > 0) { body.classList.add('scrolled'); update(0); }
        } else {
            if (e.deltaY > 0) { if (current < dots.length - 1) update(current + 1); }
            else if (e.deltaY < 0) { if (current === 0) body.classList.remove('scrolled'); else update(current - 1); }
        }
    }, { passive: true });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (window.innerWidth <= 991) return;
            const target = parseInt(dot.getAttribute('data-index'));
            if (!body.classList.contains('scrolled')) body.classList.add('scrolled');
            update(target);
        });
    });

    // 5. NAVIGACIJA (Hamburger)
    if (navIcon && overlay) {
        navIcon.addEventListener('click', () => {
            navIcon.classList.toggle('open');
            overlay.style.width = navIcon.classList.contains('open') ? "100%" : "0";
            if (window.innerWidth <= 991) body.style.overflow = "hidden";
        });
    }
});
