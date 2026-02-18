import { teamData } from '../../database/users.js';

let htCurrentIndex = 0;

/**
 * Normaliza strings para comparação (remove acentos e deixa em minúsculo)
 */
const normalize = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/**
 * Atribui pesos para a titulação acadêmica.
 * Ordem: Doutorado (4) > Mestrado (3) > Especialização (2) > Graduação (1)
 */
const getTitleWeight = (titulo) => {
  const t = normalize(titulo || "");
  if (t.includes("doutor") || t.includes("doutora")) return 4;
  if (t.includes("mestre") || t.includes("mestra")) return 3;
  if (t.includes("especialista")) return 2;
  if (t.includes("bacharel") || t.includes("licencia") || t.includes("graduado") || t.includes("graduada")) return 1;
  return 0;
};

/**
 * Função de comparação para o método .sort()
 * 1º Critério: Peso da titulação (decrescente)
 * 2º Critério: Nome (ordem alfabética A-Z)
 */
const sortByEducation = (a, b) => {
  const weightA = getTitleWeight(a.titulo);
  const weightB = getTitleWeight(b.titulo);

  if (weightA !== weightB) {
    return weightB - weightA;
  }

  const nomeA = normalize(a.nome);
  const nomeB = normalize(b.nome);
  return nomeA.localeCompare(nomeB);
};

/**
 * FILTROS DE DADOS
 * Utilizamos o operador spread [...] para criar cópias e não mutar o array original
 */
const getCoords = () => {
  return [...teamData]
    .filter(m => normalize(m.cargo).includes('coordenador'))
    .sort(sortByEducation);
};

const getOthersSorted = () => {
  return [...teamData]
    .filter(m => !normalize(m.cargo).includes('coordenador'))
    .sort(sortByEducation);
};

/**
 * Configuração de responsividade do carrossel
 */
function getItemsPerSlide() {
  const w = window.innerWidth;
  if (w < 768) return 1;  // Celular
  if (w < 1150) return 2; // Tablet
  return 3;               // Desktop
}

/* ==========================================================================
   RENDERIZAÇÃO DA HOME (CARROSSEL)
   ========================================================================== */
export async function initHomeTeam() {
  const injectionPoint = document.getElementById('home-team-injection-point');
  if (!injectionPoint) return;

  try {
    const resp = await fetch('./components/home-team.html');
    if (resp.ok) {
      injectionPoint.innerHTML = await resp.text();

      // Expõe as funções para os botões inline no HTML
      window.moveResearch = moveResearch;
      window.moveResearchTo = moveResearchTo;

      renderHomeCarousel();
      window.removeEventListener('resize', renderHomeCarousel);
      window.addEventListener('resize', renderHomeCarousel);
    }
  } catch (e) {
    console.error("Erro ao carregar componente Home Team:", e);
  }
}

function renderHomeCarousel() {
  const track = document.getElementById('home-research-track');
  const coordTarget = document.getElementById('home-coord-target');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track || !coordTarget) return;

  // Render Coordenadores
  coordTarget.innerHTML = getCoords().map(createTeamCard).join('');

  // Render Outros Membros Unificados (Técnicos + Pesquisadores)
  const others = getOthersSorted();
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

/* ==========================================================================
   RENDERIZAÇÃO DA PÁGINA COMPLETA DE EQUIPE
   ========================================================================== */
export function renderFullTeamPage() {
  const coordContainer = document.getElementById('coord-team');
  // Usamos o container unificado para técnicos e pesquisadores
  const othersContainer = document.getElementById('full-research-team');

  if (coordContainer) {
    coordContainer.innerHTML = getCoords().map(createTeamCard).join('');
  }

  if (othersContainer) {
    // Pega a lista unificada e ordenada para a página full
    const othersSorted = getOthersSorted();
    othersContainer.innerHTML = othersSorted.map(createTeamCard).join('');
  }
}

/* ==========================================================================
   LÓGICA DO CARROSSEL
   ========================================================================== */
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

/* ==========================================================================
   TEMPLATE DO CARD
   ========================================================================== */
export function createTeamCard(m) {
  const fotoUrl = m.foto && m.foto.startsWith('http') ? m.foto : `./${m.foto}`;
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
                ${m.lattes ? `<a href="${m.lattes}" target="_blank">Lattes →</a>` : `<span>Lattes N/D</span>`}
            </div>
        </div>`;
}