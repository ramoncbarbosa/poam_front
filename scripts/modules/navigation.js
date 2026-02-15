import { renderPublications, renderPubDetail } from './publications.js';
import { renderDatabases, renderDbDetail } from './database.js';
import { initHomeTeam, renderFullTeamPage } from './team.js';

export async function navigateTo(pId, extraData = null) {
  const allowedPages = ['home', 'publications', 'database', 'team', 'pubdetail', 'dbdetail'];
  if (!allowedPages.includes(pId)) pId = 'home';

  const contentArea = document.getElementById('content-area');
  const globalFooter = document.getElementById('global-footer-root');

  try {
    const response = await fetch(`pages/${pId}.html`);
    if (!response.ok) throw new Error('Falha ao carregar página.');

    contentArea.innerHTML = await response.text();

    switch (pId) {
      case 'home':
        await initHomeTeam();
        await loadHomeComponents();
        break;
      case 'database': renderDatabases(); break;
      case 'dbdetail': renderDbDetail(extraData); break;
      case 'publications': renderPublications(); break;
      case 'team': renderFullTeamPage(); break;
      case 'pubdetail': renderPubDetail(extraData); break;
    }

    window.scrollTo(0, 0);
    if (window.closeMobileMenu) window.closeMobileMenu();
  } catch (error) {
    console.error("Erro na navegação:", error);
  }
}

async function loadHomeComponents() {
  const components = [
    { id: 'diamonds-injection-point', file: 'components/diamonds.html' },
    { id: 'location-injection-point', file: 'components/location.html' }
  ];
  for (const comp of components) {
    const target = document.getElementById(comp.id);
    if (target) {
      try {
        const resp = await fetch(comp.file);
        if (resp.ok) target.innerHTML = await resp.text();
      } catch (e) { console.error(`Erro ao carregar componente: ${comp.file}`); }
    }
  }
}