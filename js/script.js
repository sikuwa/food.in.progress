document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navIcon = document.getElementById('nav-icon');
    const overlay = document.getElementById('overlay-menu');
    const dots = document.querySelectorAll('.dot');
    const container = document.querySelector('.sections-container');
    const bgLayers = document.querySelectorAll('.bg-layer');

    let current = 0;
    let moving = false;

    // 1. MEHKI VHOD (Fade-in ob nalaganju)
    setTimeout(() => body.classList.add('page-loaded'), 100);

    // 2. POMOŽNA FUNKCIJA ZA POSODABLJANJE SEKCIJ (Samo Desktop)
    function update(idx) {
        // Prekinemo, če smo na mobilcu, če se že premikamo ali če indeks ne obstaja
        if (window.innerWidth <= 991 || moving) return;
        if (idx < 0 || idx >= dots.length) return;
        
        moving = true;
        current = idx;

        // Premik vsebine navpično (vh enote)
        if (container) {
            container.style.transform = `translateY(-${idx * 100}vh)`;
        }
        
        // Posodobitev aktivne pike
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');

        // Preklop slik v ozadju
        bgLayers.forEach(l => l.classList.remove('active'));
        if (bgLayers[idx]) bgLayers[idx].classList.add('active');

        // Animacija gumbov znotraj sekcij
        document.querySelectorAll('.btn-premium').forEach(b => b.classList.remove('visible'));
        const activeBtn = document.querySelectorAll('.v-section')[idx]?.querySelector('.btn-premium');
        
        setTimeout(() => {
            if (activeBtn) activeBtn.classList.add('visible');
            moving = false;
        }, 800);
    }

    // 3. SCROLL INTERAKCIJA (Wheel event)
    window.addEventListener('wheel', (e) => {
        // Na mobilnih napravah dovolimo naraven scroll, JS ne posega vmes
        if (window.innerWidth <= 991) return; 
        if (moving) return;

        // Preverjanje vstopnega stanja (Intro mode)
        if (!body.classList.contains('scrolled')) {
            if (e.deltaY > 0) {
                body.classList.add('scrolled');
                update(0); 
            }
        } else {
            // Logika za premikanje med sekcijami na desktopu
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

    // 4. NAVIGACIJSKE PIKE (Klik na desktopu)
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

    // 5. HAMBURGER & OVERLAY MENI
    if (navIcon && overlay) {
        navIcon.addEventListener('click', () => {
            navIcon.classList.toggle('open');
            // Če je odprt, raztegni čez cel zaslon, sicer zapri na 0
            overlay.style.width = navIcon.classList.contains('open') ? "100%" : "0";
        });
    }

    // 6. MEHKI ODHOD (Prehodi na nove strani)
    document.querySelectorAll('.nav-links a, .btn-premium').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Preprečimo takojšen skok, če gre za lokalno .html datoteko
            if (href && href.includes('.html')) {
                e.preventDefault();
                body.classList.add('page-exit');
                setTimeout(() => window.location.href = href, 800);
            }
        });
    });

    // 7. RESPONSIVE RESET (Če uporabnik spreminja velikost okna ali obrača telefon)
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 991) {
            // Pobrišemo transformacije, da omogočimo naraven scroll
            if (container) container.style.transform = "none";
            body.classList.remove('scrolled');
            current = 0;
        }
    });
});
