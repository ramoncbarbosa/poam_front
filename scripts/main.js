import { navigateTo } from './modules/navigation.js';
import { toggleMenu, setupScrollSnap } from './modules/ui.js';
// CORREÇÃO: importando 'moveB' e 'renderPublications' (o nome correto)
import { moveB, renderPublications } from './modules/publications.js';
import { copyCitation } from './modules/database.js';
import { moveResearch, moveResearchTo } from './modules/team.js';

// Exposição global
window.navigateTo = navigateTo;
window.toggleMenu = toggleMenu;
window.moveB = moveB;

// CORREÇÃO: Atribuindo renderPublications à variável global que você usava
window.renderPubPage = renderPublications;

window.copyCitation = copyCitation;
window.moveResearch = moveResearch;
window.moveResearchTo = moveResearchTo;

window.closeMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  if (menu?.classList.contains('open') || menu?.classList.contains('translate-x-0')) toggleMenu();
};

async function initApp() {
  setupScrollSnap();

  // Inicia na home
  navigateTo('home');

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