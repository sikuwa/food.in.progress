document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navIcon = document.getElementById('nav-icon');
    const overlay = document.getElementById('overlay-menu');
    const dots = document.querySelectorAll('.dot');
    const container = document.querySelector('.sections-container');
    const bgLayers = document.querySelectorAll('.bg-layer');

    let current = 0;
    let moving = false;

    // 1. MEHKI VHOD
    setTimeout(() => body.classList.add('page-loaded'), 100);

    // 2. FUNKCIJA ZA POSODABLJANJE (Samo Desktop)
    function update(idx) {
        if (window.innerWidth <= 991 || moving) return;
        if (idx < 0 || idx >= dots.length) return;
        
        moving = true;
        current = idx;
        if (container) container.style.transform = `translateY(-${idx * 100}vh)`;
        
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');

        bgLayers.forEach(l => l.classList.remove('active'));
        if (bgLayers[idx]) bgLayers[idx].classList.add('active');

        document.querySelectorAll('.btn-premium').forEach(b => b.classList.remove('visible'));
        const activeBtn = document.querySelectorAll('.v-section')[idx]?.querySelector('.btn-premium');
        setTimeout(() => {
            if (activeBtn) activeBtn.classList.add('visible');
            moving = false;
        }, 800);
    }

    // 3. SCROLL LOGIKA
    window.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 991) return; 
        if (moving) return;

        if (!body.classList.contains('scrolled')) {
            if (e.deltaY > 0) {
                body.classList.add('scrolled');
                update(0); 
            }
        } else {
            if (e.deltaY > 0) {
                if (current < dots.length - 1) update(current + 1);
            } else if (e.deltaY < 0) {
                if (current === 0) body.classList.remove('scrolled');
                else update(current - 1);
            }
        }
    }, { passive: true });

    // POSEBEN FIX ZA MOBILNI SCROLL (Detekcija odmika od vrha)
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 991) {
            if (window.scrollY > 50) {
                body.classList.add('scrolled');
            } else {
                body.classList.remove('scrolled');
            }
        }
    });

    // 4. HAMBURGER & OVERLAY
    if (navIcon && overlay) {
        navIcon.addEventListener('click', () => {
            navIcon.classList.toggle('open');
            overlay.style.width = navIcon.classList.contains('open') ? "100%" : "0";
        });
    }

    // 5. MEHKI ODHOD
    document.querySelectorAll('.nav-links a, .btn-premium').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.includes('.html')) {
                e.preventDefault();
                body.classList.add('page-exit');
                setTimeout(() => window.location.href = href, 800);
            }
        });
    });
});
