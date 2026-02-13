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

async function loadMenu() {
  const menuAside = document.getElementById('mobile-menu');
  try {
    const response = await fetch('pages/menu.html');
    const html = await response.text();
    menuAside.innerHTML = html;
  } catch (e) { console.error("Erro ao carregar menu:", e); }
}

async function navigateTo(pId) {
  const contentArea = document.getElementById('content-area');
  const globalFooter = document.getElementById('global-footer');

  try {
    const response = await fetch(`pages/${pId}.html`);
    if (!response.ok) throw new Error('Falha ao carregar');
    const html = await response.text();
    contentArea.innerHTML = html;

    globalFooter.style.display = (pId === 'home') ? 'none' : 'block';

    if (pId === 'home' || pId === 'team') renderTeam(pId);
    if (pId === 'publications') renderPublications();

    window.scrollTo(0, 0);
    const menu = document.getElementById('mobile-menu');
    if (menu && menu.classList.contains('open')) toggleMenu();

  } catch (error) {
    console.error("Erro na navegação:", error);
  }
}

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

function renderTeam(pId) {
  const cardHtml = (m) => `
        <div class="researcher-card bg-white shadow-sm border" onclick="toggleCard(event, this)">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-5">
                    <div class="photo-circle">${m.i}</div>
                    <div class="text-left">
                        <h4 class="researcher-name">${m.n}</h4>
                        <p class="researcher-role uppercase">${m.r}</p>
                    </div>
                </div>
                <span class="toggle-icon text-3xl font-light text-green-700">+</span>
            </div>
            <div class="details-content text-left text-sm pt-4">
                <p class="mb-4 text-base opacity-90">${m.d}</p>
                <a href="http://lattes.cnpq.br/" target="_blank" class="text-green-600 font-bold uppercase underline text-xs">Currículo Lattes</a>
            </div>
        </div>`;

  if (pId === 'home') {
    const coord = document.getElementById('home-coord');
    const track = document.getElementById('researchTrack');
    const dotsContainer = document.getElementById('carouselDots');

    if (coord) coord.innerHTML = teamData.slice(0, 2).map(cardHtml).join('');

    if (track) {
      const researchers = teamData.slice(2);
      const groups = [];
      const itemsPerSlide = 3;

      for (let i = 0; i < researchers.length; i += itemsPerSlide) {
        groups.push(researchers.slice(i, i + itemsPerSlide));
      }

      track.innerHTML = groups.map(g => `<div class="research-slide">${g.map(cardHtml).join('')}</div>`).join('');

      if (dotsContainer) {
        dotsContainer.innerHTML = groups.map((_, idx) =>
          `<div class="dot ${idx === 0 ? 'active' : ''}" onclick="moveResearchTo(${idx})"></div>`
        ).join('');
      }

      const navBtns = document.querySelectorAll('.nav-btn');
      const showArrows = groups.length > 1;
      navBtns.forEach(btn => btn.style.display = showArrows ? 'flex' : 'none');

      currentResearchIdx = 0;
      updateNavButtons();
    }
  } else {
    const full = document.getElementById('full-team');
    if (full) full.innerHTML = teamData.map(cardHtml).join('');
  }
}

function moveResearchTo(idx) {
  currentResearchIdx = idx;
  const track = document.getElementById('researchTrack');
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
  const dots = document.querySelectorAll('.dot');

  if (prev && next) {
    prev.disabled = currentResearchIdx === 0;
    next.disabled = currentResearchIdx === (Math.ceil((teamData.length - 2) / 3) - 1);
  }

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentResearchIdx);
  });
}

function renderPublications() {
  const list = document.getElementById('pub-list');
  const dummyPubs = Array.from({ length: 5 }, (_, i) => ({ title: `Estudo POAM #${5 - i}`, date: 'Fev 2026' }));
  if (list) {
    list.innerHTML = dummyPubs.map(p => `
            <div class="bg-white p-8 rounded-3xl border shadow-sm">
                <span class="text-xs font-bold text-green-600 uppercase tracking-widest">${p.date}</span>
                <h4 class="text-xl font-bold text-gray-800 mt-1 mb-4 italic">${p.title}</h4>
                <a href="#" class="text-green-700 font-bold text-xs underline uppercase">Acessar documento completo →</a>
            </div>`).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadMenu();
  navigateTo('home');
});