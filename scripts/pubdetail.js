/**
 * Lógica da página de detalhes (pubdetail.js)
 */
function renderPubDetail(id) {
    const container = document.getElementById('detail-content');
    // Busca no array unificado do main.js
    const pub = pubData.find(p => p.id === parseInt(id));

    if (!container || !pub) {
        console.error("Publicação não encontrada.");
        return;
    }

    const orientador = teamData.find(t => t.i === pub.orientadorId);
    const orientadorNome = (orientador && orientador.r.toLowerCase().includes('coordenador')) ? orientador.n : "Coordenação Geral POAM";
    const pesquisadores = (pub.pesquisadoresIds || []).map(pid => teamData.find(t => t.i === pid)).filter(Boolean);

    container.innerHTML = `
      <div class="pub-banner-hero shadow-2xl" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${pub.image}');">
          <div class="pub-hero-inner">
              <span class="pub-type-tag">Destaque Científico</span>
              <h1 class="pub-hero-title">${pub.t}</h1>
              <p class="text-green-300 font-bold tracking-widest uppercase text-sm">${pub.d}</p>
          </div>
      </div>

      <div class="pub-content-layout">
          <aside class="pub-sidebar">
              <div class="pub-sidebar-block">
                  <h4 class="pub-sidebar-label">Orientação</h4>
                  <p class="pub-sidebar-name">${orientadorNome}</p>
              </div>
              <div class="pub-sidebar-block">
                  <h4 class="pub-sidebar-label">Pesquisadores</h4>
                  <ul class="pub-sidebar-list">
                      ${pesquisadores.map(p => `<li>${p.n}</li>`).join('')}
                  </ul>
              </div>
          </aside>

          <div class="pub-main-column">
              <div class="pub-lead-text">${pub.c}</div>
              <div class="pub-full-text">
                  <h2 class="text-3xl font-black text-green-900 mb-6 uppercase">Análise de Resultados</h2>
                  <p class="mb-6">${pub.textoCompleto || "Conteúdo técnico em fase de revisão final pelo Laboratório POAM."}</p>
              </div>
              <div class="pub-footer-action">
                  <a href="${pub.link}" target="_blank" class="pub-btn-green">Acessar PDF Completo</a>
              </div>
          </div>
      </div>`;
}