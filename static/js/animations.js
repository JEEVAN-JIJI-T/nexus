// Scroll reveal using IntersectionObserver
const elements = document.querySelectorAll('[data-reveal]');

if (elements.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('reveal');
    });
  }, { threshold: 0.12 });

  elements.forEach(el => io.observe(el));
} else {
  // fallback: reveal all
  elements.forEach(el => el.classList.add('reveal'));
}
