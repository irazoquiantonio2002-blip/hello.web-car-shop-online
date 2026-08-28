(() => {
  'use strict';

  /* ── Loader ─────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 500);
  });

  /* ── Footer year ────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Navbar scroll state ────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu ────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mob-menu');
  if (hamburger && mobMenu) {
    const closeMenu = () => {
      hamburger.classList.remove('is-open');
      mobMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    };
    hamburger.addEventListener('click', () => {
      const isOpen = mobMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ── Reveal on scroll ───────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ── Animated stat counters ─────────────────────────── */
  const statEls = document.querySelectorAll('.stat-num');
  if (statEls.length && 'IntersectionObserver' in window) {
    const animateCount = (el) => {
      const target = parseFloat(el.getAttribute('data-count') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = value.toLocaleString('es-MX') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statEls.forEach(el => statIo.observe(el));
  }

  /* ── Brand marquee ──────────────────────────────────── */
  const marquee = document.getElementById('marquee');
  if (marquee) {
    const brands = [
      { src: 'A552B8666DF2122D03CFD729BAE49099.jpeg', alt: 'Stetsom' },
      { src: 'A52D077FB814760DC87120EDAA73A62E.jpeg', alt: 'DC Audio' },
      { src: 'A53C28A513A654475B26D56E5EEE7658.jpeg', alt: 'DD Audio' },
      { src: 'A5422D0D4B198A52EB3C95D8258C1228.jpeg', alt: 'DS18 Digital Sound' },
      { src: 'A55171E29220B451D897AEF15072991B.jpeg', alt: 'Banda Audioparts' },
      { src: 'nuevas/marcas (1).jpeg', alt: 'Valt Power Solutions', big: true },
      { src: 'A5562E641F471A681EF3906A0156CEBD.jpeg', alt: 'SounDigital' },
      { src: 'A55AE2C2B5D4B584B436EAE0884F075B.jpeg', alt: 'Deaf Bonce' },
      { src: 'A56F5C9F01D2E77ECB1A1BCF71A5ED05.jpeg', alt: 'Rockford Fosgate' },
      { src: 'A591EEA18377AD6197E8992A31280FEB.jpeg', alt: 'Sundown Audio' },
      { src: 'nuevas/marcas (2).jpeg', alt: 'Limitless Lithium' },
      { src: 'nuevas/marca nueva.jpeg', alt: 'Valt Power Solutions', big: true },
    ];
    const buildItem = (b) => {
      const span = document.createElement('span');
      span.className = b.big ? 'marquee-item marquee-item-lg' : 'marquee-item';
      const img = document.createElement('img');
      img.src = b.src;
      img.alt = b.alt;
      img.loading = 'lazy';
      span.appendChild(img);
      return span;
    };
    // duplicated once for a seamless infinite loop
    [...brands, ...brands].forEach(b => marquee.appendChild(buildItem(b)));
  }

  /* ── Hero canvas — floating particle orbs ───────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height, dpr;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const colors = ['rgba(227,18,45,0.55)', 'rgba(56,209,255,0.45)', 'rgba(255,255,255,0.25)'];

    const initParticles = () => {
      const count = Math.round((width * height) / 22000);
      particles = Array.from({ length: Math.min(count, 70) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      resize();
      initParticles();
      requestAnimationFrame(tick);
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resize(); initParticles(); }, 200);
      });
    }
  }

  /* ── Contact form → WhatsApp ────────────────────────── */
  const waForm = document.getElementById('wa-form');
  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const interest = document.getElementById('f-interest').value;
      const msg = document.getElementById('f-msg').value.trim();

      if (!name || !msg) return;

      const text = `Hola, soy ${name}.\nMe interesa: ${interest}.\nDetalle: ${msg}`;

      window.open(`https://wa.me/523314618688?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    });
  }
})();
