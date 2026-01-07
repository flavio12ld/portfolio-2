(function () {
    'use strict';

    // util: debounce
    function debounce(fn, wait) {
        let t;
        return function () {
            const args = arguments;
            const ctx = this;
            clearTimeout(t);
            t = setTimeout(function () { fn.apply(ctx, args); }, wait);
        };
    }

    // util: check if element visible in viewport (with offset)
    function isInViewport(el, offset = 50) {
        const rect = el.getBoundingClientRect();
        return rect.top < (window.innerHeight - offset);
    }

    // revealOnScroll: ajoute .visible aux éléments .fade-in
    function revealOnScroll() {
        document.querySelectorAll('.fade-in').forEach(function (el) {
            if (isInViewport(el, 50)) el.classList.add('visible');
        });
    }

    // animateProgressBars: anime la largeur depuis 0 jusqu'au pourcentage défini
    function animateProgressBars() {
        document.querySelectorAll('.progress-fill').forEach(function (el) {
            // valeur cible préférée : data-target (ex: "40" ou "40%")
            const raw = el.getAttribute('data-target') || el.style.width || el.dataset.percent || '';
            let percent = 0;
            if (typeof raw === 'string' && raw.trim().length) {
                percent = parseFloat(raw.replace('%', '')) || 0;
            }
            // aria for accessibility
            el.setAttribute('role', 'progressbar');
            el.setAttribute('aria-valuemin', '0');
            el.setAttribute('aria-valuemax', '100');

            // animate
            el.style.width = '0%';
            // ensure transition set (in case custom)
            el.style.transition = 'width 900ms cubic-bezier(.2,.9,.2,1)';
            // small timeout for visual effect
            setTimeout(function () {
                el.style.width = percent + '%';
                el.setAttribute('aria-valuenow', '' + percent);
            }, 80);
        });
    }

    // attachSurpriseHandler -> bouton surprise
    function attachSurpriseHandler() {
        const btn = document.getElementById('surpriseBtn');
        const surprise = document.getElementById('surprise');
        if (!btn || !surprise) return;
        btn.addEventListener('click', function () {
            surprise.classList.toggle('hidden');
            // faire apparaître avec animation si besoin
            surprise.classList.add('fade-in');
            setTimeout(function () { surprise.classList.add('visible'); }, 20);
            // access focus pour clavier
            if (!surprise.classList.contains('hidden')) surprise.focus();
        });
    }

    // attachContactHandler -> simulate submit (remplacer par fetch si backend)
    function attachContactHandler() {
        const form = document.getElementById('contactForm') || document.querySelector('form#contactForm');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi...';
            }
            // simulation
            setTimeout(function () {
                const success = document.createElement('p');
                success.className = 'mt-4 text-green-400 contact-success';
                success.setAttribute('role', 'status');
                success.textContent = 'Message envoyé — merci ! (simulation locale)';
                if (!form.querySelector('.contact-success')) form.appendChild(success);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Envoyer';
                }
                form.reset();
            }, 900);
        });
    }

    // mobile nav toggle (si bouton #navToggle exist) — utilise mainNav id
    function attachNavToggle() {
        const toggle = document.getElementById('navToggle');
        const navList = document.getElementById('mainNav');
        if (!toggle || !navList) return;
        toggle.addEventListener('click', function () {
            const open = navList.classList.toggle('hidden') === false;
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    // Close mobile nav when clicking a nav link (improves UX on small screens)
    function attachNavCloseOnClick() {
        const toggle = document.getElementById('navToggle');
        const navList = document.getElementById('mainNav');
        if (!toggle || !navList) return;
        navList.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth < 768 && !navList.classList.contains('hidden')) {
                    navList.classList.add('hidden');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        // Escape key to close mobile nav
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && window.innerWidth < 768 && !navList.classList.contains('hidden')) {
                navList.classList.add('hidden');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            }
        });
        // Click outside to close
        document.addEventListener('click', function (e) {
            const target = e.target;
            if (window.innerWidth < 768 && !navList.classList.contains('hidden')) {
                if (!navList.contains(target) && target !== toggle && !toggle.contains(target)) {
                    navList.classList.add('hidden');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // small UI helpers: add hover effect for skill percentage label (optional)
    function attachSkillHover() {
        document.querySelectorAll('.progress-track').forEach(function (track) {
            track.addEventListener('mouseenter', function () {
                track.classList.add('hovered');
            });
            track.addEventListener('mouseleave', function () {
                track.classList.remove('hovered');
            });
        });
    }

    // Chargement progressif des images de la section "Passions".
    // Logique : si un fichier local haute-résolution existe (ex: assets/img/passion-*-4k.webp), il est utilisé,
    // sinon on utilise l'URL distante fournie en data-remote-src. Le chargement se fait quand l'élément entre
    // dans le viewport (lazy) pour économiser la bande passante.
    function setPassionBackgrounds() {
        document.querySelectorAll('.passion-img').forEach(function (el) {
            // Attributs attendus : data-local-src, data-remote-src
            const local = el.dataset.localSrc;
            const remote = el.dataset.remoteSrc;
            const setBg = function (src) {
                if (!src) return;
                el.style.backgroundImage = "url('" + src + "')";
            };

            const loadSrc = function () {
                if (local) {
                    const img = new Image();
                    img.onload = function () { setBg(local); };
                    img.onerror = function () { if (remote) setBg(remote); };
                    img.src = local;
                } else if (remote) {
                    const img = new Image();
                    img.onload = function () { setBg(remote); };
                    img.onerror = function () { /* ignore */ };
                    img.src = remote;
                }
            };

            // Si déjà visible, charger tout de suite sinon attendre le scroll
            if (isInViewport(el, 120)) {
                loadSrc();
            } else {
                const handler = debounce(function () {
                    if (isInViewport(el, 120)) {
                        loadSrc();
                        window.removeEventListener('scroll', handler);
                    }
                }, 100);
                window.addEventListener('scroll', handler);
                // aussi essayer au chargement complet
                window.addEventListener('load', function () { if (isInViewport(el, 120)) { loadSrc(); window.removeEventListener('scroll', handler); } });
            }
        });
    }

    // Définit dynamiquement l'item de la navbar qui correspond à la page courante
    function setActiveNavItem() {
        try {
            const path = (window.location.pathname || '').toLowerCase();
            let page = path.substring(path.lastIndexOf('/') + 1);
            if (!page || page === '') page = 'index.html';

            document.querySelectorAll('#mainNav a').forEach(function (a) {
                a.removeAttribute('aria-current');
                try {
                    const href = a.getAttribute('href') || '';
                    const url = new URL(href, window.location.origin);
                    let hrefPage = url.pathname.substring(url.pathname.lastIndexOf('/') + 1).toLowerCase();
                    if (!hrefPage || hrefPage === '') hrefPage = 'index.html';
                    if (hrefPage === page) {
                        a.setAttribute('aria-current', 'page');
                    }
                } catch (e) { /* ignore invalid href */ }
            });
        } catch (e) { /* non critique */ }
    }

    function init() {
        // initial actions
        revealOnScroll();
        animateProgressBars();

        // Animated background setup (index only) and respects preferences
        setupAnimatedBackground();

        attachSurpriseHandler();
        attachContactHandler();
        attachNavToggle();
        attachNavCloseOnClick();
        attachSkillHover();

        // load passion images with fallback logic
        try { setPassionBackgrounds(); } catch (e) { /* non critique */ }

        // set the active nav item based on the current page
        try { setActiveNavItem(); } catch (e) { /* non critique */ }

        // event listeners (debounced)
        window.addEventListener('scroll', debounce(revealOnScroll, 60));
        window.addEventListener('resize', debounce(function () {
            revealOnScroll();
            animateProgressBars();
        }, 100));

        // re-run after load to ensure assets/styles applied
        window.addEventListener('load', function () {
            revealOnScroll();
            animateProgressBars();
        });
    }

    // run on DOM ready
    document.addEventListener('DOMContentLoaded', init);

    // Animated background logic: enable on index.html and respect reduced-motion
    function isIndexPage() {
        try {
            const path = window.location.pathname || '';
            const last = path.substring(path.lastIndexOf('/') + 1).toLowerCase();
            // consider when URL ends with / (last === '') or index file
            return last === '' || last === 'index.html' || last === 'index.htm';
        } catch (e) { return false; }
    }

    function setupAnimatedBackground() {
        const body = document.body;
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // debug info
        // debug logs removed for production; keep function call above
        if (!isIndexPage()) {
            body.classList.remove('animated-bg');
            return;
        }
        if (prefersReduced) {
            body.classList.remove('animated-bg');
            body.style.animationPlayState = 'paused';
        } else {
            body.classList.add('animated-bg');
            body.style.animationPlayState = 'running';
        }

        // Ensure layout-flex for index so footer stays bottom (adds classes if missing)
        try {
            const mainEl = document.querySelector('main');
            body.classList.add('flex', 'flex-col');
            if (mainEl) mainEl.classList.add('flex-1');
        } catch (e) { /* ignore */ }

        // Remove static tailwind gradient classes if present so CSS animation takes precedence
        ['bg-gradient-to-br', 'from-black', 'via-gray-800', 'to-blue-200'].forEach(cls => body.classList.remove(cls));

        // Pause animation when tab is hidden
        document.addEventListener('visibilitychange', function () {
            const prefersNow = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (document.hidden) body.style.animationPlayState = 'paused';
            else body.style.animationPlayState = prefersNow ? 'paused' : 'running';
        });

        // watch for preference changes
        if (window.matchMedia) {
            const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
            mq.addEventListener('change', function (e) {
                if (e.matches) {
                    body.classList.remove('animated-bg');
                    body.style.animationPlayState = 'paused';
                } else {
                    body.classList.add('animated-bg');
                    body.style.animationPlayState = 'running';
                }
            });
        }
    }

}());
