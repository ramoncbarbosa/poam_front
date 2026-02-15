import { navigateTo } from './modules/navigation.js';
import { toggleMenu, setupScrollSnap } from './modules/ui.js';
import { moveB, renderPubPage } from './modules/publications.js';
import { copyCitation } from './modules/database.js';
import { moveResearchTo, htToggleCard, moveResearch } from './modules/team.js';

// Exposição Global
window.navigateTo = navigateTo;
window.toggleMenu = toggleMenu;
window.moveB = moveB;
window.renderPubPage = renderPubPage;
window.copyCitation = copyCitation;
window.moveResearch = moveResearch;
window.moveResearchTo = moveResearchTo;
window.htToggleCard = htToggleCard;

window.closeMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  if (menu?.classList.contains('open')) toggleMenu();
};

// async function initApp() {
//   setupScrollSnap();

//   // Inicia a navegação imediatamente
//   navigateTo('home');

//   // Injeções em segundo plano (Header/Footer)
//   const injections = [
//     { id: 'header-injection-point', file: 'components/header.html' },
//     { id: 'mobile-menu', file: 'components/menu.html' },
//     { id: 'global-footer-root', file: 'components/footer.html' }
//   ];

//   for (const adj of injections) {
//     const target = document.getElementById(adj.id);
//     if (target) {
//       fetch(adj.file)
//         .then(resp => resp.ok ? resp.text() : null)
//         .then(html => { if (html) target.innerHTML = html; })
//         .catch(e => console.error(`Erro injeção: ${adj.file}`, e));
//     }
//   }
// }

async function initApp() {
  setupScrollSnap();

  // Inicia a navegação imediatamente
  navigateTo('home');

  // AJUSTE: Use caminhos relativos (./) para evitar erro 404 em subpastas de servidores
  const injections = [
    { id: 'header-injection-point', file: './components/header.html' },
    { id: 'mobile-menu', file: './components/menu.html' },
    { id: 'global-footer-root', file: './components/footer.html' }
  ];

  for (const adj of injections) {
    const target = document.getElementById(adj.id);
    if (target) {
      // O fetch agora buscará relativo à URL atual do navegador
      fetch(adj.file)
        .then(resp => {
          if (!resp.ok) throw new Error(`Falha: ${resp.status}`);
          return resp.text();
        })
        .then(html => { if (html) target.innerHTML = html; })
        .catch(e => console.error(`❌ Erro injeção: ${adj.file}`, e));
    }
  }
}

initApp();