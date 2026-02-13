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
  {
    id: 0,
    t: "Governança Ambiental na Amazônia",
    orientador: "Dra. Maria Dolores",
    pesquisadores: ["Dâina Naíny Cunha", "Ricardo Bezerra"],
    d: "15 de Outubro, 2023",
    c: "Análise sobre as novas políticas de conservação e o papel das instituições locais no monitoramento da biodiversidade.",
    textoCompleto: "Este estudo detalha as métricas de governança aplicadas no período de 2020-2023, demonstrando como a participação local reduz em 20% os índices de desmatamento ilegal em áreas protegidas.",
    link: "http://lattes.cnpq.br/"
  },
  {
    id: 1,
    t: "Dinâmicas Territoriais e Conflitos",
    orientador: "Ricardo Bezerra",
    pesquisadores: ["Aline Silva", "João Mendes"],
    d: "20 de Agosto, 2023",
    c: "Estudo focado no sudeste paraense e as transformações no uso do solo.",
    textoCompleto: "A pesquisa mapeia os conflitos fundiários através de dados geoprocessados, oferecendo uma nova perspectiva sobre a expansão da fronteira agrícola amazônica.",
    link: "http://lattes.cnpq.br/"
  },
  {
    id: 2,
    t: "Sustentabilidade em Áreas Urbanas",
    orientador: "Dra. Eugênia Rosa Cabral",
    pesquisadores: ["Lucas Costa", "Dâina Naíny Cunha"],
    d: "12 de Maio, 2023",
    c: "Políticas públicas para cidades resilientes no contexto amazônico.",
    textoCompleto: "O artigo foca na urbanização de Belém e Manaus, sugerindo modelos de drenagem sustentável baseados em soluções baseadas na natureza (SbN).",
    link: "http://lattes.cnpq.br/"
  }
];

// --- VARIÁVEIS DE ESTADO GLOBAL ---
let htCurrentIndex = 0;           // Índice atual do carrossel da Home
let lastWindowWidth = window.innerWidth;
let currentPubB = 0;              // Índice do banner de publicações

// --- 1. SISTEMA DE NAVEGAÇÃO SPA (SINGLE PAGE APPLICATION) ---

/**
 * Carrega o menu lateral mobile
 */
async function loadMenu() {
  const menuAside = document.getElementById('mobile-menu');
  try {
    const response = await fetch('pages/menu.html');
    if (response.ok) menuAside.innerHTML = await response.text();
  } catch (e) {
    console.error("Erro ao carregar o menu lateral:", e);
  }
}

/**
 * Gerencia a troca de páginas e inicializa as funções específicas de cada uma
 * @param {string} pId - ID da página (nome do arquivo .html em /pages)
 * @param {any} extraData - Dados adicionais (ex: ID da publicação para detalhes)
 */
async function navigateTo(pId, extraData = null) {
  const contentArea = document.getElementById('content-area');
  const globalFooter = document.getElementById('global-footer');

  try {
    const response = await fetch(`pages/${pId}.html`);
    if (!response.ok) throw new Error('Falha ao carregar a página solicitada.');

    contentArea.innerHTML = await response.text();

    // Footer global visível em todas as páginas exceto na Home (que tem footer próprio)
    if (globalFooter) {
      globalFooter.style.display = (pId === 'home') ? 'none' : 'block';
    }

    // Roteamento de Funções de Inicialização
    switch (pId) {
      case 'home':
        await loadHomeTeamSection();
        break;
      case 'publications':
        renderPublications();
        break;
      case 'team':
        renderFullTeamPage();
        break;
      case 'pubdetail':
        // Se houver extraData, renderiza o detalhe específico
        if (typeof renderPubDetail === 'function') {
          renderPubDetail(extraData);
        }
        break;
    }

    // Reset de scroll e interface
    window.scrollTo(0, 0);
    const menu = document.getElementById('mobile-menu');
    if (menu && menu.classList.contains('open')) toggleMenu();

  } catch (error) {
    console.error("Erro de navegação:", error);
  }
}

// --- 2. COMPONENTE CORPO CIENTÍFICO (HOME & TEAM) ---

/**
 * Busca e injeta a seção de equipe na Home
 */
async function loadHomeTeamSection() {
  const injectionPoint = document.getElementById('home-team-injection-point');
  if (!injectionPoint) return;
  try {
    const resp = await fetch('pages/home-team.html');
    if (resp.ok) {
      injectionPoint.innerHTML = await resp.text();
      initHomeCarousel();
    }
  } catch (e) {
    console.error("Erro ao carregar componente Home-Team:", e);
  }
}

/**
 * Gera o HTML padrão para os cards científicos (usado em múltiplos lugares)
 * @param {object} m - Objeto de dados do membro da equipe
 */
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

/**
 * Renderiza todos os membros na página de equipe completa
 */
function renderFullTeamPage() {
  const container = document.getElementById('full-team');
  if (!container) return;
  container.innerHTML = teamData.map(m => createHtCard(m)).join('');
}

/**
 * Inicializa a lógica do carrossel na Home (Coordenação + Pesquisadores)
 */
function initHomeCarousel() {
  const coordTarget = document.getElementById('home-coord-target');
  const track = document.getElementById('home-research-track');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track || !coordTarget) return;

  // 1. Renderiza os Coordenadores (fixos no topo da seção)
  coordTarget.innerHTML = teamData.slice(0, 2).map(createHtCard).join('');

  // 2. Organiza Pesquisadores em grupos conforme o tamanho da tela
  const researchers = teamData.slice(2);
  const itemsPerSlide = getHtItemsPerSlide();
  const groups = [];

  for (let i = 0; i < researchers.length; i += itemsPerSlide) {
    groups.push(researchers.slice(i, i + itemsPerSlide));
  }

  // 3. Injeta os slides no trilho (track)
  track.innerHTML = groups.map(g => `<div class="ht-slide">${g.map(createHtCard).join('')}</div>`).join('');

  // 4. Gera as bolinhas (dots) de navegação
  if (dotsContainer) {
    dotsContainer.innerHTML = groups.map((_, idx) =>
      `<div class="ht-dot ${idx === 0 ? 'active' : ''}" onclick="moveResearchTo(${idx})"></div>`
    ).join('');
  }

  htCurrentIndex = 0;
  track.style.transform = `translateX(0)`;
  updateNavButtons();
}

// --- 3. COMPONENTE DE PUBLICAÇÕES ---

/**
 * Renderiza a lista e o banner de publicações
 */
function renderPublications() {
  const list = document.getElementById('pub-list');
  const track = document.getElementById('bannerTrack');
  if (!list || !track) return;

  // Banner Superior (Slides)
  track.innerHTML = pubData.map(p => `
        <div class="article-slide p-12 flex flex-col justify-center text-white bg-green-900 w-full flex-shrink-0 cursor-pointer" onclick="navigateTo('pubdetail', ${p.id})">
            <span class="text-green-400 font-bold uppercase text-xs mb-2">Destaque</span>
            <h2 class="text-3xl font-black mb-4 leading-tight">${p.t}</h2>
            <p class="opacity-80">${p.c}</p>
        </div>
    `).join('');

  // Lista Inferior (Histórico)
  list.innerHTML = pubData.map(p => `
        <div class="p-6 bg-white border-l-4 border-green-600 shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="navigateTo('pubdetail', ${p.id})">
            <h4 class="text-xl font-bold text-green-900">${p.t}</h4>
            <p class="text-sm text-gray-500 mb-2">${p.a} • ${p.d}</p>
            <p class="text-gray-600">${p.c}</p>
        </div>
    `).join('');

  moveB(0); // Centraliza banner inicial
}

/**
 * Move o banner de publicações
 */
function moveB(dir) {
  const track = document.getElementById('bannerTrack');
  if (!track) return;
  currentPubB = (currentPubB + dir + pubData.length) % pubData.length;
  track.style.transform = `translateX(-${currentPubB * 100}%)`;
}

/**
 * Renderiza o detalhe de uma publicação específica com layout de artigo
 * @param {number} id - ID da publicação
 */
function renderPubDetail(id) {
  const container = document.getElementById('detail-content');
  const pub = pubData.find(p => p.id === parseInt(id));
  if (!container || !pub) return;

  container.innerHTML = `
      <div class="pub-hero-banner">
          <p class="pub-date-tag">${pub.d}</p>
          <h1 class="pub-hero-title">${pub.t}</h1>
          <div class="pub-divider"></div>
      </div>

      <div class="pub-team-grid">
          <div class="pub-team-block">
              <span class="pub-team-label">Orientação</span>
              <span class="pub-member-name">${pub.orientador}</span>
          </div>
          <div class="pub-team-block">
              <span class="pub-team-label">Pesquisadores</span>
              <span class="pub-member-name">${pub.pesquisadores.join(', ')}</span>
          </div>
      </div>

      <div class="pub-body-text">
          <p class="pub-abstract">${pub.c}</p>
          <div class="pub-main-content">
              <p>${pub.textoCompleto}</p>
              <p>O POAM reafirma seu compromisso com a sistematização de dados para o desenvolvimento sustentável e governança regional através desta linha de pesquisa.</p>
          </div>
          
          <a href="${pub.link}" target="_blank" class="pub-external-btn">
              Ler Publicação na Íntegra
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
          </a>
      </div>
  `;
}

// --- 4. CONTROLES DE INTERAÇÃO E UI ---

/**
 * Gerencia a expansão (toggle) dos cards científicos
 */
function htToggleCard(event, el) {
  event.stopPropagation();
  const isActive = el.classList.contains('active');

  // Fecha outros cards abertos
  document.querySelectorAll('.ht-card.active').forEach(card => {
    if (card !== el) {
      card.classList.remove('active');
      const icon = card.querySelector('.ht-toggle');
      if (icon) icon.innerText = '+';
    }
  });

  // Abre ou fecha o card atual
  if (!isActive) {
    el.classList.add('active');
    const icon = el.querySelector('.ht-toggle');
    if (icon) icon.innerText = '-';
  } else {
    el.classList.remove('active');
    const icon = el.querySelector('.ht-toggle');
    if (icon) icon.innerText = '+';
  }
}

/**
 * Move o carrossel para um índice específico
 */
function moveResearchTo(idx) {
  htCurrentIndex = idx;
  const track = document.getElementById('home-research-track');
  const dots = document.querySelectorAll('.ht-dot');
  if (track) track.style.transform = `translateX(-${htCurrentIndex * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === htCurrentIndex);
  });
  updateNavButtons();
}

/**
 * Move o carrossel para frente ou para trás
 */
function moveResearch(dir) {
  const slides = document.querySelectorAll('.ht-slide');
  if (slides.length === 0) return;

  let newIdx = htCurrentIndex + dir;
  if (newIdx < 0) newIdx = 0;
  if (newIdx >= slides.length) newIdx = slides.length - 1;

  moveResearchTo(newIdx);
}

/**
 * Atualiza o estado dos botões de navegação e visibilidade mobile
 */
function updateNavButtons() {
  const prev = document.querySelector('.ht-prev');
  const next = document.querySelector('.ht-next');
  const slides = document.querySelectorAll('.ht-slide');

  if (prev && next && slides.length > 0) {
    prev.disabled = (htCurrentIndex === 0);
    next.disabled = (htCurrentIndex === slides.length - 1);

    // Esconde setas em telas mobile
    prev.style.display = (window.innerWidth < 768) ? 'none' : 'flex';
    next.style.display = (window.innerWidth < 768) ? 'none' : 'flex';
  }
}

/**
 * Retorna o número de itens visíveis por slide conforme a largura da janela
 */
function getHtItemsPerSlide() {
  const w = window.innerWidth;
  if (w < 768) return 1;
  if (w < 1150) return 2;
  return 3;
}

/**
 * Alterna a visibilidade do menu mobile
 */
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
  document.getElementById('menu-overlay').classList.toggle('active');
}

// --- 5. INICIALIZADORES E LISTENERS ---

// Listener para ajuste de layout em tempo real (responsividade)
window.addEventListener('resize', () => {
  const currentW = window.innerWidth;
  const oldCols = (lastWindowWidth < 768) ? 1 : (lastWindowWidth < 1150) ? 2 : 3;
  const newCols = (currentW < 768) ? 1 : (currentW < 1150) ? 2 : 3;

  if (oldCols !== newCols) {
    if (document.getElementById('home-research-track')) {
      initHomeCarousel();
    }
  }
  lastWindowWidth = currentW;
});

// Inicialização ao carregar o documento
document.addEventListener('DOMContentLoaded', () => {
  loadMenu();
  navigateTo('home');
});