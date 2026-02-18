import { teamData } from '../../database/users.js';

// =========================================================
// ESTADO INTERNO
// =========================================================
let htCurrentIndex = 0;
let resizeHandler = null;

// =========================================================
// AUXILIARES
// =========================================================
const normalize = (s) => s ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

const getTitleWeight = (titulo) => {
  const t = normalize(titulo);
  if (t.includes("doutor") || t.includes("doutora")) return 4;
  if (t.includes("mestre") || t.includes("mestra")) return 3;
  if (t.includes("especialista")) return 2;
  if (t.includes("bacharel") || t.includes("licencia") || t.includes("graduado") || t.includes("graduada")) return 1;
  return 0;
};

const sortByEducation = (a, b) => {
  const weightA = getTitleWeight(a.titulo);
  const weightB = getTitleWeight(b.titulo);
  if (weightA !== weightB) return weightB - weightA;
  return normalize(a.nome).localeCompare(normalize(b.nome));
};

const getCoords = () => [...teamData].filter(m => normalize(m.cargo).includes('coordenador')).sort(sortByEducation);
const getOthersSorted = () => [...teamData].filter(m => !normalize(m.cargo).includes('coordenador')).sort(sortByEducation);

function getItemsPerSlide() {
  const w = window.innerWidth;
  if (w < 768) return 1;
  if (w < 1150) return 2;
  return 3;
}

/**
 * Injeta o CSS dinamicamente para evitar erro 404 no GitHub Pages
 */
function injectTeamCSS() {
  if (!document.getElementById('home-team-css')) {
    const link = document.createElement('link');
    link.id = 'home-team-css';
    link.rel = 'stylesheet';
    link.href = './styles/home-team.css';
    document.head.appendChild(link);
  }
}

/* =========================================================
   INICIALIZAÇÃO DA HOME (CARROSSEL)
   ========================================================= */
export async function initHomeTeam() {
  const injectionPoint = document.getElementById('home-team-injection-point');
  if (!injectionPoint) return;

  injectTeamCSS();

  try {
    const resp = await fetch('./components/home-team.html');
    if (!resp.ok) throw new Error(`Erro ao buscar componente: ${resp.status}`);

    const html = await resp.text();
    injectionPoint.innerHTML = html;

    window.moveResearch = moveResearch;
    window.moveResearchTo = moveResearchTo;

    renderHomeCarousel();

    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = () => renderHomeCarousel();
    window.addEventListener('resize', resizeHandler);

  } catch (e) {
    console.error("Erro ao inicializar Home Team:", e);
  }
}

function renderHomeCarousel() {
  const track = document.getElementById('home-research-track');
  const coordTarget = document.getElementById('home-coord-target');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track || !coordTarget) return;

  coordTarget.innerHTML = getCoords().map(createTeamCard).join('');

  const others = getOthersSorted();
  const itemsPerSlide = getItemsPerSlide();
  const groups = [];

  for (let i = 0; i < others.length; i += itemsPerSlide) {
    groups.push(others.slice(i, i + itemsPerSlide));
  }

  track.innerHTML = groups.map(g => `
        <div class="ht-slide" style="display: grid; grid-template-columns: repeat(${itemsPerSlide}, 1fr); min-width: 100%;">
            ${g.map(createTeamCard).join('')}
        </div>
    `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = groups.map((_, idx) => `
            <div class="ht-dot ${idx === htCurrentIndex ? 'active' : ''}" onclick="moveResearchTo(${idx})"></div>
        `).join('');
  }

  if (htCurrentIndex >= groups.length) htCurrentIndex = Math.max(0, groups.length - 1);
  moveResearchTo(htCurrentIndex);
}

/* =========================================================
   PÁGINA COMPLETA DE EQUIPE (A função que estava faltando!)
   ========================================================= */
export function renderFullTeamPage() {
  const coordContainer = document.getElementById('coord-team');
  const othersContainer = document.getElementById('full-research-team');

  if (coordContainer) {
    coordContainer.innerHTML = getCoords().map(createTeamCard).join('');
  }

  if (othersContainer) {
    othersContainer.innerHTML = getOthersSorted().map(createTeamCard).join('');
  }
}

/* =========================================================
   LÓGICA DE NAVEGAÇÃO
   ========================================================= */
export function moveResearch(dir) {
  const track = document.getElementById('home-research-track');
  if (!track) return;
  const totalPages = track.children.length;
  htCurrentIndex = (htCurrentIndex + dir + totalPages) % totalPages;
  moveResearchTo(htCurrentIndex);
}

export function moveResearchTo(idx) {
  htCurrentIndex = idx;
  const track = document.getElementById('home-research-track');
  if (track) track.style.transform = `translateX(-${htCurrentIndex * 100}%)`;

  document.querySelectorAll('.ht-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === htCurrentIndex);
  });
}

export function createTeamCard(m) {
  const fotoUrl = m.foto && m.foto.startsWith('http') ? m.foto : `./${m.foto}`;
  const avatar = m.foto
    ? `<img src="${fotoUrl}" alt="${m.nome}" onerror="this.parentElement.innerHTML='<div class=\'no-img\'>${m.nome.charAt(0)}</div>'">`
    : `<div class="no-img">${m.nome.charAt(0)}</div>`;

  return `
        <div class="team-card-fixed">
            <div class="card-header">
                <div class="avatar">${avatar}</div>
                <div class="header-info">
                    <h4>${m.nome}</h4>
                    <p class="role">${m.cargo}</p>
                </div>
            </div>
            <div class="card-content">
                <div class="info-group">
                    <label>Titulação</label>
                    <p>${m.titulo || 'N/A'}</p>
                </div>
                <div class="info-group">
                    <label>Área de Atuação</label>
                    <p>${m.areaPesquisa || 'Não informada'}</p>
                </div>
            </div>
            <div class="card-footer">
                ${m.lattes ? `<a href="${m.lattes}" target="_blank">Lattes →</a>` : `<span>Lattes N/D</span>`}
            </div>
        </div>`;
}