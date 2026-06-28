/* ═══════════════════════════════════════════════════════════════════════
   Aissam Khiri — script.js
   Dark identity page — animations, particles, fade-in, form
   Static-ready: GitHub Pages, Cloudflare Pages
═══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. HEADER scroll state ─────────────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('header');
  const links  = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);

    // Active nav link tracking
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── 2. FADE-IN on scroll (IntersectionObserver) ────────────────────── */
(function initFadeIn() {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
})();


/* ── 3. CANVAS PARTICLES ────────────────────────────────────────────── */
(function initParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(60, Math.floor((W * H) / 18000));
    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r:  Math.random() * 1.5 + 0.4,
      // Alternate between blue and purple tints
      color: Math.random() > 0.5 ? '56,189,248' : '139,92,246',
      alpha: Math.random() * 0.4 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -2) p.x = W + 2;
      if (p.x > W + 2) p.x = -2;
      if (p.y < -2) p.y = H + 2;
      if (p.y > H + 2) p.y = -2;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      // Draw soft glow
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `rgba(${p.color},${p.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${p.color},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });
})();


/* ── 4. CONTACT FORM handler ────────────────────────────────────────── */
/*
   This form is UI only on static hosting (GitHub Pages / Cloudflare Pages).
   To connect a real form service, add an action URL to the <form> tag.

   Examples:
   - Formspree:  action="https://formspree.io/f/YOUR_FORM_ID"  method="POST"
   - Getform:    action="https://getform.io/f/YOUR_FORM_ID"    method="POST"
   - Web3Forms:  action="https://api.web3forms.com/submit"     method="POST" + hidden access_key
   - Basin:      action="https://usebasin.com/f/YOUR_FORM_ID"  method="POST"

   Once a real action URL is set, remove or comment out this initForm() block.
*/
(function initForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  // Only intercept if no real action URL is set
  const action = form.getAttribute('action');
  if (action && action !== '#') return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name  = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();

    if (!name || !email) {
      alert('Please fill in your name and email address.');
      return;
    }

    // Static hosting notice
    alert(
      'Thank you. This static form is not connected yet.\n\n' +
      'Please connect it to Formspree, Getform, Tally, Basin, or another form service to enable real message delivery.'
    );

    form.reset();
  });
})();


/* ── 5. SMOOTH SCROLL for all anchor links ───────────────────────────── */
(function initSmoothScroll() {
  const HEADER_H = 64;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
