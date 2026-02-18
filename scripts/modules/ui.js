// =========================================================
// CONTROLE DE INTERFACE (Menu, Scroll, etc)
// =========================================================

export function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('menu-overlay');

  if (!menu) return;

  // Alterna a classe 'open' no menu (o CSS cuida da animação de transform)
  const isOpen = menu.classList.toggle('open');

  // Controla o Overlay
  if (overlay) {
    if (isOpen) {
      overlay.classList.add('active');
      overlay.style.display = 'block'; // Garante visibilidade
    } else {
      overlay.classList.remove('active');
      // Pequeno delay para esperar animação ou remove imediato
      // Dependendo do CSS, podemos apenas remover a classe, mas display none garante o clique
      setTimeout(() => {
        if (!menu.classList.contains('open')) {
          overlay.style.display = 'none';
        }
      }, 300); // Sincronizado com a transição do CSS
    }
  }
}

export function setupScrollSnap() {
  window.addEventListener('scroll', () => {
    const container = document.querySelector('.snap-container');
    if (!container) return;

    // Verifica se chegou ao fim da página
    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 150;

    // Desativa o snap no final para não travar o rodapé
    container.style.scrollSnapType = isAtBottom ? 'none' : 'y proximity';
  });
}