/**
 * Lógica exclusiva para a página de detalhes da publicação - POAM
 */
const pubDataDetails = [
    {
        id: 0,
        t: "Governança Ambiental na Amazônia",
        orientador: "Dra. Maria Dolores",
        pesquisadores: ["Dâina Naíny Cunha", "Ricardo Bezerra"],
        d: "15 de Outubro, 2023",
        c: "Análise sobre as novas políticas de conservação e o papel das instituições locais no monitoramento da biodiversidade.",
        textoCompleto: "Este estudo detalha as métricas de governança aplicadas no período de 2020-2023, demonstrando como a participação local reduz em 20% os índices de desmatamento ilegal em áreas protegidas.",
        link: "http://lattes.cnpq.br/",
        image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000"
    },
    {
        id: 1,
        t: "Dinâmicas Territoriais e Conflitos",
        orientador: "Ricardo Bezerra",
        pesquisadores: ["Aline Silva", "João Mendes"],
        d: "20 de Agosto, 2023",
        c: "Estudo focado no sudeste paraense e as transformações no uso do solo.",
        textoCompleto: "A pesquisa mapeia os conflitos fundiários através de dados geoprocessados, oferecendo uma nova perspectiva sobre a expansão da fronteira agrícola.",
        link: "http://lattes.cnpq.br/",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000"
    },
    {
        id: 2,
        t: "Sustentabilidade em Áreas Urbanas",
        orientador: "Dra. Eugênia Rosa Cabral",
        pesquisadores: ["Lucas Costa", "Dâina Naíny Cunha"],
        d: "12 de Maio, 2023",
        c: "Políticas públicas para cidades resilientes no contexto amazônico.",
        textoCompleto: "O artigo foca na urbanização de Belém e Manaus, sugerindo modelos de drenagem sustentável baseados em soluções baseadas na natureza (SbN).",
        link: "http://lattes.cnpq.br/",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000"
    }
];

function renderPubDetail(id) {
    const container = document.getElementById('detail-content');
    const pub = pubDataDetails.find(p => p.id === parseInt(id));

    if (!container || !pub) {
        console.error("Publicação não encontrada.");
        return;
    }

    container.innerHTML = `
      <div class="pub-banner-hero shadow-2xl" style="background-image: url('${pub.image}');">
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
                  <p class="pub-sidebar-name">${pub.orientador}</p>
              </div>
              
              <div class="pub-sidebar-block">
                  <h4 class="pub-sidebar-label">Pesquisadores</h4>
                  <ul class="pub-sidebar-list">
                      ${pub.pesquisadores.map(p => `<li>${p}</li>`).join('')}
                  </ul>
              </div>
          </aside>

          <div class="pub-main-column">
              <div class="pub-lead-text">
                  ${pub.c}
              </div>
              
              <div class="pub-full-text">
                  <h2 class="text-3xl font-black text-green-900 mb-6 uppercase">Análise e Resultados</h2>
                  <p class="mb-6">${pub.textoCompleto}</p>
                  <p>O Laboratório POAM (Políticas Ambientais na Amazônia) continua monitorando os impactos dessas variáveis para fornecer dados precisos para a governança regional e o desenvolvimento sustentável da floresta tropical.</p>
              </div>

              <div class="pub-footer-action">
                  <a href="${pub.link}" target="_blank" class="pub-btn-green">
                      Acessar Artigo em PDF Completo
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-left:10px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </a>
              </div>
          </div>

      </div>
  `;
}