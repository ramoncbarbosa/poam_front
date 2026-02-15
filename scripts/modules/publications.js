import { pubData } from '../../database/publications.js';

let currentPubB = 0;
let currentPubPage = 1;
const pubsPerPage = 5;
let bannerInterval;

/**
 * Inicializa a página de listagem de publicações
 */
export function renderPublications() {
  const track = document.getElementById('bannerTrack');
  if (!track) return;

  if (bannerInterval) clearInterval(bannerInterval);

  // Banner com as 5 mais recentes
  const latestPubs = pubData.slice(0, 5);
  track.innerHTML = latestPubs.map(p => `
    <div class="article-slide flex flex-col justify-end p-12 text-white w-full flex-shrink-0 cursor-pointer relative min-h-[350px]" 
         style="background: linear-gradient(to top, rgba(6,78,59,0.95), transparent), url('${p.imagem}') center/cover no-repeat;"
         onclick="navigateTo('pubdetail', ${p.id})">
        <div class="relative z-10">
            <span class="bg-green-500 text-white font-bold uppercase text-[10px] px-3 py-1 rounded-full mb-3 inline-block shadow-lg">Destaque</span>
            <h2 class="text-4xl font-black mb-2 leading-none uppercase italic tracking-tighter">${p.titulo}</h2>
            <p class="opacity-90 line-clamp-2 max-w-2xl text-sm font-medium">${p.resumo}</p>
        </div>
    </div>`).join('');

  renderPubPage(1);
  bannerInterval = setInterval(() => moveB(1), 5000);
}

/**
 * Gerencia a paginação do histórico
 */
export function renderPubPage(page) {
  const list = document.getElementById('pub-list');
  const container = document.getElementById('pub-pagination');
  if (!list || !container) return;

  currentPubPage = page;
  const start = (page - 1) * pubsPerPage;
  const paginatedItems = pubData.slice(start, start + pubsPerPage);
  const totalPages = Math.ceil(pubData.length / pubsPerPage);

  list.innerHTML = paginatedItems.map(p => `
        <div class="p-8 bg-white border-l-[6px] border-green-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group mb-4" onclick="navigateTo('pubdetail', ${p.id})">
            <h4 class="text-xl font-black text-gray-900 group-hover:text-green-800 transition-colors">${p.titulo}</h4>
            <p class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-2 mb-4">${p.data}</p>
            <p class="text-gray-500 text-sm leading-relaxed line-clamp-2">${p.resumo}</p>
        </div>`).join('');

  container.innerHTML = `
        <div class="flex items-center justify-center gap-6 mt-12">
            <button onclick="renderPubPage(${currentPubPage - 1})" class="pub-page-btn" ${currentPubPage === 1 ? 'disabled' : ''}>← Anterior</button>
            <span class="font-black text-green-900 uppercase text-[10px] tracking-widest">Página ${currentPubPage} de ${totalPages}</span>
            <button onclick="renderPubPage(${currentPubPage + 1})" class="pub-page-btn" ${currentPubPage === totalPages ? 'disabled' : ''}>Próxima →</button>
        </div>`;
}

/**
 * Renderiza o conteúdo completo de um artigo
 */
export function renderPubDetail(id) {
  const container = document.getElementById('detail-content');
  const pub = pubData.find(p => p.id === parseInt(id));
  if (!container || !pub) return;

  container.innerHTML = `
      <div class="pub-banner-hero shadow-2xl" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${pub.imagem}');">
          <div class="pub-hero-inner">
              <span class="pub-type-tag">Destaque Científico</span>
              <h1 class="pub-hero-title">${pub.titulo}</h1>
              <p class="text-green-300 font-bold tracking-widest uppercase text-sm">${pub.data}</p>
          </div>
      </div>
      <div class="pub-content-layout">
          <aside class="pub-sidebar">
              <div class="pub-sidebar-block">
                  <h4 class="pub-sidebar-label">Orientação</h4>
                  <p class="pub-sidebar-name">${pub.orientador}</p>
              </div>
              <div class="pub-sidebar-block">
                  <h4 class="pub-sidebar-label">Pesquisadores</h4>
                  <ul class="pub-sidebar-list">${(pub.pesquisadores || []).map(n => `<li>${n}</li>`).join('')}</ul>
              </div>
          </aside>
          <div class="pub-main-column">
              <div class="pub-lead-text">${pub.resumo}</div>
              <div class="pub-full-text">
                  <h2 class="text-3xl font-black text-green-900 mb-6 uppercase">Análise de Resultados</h2>
                  <p class="mb-6">${pub.textoCompleto || "Conteúdo em fase de revisão final."}</p>
              </div>
          </div>
      </div>`;
}

/**
 * Movimentação do Banner (Exposta para onclick no HTML via main.js)
 */
export function moveB(dir) {
  const track = document.getElementById('bannerTrack');
  if (!track) return;
  currentPubB = (currentPubB + dir + 5) % 5;
  track.style.transform = `translateX(-${currentPubB * 100}%)`;
}