import { teamData } from '../../database/users.js';

let htCurrentIndex = 0;

export async function initHomeTeam() {
  const injectionPoint = document.getElementById('home-team-injection-point');
  if (!injectionPoint) return;
  try {
    const resp = await fetch('components/home-team.html');
    if (resp.ok) {
      injectionPoint.innerHTML = await resp.text();
      renderCarousel();
    }
  } catch (e) { console.error("Erro home-team component:", e); }
}

export function renderFullTeamPage() {
  const container = document.getElementById('full-team');
  if (container) container.innerHTML = teamData.map(m => createHtCard(m)).join('');
}

function renderCarousel() {
  const coordTarget = document.getElementById('home-coord-target');
  const track = document.getElementById('home-research-track');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !coordTarget) return;

  coordTarget.innerHTML = teamData.slice(0, 2).map(createHtCard).join('');
  const researchers = teamData.slice(2);
  const itemsPerSlide = window.innerWidth < 768 ? 1 : window.innerWidth < 1150 ? 2 : 3;
  const groups = [];
  for (let i = 0; i < researchers.length; i += itemsPerSlide) {
    groups.push(researchers.slice(i, i + itemsPerSlide));
  }
  track.innerHTML = groups.map(g => `<div class="ht-slide">${g.map(createHtCard).join('')}</div>`).join('');
  if (dotsContainer) {
    dotsContainer.innerHTML = groups.map((_, idx) => `<div class="ht-dot ${idx === 0 ? 'active' : ''}" onclick="moveResearchTo(${idx})"></div>`).join('');
  }
}

function createHtCard(m) {
  const foto = m.foto ? `<img src="${m.foto}" class="w-full h-full object-cover">` : `<div class="w-full h-full bg-green-800 flex items-center justify-center text-white font-bold">${m.nome.charAt(0)}</div>`;
  return `
    <div class="ht-card" onclick="htToggleCard(event, this)">
        <div class="ht-card-header flex items-center justify-between w-full">
            <div class="ht-info flex items-center gap-4">
                <div class="ht-photo w-14 h-14 rounded-full overflow-hidden border-2 border-green-50">${foto}</div>
                <div><h4 class="ht-name font-black">${m.nome}</h4><p class="ht-role">${m.cargo}</p></div>
            </div>
            <span class="ht-toggle">+</span>
        </div>
        <div class="ht-details">
            <p class="text-sm mt-4 text-gray-400 font-bold uppercase">Área</p>
            <p class="text-sm text-gray-600">${m.areaPesquisa}</p>
            <a href="http://lattes.cnpq.br/" target="_blank" class="ht-lattes-link">Lattes</a>
        </div>
    </div>`;
}

export function moveResearchTo(idx) {
  htCurrentIndex = idx;
  const track = document.getElementById('home-research-track');
  if (track) track.style.transform = `translateX(-${htCurrentIndex * 100}%)`;
  document.querySelectorAll('.ht-dot').forEach((dot, i) => dot.classList.toggle('active', i === htCurrentIndex));
}

export function htToggleCard(event, el) {
  event.stopPropagation();
  const isActive = el.classList.contains('active');
  document.querySelectorAll('.ht-card.active').forEach(card => card.classList.remove('active'));
  if (!isActive) el.classList.add('active');
}