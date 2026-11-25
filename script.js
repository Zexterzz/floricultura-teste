(() => {
  'use strict';

  /* Imagens: IDs do Unsplash em data-img. Troque aqui por fotos próprias quando houver. */
  const BASE = 'https://images.unsplash.com/';
  document.querySelectorAll('img[data-img]').forEach(img => {
    const w = img.dataset.w || 800;
    img.src = `${BASE}${img.dataset.img}?auto=format&fit=crop&w=${w}&q=80`;
    img.addEventListener('error', () => { img.style.opacity = 0; img.parentElement.classList.add('noimg'); });
  });

  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  /* Navbar compacta ao rolar */
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();

  /* Menu mobile */
  const setMenu = open => {
    menu.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  window.matchMedia('(min-width:861px)').addEventListener('change', () => setMenu(false));

  /* Reveal ao entrar na viewport */
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Parallax sutil (hero + folhas decorativas) */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroImg = document.querySelector('.hero-img');
  const decos = document.querySelectorAll('.deco[data-speed]');
  let ticking = false;
  const parallax = () => {
    const y = window.scrollY;
    if (heroImg && y < window.innerHeight * 1.2) heroImg.style.transform = `translate3d(0,${y * .12}px,0)`;
    decos.forEach(d => {
      const r = d.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) d.style.translate = `0 ${(r.top - window.innerHeight / 2) * parseFloat(d.dataset.speed)}px`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    onScroll();
    if (!reduce && !ticking) { ticking = true; requestAnimationFrame(parallax); }
  }, { passive: true });

  /* Feedback do botão "Quero este" (sem carrinho real) */
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const old = btn.textContent;
      btn.textContent = 'Adicionado ✓';
      btn.classList.add('added');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('added'); }, 2000);
    });
  });
})();
