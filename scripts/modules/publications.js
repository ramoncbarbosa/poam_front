import { pubData } from '../../database/publications.js';

let currentPubB = 0;
let currentPubPage = 1;
const pubsPerPage = 5;
let bannerInterval;

const filterEmpty = (arr) => (arr && Array.isArray(arr) ? arr.filter(item => item.trim() !== "") : []);
const formatType = (type) => (type ? type.replace(/_/g, ' ').toUpperCase() : 'PUBLICAÇÃO');

export function renderPublications() {
    const track = document.getElementById('bannerTrack');
    if (!track) return;
    if (bannerInterval) clearInterval(bannerInterval);
    const latestPubs = pubData.slice(0, 5);
    track.innerHTML = latestPubs.map(p => `
    <div class="article-slide flex flex-col justify-end p-8 md:p-12 text-white w-full flex-shrink-0 cursor-pointer relative min-h-[400px]" 
         style="background: linear-gradient(to top, rgba(6,78,59,0.95), transparent), url('${p.imagem}') center/cover no-repeat;"
         onclick="navigateTo('pubdetail', ${p.id})">
        <div class="relative z-10">
            <span class="bg-[#064e3b] text-white font-bold uppercase text-[10px] px-4 py-1.5 rounded-full mb-3 inline-block shadow-lg border border-green-800/50">
                ${formatType(p.tipo)}
            </span>
            <h2 class="text-2xl md:text-4xl font-black mb-2 leading-tight uppercase italic tracking-tighter">${p.titulo}</h2>
            <p class="opacity-90 line-clamp-2 max-w-2xl text-sm font-medium">${p.resumo}</p>
        </div>
    </div>`).join('');
    renderPubPage(1);
    bannerInterval = setInterval(() => moveB(1), 5000);
}

/**
 * Tag da lista ajustada para o Verde Escuro do Resumo
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
        <div class="p-6 md:p-8 bg-white border-l-[6px] border-green-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group mb-4" onclick="navigateTo('pubdetail', ${p.id})">
            <div class="flex flex-wrap gap-2 mb-3">
                 <span class="bg-[#064e3b] text-white font-bold uppercase text-[9px] px-3 py-1 rounded-full shadow-sm">
                    ${formatType(p.tipo)}
                 </span>
            </div>
            <h4 class="text-lg md:text-xl font-black text-gray-900 group-hover:text-green-800 transition-colors leading-tight">${p.titulo}</h4>
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

export function renderPubDetail(id) {
    const container = document.getElementById('detail-content');
    const pub = pubData.find(p => p.id === parseInt(id));
    if (!container || !pub) return;

    const autores = filterEmpty(pub.autores);
    const orientacao = filterEmpty(pub.orientação);
    const pesquisadores = filterEmpty(pub.pesquisadores);

    container.innerHTML = `
      <div class="pub-banner-hero shadow-2xl" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('${pub.imagem}');">
          <div class="pub-hero-inner">
              <span class="pub-type-tag" style="background-color: #064e3b;">${formatType(pub.tipo)}</span>
              <h1 class="pub-hero-title">${pub.titulo}</h1>
              <p class="text-green-300 font-bold tracking-widest uppercase text-sm">${pub.data}</p>
          </div>
      </div>

      <div class="pub-content-layout container mx-auto px-4">
          <aside class="pub-sidebar flex flex-col gap-6">
              
              <div class="p-8 rounded-[2rem] bg-green-900 text-white shadow-2xl">
                  ${autores.length > 0 ? `
                  <div class="mb-6">
                      <h4 class="text-white text-lg font-black uppercase tracking-tighter mb-2">Autores</h4>
                      <ul class="text-white opacity-90 text-sm md:text-base space-y-1">
                          ${autores.map(n => `<li>${n}</li>`).join('')}
                      </ul>
                  </div>` : ''}

                  ${orientacao.length > 0 ? `
                  <div class="mb-6">
                      <h4 class="text-white text-lg font-black uppercase tracking-tighter mb-2">Orientação</h4>
                      <ul class="text-white opacity-90 text-sm md:text-base space-y-1">
                          ${orientacao.map(n => `<li>${n}</li>`).join('')}
                      </ul>
                  </div>` : ''}

                  ${pesquisadores.length > 0 ? `
                  <div>
                      <h4 class="text-white text-lg font-black uppercase tracking-tighter mb-2">Pesquisadores</h4>
                      <ul class="text-white opacity-90 text-sm md:text-base space-y-1">
                          ${pesquisadores.map(n => `<li>${n}</li>`).join('')}
                      </ul>
                  </div>` : ''}
              </div>
              
              <div class="p-8 rounded-[2rem] bg-green-900 text-white shadow-2xl flex flex-col">
                  <h4 class="text-lg md:text-xl font-black uppercase tracking-tighter mb-1 text-white">
                      Como citar
                  </h4>
                  <div class="italic font-normal leading-relaxed mb-6 text-sm md:text-base text-white opacity-90" id="citation-text">
                      "${pub.comocitar}"
                  </div> 

                  <button 
                      class="w-full border-none py-4 rounded-xl text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-lg"
                      style="background-color: #ffffff; color: #064e3b;"
                      onclick="copyPubCitation(this, '${pub.comocitar}')">
                      Copiar Citação
                  </button>
              </div>
          </aside>

          <div class="pub-main-column">
              <div class="bg-green-900 p-8 md:p-12 rounded-[2rem] shadow-inner flex flex-col relative min-h-[400px]"> 
                  <h2 class="text-2xl md:text-3xl font-black text-white mb-8 uppercase tracking-tighter">
                      Resumo
                  </h2>
                  <div class="text-white leading-relaxed text-justify text-base md:text-lg font-normal opacity-90 antialiased mb-16">
                      ${pub.resumo}
                  </div>

                  <div class="absolute bottom-8 right-8 md:bottom-12 md:right-12">
                      <a href="${pub.link}" target="_blank" 
                         class="flex items-center gap-2 bg-white text-[#064e3b] text-[11px] font-black uppercase py-4 px-8 rounded-xl hover:-translate-y-1 transition-all shadow-xl group">
                          Acessar Completo
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                      </a>
                  </div>
              </div>
          </div>
      </div>`;
}

export function copyPubCitation(btn, text) {
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.innerText;
            btn.innerText = "Copiado!";
            btn.style.backgroundColor = "#10b981";
            btn.style.color = "#ffffff";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "#ffffff";
                btn.style.color = "#064e3b";
            }, 2000);
        });
    }
}

export function moveB(dir) {
    const track = document.getElementById('bannerTrack');
    if (!track) return;
    currentPubB = (currentPubB + dir + 5) % 5;
    track.style.transform = `translateX(-${currentPubB * 100}%)`;
}