import { navigateTo } from './modules/navigation.js';
import { toggleMenu, setupScrollSnap } from './modules/ui.js';
import { renderPublications, renderPubDetail } from './modules/publications.js';
import { initHomeTeam, moveResearch, moveResearchTo } from './modules/team.js'; // Adicionado initHomeTeam

// Exposição global
window.navigateTo = navigateTo;
window.toggleMenu = toggleMenu;
window.renderPubPage = renderPublications;
window.renderPubDetail = renderPubDetail;
window.moveResearch = moveResearch;
window.moveResearchTo = moveResearchTo;

async function initApp() {
  setupScrollSnap();

  // Inicia na home
  navigateTo('home');

  // IMPORTANTE: Inicializa a equipe se estivermos na Home
  initHomeTeam();

  const injections = [
    { id: 'header-injection-point', file: './components/header.html' },
    { id: 'mobile-menu', file: './components/menu.html' },
    { id: 'global-footer-root', file: './components/footer.html' }
  ];

  injections.forEach(adj => {
    const target = document.getElementById(adj.id);
    if (target) {
      fetch(adj.file)
        .then(resp => resp.ok ? resp.text() : null)
        .then(html => { if (html) target.innerHTML = html; })
        .catch(e => console.error(`Erro injeção: ${adj.file}`, e));
    }
  });
}

initApp();