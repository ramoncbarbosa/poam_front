import { pubData } from '../../database/publications.js';

// =========================================================
// ESTADO INTERNO
// =========================================================
let currentBannerIndex = 0;
let currentPage = 1;
const ITEMS_PER_PAGE = 5;
let bannerInterval = null;

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
        startBannerAutoplay(bannerTrack);
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

// =========================================================
// FUNÇÕES INTERNAS (LISTAGEM E PAGINAÇÃO)
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

// =========================================================
// FUNÇÕES DO BANNER (CARROSSEL)
// =========================================================

function renderBanner(pubs, track) {
    const sortedPubs = [...pubs].sort((a, b) => {
        const dateA = parseInt(a.data) || 0;
        const dateB = parseInt(b.data) || 0;
        return dateB - dateA;
    });

    const featured = sortedPubs.slice(0, 5);

    track.innerHTML = featured.map(pub => {
        const imgUrl = pub.imagem ? `./${pub.imagem}` : '';
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
            // Se o usuário clicar, paramos o autoplay para não atrapalhar a leitura
            if (bannerInterval) clearInterval(bannerInterval);
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
            dots[i].classList.toggle('active', i === currentBannerIndex);
        }
    }
}

function startBannerAutoplay(track) {
    if (bannerInterval) clearInterval(bannerInterval);

    bannerInterval = setInterval(() => {
        const indicatorsContainer = document.getElementById('banner-indicators-container');
        if (!track || !track.children.length) return;

        currentBannerIndex = (currentBannerIndex + 1) % track.children.length;
        goToSlide(currentBannerIndex, track, indicatorsContainer);
    }, 5000); // 5 segundos
}

// =========================================================
// FUNÇÕES DE DETALHE DA PUBLICAÇÃO
// =========================================================

function renderDetailContent(pub, container) {
    const imagePath = pub.imagem ? `../${pub.imagem}` : '';
    const bgRule = imagePath ? `url('${imagePath}')` : 'linear-gradient(to bottom, #064e3b, #047857)';
    const tipo = (pub.tipo || 'Artigo').replace(/_/g, ' ');
    const dataPub = pub.data || '';

    container.innerHTML = `
        <div class="detail-banner-wrapper">
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

        <div class="pub-content-layout">
            <div class="pub-main-column">
                <div class="pub-lead-text">
                    <h3 class="resumo-card-title">Resumo</h3>
                    <p>${pub.resumo || ''}</p>
                    
                    <a href="${pub.link || '#'}" target="_blank" class="pub-btn-contrast">
                        Documento Completo
                    </a>
                </div>
            </div>

            <aside class="pub-sidebar">
                <div class="pub-sidebar-block">
                    <div class="pub-sidebar-label">Autores</div>
                    <ul class="pub-sidebar-list">
                        ${(pub.autores || []).map(author => `<li>${author}</li>`).join('')}
                    </ul>
                </div>

                <div class="pub-sidebar-block">
                    <div class="pub-sidebar-label">Como Citar</div>
                    <div class="citation-box">
                        <p id="citation-text">${pub.comocitar || ''}</p>
                        <button class="copy-citation-btn" onclick="copyCitation()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copiar
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    `;
}

window.copyCitation = function () {
    const text = document.getElementById('citation-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.copy-citation-btn');
        const originalContent = btn.innerHTML;
        btn.innerHTML = 'Copiado!';
        btn.classList.add('copied');

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove('copied');
        }, 2000);
    });
};