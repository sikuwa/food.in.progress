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

    // 2. GLAVNA FUNKCIJA ZA POSODABLJANJE (Samo Desktop)
    function update(idx) {
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

        document.querySelectorAll('.btn-premium').forEach(b => b.classList.remove('visible'));
        const activeBtn = sections[idx]?.querySelector('.btn-premium');
        
        setTimeout(() => {
            if (activeBtn) activeBtn.classList.add('visible');
            moving = false;
        }, 800);
    }

    // 3. MOBILNI TOUCH/SNAP LOGIKA (Tvoj predlog - Popravljen)
    if (window.innerWidth <= 991) {
        container.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
            isDragging = true;
            // Onemogočimo tranzicijo za takojšen odziv na prst
            container.style.transition = "none";
        }, { passive: true });

        container.addEventListener('touchmove', e => {
            if (!isDragging) return;
            
            let currentY = e.touches[0].clientY;
            let diff = currentY - startY;

            // Če smo na vrhu in vlečemo dol (intro), pustimo naravno
            if (!body.classList.contains('scrolled') && diff > 0) return;

            // Preprečimo brskalniku, da bi sam skrolal, da se ne zatika
            if (e.cancelable) e.preventDefault();

            let moveY = -current * 100 + (diff / window.innerHeight * 100);
            container.style.transform = `translateY(${moveY}vh)`;
        }, { passive: false }); // Passive: false je nujen za preventDefault

        container.addEventListener('touchend', e => {
            if (!isDragging) return;
            isDragging = false;
            
            let endY = e.changedTouches[0].clientY;
            let diff = endY - startY;

            // Vrnemo gladko tranzicijo za "snap"
            container.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";

            if (Math.abs(diff) > 70) { // Prag za premik
                if (diff < 0 && current < sections.length - 1) {
                    // Dol -> Naslednja
                    if (!body.classList.contains('scrolled')) {
                        body.classList.add('scrolled');
                    } else {
                        current++;
                    }
                } else if (diff > 0) {
                    // Gor -> Prejšnja
                    if (current === 0) {
                        body.classList.remove('scrolled');
                    } else {
                        current--;
                    }
                }
            }
            
            container.style.transform = `translateY(-${current * 100}vh)`;
        });
    }

    // 4. DESKTOP SCROLL (Wheel)
    const handleWheel = (e) => {
        if (window.innerWidth <= 991 || moving) return;

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
    };
    window.addEventListener('wheel', handleWheel, { passive: true });

    // 5. KLIK NA PIKE (Desktop)
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (window.innerWidth <= 991) return;
            const target = parseInt(dot.getAttribute('data-index'));
            if (!body.classList.contains('scrolled')) {
                body.classList.add('scrolled');
            }
            update(target);
        });
    });

    // 6. HAMBURGER & OVERLAY
    if (navIcon && overlay) {
        navIcon.addEventListener('click', () => {
            navIcon.classList.toggle('open');
            overlay.style.width = navIcon.classList.contains('open') ? "100%" : "0";
            
            if (window.innerWidth <= 991) {
                body.style.overflow = navIcon.classList.contains('open') ? "hidden" : "auto";
            }
        });
    }

    // 7. MEHKI ODHOD
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

    // 8. RESET OB RESIZE
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 991) {
            container.style.transform = body.classList.contains('scrolled') ? `translateY(-${current * 100}vh)` : "none";
        } else {
            container.style.transform = `translateY(-${current * 100}vh)`;
            body.style.overflow = "hidden";
        }
    });
});
