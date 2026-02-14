import { teamData } from '../database/users.js';

let htCurrentIndex = 0;

export async function initHomeTeam() {
    const injectionPoint = document.getElementById('home-team-injection-point');
    if (!injectionPoint) return;

    try {
        const resp = await fetch('pages/home-team.html');
        if (resp.ok) {
            injectionPoint.innerHTML = await resp.text();
            renderCarousel();
        }
    } catch (e) {
        console.error("Erro ao carregar home-team component:", e);
    }
}

function getHtItemsPerSlide() {
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w < 1150) return 2;
    return 3;
}

function renderCarousel() {
    const coordTarget = document.getElementById('home-coord-target');
    const track = document.getElementById('home-research-track');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track || !coordTarget) return;

    // 1. Renderiza Coordenação (Primeiros 2)
    coordTarget.innerHTML = teamData.slice(0, 2).map(m => createHtCard(m)).join('');

    // 2. Renderiza Pesquisadores no Carrossel
    const researchers = teamData.slice(2);
    const itemsPerSlide = getHtItemsPerSlide();
    const groups = [];

    for (let i = 0; i < researchers.length; i += itemsPerSlide) {
        groups.push(researchers.slice(i, i + itemsPerSlide));
    }

    track.innerHTML = groups.map(g => `
        <div class="ht-slide">
            ${g.map(m => createHtCard(m)).join('')}
        </div>
    `).join('');

    // 3. Renderiza Dots
    if (dotsContainer) {
        dotsContainer.innerHTML = groups.map((_, idx) => `
            <div class="ht-dot ${idx === htCurrentIndex ? 'active' : ''}" 
                 onclick="moveResearchTo(${idx})"></div>
        `).join('');
    }
}

function createHtCard(m) {
    const fotoContent = m.foto 
        ? `<img src="${m.foto}" alt="${m.nome}" class="w-full h-full object-cover rounded-full">`
        : `<div class="ht-photo">${m.nome.charAt(0)}</div>`;

    return `
    <div class="ht-card" onclick="htToggleCard(event, this)">
        <div class="ht-card-header">
            <div class="ht-info">
                <div class="ht-photo-wrapper">${fotoContent}</div>
                <div>
                    <h4 class="ht-name">${m.nome}</h4>
                    <p class="ht-role">${m.cargo}</p>
                </div>
            </div>
            <span class="ht-toggle">+</span>
        </div>
        <div class="ht-details">
            <div class="mt-6">
                <p class="detail-label">Titulação</p>
                <p class="detail-value">${m.titulo}</p>
                <p class="detail-label">Área de Atuação</p>
                <p class="detail-desc">${m.areaPesquisa}</p>
            </div>
            <a href="http://lattes.cnpq.br/" target="_blank" class="ht-lattes-link">Currículo Lattes</a>
        </div>
    </div>`;
}

// --- FUNÇÕES GLOBAIS PARA O HTML ---

window.moveResearch = (dir) => {
    const researchers = teamData.slice(2);
    const itemsPerSlide = getHtItemsPerSlide();
    const totalPages = Math.ceil(researchers.length / itemsPerSlide);
    
    htCurrentIndex = (htCurrentIndex + dir + totalPages) % totalPages;
    window.moveResearchTo(htCurrentIndex);
};

window.moveResearchTo = (idx) => {
    htCurrentIndex = idx;
    const track = document.getElementById('home-research-track');
    if (track) track.style.transform = `translateX(-${htCurrentIndex * 100}%)`;
    
    document.querySelectorAll('.ht-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === htCurrentIndex);
    });
};

window.htToggleCard = (event, el) => {
    event.stopPropagation();
    const isActive = el.classList.contains('active');

    document.querySelectorAll('.ht-card.active').forEach(card => {
        if (card !== el) card.classList.remove('active');
    });

    el.classList.toggle('active', !isActive);
};

// Listener de Redimensionamento
window.addEventListener('resize', () => {
    if (document.getElementById('home-research-track')) renderCarousel();
});