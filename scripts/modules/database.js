import { dbData } from '../../database/databases.js';

export function renderDatabases() {
  const grid = document.getElementById('database-grid');
  if (!grid) return;
  grid.innerHTML = dbData.map(db => `
        <div class="db-card" onclick="navigateTo('dbdetail', ${db.id})">
            <div class="db-card-content">
                <span class="db-tag ${db.tipo}">${db.categoria}</span>
                <h3 class="db-title">${db.titulo}</h3>
                <p class="db-desc">${db.descricao}</p>
                <span class="db-link">Conhecer Pesquisa →</span>
            </div>
        </div>`).join('');
}

export function renderDbDetail(id) {
  const container = document.getElementById('db-detail-content');
  const db = dbData.find(d => d.id === parseInt(id));
  if (!container || !db) return;

  container.innerHTML = `
        <div class="db-detail-view">            
            <span class="db-tag ${db.tipo}">${db.categoria}</span>
            <h1 class="db-detail-title">${db.titulo}</h1>
            <div class="db-content-grid">
                <div class="db-info-main">
                    <h4 class="db-label">Sobre os Dados</h4>
                    <p class="db-text">${db.resumoCompleto || db.descricao}</p>
                    <h4 class="db-label">Estrutura (Amostra)</h4>
                    <div class="db-table-container" id="preview-table-container">Carregando...</div>
                </div>

                <div class="db-sidebar">
                    <div class="db-citation-card">
                        <h4 class="db-label-light">Como citar</h4>
                        <div class="db-citation-box" id="citation-text">...</div>
                        <button class="btn-copy" onclick="copyCitation()">Copiar Citação</button>
                    </div>

                    <div class="db-contact-card">
                        <h4 class="db-label-light">Responsável</h4>
                        <div class="db-name-box">${db.responsavel}</div>
                        <a href="${db.linkForms || '#'}" target="_blank" class="btn-request">Solicitar Acesso</a>
                    </div>
                </div>
            </div>
        </div>`;
  fetchCitation(db.citationSource, 'citation-text');
  fetchAndBuildTable(db.previewSource, 'preview-table-container');
}

async function fetchCitation(url, containerId) {
  try {
    const resp = await fetch(url);
    const text = await resp.text();
    const el = document.getElementById(containerId);
    if (el) el.innerText = text.trim();
  } catch (e) { console.error("Erro citação:", e); }
}

async function fetchAndBuildTable(url, containerId) {
  try {
    const resp = await fetch(url);
    const text = await resp.text();
    const separator = text.includes(';') ? ';' : ',';
    const rows = text.split('\n').filter(r => r.trim() !== "").slice(0, 8);
    let html = '<table class="data-table"><thead><tr>' +
      rows[0].split(separator).map(h => `<th>${h.trim()}</th>`).join('') +
      '</tr></thead><tbody>' +
      rows.slice(1).map(row => '<tr>' + row.split(separator).map(c => `<td>${c.trim()}</td>`).join('') + '</tr>').join('') +
      '</tbody></table>';
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = html;
  } catch (e) { console.error("Erro CSV:", e); }
}

export function copyCitation() {
  const text = document.getElementById('citation-text').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.btn-copy');
    const originalText = btn.innerText;
    btn.innerText = "Copiado!";
    setTimeout(() => { btn.innerText = originalText; }, 2000);
  });
}