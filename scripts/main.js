/**
 * POAM - Políticas Ambientais na Amazônia
 * Arquivo Principal de Lógica (main.js)
 * Desenvolvido para gestão de navegação, componentes dinâmicos e carrosséis.
 */

// --- DADOS DO CORPO CIENTÍFICO ---
const teamData = [
  { i: 'MD', n: 'Dra. Maria Dolores', r: 'Coordenadora', d: 'Doutora em Ciência Política. Especialista em gestão pública amazônica.' },
  { i: 'ED', n: 'Dra. Eugênia Rosa Cabral', r: 'Coordenadora Adjunta', d: 'Doutora e pesquisadora em Políticas de Sustentabilidade.' },
  { i: 'DN', n: 'Dâina Naíny Cunha', r: 'Pesquisadora Principal', d: 'Ciências Sociais e análise de políticas públicas.' },
  { i: 'RB', n: 'Ricardo Bezerra', r: 'Pesquisador', d: 'Ecologia e legislação ambiental amazônica.' },
  { i: 'AS', n: 'Aline Silva', r: 'Pesquisadora', d: 'Direito Ambiental e governança de terras.' },
  { i: 'JM', n: 'João Mendes', r: 'Pesquisador', d: 'Geoprocessamento e mineração de dados políticos.' },
  { i: 'LC', n: 'Lucas Costa', r: 'Pesquisador', d: 'Análise de dados territoriais.' }
];

// --- DADOS DE PUBLICAÇÕES CIENTÍFICAS ---
const pubData = [
  { id: 0, t: "Governança Ambiental na Amazônia", orientadorId: "MD", pesquisadoresIds: ["DN", "RB"], d: "15 Out 2023", c: "Análise sobre as novas políticas de conservação.", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000" },
  { id: 1, t: "Dinâmicas Territoriais e Conflitos", orientadorId: "RB", pesquisadoresIds: ["AS", "JM"], d: "20 Ago 2023", c: "Estudo focado no sudeste paraense.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000" },
  { id: 2, t: "Sustentabilidade em Áreas Urbanas", orientadorId: "ED", pesquisadoresIds: ["LC", "DN"], d: "12 Mai 2023", c: "Políticas públicas para cidades resilientes.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" },
  { id: 3, t: "Uso do Solo e Fronteira Agrícola", orientadorId: "MD", pesquisadoresIds: ["RB"], d: "05 Abr 2023", c: "Impactos do agronegócio na floresta primária.", image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2000" },
  { id: 4, t: "Hidrografia e Ribeirinhos", orientadorId: "ED", pesquisadoresIds: ["AS"], d: "18 Mar 2023", c: "A gestão das águas e comunidades tradicionais.", image: "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=2000" },
  { id: 5, t: "Bioeconomia Amazônica", orientadorId: "MD", pesquisadoresIds: ["JM"], d: "10 Fev 2023", c: "Cadeias produtivas sustentáveis e inovação.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" },
  { id: 6, t: "Mineração em Terras Indígenas", orientadorId: "ED", pesquisadoresIds: ["DN", "LC"], d: "25 Jan 2023", c: "Conflitos e impactos ambientais.", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000" },
  { id: 7, t: "Climatologia Regional", orientadorId: "MD", pesquisadoresIds: ["RB"], d: "12 Dez 2022", c: "Mudanças microclimáticas em zonas desmatadas.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000" },
  { id: 8, t: "Legislação Ambiental e Gestão", orientadorId: "ED", pesquisadoresIds: ["AS", "JM"], d: "30 Nov 2022", c: "O papel dos municípios na fiscalização.", image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2000" },
  { id: 9, t: "Fauna Silvestre e Tráfico", orientadorId: "MD", pesquisadoresIds: ["LC"], d: "15 Out 2022", c: "Estratégias de combate ao comércio ilegal.", image: "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=2000" },
  { id: 10, t: "Ecologia de Paisagem", orientadorId: "ED", pesquisadoresIds: ["DN"], d: "05 Set 2022", c: "Conectividade de fragmentos florestais.", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000" },
  { id: 11, t: "Políticas de Reflorestamento", orientadorId: "MD", pesquisadoresIds: ["RB", "JM"], d: "22 Ago 2022", c: "Análise de projetos de recuperação de áreas degradas.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000" },
  { id: 12, t: "Sociologia Rural Amazônica", orientadorId: "ED", pesquisadoresIds: ["AS"], d: "10 Jul 2022", c: "Identidade e resistência no campo.", image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2000" },
  { id: 13, t: "Sistemas Agroflorestais", orientadorId: "MD", pesquisadoresIds: ["LC", "DN"], d: "02 Jun 2022", c: "Produtividade e conservação integradas.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" },
  { id: 14, t: "Geoprocessamento Aplicado", orientadorId: "ED", pesquisadoresIds: ["JM"], d: "20 Mai 2022", c: "Novas tecnologias no mapeamento da Amazônia.", image: "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=2000" },
  { id: 15, t: "Educação Ambiental Escolar", orientadorId: "MD", pesquisadoresIds: ["AS", "LC"], d: "10 Abr 2022", c: "Conscientização nas escolas da rede pública.", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000" },
  { id: 16, t: "Turismo Sustentável", orientadorId: "ED", pesquisadoresIds: ["RB"], d: "15 Mar 2022", c: "Potencial econômico da floresta em pé.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000" },
  { id: 17, t: "Saúde Única e Amazônia", orientadorId: "MD", pesquisadoresIds: ["DN"], d: "28 Fev 2022", c: "A relação entre desmatamento e zoonoses.", image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2000" }
];

// --- VARIÁVEIS DE ESTADO GLOBAL ---
let htCurrentIndex = 0;
let lastWindowWidth = window.innerWidth;
let currentPubB = 0;
let currentPubPage = 1;
const pubsPerPage = 5;

// --- 1. SISTEMA DE NAVEGAÇÃO SPA ---

async function loadMenu() {
  const menuAside = document.getElementById('mobile-menu');
  try {
    const response = await fetch('pages/menu.html');
    if (response.ok) menuAside.innerHTML = await response.text();
  } catch (e) { console.error("Erro menu lateral:", e); }
}

async function navigateTo(pId, extraData = null) {
  const contentArea = document.getElementById('content-area');
  const globalFooter = document.getElementById('global-footer');

  try {
    const response = await fetch(`pages/${pId}.html`);
    if (!response.ok) throw new Error('Falha ao carregar a página.');

    contentArea.innerHTML = await response.text();
    if (globalFooter) globalFooter.style.display = (pId === 'home') ? 'none' : 'block';

    switch (pId) {
      case 'home': await loadHomeTeamSection(); break;
      case 'publications': renderPublications(); break;
      case 'team': renderFullTeamPage(); break;
      case 'pubdetail': renderPubDetail(extraData); break;
    }

    window.scrollTo(0, 0);
    const menu = document.getElementById('mobile-menu');
    if (menu && menu.classList.contains('open')) toggleMenu();
  } catch (error) { console.error("Erro de navegação:", error); }
}

// --- 2. COMPONENTE CORPO CIENTÍFICO (CARDS) ---

async function loadHomeTeamSection() {
  const injectionPoint = document.getElementById('home-team-injection-point');
  if (!injectionPoint) return;
  try {
    const resp = await fetch('pages/home-team.html');
    if (resp.ok) {
      injectionPoint.innerHTML = await resp.text();
      initHomeCarousel();
    }
  } catch (e) { console.error("Erro Home-Team:", e); }
}

function createHtCard(m) {
  return `
    <div class="ht-card" onclick="htToggleCard(event, this)">
        <div class="ht-card-header">
            <div class="ht-info">
                <div class="ht-photo">${m.i}</div>
                <div>
                    <h4 class="ht-name">${m.n}</h4>
                    <p class="ht-role">${m.r}</p>
                </div>
            </div>
            <span class="ht-toggle">+</span>
        </div>
        <div class="ht-details">
            <p class="ht-desc-text">${m.d}</p>
            <a href="http://lattes.cnpq.br/" target="_blank" class="ht-lattes-link">Currículo Lattes</a>
        </div>
    </div>`;
}

function renderFullTeamPage() {
  const container = document.getElementById('full-team');
  if (container) container.innerHTML = teamData.map(m => createHtCard(m)).join('');
}

function initHomeCarousel() {
  const coordTarget = document.getElementById('home-coord-target');
  const track = document.getElementById('home-research-track');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !coordTarget) return;

  coordTarget.innerHTML = teamData.slice(0, 2).map(createHtCard).join('');
  const researchers = teamData.slice(2);
  const itemsPerSlide = getHtItemsPerSlide();
  const groups = [];
  for (let i = 0; i < researchers.length; i += itemsPerSlide) {
    groups.push(researchers.slice(i, i + itemsPerSlide));
  }
  track.innerHTML = groups.map(g => `<div class="ht-slide">${g.map(createHtCard).join('')}</div>`).join('');
  if (dotsContainer) {
    dotsContainer.innerHTML = groups.map((_, idx) => `<div class="ht-dot ${idx === 0 ? 'active' : ''}" onclick="moveResearchTo(${idx})"></div>`).join('');
  }
  htCurrentIndex = 0;
  track.style.transform = `translateX(0)`;
  updateNavButtons();
}

// --- 3. COMPONENTE DE PUBLICAÇÕES (BANNER & PAGINAÇÃO) ---

function renderPublications() {
  const list = document.getElementById('pub-list');
  const track = document.getElementById('bannerTrack');
  if (!list || !track) return;

  const latestPubs = pubData.slice(0, 5);
  track.innerHTML = latestPubs.map(p => `
    <div class="article-slide flex flex-col justify-end p-12 text-white w-full flex-shrink-0 cursor-pointer relative" 
         style="background: linear-gradient(to top, rgba(6,78,59,0.95), transparent), url('${p.image}') center/cover no-repeat;"
         onclick="navigateTo('pubdetail', ${p.id})">
        <div class="relative z-10">
            <span class="bg-green-500 text-white font-bold uppercase text-[10px] px-3 py-1 rounded-full mb-3 inline-block">Destaque</span>
            <h2 class="text-4xl font-black mb-2 leading-none uppercase italic">${p.t}</h2>
            <p class="opacity-90 line-clamp-2 max-w-2xl">${p.c}</p>
        </div>
    </div>`).join('');

  renderPubPage(1);
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
        <div class="p-6 bg-white border-l-4 border-green-600 shadow-sm hover:shadow-md transition-all cursor-pointer mb-4" onclick="navigateTo('pubdetail', ${p.id})">
            <h4 class="text-xl font-bold text-green-900">${p.t}</h4>
            <p class="text-sm text-gray-500 mb-2">${p.d}</p>
            <p class="text-gray-600 line-clamp-2">${p.c}</p>
        </div>`).join('');

  container.innerHTML = `
        <div class="flex items-center justify-center gap-4 mt-10">
            <button onclick="renderPubPage(${currentPubPage - 1})" class="pub-page-btn" ${currentPubPage === 1 ? 'disabled' : ''}>← Anterior</button>
            <span class="font-bold text-green-900 uppercase text-[10px] tracking-widest">Página ${currentPubPage} de ${totalPages}</span>
            <button onclick="renderPubPage(${currentPubPage + 1})" class="pub-page-btn" ${currentPubPage === totalPages ? 'disabled' : ''}>Próxima →</button>
        </div>`;
}

function moveB(dir) {
  const track = document.getElementById('bannerTrack');
  if (!track) return;
  currentPubB = (currentPubB + dir + 5) % 5;
  track.style.transform = `translateX(-${currentPubB * 100}%)`;
}

function renderPubDetail(id) {
  const container = document.getElementById('detail-content');
  const pub = pubData.find(p => p.id === parseInt(id));
  if (!container || !pub) return;

  const orientador = teamData.find(t => t.i === pub.orientadorId);
  const orientadorNome = (orientador && orientador.r.toLowerCase().includes('coordenador')) ? orientador.n : "Coordenação Geral POAM";
  const pesquisadores = (pub.pesquisadoresIds || []).map(pid => teamData.find(t => t.i === pid)).filter(Boolean);

  container.innerHTML = `
      <div class="pub-banner-hero shadow-2xl" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${pub.image}');">
          <div class="pub-hero-inner">
              <span class="pub-type-tag">Destaque Científico</span>
              <h1 class="pub-hero-title">${pub.t}</h1>
              <p class="text-green-300 font-bold tracking-widest uppercase text-sm">${pub.d}</p>
          </div>
      </div>

      <div class="pub-content-layout">
          <aside class="pub-sidebar">
              <div class="pub-sidebar-block">
                  <h4 class="pub-sidebar-label">Orientação</h4>
                  <p class="pub-sidebar-name">${orientadorNome}</p>
              </div>
              <div class="pub-sidebar-block">
                  <h4 class="pub-sidebar-label">Pesquisadores</h4>
                  <ul class="pub-sidebar-list">
                      ${pesquisadores.map(p => `<li>${p.n}</li>`).join('')}
                  </ul>
              </div>
          </aside>

          <div class="pub-main-column">
              <div class="pub-lead-text">${pub.c}</div>
              <div class="pub-full-text">
                  <h2 class="text-3xl font-black text-green-900 mb-6 uppercase">Análise de Resultados</h2>
                  <p class="mb-6">${pub.textoCompleto || "Conteúdo técnico em fase de revisão final pelo Laboratório POAM."}</p>
              </div>
              <div class="pub-footer-action">
                  <a href="${pub.link}" target="_blank" class="pub-btn-green">Acessar PDF Completo</a>
              </div>
          </div>
      </div>`;
}

// --- 4. CONTROLES DE INTERAÇÃO E UI ---

function htToggleCard(event, el) {
  event.stopPropagation();
  const isActive = el.classList.contains('active');
  document.querySelectorAll('.ht-card.active').forEach(card => {
    if (card !== el) {
      card.classList.remove('active');
      card.querySelector('.ht-toggle').innerText = '+';
    }
  });
  if (!isActive) {
    el.classList.add('active');
    el.querySelector('.ht-toggle').innerText = '-';
  } else {
    el.classList.remove('active');
    el.querySelector('.ht-toggle').innerText = '+';
  }
}

function moveResearchTo(idx) {
  htCurrentIndex = idx;
  const track = document.getElementById('home-research-track');
  const dots = document.querySelectorAll('.ht-dot');
  if (track) track.style.transform = `translateX(-${htCurrentIndex * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === htCurrentIndex));
}

function getHtItemsPerSlide() {
  const w = window.innerWidth;
  if (w < 768) return 1;
  if (w < 1150) return 2;
  return 3;
}

function updateNavButtons() {
  const prev = document.querySelector('.ht-prev');
  const next = document.querySelector('.ht-next');
  if (prev && next) {
    prev.style.display = (window.innerWidth < 768) ? 'none' : 'flex';
    next.style.display = (window.innerWidth < 768) ? 'none' : 'flex';
  }
}

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('menu-overlay');
  if (menu) menu.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

// --- 5. INICIALIZADORES E LISTENERS ---

window.addEventListener('resize', () => {
  if (document.getElementById('home-research-track')) initHomeCarousel();
});

document.addEventListener('DOMContentLoaded', () => {
  loadMenu();
  navigateTo('home');
});