document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          // show gradient ribbon near this element if present
          const ribbon = entry.target.parentElement && entry.target.parentElement.querySelector('.gradient-reveal');
          if (ribbon) ribbon.classList.add('show');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('reveal'));
    const ribbon = document.querySelector('.gradient-reveal');
    if (ribbon) ribbon.classList.add('show');
  }
});
