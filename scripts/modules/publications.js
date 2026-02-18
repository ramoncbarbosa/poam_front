import { pubData } from '../../database/publications.js';

// =========================================================
// ESTADO INTERNO
// =========================================================
let currentBannerIndex = 0;
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

// =========================================================
// FUNÇÕES EXPORTADAS
// =========================================================

export function renderPublications() {
    const listContainer = document.getElementById('pub-list');
    const paginationContainer = document.getElementById('pub-pagination');
    const bannerTrack = document.getElementById('bannerTrack');

    if (listContainer) {
        currentPage = 1;
        updatePublicationView(listContainer, paginationContainer);
    }

    if (bannerTrack) {
        currentBannerIndex = 0;
        renderBanner(pubData, bannerTrack);
    }
}

export function renderPubDetail(extraData = null) {
    const detailContainer = document.getElementById('detail-content');

    if (!detailContainer) return;

    let pubId = extraData;

    if (pubId === null || pubId === undefined) {
        const params = new URLSearchParams(window.location.search);
        pubId = params.get('id');
    }

    const publication = pubData.find(p => p.id == pubId) || pubData[pubId];

    if (publication) {
        renderDetailContent(publication, detailContainer);
    } else {
        detailContainer.innerHTML = '<p class="pub-full-text" style="text-align: center; padding: 2rem;">Publicação não encontrada.</p>';
    }
}

// Nota: moveB foi removida. A navegação agora é feita pela função interna goToSlide clicando nos indicadores.

// =========================================================
// FUNÇÕES INTERNAS
// =========================================================

function updatePublicationView(listContainer, paginationContainer) {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedPubs = pubData.slice(start, end);

    renderPublicationList(paginatedPubs, listContainer);

    if (paginationContainer) {
        renderPaginationControls(pubData.length, paginationContainer, listContainer);
    }
}

function renderPaginationControls(totalItems, container, listContainer) {
    container.innerHTML = '';
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'pub-page-btn';
    prevBtn.innerHTML = '←';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updatePublicationView(listContainer, container);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };
    container.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `pub-page-btn ${i === currentPage ? 'active' : ''}`;
        btn.innerText = i;
        btn.onclick = () => {
            currentPage = i;
            updatePublicationView(listContainer, container);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        };
        container.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'pub-page-btn';
    nextBtn.innerHTML = '→';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePublicationView(listContainer, container);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };
    container.appendChild(nextBtn);
}

function renderPublicationList(pubs, container) {
    container.innerHTML = '';

    pubs.forEach((pub) => {
        const card = document.createElement('div');
        card.className = 'pub-card-item';

        const tipo = (pub.tipo || 'Artigo').replace(/_/g, ' ');
        const autores = (pub.autores || []).join(', ');

        card.innerHTML = `
            <div class="pub-card-content">
                <span class="pub-card-tag">${tipo}</span>
                <h3 class="pub-card-title">${pub.titulo || 'Sem título'}</h3>
                <p class="pub-card-authors">${autores}</p>
                <div class="pub-card-action">
                    Ver detalhes <span>→</span>
                </div>
            </div>
        `;

        card.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('pubdetail', pub.id);
            }
        };

        container.appendChild(card);
    });
}

function renderBanner(pubs, track) {
    const sortedPubs = [...pubs].sort((a, b) => {
        const dateA = parseInt(a.data) || 0;
        const dateB = parseInt(b.data) || 0;
        return dateB - dateA;
    });

    const featured = sortedPubs.slice(0, 5);

    track.innerHTML = featured.map(pub => {
        const imgUrl = pub.imagem ? `../${pub.imagem}` : '';
        const bgRule = imgUrl ? `url('${imgUrl}')` : 'linear-gradient(to bottom, #064e3b, #047857)';
        const tipo = (pub.tipo || 'Destaque').replace(/_/g, ' ');
        const dataPub = pub.data || '';

        return `
        <div class="article-slide">
            <div class="banner-slide-bg" style="background-image: ${bgRule};">
                <div class="banner-overlay"></div>
                <div class="banner-content">
                    <div class="banner-meta">
                        <span class="banner-tag">${tipo}</span>
                        <span class="banner-date">${dataPub}</span>
                    </div>
                    <h2 class="banner-title">${pub.titulo}</h2>
                </div>
            </div>
        </div>
    `}).join('');

    // CORREÇÃO: Chamando a função que cria os indicadores abaixo do banner
    setupBannerIndicators(featured.length, track);
}

function setupBannerIndicators(count, track) {
    let indicatorsContainer = document.getElementById('banner-indicators-container');

    if (!indicatorsContainer) {
        indicatorsContainer = document.createElement('div');
        indicatorsContainer.id = 'banner-indicators-container';
        indicatorsContainer.className = 'banner-indicators';

        if (track.parentElement) {
            track.parentElement.after(indicatorsContainer);
        }
    }

    indicatorsContainer.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.className = `banner-indicator ${i === 0 ? 'active' : ''}`;

        dot.onclick = () => {
            goToSlide(i, track, indicatorsContainer);
        };

        indicatorsContainer.appendChild(dot);
    }
}

function goToSlide(index, track, indicatorsContainer) {
    currentBannerIndex = index;

    if (track) {
        track.style.transform = `translateX(-${currentBannerIndex * 100}%)`;
    }

    if (indicatorsContainer) {
        const dots = indicatorsContainer.children;
        for (let i = 0; i < dots.length; i++) {
            if (i === currentBannerIndex) {
                dots[i].classList.add('active');
            } else {
                dots[i].classList.remove('active');
            }
        }
    }
}

function renderDetailContent(pub, container) {
    const imagePath = pub.imagem ? `../${pub.imagem}` : '';
    const bgStyle = imagePath ? `url('${imagePath}')` : 'linear-gradient(to right, #064e3b, #047857)';
    const tipoFormatado = (pub.tipo || 'Artigo').replace(/_/g, ' ');

    container.innerHTML = `
        <div class="pub-banner-hero" style="background-image: ${bgStyle};">
            <div class="pub-hero-inner">
                <span class="pub-type-tag">${tipoFormatado}</span>
                <h1 class="pub-hero-title">${pub.titulo}</h1>
            </div>
        </div>

        <div class="pub-content-layout">
            <div class="pub-main-column">
                <div class="pub-lead-text">
                    <p>${pub.resumo || ''}</p>
                    
                    <a href="${pub.link || '#'}" target="_blank" class="pub-btn-contrast">
                        Acessar Documento Original
                    </a>
                </div>
                
                <div class="pub-full-text">
                   <h3 class="pub-citation-title">Como Citar:</h3>
                   <div class="pub-citation-box">
                        <p class="pub-citation-text">${pub.comocitar || ''}</p>
                   </div>
                </div>
            </div>

            <aside class="pub-sidebar">
                <div class="pub-sidebar-block">
                    <div class="pub-sidebar-label">Autores</div>
                    <ul class="pub-sidebar-list">
                        ${(pub.autores || []).map(author => `<li>${author}</li>`).join('')}
                    </ul>
                </div>
            </aside>
        </div>
    `;
}