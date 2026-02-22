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

    // 2. POMOŽNA FUNKCIJA ZA POSODABLJANJE SEKCIJ (Samo Desktop)
    function update(idx) {
        // Če je mobilec, ne premikaj kontejnerja
        if (window.innerWidth <= 991 || moving) return;
        if (idx < 0 || idx >= dots.length) return;
        
        moving = true;
        current = idx;

        if (container) {
            container.style.transform = `translateY(-${idx * 100}vh)`;
        }
        
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');

        bgLayers.forEach(l => l.classList.remove('active'));
        if (bgLayers[idx]) bgLayers[idx].classList.add('active');

        // Gumbi
        document.querySelectorAll('.btn-premium').forEach(b => b.classList.remove('visible'));
        const activeBtn = document.querySelectorAll('.v-section')[idx]?.querySelector('.btn-premium');
        
        setTimeout(() => {
            if (activeBtn) activeBtn.classList.add('visible');
            moving = false;
        }, 800);
    }

    // 3. SCROLL INTERAKCIJA
    window.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 991) return; // NA MOBILCU NE DELAJ NIČ
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
                if (current === 0) {
                    body.classList.remove('scrolled');
                } else {
                    update(current - 1);
                }
            }
        }
    }, { passive: true });

    // 4. NAVIGACIJSKE PIKE (Klik)
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (window.innerWidth <= 991) return;
            const target = parseInt(dot.dataset.index);
            if (!body.classList.contains('scrolled')) body.classList.add('scrolled');
            update(target);
        });
    });

    // 5. HAMBURGER & OVERLAY
    if (navIcon && overlay) {
        navIcon.addEventListener('click', () => {
            navIcon.classList.toggle('open');
            overlay.style.width = navIcon.classList.contains('open') ? "100%" : "0";
        });
    }

    // 6. MEHKI ODHOD
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

    // 7. RESET OB SPREMEMBI VELIKOSTI
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 991) {
            if (container) container.style.transform = "none";
            // Pustimo body.scrolled na miru, da ne skače logotip med scrollanjem na mobilcu
            current = 0;
        }
    });
});
