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

// 1. Renderiza a página principal de publicações (Lista + Banner + Paginação)
export function renderPublications() {
    const listContainer = document.getElementById('pub-list');
    const paginationContainer = document.getElementById('pub-pagination');
    const bannerTrack = document.getElementById('bannerTrack');

    // Renderiza a Lista com Paginação
    if (listContainer) {
        // Reseta para página 1 ao entrar na tela
        currentPage = 1;
        updatePublicationView(listContainer, paginationContainer);
    }

    // Renderiza o Banner
    if (bannerTrack) {
        currentBannerIndex = 0;
        renderBanner(pubData, bannerTrack);
    }
}

// 2. Renderiza a página de detalhes
export function renderPubDetail(extraData = null) {
    const detailContainer = document.getElementById('detail-content');

    if (!detailContainer) return;

    // Tenta pegar o ID vindo do roteador ou da URL
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

// 3. Lógica do Movimento do Carrossel (moveB)
export function moveB(direction) {
    const track = document.getElementById('bannerTrack');
    if (!track) return;

    const bannerItems = track.children.length; // Quantidade real de slides
    if (bannerItems === 0) return;

    currentBannerIndex += direction;

    if (currentBannerIndex < 0) {
        currentBannerIndex = bannerItems - 1;
    } else if (currentBannerIndex >= bannerItems) {
        currentBannerIndex = 0;
    }

    track.style.transform = `translateX(-${currentBannerIndex * 100}%)`;
}


// =========================================================
// FUNÇÕES INTERNAS (Lógica de Controle e Renderização)
// =========================================================

// Atualiza a visualização da lista com base na página atual
function updatePublicationView(listContainer, paginationContainer) {
    // Calcular intervalo
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    // Fatiar dados
    const paginatedPubs = pubData.slice(start, end);

    // Renderizar Cards
    renderPublicationList(paginatedPubs, listContainer);

    // Renderizar Controles de Paginação (se container existir)
    if (paginationContainer) {
        renderPaginationControls(pubData.length, paginationContainer, listContainer);
    }
}

// Gera os botões de paginação
function renderPaginationControls(totalItems, container, listContainer) {
    container.innerHTML = '';
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Se só tem 1 página, esconde
    if (totalPages <= 1) return;

    // --- Botão Anterior ---
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pub-page-btn';
    prevBtn.innerHTML = '←';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updatePublicationView(listContainer, container);
            window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll opcional para topo da lista
        }
    };
    container.appendChild(prevBtn);

    // --- Números ---
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

    // --- Botão Próximo ---
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

// Gera o HTML da Lista de Cards
function renderPublicationList(pubs, container) {
    container.innerHTML = '';

    pubs.forEach((pub) => {
        const card = document.createElement('div');
        card.className = 'pub-card-item'; // Classe CSS

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
            } else {
                console.error("Erro: navigateTo não definido globalmente.");
            }
        };

        container.appendChild(card);
    });
}

// Gera o HTML do Banner (Carrossel)
function renderBanner(pubs, track) {
    // 1. Clonar e Ordenar por data (Decrescente: 2025 -> 2024...)
    const sortedPubs = [...pubs].sort((a, b) => {
        const dateA = parseInt(a.data) || 0;
        const dateB = parseInt(b.data) || 0;
        return dateB - dateA;
    });

    // 2. Pegar os 5 mais recentes
    const featured = sortedPubs.slice(0, 5);

    // 3. Gerar HTML (Sem resumo, apenas Data, Tipo e Titulo)
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
}

// Gera o HTML do Detalhe
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
                <div class="pub-lead-text">${pub.resumo || ''}</div>
                
                <div class="pub-full-text">
                   <h3 style="color: #064e3b; margin-bottom: 1rem; font-weight:800;">Como Citar:</h3>
                   <div style="background: #f1f5f9; padding: 1.5rem; border-left: 4px solid #064e3b; border-radius: 0 1rem 1rem 0;">
                        <p style="font-style: italic; color: #334155;">${pub.comocitar || ''}</p>
                   </div>
                </div>

                <div class="pub-footer-action">
                    <a href="${pub.link || '#'}" target="_blank" class="pub-btn-green">
                        Acessar Documento Original
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
                    <div class="pub-sidebar-label">Data</div>
                    <div class="pub-sidebar-name">${pub.data || '2025'}</div>
                </div>
            </aside>
        </div>
    `;
}