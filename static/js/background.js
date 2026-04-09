(() => {
  const layers = document.querySelectorAll(".aurora-layer");
  const canvas = document.getElementById("aurora-particles");

  let ctx, w, h, stars = [];
  let mx = 0, my = 0;
  let tick = 0;

  /* Resize canvas */
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initStars();
  }

  /* Initialize twinkling stars */
  function initStars() {
    stars = [];
    const count = Math.floor((w * h) / 90000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.2,
        a: Math.random() * 0.5 + 0.1,
        vx: (Math.random() - 0.5) * 0.05
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, w, h);
    for (let s of stars) {
      s.x += s.vx;
      if (s.x < 0) s.x = w;
      if (s.x > w) s.x = 0;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* Parallax + drifting animation */
  function animateLayers() {
    tick += 0.0025;  // slow natural drift

    layers.forEach((layer, i) => {
      const depth = (i + 1) * 40;

      const driftX = Math.sin(tick + i) * 40;
      const driftY = Math.cos(tick + i * 1.2) * 30;

      const px = mx * depth + driftX;
      const py = my * depth + driftY;

      layer.style.transform = `translate(${px}px, ${py}px) scale(1.15)`;
    });
  }

  /* Track mouse */
  window.addEventListener("pointermove", (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mx = (e.clientX - centerX) / centerX;
    my = (e.clientY - centerY) / centerY;
  });

  /* Main loop */
  function loop() {
    drawStars();
    animateLayers();
    requestAnimationFrame(loop);
  }

  /* Init */
  function init() {
    if (canvas) {
      ctx = canvas.getContext("2d");
      resize();
      window.addEventListener("resize", resize);
      loop();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
