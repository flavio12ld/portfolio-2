document.addEventListener('DOMContentLoaded', () => {
  const pages = [
    { title: "Portfolio", desc: "Page d'accueil", url: "index.html" },
    { title: "Sélection des projets", desc: "Voir tous les projets", url: "projet.html" },
    { title: "Projets scolaires", desc: "Projets réalisés durant les études", url: "projet-scolaire.html" },
    { title: "Projets en entreprise", desc: "Projets réalisés en entreprise", url: "projet-entreprise.html" },
    { title: "Veille", desc: "Articles et notes de veille", url: "veille.html" },
    { title: "Contact", desc: "Me contacter", url: "contact.html" }
  ];

  const container = document.getElementById('rootCards');

  pages.forEach(p => {
    const a = document.createElement('a');
    a.href = p.url;
    a.className = 'block bg-gray-900 border border-gray-700 rounded-lg p-4 hover:shadow-lg transform hover:-translate-y-1 transition';
    a.innerHTML = `
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-blue-400 mt-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 0 0 2 2h14V5H5a2 2 0 0 0-2 2z"></path>
        </svg>
        <div>
          <h3 class="text-lg font-semibold text-blue-300">${p.title}</h3>
          <p class="text-sm text-gray-300">${p.desc}</p>
        </div>
      </div>
    `;
    container.appendChild(a);
  });
});