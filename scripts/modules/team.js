import { teamData } from '../../database/users.js';

let htCurrentIndex = 0;

// Normalização para filtro inclusivo
const normalize = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const getCoords = () => teamData.filter(m => normalize(m.cargo).includes('coordenador'));
const getOthers = () => teamData.filter(m => !normalize(m.cargo).includes('coordenador'));

function getItemsPerSlide() {
  const w = window.innerWidth;
  if (w < 768) return 1;
  if (w < 1150) return 2;
  return 3;
}

/**
 * Injeta o CSS específico dependendo da página
 */
function injectStyles(fileName) {
  const cssPath = `./styles/${fileName}`;
  if (!document.querySelector(`link[href="${cssPath}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
  }
}

export async function initHomeTeam() {
  const injectionPoint = document.getElementById('home-team-injection-point');
  if (!injectionPoint) return;

  injectStyles('home-team.css');

  try {
    const resp = await fetch('./components/home-team.html');
    if (resp.ok) {
      injectionPoint.innerHTML = await resp.text();
      renderHomeCarousel();

      window.removeEventListener('resize', renderHomeCarousel);
      window.addEventListener('resize', renderHomeCarousel);
    }
  } catch (e) {
    console.error("Erro ao carregar home-team component:", e);
  }
}

function renderHomeCarousel() {
  const track = document.getElementById('home-research-track');
  const coordTarget = document.getElementById('home-coord-target');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !coordTarget) return;

  coordTarget.innerHTML = getCoords().map(createTeamCard).join('');

  const others = getOthers();
  const itemsPerSlide = getItemsPerSlide();
  const groups = [];

  for (let i = 0; i < others.length; i += itemsPerSlide) {
    groups.push(others.slice(i, i + itemsPerSlide));
  }

  track.innerHTML = groups.map(g => `
    <div class="ht-slide" style="grid-template-columns: repeat(${itemsPerSlide}, 1fr);">
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

// CORREÇÃO AQUI: Injeção do CSS da página completa de equipe
export function renderFullTeamPage() {
  injectStyles('team.css');

  const mapping = [
    { id: 'coord-team', data: getCoords() },
    { id: 'tech-team', data: teamData.filter(m => normalize(m.cargo).includes('tecnic')) },
    { id: 'research-team', data: teamData.filter(m => normalize(m.cargo).includes('pesquisador')) }
  ];

  mapping.forEach(section => {
    const container = document.getElementById(section.id);
    if (container) container.innerHTML = section.data.map(createTeamCard).join('');
  });
}

export function createTeamCard(m) {
  // CORREÇÃO DOS PATHS DE IMAGEM: Garante que usem o caminho relativo ao projeto
  const fotoUrl = m.foto.startsWith('http') ? m.foto : `./${m.foto}`;

  const foto = m.foto
    ? `<img src="${fotoUrl}" alt="${m.nome}" onerror="this.parentElement.innerHTML='<div class=\'no-img\'>${m.nome.charAt(0)}</div>'">`
    : `<div class="no-img">${m.nome.charAt(0)}</div>`;

  return `
    <div class="team-card-fixed">
        <div class="card-header">
            <div class="avatar">${foto}</div>
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
            ${m.lattes ? `<a href="${m.lattes}" target="_blank">Lattes →</a>` : `<span>Lattes não disponível</span>`}
        </div>
    </div>`;
}