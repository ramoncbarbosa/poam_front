const teamData = [
  { i: 'MD', n: 'Dra. Maria Dolores', r: 'Coordenadora', d: 'Doutora em Ciência Política. Especialista em gestão pública amazônica.' },
  { i: 'ED', n: 'Dra. Eugênia Rosa Cabral', r: 'Coordenadora Adjunta', d: 'Doutora e pesquisadora em Políticas de Sustentabilidade.' },
  { i: 'DN', n: 'Dâina Naíny Cunha', r: 'Pesquisadora Principal', d: 'Ciências Sociais e análise de políticas públicas.' },
  { i: 'RB', n: 'Ricardo Bezerra', r: 'Pesquisador', d: 'Ecologia e legislação ambiental amazônica.' },
  { i: 'AS', n: 'Aline Silva', r: 'Pesquisadora', d: 'Direito Ambiental e governança de terras.' },
  { i: 'JM', n: 'João Mendes', r: 'Pesquisador', d: 'Geoprocessamento e mineração de dados políticos.' }
];

let currentResearchIdx = 0;

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
    if (document.getElementById('mobile-menu').classList.contains('open')) toggleMenu();

  } catch (error) {
    console.error("Erro na navegação:", error);
  }
}

function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
  document.getElementById('menu-overlay').classList.toggle('active');
}

// Lógica de abertura/fechamento de cards
function toggleCard(event, el) {
  event.stopPropagation(); // Impede que o clique no card dispare o fechamento global

  const isActive = el.classList.contains('active');

  // Fecha todos os outros cards abertos
  document.querySelectorAll('.researcher-card').forEach(card => {
    card.classList.remove('active');
    const icon = card.querySelector('.toggle-icon');
    if (icon) icon.innerText = '+';
  });

  // Se o card clicado não estava ativo, abre ele e muda o ícone para '-'
  if (!isActive) {
    el.classList.add('active');
    const icon = el.querySelector('.toggle-icon');
    if (icon) icon.innerText = '-';
  }
}

// Fecha cards ao clicar em qualquer lugar fora deles
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
                        <h4 class="researcher-name text-gray-800">${m.n}</h4>
                        <p class="researcher-role uppercase">${m.r}</p>
                    </div>
                </div>
                <span class="toggle-icon text-3xl font-light text-green-700 transition-colors duration-300">+</span>
            </div>
            <div class="details-content text-left text-sm pt-4">
                <p class="mb-4 text-base opacity-90">${m.d}</p>
                <a href="http://lattes.cnpq.br/" target="_blank" class="text-green-600 font-bold uppercase underline text-xs">Currículo Lattes</a>
            </div>
        </div>`;

  if (pId === 'home') {
    const homeCoord = document.getElementById('home-coord');
    const researchTrack = document.getElementById('researchTrack');

    if (homeCoord) homeCoord.innerHTML = teamData.slice(0, 2).map(cardHtml).join('');

    if (researchTrack) {
      const researchers = teamData.slice(2);
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        researchTrack.innerHTML = `<div class="research-slide">${researchers.map(cardHtml).join('')}</div>`;
      } else {
        const groups = [];
        for (let i = 0; i < researchers.length; i += 3) groups.push(researchers.slice(i, i + 3));
        researchTrack.innerHTML = groups.map(g => `<div class="research-slide">${g.map(cardHtml).join('')}</div>`).join('');
        currentResearchIdx = 0;
        updateNavButtons();
      }
    }
  } else {
    const fullTeam = document.getElementById('full-team');
    if (fullTeam) fullTeam.innerHTML = teamData.map(cardHtml).join('');
  }
}

function moveResearch(dir) {
  const track = document.getElementById('researchTrack');
  const slides = document.querySelectorAll('.research-slide');
  if (!track || slides.length === 0) return;

  currentResearchIdx = Math.max(0, Math.min(currentResearchIdx + dir, slides.length - 1));
  track.style.transform = `translateX(-${currentResearchIdx * 100}%)`;
  updateNavButtons();
}

function updateNavButtons() {
  const prev = document.querySelector('.prev-btn');
  const next = document.querySelector('.next-btn');
  const slides = document.querySelectorAll('.research-slide');
  if (prev && next) {
    prev.disabled = currentResearchIdx === 0;
    next.disabled = currentResearchIdx === (slides.length - 1);
  }
}

function renderPublications() {
  const list = document.getElementById('pub-list');
  const track = document.getElementById('bannerTrack');
  const dummyPubs = Array.from({ length: 5 }, (_, i) => ({ title: `Estudo POAM #${5 - i}`, date: 'Fev 2026' }));

  if (list) {
    list.innerHTML = dummyPubs.map(p => `
            <div class="bg-white p-8 rounded-3xl border shadow-sm">
                <span class="text-xs font-bold text-green-600 uppercase tracking-widest">${p.date}</span>
                <h4 class="text-xl font-bold text-gray-800 mt-1 mb-4 italic">${p.title}</h4>
                <a href="#" class="text-green-700 font-bold text-xs underline uppercase">Acessar documento completo →</a>
            </div>`).join('');
  }

  if (track) {
    track.innerHTML = dummyPubs.map(p => `
            <div class="article-slide" style="background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1200'); background-size: cover;">
                <h2 class="text-white text-3xl font-black italic text-left">${p.title}</h2>
            </div>`).join('');
  }
}

let bIdx = 0;
function moveB(d) {
  const t = document.getElementById('bannerTrack');
  bIdx = (bIdx + d + 5) % 5;
  if (t) t.style.transform = `translateX(-${bIdx * 100}%)`;
}

document.addEventListener('DOMContentLoaded', () => navigateTo('home'));