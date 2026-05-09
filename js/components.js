/* ─────────────────────────────────────────────
   Skillistan — Shared Components
   Injects navbar + footer into every page.
   Usage: <script src="js/components.js"></script>
          (place just before </body> on every page)
   ───────────────────────────────────────────── */

(function () {

  /* ── 1. DETECT ACTIVE PAGE ── */
  const path = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    const hFile = href.split('/').pop().split('#')[0] || 'index.html';
    return path === hFile || (path === '' && hFile === 'index.html');
  }

  /* ── 2. NAV HTML ── */
  const navHTML = `
<nav class="nav" id="navbar">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo">Skillistan</a>
    <ul class="nav-links">
      <li><a href="index.html"   class="nav-link">Home</a></li>
      <li><a href="courses.html" class="nav-link">Academy</a></li>
      <li><a href="skillistan-services.html" class="nav-link">Services</a></li>
      <li><a href="about.html"   class="nav-link">About Us</a></li>
    </ul>
    <div class="nav-right">
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
        <span class="theme-icon sun">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1"  x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1"  y1="12" x2="3"  y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
            <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
          </svg>
        </span>
        <span class="theme-icon moon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </span>
        <span class="toggle-knob"></span>
      </button>
      <a href="auth.html"       class="btn-ghost">Sign In</a>
      <a href="auth.html#hire"  class="btn-primary">Hire Talent</a>
    </div>
  </div>
</nav>`;

  /* ── 3. FOOTER HTML ── */
  const footerHTML = `
<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <a href="index.html" class="nav-logo">Skillistan</a>
      <span class="footer-copy">© 2025 Skillistan Nexus. Built for the future of work.</span>
    </div>
    <div class="footer-links">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Cookie Settings</a>
      <a href="courses.html">Academy</a>
    </div>
    <div class="footer-socials">
      <a href="#" class="social-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
        </svg>
      </a>
      <a href="#" class="social-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      </a>
      <a href="#" class="social-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      </a>
    </div>
  </div>
</footer>`;

  /* ── 4. INJECT NAV (prepend to <body>) ── */
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  /* ── 5. INJECT FOOTER (append to <body>) ── */
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  /* ── 6. MARK ACTIVE NAV LINK ── */
  document.querySelectorAll('.nav-link').forEach(link => {
    if (isActive(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });

  /* ── 7. THEME TOGGLE ── */
  const html   = document.documentElement;
  const toggle = document.getElementById('themeToggle');

  // Apply saved theme immediately (prevents flash)
  const saved = localStorage.getItem('skillistan-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('skillistan-theme', next);
  });

  /* ── 8. NAV SCROLL SHADOW ── */
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')
      .classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

})();