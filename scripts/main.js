/**
 * POAM - Políticas Ambientais na Amazônia
 * Arquivo Principal de Lógica (main.js)
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
  { id: 0, t: "Governança Ambiental na Amazônia", orientadorId: "MD", pesquisadoresIds: ["DN", "RB"], d: "15 Out 2023", c: "Análise sobre as novas políticas de conservação.", textoCompleto: "Este estudo detalha as métricas de governança aplicadas no período de 2020-2023, demonstrando como a participação local reduz o desmatamento.", link: "http://lattes.cnpq.br/", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000" },
  { id: 1, t: "Dinâmicas Territoriais e Conflitos", orientadorId: "RB", pesquisadoresIds: ["AS", "JM"], d: "20 Ago 2023", c: "Estudo focado no sudeste paraense.", textoCompleto: "A pesquisa mapeia os conflitos fundiários através de dados geoprocessados.", link: "http://lattes.cnpq.br/", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000" },
  { id: 2, t: "Sustentabilidade em Áreas Urbanas", orientadorId: "ED", pesquisadoresIds: ["LC", "DN"], d: "12 Mai 2023", c: "Políticas públicas para cidades resilientes.", textoCompleto: "O artigo foca na urbanização de Belém e Manaus, sugerindo modelos de drenagem sustentável.", link: "http://lattes.cnpq.br/", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" },
  { id: 3, t: "Uso do Solo e Fronteira Agrícola", orientadorId: "MD", pesquisadoresIds: ["RB"], d: "05 Abr 2023", c: "Impactos do agronegócio na floresta primária.", textoCompleto: "Análise multitemporal do uso da terra no arco do desmatamento.", link: "#", image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2000" },
  { id: 4, t: "Hidrografia e Ribeirinhos", orientadorId: "ED", pesquisadoresIds: ["AS"], d: "18 Mar 2023", c: "A gestão das águas e comunidades tradicionais.", textoCompleto: "Estudo sobre o impacto das hidrelétricas nas comunidades locais.", link: "#", image: "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=2000" },
  { id: 5, t: "Bioeconomia Amazônica", orientadorId: "MD", pesquisadoresIds: ["JM"], d: "10 Fev 2023", c: "Cadeias produtivas sustentáveis e inovação.", textoCompleto: "Novas abordagens econômicas para a conservação florestal.", link: "#", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" },
  { id: 6, t: "Mineração em Terras Indígenas", orientadorId: "ED", pesquisadoresIds: ["DN", "LC"], d: "25 Jan 2023", c: "Conflitos e impactos ambientais.", textoCompleto: "Mapeamento das pressões externas sobre territórios protegidos.", link: "#", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000" },
  { id: 7, t: "Climatologia Regional", orientadorId: "MD", pesquisadoresIds: ["RB"], d: "12 Dez 2022", c: "Mudanças microclimáticas em zonas desmatadas.", textoCompleto: "Estudo térmico de superfícies em áreas de transição florestal.", link: "#", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000" },
  { id: 8, t: "Legislação Ambiental e Gestão", orientadorId: "ED", pesquisadoresIds: ["AS", "JM"], d: "30 Nov 2022", c: "O papel dos municípios na fiscalização.", textoCompleto: "Desafios da descentralização da gestão ambiental no Pará.", link: "#", image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2000" },
  { id: 9, t: "Fauna Silvestre e Tráfico", orientadorId: "MD", pesquisadoresIds: ["LC"], d: "15 Out 2022", c: "Estratégias de combate ao comércio ilegal.", textoCompleto: "Levantamento de rotas e impactos na biodiversidade amazônica.", link: "#", image: "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=2000" }
];

let htCurrentIndex = 0;
let lastWindowWidth = window.innerWidth;
let currentPubB = 0;
let currentPubPage = 1;
const pubsPerPage = 5;

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
  // SEGURANÇA: Restringe acesso a páginas não autorizadas
  const allowedPages = ['home', 'publications', 'team', 'pubdetail'];
  if (!allowedPages.includes(pId)) pId = 'home';

  const contentArea = document.getElementById('content-area');
  const globalFooter = document.getElementById('global-footer');

  try {
    const response = await fetch(`pages/${pId}.html`);
    if (!response.ok) throw new Error('Falha ao carregar página.');

    contentArea.innerHTML = await response.text();
    if (globalFooter) globalFooter.style.display = (pId === 'home') ? 'none' : 'block';

    switch (pId) {
      case 'home': await loadHomeTeamSection(); break;
      case 'publications': renderPublications(); break;
      case 'team': renderFullTeamPage(); break;
      case 'pubdetail': if (typeof renderPubDetail === 'function') renderPubDetail(extraData); break;
    }

    window.scrollTo(0, 0);
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      menu.style.transform = 'translateX(100%)';
      if (overlay) overlay.style.display = 'none';
    }
  } catch (error) { console.error(error); }
}

// --- 2. COMPONENTE CORPO CIENTÍFICO ---
async function loadHomeTeamSection() {
  const injectionPoint = document.getElementById('home-team-injection-point');
  if (!injectionPoint) return;
  try {
    const resp = await fetch('pages/home-team.html');
    if (resp.ok) {
      injectionPoint.innerHTML = await resp.text();
      initHomeCarousel();
    }
  } catch (e) { console.error(e); }
}

function createHtCard(m) {
  return `
    <div class="ht-card bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onclick="htToggleCard(event, this)">
        <div class="ht-card-header flex items-center justify-between">
            <div class="ht-info flex items-center gap-5">
                <div class="ht-photo w-16 h-16 rounded-full bg-green-100 flex items-center justify-center font-black text-green-800 text-xl group-hover:bg-green-800 group-hover:text-white transition-colors">${m.i}</div>
                <div>
                    <h4 class="ht-name font-black text-gray-900 text-lg leading-tight">${m.n}</h4>
                    <p class="ht-role font-bold text-green-700 text-[10px] uppercase tracking-widest mt-1">${m.r}</p>
                </div>
            </div>
            <span class="ht-toggle text-3xl font-light text-green-200 group-hover:text-green-800 transition-colors">+</span>
        </div>
        <div class="ht-details max-height-0 overflow-hidden opacity-0 transition-all duration-500">
            <p class="ht-desc-text mt-6 text-gray-500 leading-relaxed text-sm">${m.d}</p>
            <a href="http://lattes.cnpq.br/" target="_blank" class="ht-lattes-link inline-block mt-4 font-black text-[10px] text-green-800 uppercase tracking-tighter hover:underline">Currículo Lattes</a>
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
  track.innerHTML = groups.map(g => `<div class="ht-slide flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">${g.map(createHtCard).join('')}</div>`).join('');
  if (dotsContainer) {
    dotsContainer.innerHTML = groups.map((_, idx) => `<div class="ht-dot w-2 h-2 rounded-full bg-gray-200 cursor-pointer transition-all ${idx === htCurrentIndex ? 'active !bg-green-800 scale-125' : ''}" onclick="moveResearchTo(${idx})"></div>`).join('');
  }
}

// --- 3. COMPONENTE DE PUBLICAÇÕES ---
function renderPublications() {
  const list = document.getElementById('pub-list');
  const track = document.getElementById('bannerTrack');
  if (!list || !track) return;

  const latestPubs = pubData.slice(0, 5);
  track.innerHTML = latestPubs.map(p => `
    <div class="article-slide flex flex-col justify-end p-12 text-white w-full flex-shrink-0 cursor-pointer relative min-h-[350px]" 
         style="background: linear-gradient(to top, rgba(6,78,59,0.95), transparent), url('${p.image}') center/cover no-repeat;"
         onclick="navigateTo('pubdetail', ${p.id})">
        <div class="relative z-10">
            <span class="bg-green-500 text-white font-bold uppercase text-[10px] px-3 py-1 rounded-full mb-3 inline-block">Destaque</span>
            <h2 class="text-4xl font-black mb-2 leading-none uppercase italic">${p.t}</h2>
            <p class="opacity-90 line-clamp-2 max-w-2xl text-sm">${p.c}</p>
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
        <div class="p-8 bg-white border-l-[6px] border-green-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group mb-4" onclick="navigateTo('pubdetail', ${p.id})">
            <h4 class="text-xl font-black text-gray-900 group-hover:text-green-800 transition-colors">${p.t}</h4>
            <p class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-2 mb-4">${p.d}</p>
            <p class="text-gray-500 text-sm line-clamp-2">${p.c}</p>
        </div>`).join('');

  container.innerHTML = `
        <div class="flex items-center justify-center gap-6 mt-12">
            <button onclick="renderPubPage(${currentPubPage - 1})" class="px-6 py-2 rounded-full font-black text-[10px] uppercase border hover:bg-green-800 hover:text-white transition-all disabled:opacity-20" ${currentPubPage === 1 ? 'disabled' : ''}>← Anterior</button>
            <span class="font-black text-green-900 text-[10px]">Página ${currentPubPage} de ${totalPages}</span>
            <button onclick="renderPubPage(${currentPubPage + 1})" class="px-6 py-2 rounded-full font-black text-[10px] uppercase border hover:bg-green-800 hover:text-white transition-all disabled:opacity-20" ${currentPubPage === totalPages ? 'disabled' : ''}>Próxima →</button>
        </div>`;
}

function moveB(dir) {
  const track = document.getElementById('bannerTrack');
  if (!track) return;
  currentPubB = (currentPubB + dir + 5) % 5;
  track.style.transform = `translateX(-${currentPubB * 100}%)`;
}

// --- 4. CONTROLES E BUG FIXES ---
function htToggleCard(event, el) {
  event.stopPropagation();
  const isActive = el.classList.contains('active');
  const details = el.querySelector('.ht-details');
  const icon = el.querySelector('.ht-toggle');

  document.querySelectorAll('.ht-card.active').forEach(card => {
    if (card !== el) {
      card.classList.remove('active');
      card.querySelector('.ht-details').style.maxHeight = '0';
      card.querySelector('.ht-details').style.opacity = '0';
      card.querySelector('.ht-toggle').innerText = '+';
    }
  });

  if (!isActive) {
    el.classList.add('active');
    details.style.maxHeight = '300px';
    details.style.opacity = '1';
    icon.innerText = '-';
  } else {
    el.classList.remove('active');
    details.style.maxHeight = '0';
    details.style.opacity = '0';
    icon.innerText = '+';
  }
}

function moveResearchTo(idx) {
  htCurrentIndex = idx;
  const track = document.getElementById('home-research-track');
  if (track) track.style.transform = `translateX(-${htCurrentIndex * 100}%)`;
  document.querySelectorAll('.ht-dot').forEach((dot, i) => dot.style.backgroundColor = i === htCurrentIndex ? '#064e3b' : '#e5e7eb');
}

function getHtItemsPerSlide() {
  const w = window.innerWidth;
  if (w < 768) return 1;
  if (w < 1150) return 2;
  return 3;
}

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('menu-overlay');
  if (!menu || !overlay) return;
  const isOpen = menu.classList.contains('open');
  if (isOpen) {
    menu.classList.remove('open');
    menu.style.transform = 'translateX(100%)';
    overlay.style.display = 'none';
  } else {
    menu.classList.add('open');
    menu.style.transform = 'translateX(0)';
    overlay.style.display = 'block';
  }
}

// BUG FIX: SCROLL SNAP VS FOOTER
window.addEventListener('scroll', () => {
  const container = document.querySelector('.snap-container');
  if (!container) return;
  const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 150;
  container.style.scrollSnapType = isAtBottom ? 'none' : 'y proximity';
});

window.addEventListener('resize', () => {
  if (document.getElementById('home-research-track')) initHomeCarousel();
});

document.addEventListener('DOMContentLoaded', () => {
  loadMenu();
  navigateTo('home');
});