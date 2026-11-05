document.addEventListener('DOMContentLoaded', function () {
  var pages = [
    { title: "Portfolio", desc: "Page d'accueil", url: "index.html" },
    { title: "Sélection des projets", desc: "Voir tous les projets", url: "projet.html" },
    { title: "Projets scolaires", desc: "Projets réalisés durant les études", url: "projet-scolaire.html" },
    { title: "Projets en entreprise", desc: "Projets réalisés en entreprise", url: "projet-entreprise.html" },
    { title: "Veille", desc: "Articles et notes de veille", url: "veille.html" },
    { title: "Contact", desc: "Me contacter", url: "contact.html" }
  ];

  var container = document.getElementById('rootCards');
  if (!container) return;

  pages.forEach(function (p, i) {
    var a = document.createElement('a');
    a.href = p.url;
    a.className = 'card card-hover explore';
    var num = String(i + 1).padStart(2, '0');
    a.innerHTML =
      '<div class="top"><span class="index-num">' + num + '</span>' +
      '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg></div>' +
      '<h3></h3><p></p><span class="more"></span>';
    a.querySelector('h3').textContent = p.title;
    a.querySelector('p').textContent = p.desc;
    a.querySelector('.more').textContent = p.url;
    container.appendChild(a);
  });
});
