/* security.js — assemble des informations sensibles côté client sans stocker d'infos en clair dans les scripts */
(function (){
  'use strict';

  function formatPhone(raw){
    // raw should be digits only, return spaced french format
    const s = (raw || '').toString().replace(/\D/g, '');
    return s.replace(/(\d{2})(?=\d)/g, '$1 ');
  }

  function copyToClipboard(text, el){
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){
        el.textContent = 'Copié';
        setTimeout(function(){ el.textContent = 'Copier'; }, 1300);
      });
    } else {
      // fallback
      const tmp = document.createElement('textarea');
      tmp.value = text;
      document.body.appendChild(tmp);
      tmp.select();
      try { document.execCommand('copy'); el.textContent = 'Copié'; } catch(e){}
      document.body.removeChild(tmp);
      setTimeout(function(){ el.textContent = 'Copier'; }, 1300);
    }
  }

  function revealEmail(el){
    var user = el.dataset.user;
    var domain = el.dataset.domain;
    if (!user || !domain) return;
    var email = user + '@' + domain;
    var a = document.createElement('a');
    a.href = 'mailto:' + email;
    a.className = el.className || '';
    a.textContent = email;
    el.parentNode.replaceChild(a, el);
    // copy button
    var copy = document.createElement('button');
    copy.className = 'ml-2 text-sm text-gray-300 hover:text-white transition';
    copy.type = 'button';
    copy.setAttribute('aria-label', 'Copier email');
    copy.textContent = 'Copier';
    copy.addEventListener('click', function(e){ e.stopPropagation(); e.preventDefault(); copyToClipboard(email, copy); });
    a.parentNode.insertBefore(copy, a.nextSibling);
  }

  function revealTelephone(el){
    var raw = el.dataset.t || el.dataset.tel || '';
    if (!raw) return;
    var formatted = formatPhone(raw);
    var a = document.createElement('a');
    a.href = 'tel:' + raw;
    a.className = el.className || '';
    a.textContent = formatted;
    el.parentNode.replaceChild(a, el);
    var copy = document.createElement('button');
    copy.className = 'ml-2 text-sm text-gray-300 hover:text-white transition';
    copy.type = 'button';
    copy.setAttribute('aria-label', 'Copier numéro');
    copy.textContent = 'Copier';
    copy.addEventListener('click', function(e){ e.stopPropagation(); e.preventDefault(); copyToClipboard(raw, copy); });
    a.parentNode.insertBefore(copy, a.nextSibling);
  }

  function initObf(){
    document.querySelectorAll('.obf-reveal').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var type = el.dataset.type;
        if (type === 'email') revealEmail(el);
        else if (type === 'tel' || type === 'phone') revealTelephone(el);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initObf);
  else initObf();
})();
