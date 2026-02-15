import { navigateTo } from './modules/navigation.js';
import { toggleMenu, setupScrollSnap } from './modules/ui.js';
import { moveB, renderPubPage } from './modules/publications.js';
import { copyCitation } from './modules/database.js';
// Ajuste 1: Adicionada a importação do moveResearch
import { moveResearchTo, htToggleCard, moveResearch } from './modules/team.js';

// --- EXPOSIÇÃO GLOBAL PARA HTML ---
window.navigateTo = navigateTo;
window.toggleMenu = toggleMenu;
window.moveB = moveB;
window.renderPubPage = renderPubPage;
window.copyCitation = copyCitation;

// Ajuste 2: Organizada a exposição de Equipe (removida a duplicidade)
window.moveResearch = moveResearch;
window.moveResearchTo = moveResearchTo;
window.htToggleCard = htToggleCard;

window.closeMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  if (menu && menu.classList.contains('open')) toggleMenu();
};

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
  setupScrollSnap();

  const injections = [
    { id: 'header-injection-point', file: 'components/header.html' },
    { id: 'mobile-menu', file: 'components/menu.html' },
    { id: 'global-footer-root', file: 'components/footer.html' }
  ];

  injections.forEach(async (adj) => {
    const target = document.getElementById(adj.id);
    if (target) {
      try {
        const resp = await fetch(adj.file);
        if (resp.ok) {
          target.innerHTML = await resp.text();
        }
      } catch (e) {
        console.error(`Erro injeção: ${adj.file}`, e);
      }
    }
  });

  navigateTo('home');
});