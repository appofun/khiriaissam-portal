'use strict';

/* ── Fade-in ────────────────────────────────────────────────────────── */
(function initFadeIn() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
})();


/* ── Canvas Particles ───────────────────────────────────────────────── */
(function initParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function init() {
    const n = Math.min(55, Math.floor(W * H / 18000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.4 + 0.4,
      c: Math.random() > 0.5 ? '56,189,248' : '139,92,246',
      a: Math.random() * 0.35 + 0.1,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -2) p.x = W + 2;
      if (p.x > W + 2) p.x = -2;
      if (p.y < -2) p.y = H + 2;
      if (p.y > H + 2) p.y = -2;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},${p.a})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); init(); draw();
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
})();


/* ── Contact Form ───────────────────────────────────────────────────── */
/*
   Static form — shows alert by default.
   To enable real submissions, set action URL on the <form> tag and remove this block.
   Services: Formspree, Getform, Web3Forms, Basin, Tally
*/
(function initForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  if (form.getAttribute('action') !== '#') return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    if (!name || !email) { alert('Please fill in your name and email.'); return; }
    alert('Thank you. This static form is not connected yet.\nPlease connect it to Formspree, Getform, or another form service.');
    form.reset();
  });
})();
