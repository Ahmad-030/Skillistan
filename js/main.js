/**
 * Skillistan — main.js
 * Theme toggle, hero tabs, navbar scroll, ScrollStack init
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── THEME TOGGLE ─── */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const saved       = localStorage.getItem('skillistan-theme') || 'dark';

  html.setAttribute('data-theme', saved);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('skillistan-theme', next);
  });

  /* ─── HERO SEARCH TABS ─── */
  const tabs = document.querySelectorAll('.hero-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ─── NAVBAR SCROLL EFFECT ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.18)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });

  /* ─── SCROLL STACK INIT ─── */
  const stack = new ScrollStack('scrollStack', {
    itemDistance:      100,
    itemScale:         0.03,
    itemStackDistance: 30,
    stackPosition:     '20%',
    scaleEndPosition:  '10%',
    baseScale:         0.85,
    rotationAmount:    0,
    blurAmount:        0,
    onStackComplete: () => {
      console.log('Stack complete!');
    }
  });

  /* ─── CAROUSEL BUTTONS (cycle visible card) ─── */
  const scroller = document.getElementById('scrollStack');
  const cards    = scroller ? scroller.querySelectorAll('.scroll-stack-card') : [];
  let current    = 0;

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function scrollToCard(index) {
    if (!cards.length) return;
    const idx  = Math.max(0, Math.min(cards.length - 1, index));
    const card = cards[idx];
    scroller.scrollTo({
      top:      card.offsetTop - scroller.clientHeight * 0.2,
      behavior: 'smooth'
    });
    current = idx;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % cards.length;
      scrollToCard(current);
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + cards.length) % cards.length;
      scrollToCard(current);
    });
  }

  /* ─── INTERSECTION OBSERVER — fade-in sections ─── */
  const sections = document.querySelectorAll('.section, .cta-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(sec => {
    sec.style.opacity   = '0';
    sec.style.transform = 'translateY(28px)';
    sec.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(sec);
  });

  /* ─── CATEGORY CARD HOVER GLOW ─── */
  document.querySelectorAll('.cat-card, .talent-card, .protocol-step').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = ((e.clientX - rect.left) / rect.width)  * 100;
      const y     = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

});
