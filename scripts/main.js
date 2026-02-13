const teamData = [
  { i: 'MD', n: 'Dra. Maria Dolores', r: 'Coordenadora', d: 'Doutora em Ciência Política. Especialista em gestão pública amazônica.' },
  { i: 'ED', n: 'Dra. Eugênia Rosa Cabral', r: 'Coordenadora Adjunta', d: 'Doutora e pesquisadora em Políticas de Sustentabilidade.' },
  { i: 'DN', n: 'Dâina Naíny Cunha', r: 'Pesquisadora Principal', d: 'Ciências Sociais e análise de políticas públicas.' },
  { i: 'RB', n: 'Ricardo Bezerra', r: 'Pesquisador', d: 'Ecologia e legislação ambiental amazônica.' },
  { i: 'AS', n: 'Aline Silva', r: 'Pesquisadora', d: 'Direito Ambiental e governança de terras.' },
  { i: 'JM', n: 'João Mendes', r: 'Pesquisador', d: 'Geoprocessamento e mineração de dados políticos.' },
  { i: 'LC', n: 'Lucas Costa', r: 'Pesquisador', d: 'Análise de dados territoriais.' }
];

let currentResearchIdx = 0;
let lastWindowWidth = window.innerWidth;

// --- SISTEMA DE NAVEGAÇÃO ---
async function loadMenu() {
  const menuAside = document.getElementById('mobile-menu');
  try {
    const response = await fetch('pages/menu.html');
    menuAside.innerHTML = await response.text();
  } catch (e) { console.error("Erro menu:", e); }
}

async function navigateTo(pId) {
  const contentArea = document.getElementById('content-area');
  const globalFooter = document.getElementById('global-footer');

  try {
    const response = await fetch(`pages/${pId}.html`);
    if (!response.ok) throw new Error('Falha ao carregar página');
    contentArea.innerHTML = await response.text();

    if (globalFooter) globalFooter.style.display = (pId === 'home') ? 'none' : 'block';

    if (pId === 'home') {
      // Carrega o componente separado e AGUARDA terminar antes de iniciar o carrossel
      await loadHomeTeamSection();
    }
    else if (pId === 'team') {
      // Lógica da página de equipe se necessário
    }

    window.scrollTo(0, 0);
    const menu = document.getElementById('mobile-menu');
    if (menu && menu.classList.contains('open')) toggleMenu();

  } catch (error) { console.error("Erro navegação:", error); }
}

// --- CARREGAMENTO DO COMPONENTE HOME-TEAM ---
async function loadHomeTeamSection() {
  const injectionPoint = document.getElementById('home-team-injection-point');
  if (!injectionPoint) return;

  try {
    const resp = await fetch('pages/home-team.html'); // Ajuste o caminho se necessário (ex: pages/components/home-team.html)
    if (!resp.ok) throw new Error('Componente home-team não encontrado');

    const html = await resp.text();
    injectionPoint.innerHTML = html;

    // Renderiza os dados apenas após o HTML estar no DOM
    initHomeCarousel();
  } catch (e) { console.error("Erro componente team:", e); }
}

// --- LÓGICA DE ITENS POR SLIDE (Sincronizada com CSS 1150px) ---
function getItemsPerSlide() {
  const w = window.innerWidth;
  if (w < 768) return 1;    // Mobile
  if (w < 1150) return 2;   // Tablet (768 - 1149)
  return 3;                 // Desktop (>= 1150)
}

function initHomeCarousel() {
  const coordTarget = document.getElementById('home-coord-target');
  const track = document.getElementById('home-research-track');
  const dotsContainer = document.getElementById('carouselDots');

  // Se os elementos não existirem (HTML não carregou), para aqui.
  if (!track || !coordTarget) return;

  const cardHtml = (m) => `
        <div class="researcher-card" onclick="toggleCard(event, this)">
            <div class="flex items-center justify-between mb-4 w-full">
                <div class="flex items-center space-x-4">
                    <div class="photo-circle shadow-md">${m.i}</div>
                    <div class="text-left">
                        <h4 class="researcher-name">${m.n}</h4>
                        <p class="researcher-role">${m.r}</p>
                    </div>
                </div>
                <span class="toggle-icon text-2xl font-light text-green-700">+</span>
            </div>
            <div class="details-content text-left text-sm">
                <p class="mb-4 text-gray-600 leading-relaxed">${m.d}</p>
                <a href="#" class="text-green-600 font-bold uppercase underline text-xs tracking-wider">Currículo Lattes</a>
            </div>
        </div>`;

  // 1. Renderiza Coordenação
  coordTarget.innerHTML = teamData.slice(0, 2).map(cardHtml).join('');

  // 2. Renderiza Carrossel
  const researchers = teamData.slice(2);
  const groups = [];
  const itemsPerSlide = getItemsPerSlide();

  for (let i = 0; i < researchers.length; i += itemsPerSlide) {
    groups.push(researchers.slice(i, i + itemsPerSlide));
  }

  track.innerHTML = groups.map(g => `<div class="research-slide">${g.map(cardHtml).join('')}</div>`).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = groups.map((_, idx) =>
      `<div class="dot ${idx === 0 ? 'active' : ''}" onclick="moveResearchTo(${idx})"></div>`
    ).join('');
  }

  currentResearchIdx = 0;
  track.style.transform = `translateX(0)`;
  updateNavButtons();

  // Controle de visibilidade das setas (Só Desktop)
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.style.display = (groups.length > 1 && window.innerWidth >= 1150) ? 'flex' : 'none';
  });
}

// --- FUNÇÕES DE CONTROLE ---
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
  document.getElementById('menu-overlay').classList.toggle('active');
}

function toggleCard(event, el) {
  event.stopPropagation();
  const isActive = el.classList.contains('active');
  document.querySelectorAll('.researcher-card').forEach(card => {
    card.classList.remove('active');
    const icon = card.querySelector('.toggle-icon');
    if (icon) icon.innerText = '+';
  });
  if (!isActive) {
    el.classList.add('active');
    const icon = el.querySelector('.toggle-icon');
    if (icon) icon.innerText = '-';
  }
}

document.addEventListener('click', () => {
  document.querySelectorAll('.researcher-card').forEach(card => {
    card.classList.remove('active');
    const icon = card.querySelector('.toggle-icon');
    if (icon) icon.innerText = '+';
  });
});

function moveResearchTo(idx) {
  currentResearchIdx = idx;
  const track = document.getElementById('home-research-track');
  if (track) {
    track.style.transform = `translateX(-${currentResearchIdx * 100}%)`;
    updateNavButtons();
  }
}

function moveResearch(dir) {
  const slides = document.querySelectorAll('.research-slide');
  if (slides.length === 0) return;
  currentResearchIdx = Math.max(0, Math.min(currentResearchIdx + dir, slides.length - 1));
  moveResearchTo(currentResearchIdx);
}

function updateNavButtons() {
  const prev = document.querySelector('.prev-btn');
  const next = document.querySelector('.next-btn');
  const slides = document.querySelectorAll('.research-slide');
  const dots = document.querySelectorAll('.dot');

  if (prev && next && slides.length > 0) {
    prev.disabled = currentResearchIdx === 0;
    next.disabled = currentResearchIdx === (slides.length - 1);
  }
  if (dots.length > 0) {
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentResearchIdx));
  }
}

// Listener de Redimensionamento
window.addEventListener('resize', () => {
  const currentW = window.innerWidth;
  const oldItems = (lastWindowWidth < 768) ? 1 : (lastWindowWidth < 1150) ? 2 : 3;
  const newItems = (currentW < 768) ? 1 : (currentW < 1150) ? 2 : 3;

  if (oldItems !== newItems) {
    // Se mudou a quantidade de colunas, re-renderiza o carrossel se ele existir na tela
    if (document.getElementById('home-research-track')) initHomeCarousel();
  }
  lastWindowWidth = currentW;
});

document.addEventListener('DOMContentLoaded', () => {
  loadMenu();
  navigateTo('home');
});