export function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('menu-overlay');
  if (!menu || !overlay) return;
  menu.classList.toggle('open');
  if (menu.classList.contains('open')) {
    menu.style.transform = 'translateX(0)';
    overlay.style.display = 'block';
    overlay.classList.add('active');
  } else {
    menu.style.transform = 'translateX(100%)';
    overlay.style.display = 'none';
    overlay.classList.remove('active');
  }
}

export function setupScrollSnap() {
  window.addEventListener('scroll', () => {
    const container = document.querySelector('.snap-container');
    if (!container) return;
    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 150;
    container.style.scrollSnapType = isAtBottom ? 'none' : 'y proximity';
  });
}