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

      // Recalcula ao redimensionar a tela
      window.removeEventListener('resize', renderCarousel);
      window.addEventListener('resize', renderCarousel);
    }
  } catch (e) { console.error("Erro home-team component:", e); }
}

/**
 * Renderiza a página de Equipe Completa
 */
export function renderFullTeamPage() {
  const coordContainer = document.getElementById('coord-team');
  const researchContainer = document.getElementById('research-team');

  if (!coordContainer || !researchContainer) return;

  const coordData = teamData.slice(0, 2);
  const researchData = teamData.slice(2);

  coordContainer.innerHTML = coordData.map(m => createHtCard(m)).join('');
  researchContainer.innerHTML = researchData.map(m => createHtCard(m)).join('');
}

/**
 * Move o carrossel circularmente
 */
export function moveResearch(dir) {
  const researchers = teamData.slice(2);
  const itemsPerSlide = getItemsPerSlide();
  const totalPages = Math.ceil(researchers.length / itemsPerSlide);

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

  // Fecha outros cards e reseta ícones
  document.querySelectorAll('.ht-card.active').forEach(card => {
    if (card !== el) {
      card.classList.remove('active');
      const icon = card.querySelector('.ht-toggle');
      if (icon) icon.innerText = '+';
    }
  });

  // Alterna o atual
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

  // Seleção das setas
  const prevBtn = document.querySelector('.ht-nav-btn.prev');
  const nextBtn = document.querySelector('.ht-nav-btn.next');

  if (!track || !coordTarget) return;

  coordTarget.innerHTML = teamData.slice(0, 2).map(createHtCard).join('');

  const researchers = teamData.slice(2);
  const itemsPerSlide = getItemsPerSlide();
  const groups = [];

  for (let i = 0; i < researchers.length; i += itemsPerSlide) {
    groups.push(researchers.slice(i, i + itemsPerSlide));
  }

  // LÓGICA DE VISIBILIDADE: Só mostra setas se houver mais de uma página
  // O CSS cuida de esconder no Mobile via Media Query
  const showNav = groups.length > 1;
  if (prevBtn) prevBtn.style.display = showNav ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = showNav ? 'flex' : 'none';

  track.innerHTML = groups.map(g => `
        <div class="ht-slide" style="flex: 0 0 100%; display: grid; grid-template-columns: repeat(${g.length}, 1fr); gap: 1.5rem;">
            ${g.map(m => createHtCard(m)).join('')}
        </div>
    `).join('');

  if (htCurrentIndex >= groups.length) htCurrentIndex = 0;
  moveResearchTo(htCurrentIndex);

  if (dotsContainer) {
    // Gerado aqui, visibilidade controlada pelo CSS (Media Query)
    dotsContainer.innerHTML = groups.map((_, idx) => `
            <div class="ht-dot ${idx === htCurrentIndex ? 'active' : ''}" onclick="moveResearchTo(${idx})"></div>
        `).join('');
  }
}

function createHtCard(m) {
  const foto = m.foto
    ? `<img src="${m.foto}" class="w-full h-full object-cover">`
    : `<div class="w-full h-full flex items-center justify-center font-bold">${m.nome.charAt(0)}</div>`;

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
          <p><strong>Titulação</strong> ${m.titulo || 'N/A'}</p>
          <p><strong>Área de Atuação</strong> ${m.areaPesquisa}</p>
          <a href="${m.lattes || '#'}" target="_blank" class="ht-lattes-link">
              Ver Currículo Lattes →
          </a>
        </div>
    </div>`;
}