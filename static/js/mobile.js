const btn = document.getElementById('mobileMenuBtn');
const menu = document.getElementById('mobileMenu');

if (btn && menu) {
  btn.addEventListener('click', () => {
    const show = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !show);
    menu.classList.toggle('block', show);
    btn.setAttribute('aria-expanded', String(show));
  });
}
