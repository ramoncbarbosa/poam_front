import { teamData } from '../database/users.js';
import { pubData } from '../database/publications.js';
import { initHomeTeam } from './home-team.js';

// --- CONFIGURAÇÕES E ESTADO GLOBAL ---
let currentPubB = 0;
let currentPubPage = 1;
const pubsPerPage = 5;
let bannerInterval; // Controle do autoplay do banner

// --- 1. SISTEMA DE NAVEGAÇÃO SPA ---
async function loadMenu() {
    const menuAside = document.getElementById('mobile-menu');
    if (!menuAside) return;
    try {
        const response = await fetch('pages/menu.html');
        if (response.ok) menuAside.innerHTML = await response.text();
    } catch (e) { console.error("Erro menu lateral:", e); }
}

async function navigateTo(pId, extraData = null) {
    const allowedPages = ['home', 'publications', 'database', 'team', 'pubdetail'];
    if (!allowedPages.includes(pId)) pId = 'home';

    const contentArea = document.getElementById('content-area');
    const globalFooter = document.getElementById('global-footer');

    // Limpa o timer do banner ao sair da página de publicações
    if (pId !== 'publications' && bannerInterval) {
        clearInterval(bannerInterval);
    }

    try {
        const response = await fetch(`pages/${pId}.html`);
        if (!response.ok) throw new Error('Falha ao carregar página.');

        contentArea.innerHTML = await response.text();
        if (globalFooter) globalFooter.style.display = (pId === 'home') ? 'none' : 'block';

        switch (pId) {
            case 'home': 
                await initHomeTeam(); 
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

        window.scrollTo(0, 0);
        closeMobileMenu();
    } catch (error) { console.error("Erro na navegação:", error); }
}

// --- 2. PÁGINA DE EQUIPE COMPLETA ---
// Mantido aqui pois usa a lógica de listagem simples sem carrossel
function renderFullTeamPage() {
    const container = document.getElementById('full-team');
    if (!container) return;
    
    // Usa a função de criação de card que deve estar disponível globalmente ou importada
    // Se você moveu a createHtCard para o home-team.js, lembre-se de exportá-la e importá-la aqui
    container.innerHTML = teamData.map(m => {
        const fotoContent = m.foto 
            ? `<img src="${m.foto}" alt="${m.nome}" class="w-full h-full object-cover rounded-full">`
            : `<div class="w-full h-full rounded-full bg-green-800 flex items-center justify-center text-white font-bold">${m.nome.charAt(0)}</div>`;

        return `
        <div class="ht-card bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onclick="htToggleCard(event, this)">
            <div class="ht-card-header flex items-center justify-between">
                <div class="ht-info flex items-center gap-5">
                    <div class="ht-photo w-16 h-16 rounded-full overflow-hidden border-2 border-green-50">${fotoContent}</div>
                    <div>
                        <h4 class="ht-name font-black text-gray-900 text-lg leading-tight">${m.nome}</h4>
                        <p class="ht-role font-bold text-green-700 text-[10px] uppercase tracking-widest mt-1">${m.cargo}</p>
                    </div>
                </div>
                <span class="ht-toggle text-3xl font-light text-green-200 group-hover:text-green-800 transition-colors">+</span>
            </div>
            <div class="ht-details max-height-0 overflow-hidden opacity-0 transition-all duration-500">
                <div class="mt-6">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Titulação</p>
                    <p class="text-gray-700 font-bold text-sm mb-3">${m.titulo}</p>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Área de Atuação</p>
                    <p class="text-gray-500 leading-relaxed text-sm">${m.areaPesquisa}</p>
                </div>
                <a href="http://lattes.cnpq.br/" target="_blank" class="ht-lattes-link inline-block mt-4 font-black text-[10px] text-green-800 uppercase tracking-tighter hover:underline">Currículo Lattes</a>
            </div>
        </div>`;
    }).join('');
}

// --- 3. COMPONENTE DE PUBLICAÇÕES ---
function renderPublications() {
    const track = document.getElementById('bannerTrack');
    if (!track) return;

    if (bannerInterval) clearInterval(bannerInterval);

    const latestPubs = pubData.slice(0, 5);
    track.innerHTML = latestPubs.map(p => `
    <div class="article-slide flex flex-col justify-end p-12 text-white w-full flex-shrink-0 cursor-pointer relative min-h-[350px]" 
         style="background: linear-gradient(to top, rgba(6,78,59,0.95), transparent), url('${p.imagem}') center/cover no-repeat;"
         onclick="navigateTo('pubdetail', ${p.id})">
        <div class="relative z-10">
            <span class="bg-green-500 text-white font-bold uppercase text-[10px] px-3 py-1 rounded-full mb-3 inline-block">Destaque</span>
            <h2 class="text-4xl font-black mb-2 leading-none uppercase italic">${p.titulo}</h2>
            <p class="opacity-90 line-clamp-2 max-w-2xl text-sm">${p.resumo}</p>
        </div>
    </div>`).join('');

    renderPubPage(1);

    bannerInterval = setInterval(() => { window.moveB(1); }, 5000);
}

function renderPubPage(page) {
    const list = document.getElementById('pub-list');
    const container = document.getElementById('pub-pagination');
    if (!list || !container) return;

    currentPubPage = page;
    const start = (page - 1) * pubsPerPage;
    const paginatedItems = pubData.slice(start, start + pubsPerPage);
    const totalPages = Math.ceil(pubData.length / pubsPerPage);

    list.innerHTML = paginatedItems.map(p => `
        <div class="p-8 bg-white border-l-[6px] border-green-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group mb-4" onclick="navigateTo('pubdetail', ${p.id})">
            <h4 class="text-xl font-black text-gray-900 group-hover:text-green-800 transition-colors">${p.titulo}</h4>
            <p class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-2 mb-4">${p.data}</p>
            <p class="text-gray-500 text-sm line-clamp-2">${p.resumo}</p>
        </div>`).join('');

    container.innerHTML = `
        <div class="flex items-center justify-center gap-6 mt-12">
            <button onclick="renderPubPage(${currentPubPage - 1})" class="pub-page-btn" ${currentPubPage === 1 ? 'disabled' : ''}>← Anterior</button>
            <span class="font-black text-green-900 text-[10px]">Página ${currentPubPage} de ${totalPages}</span>
            <button onclick="renderPubPage(${currentPubPage + 1})" class="pub-page-btn" ${currentPubPage === totalPages ? 'disabled' : ''}>Próxima →</button>
        </div>`;
}

// --- 4. DETALHES DA PUBLICAÇÃO ---
function renderPubDetail(id) {
    const container = document.getElementById('detail-content');
    const pub = pubData.find(p => p.id === parseInt(id));

    if (!container || !pub) return;

    const orientadorObj = teamData.find(t => t.nome === pub.orientador);
    const pesquisadoresNomes = (pub.pesquisadores || []).map(nome => {
        const p = teamData.find(t => t.nome === nome);
        return p ? p.nome : nome;
    });

    container.innerHTML = `
      <div class="pub-banner-hero shadow-2xl" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${pub.imagem}');">
          <div class="pub-hero-inner">
              <span class="pub-type-tag">Destaque Científico</span>
              <h1 class="pub-hero-title">${pub.titulo}</h1>
              <p class="text-green-300 font-bold tracking-widest uppercase text-sm">${pub.data}</p>
          </div>
      </div>
      <div class="pub-content-layout">
          <aside class="pub-sidebar">
              <div class="pub-sidebar-block">
                  <h4 class="pub-sidebar-label">Orientação</h4>
                  <p class="pub-sidebar-name">${orientadorObj ? orientadorObj.nome : pub.orientador}</p>
              </div>
              <div class="pub-sidebar-block">
                  <h4 class="pub-sidebar-label">Pesquisadores</h4>
                  <ul class="pub-sidebar-list">
                      ${pesquisadoresNomes.map(nome => `<li>${nome}</li>`).join('')}
                  </ul>
              </div>
          </aside>
          <div class="pub-main-column">
              <div class="pub-lead-text">${pub.resumo}</div>
              <div class="pub-full-text">
                  <h2 class="text-3xl font-black text-green-900 mb-6 uppercase">Análise de Resultados</h2>
                  <p class="mb-6">${pub.textoCompleto || "Conteúdo em fase de revisão final."}</p>
              </div>
              <div class="pub-footer-action">
                  <a href="${pub.link}" target="_blank" class="pub-btn-green">Acessar PDF Completo</a>
              </div>
          </div>
      </div>`;
}

// --- 5. EXPOSIÇÃO GLOBAL E UTILITÁRIOS ---
window.navigateTo = navigateTo;
window.renderPubPage = renderPubPage;

window.moveB = (dir, event = null) => {
    if (event) event.stopPropagation();
    const track = document.getElementById('bannerTrack');
    if (!track) return;
    if (bannerInterval) {
        clearInterval(bannerInterval);
        bannerInterval = setInterval(() => window.moveB(1), 5000);
    }
    currentPubB = (currentPubB + dir + 5) % 5;
    track.style.transform = `translateX(-${currentPubB * 100}%)`;
};

window.toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    if (!menu || !overlay) return;
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
        menu.classList.remove('open');
        menu.style.transform = 'translateX(100%)';
        overlay.style.display = 'none';
        overlay.classList.remove('active');
    } else {
        menu.classList.add('open');
        menu.style.transform = 'translateX(0)';
        overlay.style.display = 'block';
        overlay.classList.add('active');
    }
};

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    if (menu) {
        menu.classList.remove('open');
        menu.style.transform = 'translateX(100%)';
    }
    if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    navigateTo('home');
});