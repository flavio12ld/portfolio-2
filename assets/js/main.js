/* =========================================================
   Portfolio Flavio Lodé — script commun
   - pluie de code "Matrix" (canvas)
   - menu mobile
   - apparition des blocs au scroll
   - texte tapé, compteurs, formulaire de contact
   ========================================================= */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Pluie Matrix ---------- */
    function initMatrix() {
        var canvas = document.getElementById('matrix');
        if (!canvas || !canvas.getContext) return;
        var ctx = canvas.getContext('2d');
        var glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]/=+*#$;:'.split('');
        var words = ['ssh', 'nmap', 'sudo', 'root', 'vlan', 'dns', 'dhcp', 'tcp', 'ping', 'gpo', 'ufw', 'cis', 'aes', 'ldap', 'siem', 'vpn'];
        var size, cols, drops, speeds, queue, w, h, last = 0, raf = null;

        function pick() { return glyphs[(Math.random() * glyphs.length) | 0]; }

        function resize() {
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            size = w < 600 ? 14 : 17;
            cols = Math.ceil(w / size);
            drops = []; speeds = []; queue = [];
            for (var i = 0; i < cols; i++) {
                drops[i] = Math.random() * -(h / size);
                speeds[i] = 0.45 + Math.random() * 0.85;
                queue[i] = '';
            }
            ctx.fillStyle = '#030806';
            ctx.fillRect(0, 0, w, h);
        }

        function step() {
            ctx.fillStyle = 'rgba(3, 8, 6, 0.085)';
            ctx.fillRect(0, 0, w, h);
            ctx.font = '500 ' + size + 'px "JetBrains Mono", monospace';
            for (var i = 0; i < cols; i++) {
                var x = i * size;
                var y = drops[i] * size;
                // de temps en temps, une colonne "écrit" un mot de commande réseau
                var ch;
                if (queue[i].length) { ch = queue[i].charAt(0); queue[i] = queue[i].slice(1); }
                else { ch = pick(); if (Math.random() > 0.9985) queue[i] = words[(Math.random() * words.length) | 0]; }

                ctx.fillStyle = 'rgba(0, 255, 136, ' + (0.5 + Math.random() * 0.4) + ')';
                ctx.fillText(pick(), x, y - size);
                ctx.fillStyle = '#d9ffec';
                ctx.fillText(ch, x, y);

                if (y > h && Math.random() > 0.975) {
                    drops[i] = 0;
                    speeds[i] = 0.45 + Math.random() * 0.85;
                }
                drops[i] += speeds[i];
            }
        }

        function loop(t) {
            raf = requestAnimationFrame(loop);
            if (t - last < 48) return; // ~20 images/s : fluide et léger
            last = t;
            step();
        }

        resize();
        if (reduceMotion) {
            for (var n = 0; n < 90; n++) step(); // image fixe, sans animation
        } else {
            raf = requestAnimationFrame(loop);
            document.addEventListener('visibilitychange', function () {
                if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
                else if (!raf) { raf = requestAnimationFrame(loop); }
            });
        }
        var t;
        window.addEventListener('resize', function () {
            clearTimeout(t);
            t = setTimeout(function () { resize(); if (reduceMotion) for (var n = 0; n < 90; n++) step(); }, 150);
        });
    }

    /* ---------- Menu mobile ---------- */
    function initNav() {
        var toggle = document.getElementById('navToggle');
        var list = document.getElementById('mainNav');
        if (!toggle || !list) return;
        function close() { list.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = list.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        list.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
        document.addEventListener('click', function (e) { if (!list.contains(e.target) && e.target !== toggle) close(); });
    }

    /* ---------- Apparition au scroll ---------- */
    function initReveal() {
        var els = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window) || reduceMotion) {
            els.forEach(function (el) { el.classList.add('in'); });
            return;
        }
        var fired = false;
        var io = new IntersectionObserver(function (entries) {
            fired = true;
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        els.forEach(function (el) { io.observe(el); });
        // Sécurité : si l'observateur ne répond jamais, on affiche tout le contenu
        setTimeout(function () {
            if (!fired) { io.disconnect(); els.forEach(function (el) { el.classList.add('in'); }); }
        }, 1500);
    }

    /* ---------- Texte tapé (accueil) ---------- */
    function initTyped() {
        var el = document.querySelector('[data-typed]');
        if (!el) return;
        var items;
        try { items = JSON.parse(el.getAttribute('data-typed')); } catch (e) { return; }
        if (!items || !items.length) return;
        if (reduceMotion) { el.textContent = items[0]; return; }
        var i = 0, pos = 0, deleting = false;
        function tick() {
            var word = items[i];
            pos += deleting ? -1 : 1;
            el.textContent = word.slice(0, pos);
            var delay = deleting ? 35 : 70;
            if (!deleting && pos === word.length) { deleting = true; delay = 1800; }
            else if (deleting && pos === 0) { deleting = false; i = (i + 1) % items.length; delay = 350; }
            setTimeout(tick, delay);
        }
        el.textContent = '';
        setTimeout(tick, 900);
    }

    /* ---------- Compteurs ---------- */
    function initCounters() {
        var els = document.querySelectorAll('[data-count]');
        if (!els.length) return;
        function run(el) {
            var target = parseInt(el.getAttribute('data-count'), 10) || 0;
            var suffix = el.getAttribute('data-suffix') || '';
            if (reduceMotion) { el.textContent = target + suffix; return; }
            var start = null, dur = 1200;
            function frame(ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / dur, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        }
        if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
            });
        }, { threshold: 0.5 });
        els.forEach(function (el) { io.observe(el); });
    }

    /* ---------- Formulaire de contact (ouvre la messagerie) ---------- */
    function initContactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var nom = form.querySelector('#nom').value;
            var email = form.querySelector('#email').value;
            var message = form.querySelector('#message').value;
            var subject = 'Message depuis le portfolio';
            var body = 'Nom: ' + nom + '\nEmail: ' + email + '\n\nMessage:\n' + message;
            var to = ['flaviolode12', 'gmail.com'].join('@');
            window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        });
    }

    /* ---------- Année du footer ---------- */
    function initYear() {
        document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    }

    function init() {
        initMatrix();
        initNav();
        initReveal();
        initTyped();
        initCounters();
        initContactForm();
        initYear();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
}());
