document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navIcon = document.getElementById('nav-icon');
    const overlay = document.getElementById('overlay-menu');
    const dots = document.querySelectorAll('.dot');
    const container = document.querySelector('.sections-container');
    const bgLayers = document.querySelectorAll('.bg-layer');

    // 1. MEHKI VHOD
    setTimeout(() => body.classList.add('page-loaded'), 100);

    // 2. MEHKI ODHOD - Popravljen selektor, da ne blokira socialnih ikon
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

    let current = 0;
    let moving = false;

    function update(idx) {
        if (idx < 0 || idx >= dots.length || moving) return;
        moving = true;
        current = idx;

        // Premik vsebine
        container.style.transform = `translateY(-${idx * 100}vh)`;
        
        // Pike
        dots.forEach(d => d.classList.remove('active'));
        dots[idx].classList.add('active');

        // Slike ozadja
        bgLayers.forEach(l => l.classList.remove('active'));
        if (bgLayers[idx]) bgLayers[idx].classList.add('active');

        // Gumbi
        document.querySelectorAll('.btn-premium').forEach(b => b.classList.remove('visible'));
        setTimeout(() => {
            const btn = document.querySelectorAll('.v-section')[idx].querySelector('.btn-premium');
            if (btn) btn.classList.add('visible');
            moving = false;
        }, 1100);
    }

    // 3. SCROLL INTERAKCIJA
    window.addEventListener('wheel', (e) => {
        if (moving) return;

        if (!body.classList.contains('scrolled')) {
            if (e.deltaY > 0) {
                body.classList.add('scrolled');
                // Takoj pokaži prvo sliko in gumb ob prvem scrollu
                update(0); 
            }
        } else {
            if (e.deltaY > 0) update(current + 1);
            else if (e.deltaY < 0 && current === 0) {
                body.classList.remove('scrolled');
            } else if (e.deltaY < 0) {
                update(current - 1);
            }
        }
    }, { passive: true });

    // 4. OVERLAY PREKLOP
    navIcon.addEventListener('click', () => {
        navIcon.classList.toggle('open');
        if (navIcon.classList.contains('open')) {
            overlay.style.width = "100%";
        } else {
            overlay.style.width = "0";
        }
    });

    // Pike na klik
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = parseInt(dot.dataset.index);
            if (!body.classList.contains('scrolled')) {
                body.classList.add('scrolled');
                setTimeout(() => update(target), 800);
            } else {
                update(target);
            }
        });
    });
});