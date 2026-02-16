import { teamData } from '../../database/users.js';

let htCurrentIndex = 0;

/**
 * Detecta quantos itens devem aparecer por slide baseado na largura da tela
 */
function getItemsPerSlide() {
  const w = window.innerWidth;
  if (w < 768) return 1;    // Mobile: 1
  if (w < 1150) return 2;   // Tablets/Laptops pequenos: 2
  return 3;                 // Desktop: 3
}

/**
 * Filtros de dados centralizados para evitar repetição
 */
const normalizeStr = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const getCoords = () => teamData.filter(m => normalizeStr(m.cargo).includes('coordenador'));
const getTechs = () => teamData.filter(m => normalizeStr(m.cargo).includes('tecnic')); // Pega 'tecnico' e 'tecnica'
const getResearchers = () => teamData.filter(m => normalizeStr(m.cargo).includes('pesquisador'));

/**
 * Inicializa a seção de equipe na Home
 */
export async function initHomeTeam() {
  const injectionPoint = document.getElementById('home-team-injection-point');
  if (!injectionPoint) return;

  try {
    const resp = await fetch('components/home-team.html');
    if (resp.ok) {
      injectionPoint.innerHTML = await resp.text();
      renderCarousel();

      window.removeEventListener('resize', renderCarousel);
      window.addEventListener('resize', renderCarousel);
    }
  } catch (e) { console.error("Erro home-team component:", e); }
}

/**
 * Renderiza a página de Equipe Completa separada por categorias
 */
export function renderFullTeamPage() {
  const coordContainer = document.getElementById('coord-team');
  const techContainer = document.getElementById('tech-team');
  const researchContainer = document.getElementById('research-team');

  if (coordContainer) {
    coordContainer.innerHTML = getCoords().map(m => createHtCard(m)).join('');
  }

  if (techContainer) {
    techContainer.innerHTML = getTechs().map(m => createHtCard(m)).join('');
  }

  if (researchContainer) {
    researchContainer.innerHTML = getResearchers().map(m => createHtCard(m)).join('');
  }
}

/**
 * Move o carrossel circularmente
 */
export function moveResearch(dir) {
  const list = [...getTechs(), ...getResearchers()];
  const itemsPerSlide = getItemsPerSlide();
  const totalPages = Math.ceil(list.length / itemsPerSlide);

  htCurrentIndex = (htCurrentIndex + dir + totalPages) % totalPages;
  moveResearchTo(htCurrentIndex);
}

export function moveResearchTo(idx) {
  htCurrentIndex = idx;
  const track = document.getElementById('home-research-track');
  if (track) {
    track.style.transform = `translateX(-${htCurrentIndex * 100}%)`;
  }

  document.querySelectorAll('.ht-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === htCurrentIndex);
  });
}

/**
 * Expande/Contrai o card e alterna símbolo +/-
 */
export function htToggleCard(event, el) {
  event.stopPropagation();
  const isActive = el.classList.contains('active');

  document.querySelectorAll('.ht-card.active').forEach(card => {
    if (card !== el) {
      card.classList.remove('active');
      const icon = card.querySelector('.ht-toggle');
      if (icon) icon.innerText = '+';
    }
  });

  el.classList.toggle('active', !isActive);
  const toggleIcon = el.querySelector('.ht-toggle');
  if (toggleIcon) {
    toggleIcon.innerText = isActive ? '+' : '-';
  }
}

/**
 * Montagem do carrossel com lógica de visibilidade das setas
 */
function renderCarousel() {
  const coordTarget = document.getElementById('home-coord-target');
  const track = document.getElementById('home-research-track');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.querySelector('.ht-nav-btn.prev');
  const nextBtn = document.querySelector('.ht-nav-btn.next');

  if (!track || !coordTarget) return;

  coordTarget.innerHTML = getCoords().map(createHtCard).join('');

  const mainList = [...getTechs(), ...getResearchers()];
  const itemsPerSlide = getItemsPerSlide();
  const groups = [];

  for (let i = 0; i < mainList.length; i += itemsPerSlide) {
    groups.push(mainList.slice(i, i + itemsPerSlide));
  }

  const showNav = groups.length > 1;
  if (prevBtn) prevBtn.style.display = showNav ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = showNav ? 'flex' : 'none';

  track.innerHTML = groups.map(g => `
        <div class="ht-slide" style="flex: 0 0 100%; display: grid; grid-template-columns: repeat(${g.length}, 1fr); gap: 1.5rem; align-items: start;">
            ${g.map(m => createHtCard(m)).join('')}
        </div>
    `).join('');

  if (htCurrentIndex >= groups.length) htCurrentIndex = 0;
  moveResearchTo(htCurrentIndex);

  if (dotsContainer) {
    dotsContainer.innerHTML = groups.map((_, idx) => `
            <div class="ht-dot ${idx === htCurrentIndex ? 'active' : ''}" onclick="moveResearchTo(${idx})"></div>
        `).join('');
  }
}

function createHtCard(m) {
  const foto = m.foto
    ? `<img src="${m.foto}" class="w-full h-full object-cover" alt="${m.nome}">`
    : `<div class="w-full h-full flex items-center justify-center font-bold bg-gray-200 text-gray-500">${m.nome.charAt(0)}</div>`;

  const lattesLink = (m.lattes && m.lattes.trim() !== '')
    ? `<a href="${m.lattes}" target="_blank" class="ht-lattes-link">Ver Currículo Lattes →</a>`
    : `<span class="ht-lattes-none" style="font-size: 0.75rem; opacity: 0.6; font-style: italic;">Lattes não disponível</span>`;

  return `
    <div class="ht-card" onclick="htToggleCard(event, this)">
        <div class="ht-card-header">
            <div class="ht-info">
                <div class="ht-photo">${foto}</div>
                <div>
                    <h4 class="ht-name">${m.nome}</h4>
                    <p class="ht-role">${m.cargo}</p>
                </div>
            </div>
            <span class="ht-toggle">+</span>
        </div>
        <div class="ht-details">
          <p><strong>Titulação:</strong> ${m.titulo || 'N/A'}</p>
          <p><strong>Área de Atuação:</strong> ${m.areaPesquisa || 'Não informada'}</p>
          <div style="margin-top: 1rem;">${lattesLink}</div>
        </div>
    </div>`;
}