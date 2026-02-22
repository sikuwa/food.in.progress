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

    // 2. NAVIGACIJA IN PREHODI (Mehki odhod)
    document.querySelectorAll('.nav-links a, .btn-premium').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Preprečimo prehod, če gre za sidro ali prazen link
            if (href && href.includes('.html')) {
                e.preventDefault();
                body.classList.add('page-exit');
                setTimeout(() => window.location.href = href, 800);
            }
        });
    });

    // 3. POSODABLJANJE SEKCIJ (Logic za Desktop)
    function update(idx) {
        if (window.innerWidth <= 991) return; // Onemogoči na mobilcih
        if (idx < 0 || idx >= dots.length || moving) return;
        
        moving = true;
        current = idx;

        // Premik vsebine
        container.style.transform = `translateY(-${idx * 100}vh)`;
        
        // Posodobitev pik (navigacija)
        dots.forEach(d => d.classList.remove('active'));
        if(dots[idx]) dots[idx].classList.add('active');

        // Slike ozadja (Fading effect)
        bgLayers.forEach(l => l.classList.remove('active'));
        if(bgLayers[idx]) bgLayers[idx].classList.add('active');

        // Gumbi v sekcijah
        document.querySelectorAll('.btn-premium').forEach(b => b.classList.remove('visible'));
        const activeBtn = document.querySelectorAll('.v-section')[idx]?.querySelector('.btn-premium');
        
        setTimeout(() => {
            if (activeBtn) activeBtn.classList.add('visible');
            moving = false;
        }, 800);
    }

    // 4. SCROLL INTERAKCIJA (Samo Desktop)
    window.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 991) return; // Naraven scroll na mobilcih
        if (moving) return;

        // Če še nismo "vstopili" v vsebino (Intro mode)
        if (!body.classList.contains('scrolled')) {
            if (e.deltaY > 0) {
                body.classList.add('scrolled');
                update(0); 
            }
        } else {
            // Premikanje med sekcijami
            if (e.deltaY > 0) {
                update(current + 1);
            } else if (e.deltaY < 0) {
                if (current === 0) {
                    body.classList.remove('scrolled');
                } else {
                    update(current - 1);
                }
            }
        }
    }, { passive: true });

    // 5. NAVIGACIJSKE PIKE (Klik)
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (window.innerWidth <= 991) return;
            const target = parseInt(dot.dataset.index);
            
            if (!body.classList.contains('scrolled')) {
                body.classList.add('scrolled');
            }
            update(target);
        });
    });

    // 6. OVERLAY MENU (Hamburger)
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

    // 7. RESPONSIVE RESET
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 991) {
            container.style.transform = "none";
            body.classList.remove('scrolled');
        }
    });
});