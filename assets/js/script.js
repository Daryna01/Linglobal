/* ===================================================
   Linglobal — script.js
   Platí pre index.html, o-nas.html, kontakt.html
=================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const body          = document.body;
  const navbar        = document.querySelector('.navbar-oceana');
  const darkModeBtn   = document.getElementById('darkModeToggle');
  const navbarCollapse = document.getElementById('navbarNav');
  const statNumbers   = document.querySelectorAll('[data-target]');


  /* ─── Modálne okná ─── */
  document.querySelectorAll('.btn-dalej').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modal);
      if (!modal) return;
      modal.classList.add('is-open');
      body.style.overflow = 'hidden';
      modal.querySelector('.modal-close')?.focus();
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    document.querySelectorAll('.modal-overlay.is-open').forEach(m => {
      m.classList.remove('is-open');
    });
    body.style.overflow = '';
  }


  /* ─── Dark Mode ─── */
  const setThemeIcon = () => {
    if (!darkModeBtn) return;
    const isDark = body.classList.contains('dark-mode');
    darkModeBtn.textContent = isDark ? '☀️' : '🌙';
    darkModeBtn.setAttribute('title', isDark ? 'Svetlý režim' : 'Tmavý režim');
    darkModeBtn.setAttribute('aria-label', isDark ? 'Prepnúť na svetlý režim' : 'Prepnúť na tmavý režim');
  };

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
  }
  setThemeIcon();

  darkModeBtn?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    setThemeIcon();
  });


  /* ─── Navbar scroll ─── */
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ─── Aktívny nav link + zatvorenie hamburgera ─── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navbar-oceana .nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').replace('./', '');
    if (href === currentPage) link.classList.add('active');
    link.addEventListener('click', () => {
      if (!navbarCollapse || !window.bootstrap) return;
      window.bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
    });
  });


  /* ─── Smooth scroll ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = (navbar?.offsetHeight ?? 70) + 16;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });


  /* ─── Animácia štatistík (count-up) ─── */
  const animateCounter = (el) => {
    const target   = Number(el.dataset.target || 0);
    const suffix   = el.dataset.suffix || '';
    const duration = 1600;
    const start    = performance.now();

    const update = (now) => {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.floor(target * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  if (statNumbers.length) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    statNumbers.forEach(el => obs.observe(el));
  }


  /* ─── Kontaktný formulár ─── */
  const contactForm = document.getElementById('contactForm');
  const toast       = document.getElementById('toastOceana');
  const toastClose  = document.getElementById('toastClose');

  const hideToast = () => toast?.classList.remove('show-toast');

  const showToast = () => {
    if (!toast) return;
    toast.classList.add('show-toast');
    const timer = setTimeout(hideToast, 5000);
    toastClose?.addEventListener('click', () => { clearTimeout(timer); hideToast(); }, { once: true });
  };

  contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.classList.add('was-validated');
    // Zobraz invalid-hint pre všetky neplatné polia
    contactForm.querySelectorAll(':invalid').forEach(field => {
      const hint = field.parentElement.querySelector('.invalid-hint');
      if (hint) hint.style.display = 'block';
    });
    return;
  }
  showToast();
  setTimeout(() => {
    contactForm.reset();
    contactForm.classList.remove('was-validated');
    contactForm.querySelectorAll('.invalid-hint').forEach(h => h.style.display = 'none');
  }, 400);
});


  /* ─── Podmienené pole pre firmy ─── */
  const courseTypeSelect = document.getElementById('courseType');
  const companyField     = document.getElementById('companyField');

  courseTypeSelect?.addEventListener('change', () => {
    const isCompany = courseTypeSelect.value === 'firemny';
    companyField.style.display = isCompany ? 'grid' : 'none';
    const input = companyField.querySelector('input');
    if (input) input.required = isCompany;
  });

});