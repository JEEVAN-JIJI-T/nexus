// ripple effect
document.addEventListener('click', function (e) {
  const target = e.target.closest('.ripple');
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const dot = document.createElement('span');
  dot.className = 'ripple-dot';
  const size = Math.max(rect.width, rect.height);
  dot.style.width = dot.style.height = size + 'px';
  dot.style.left = (e.clientX - rect.left - size / 2) + 'px';
  dot.style.top = (e.clientY - rect.top - size / 2) + 'px';
  target.appendChild(dot);
  setTimeout(() => dot.remove(), 700);
});

// card hover assist for keyboard users
document.addEventListener('mouseover', (e) => {
  const c = e.target.closest('.glass');
  if (c) c.classList.add('hovered');
});
document.addEventListener('mouseout', (e) => {
  const c = e.target.closest('.glass');
  if (c) c.classList.remove('hovered');
});
