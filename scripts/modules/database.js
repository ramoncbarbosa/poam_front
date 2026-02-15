import { dbData } from '../../database/storage.js';

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

  // Remontagem da interface completa usando HTML
  container.innerHTML = `
    <div class="db-detail-view">            
        <span class="db-tag ${db.tipo}">${db.categoria}</span>
        <h1 class="db-detail-title">${db.titulo}</h1>
        
        <div class="db-content-grid">
            <div class="db-info-main">
                <h4 class="db-label">Sobre os Dados</h4>
                <p class="db-text">${db.resumoCompleto}</p>
                
                <h4 class="db-label">Estrutura (Amostra)</h4>
                <div class="db-table-container">
                    ${generateTableHTML(db.rawRows)}
                </div>
            </div>

            <div class="db-sidebar">
                <div class="db-citation-card">
                    <h4 class="db-label-light">Como citar</h4>
                    <div class="db-citation-box" id="citation-text">${db.citacao}</div> 
                    <button class="btn-copy" onclick="copyCitation()">Copiar Citação</button>
                </div>

                <div class="db-contact-card">
                    <h4 class="db-label-light">Responsável</h4>
                    <div class="db-name-box">${db.responsavel}</div>
                    <a href="#" class="btn-request">Solicitar Acesso</a>
                </div>
            </div>
        </div>
    </div>`;
}

// Função que remonta a tabela HTML a partir dos dados do CSV
function generateTableHTML(rows) {
  if (!rows || rows.length === 0) return "<p>Dados indisponíveis.</p>";

  const separator = ',';
  const headers = rows[0].split(separator);
  const dataRows = rows.slice(1, 8); // Pega 7 linhas de exemplo

  return `
    <table class="data-table">
      <thead>
        <tr>${headers.map(h => `<th>${h.trim()}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${dataRows.map(row => `
          <tr>${row.split(separator).map(cell => `<td>${cell.trim()}</td>`).join('')}</tr>
        `).join('')}
      </tbody>
    </table>`;
}

export function copyCitation() {
  const text = document.getElementById('citation-text')?.innerText;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('.btn-copy');
      const original = btn.innerText;
      btn.innerText = "Copiado!";
      setTimeout(() => btn.innerText = original, 2000);
    });
  }
}