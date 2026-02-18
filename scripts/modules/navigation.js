import { renderPublications, renderPubDetail } from './publications.js';
import { renderDatabases, renderDbDetail } from './database.js';
import { initHomeTeam, renderFullTeamPage } from './team.js';
import { toggleMenu } from './ui.js'; // Importante para fechar o menu

// =========================================================
// FUNÇÃO AUXILIAR: ATUALIZAR DESTAQUE DOS LINKS
// =========================================================
function updateActiveLinks(pageId) {
  // 1. Remove a classe 'active' de TODOS os links
  const allLinks = document.querySelectorAll('.nav-link, .menu-link');
  allLinks.forEach(link => link.classList.remove('active'));

  // 2. Adiciona a classe 'active' apenas nos links da página atual
  // O seletor busca elementos que tenham data-page="home", data-page="team", etc.
  const activeLinks = document.querySelectorAll(`[data-page="${pageId}"]`);
  activeLinks.forEach(link => link.classList.add('active'));
}

// =========================================================
// NAVEGAÇÃO PRINCIPAL
// =========================================================
export async function navigateTo(pId, extraData = null) {
  const allowedPages = ['home', 'publications', 'database', 'team', 'pubdetail', 'dbdetail'];
  if (!allowedPages.includes(pId)) pId = 'home';

  const contentArea = document.getElementById('content-area');

  try {
    // Busca o HTML da página
    const response = await fetch(`./pages/${pId}.html`);
    if (!response.ok) throw new Error('Falha ao carregar página.');

    const html = await response.text();
    contentArea.innerHTML = html;

    // --- ATUALIZAÇÃO VISUAL ---
    // Atualiza os links do menu para ficarem verdes (ativos)
    // Se for página de detalhe (pubdetail), mantemos o destaque em 'publications' se desejar,
    // ou removemos todos. Aqui estou mapeando detalhes para suas categorias pais.
    let parentCategory = pId;
    if (pId === 'pubdetail') parentCategory = 'publications';
    if (pId === 'dbdetail') parentCategory = 'database';

    updateActiveLinks(parentCategory);

    // --- INICIALIZAÇÃO DE SCRIPTS ESPECÍFICOS ---
    switch (pId) {
      case 'home':
        await initHomeTeam();
        await loadHomeComponents();
        break;
      case 'database':
        renderDatabases();
        break;
      case 'dbdetail':
        renderDbDetail(extraData);
        break;
      case 'publications':
        renderPublications();
        break;
      case 'team':
        renderFullTeamPage();
        break;
      case 'pubdetail':
        renderPubDetail(extraData);
        break;
    }

    // Reseta o scroll para o topo
    window.scrollTo(0, 0);

    // Fecha o menu mobile se estiver aberto (verificando a classe)
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      toggleMenu();
    }

    // Reinicia animações AOS se existirem
    if (window.AOS) {
      setTimeout(() => {
        window.AOS.refreshHard();
      }, 100);
    }

  } catch (error) {
    console.error("Erro na navegação:", error);
    contentArea.innerHTML = `<div class="p-20 text-center">Erro ao carregar conteúdo.</div>`;
  }
}

// Carrega componentes dinâmicos da Home (Diamantes, Mapa, etc)
async function loadHomeComponents() {
  const components = [
    { id: 'diamonds-injection-point', file: 'components/diamonds.html' },
    { id: 'location-injection-point', file: 'components/location.html' }
  ];

  await Promise.all(components.map(async (comp) => {
    const target = document.getElementById(comp.id);
    if (target) {
      try {
        const resp = await fetch(comp.file);
        if (resp.ok) target.innerHTML = await resp.text();
      } catch (e) {
        console.error(`Erro ao carregar componente: ${comp.file}`);
      }
    }
  }));
}