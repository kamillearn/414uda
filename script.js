/* ── MOBILE MENU ── */
(function () {
  const hamburger = document.getElementById('hamburger-btn');
  const closeBtn  = document.getElementById('close-menu-btn');
  const nav       = document.getElementById('mobile-nav');
  const overlay   = document.getElementById('mobile-overlay');

  function open() {
    nav.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function close() {
    nav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

/* ── MODALS ── */
function openModal(id) {
  const m = document.getElementById('modal-' + id);
  if (!m) return;
  m.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const m = document.getElementById('modal-' + id);
  if (!m) return;
  m.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(function (m) {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

/* ── FLOATING CTA ── */
(function () {
  const cta       = document.getElementById('cta-float');
  const closeBtn  = document.getElementById('cta-float-close');
  let dismissed   = false;

  closeBtn.addEventListener('click', function () {
    dismissed = true;
    cta.classList.remove('visible');
  });

  window.addEventListener('scroll', function () {
    if (dismissed) return;
    const hero    = document.getElementById('hero');
    const probe   = document.getElementById('probetraining');
    if (!hero || !probe) return;
    const y = window.scrollY;
    if (y > 500 && y < probe.offsetTop - 400) {
      cta.classList.add('visible');
    } else {
      cta.classList.remove('visible');
    }
  }, { passive: true });
})();

/* ── SCROLL REVEAL ── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();

/* ── GALLERY LIGHTBOX ── */
(function () {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev  = document.getElementById('lightbox-prev');
  const lbNext  = document.getElementById('lightbox-next');

  if (!lb) return;

  const items = Array.from(document.querySelectorAll('.gallery-item'));
  let current = 0;

  function show(idx) {
    current = (idx + items.length) % items.length;
    const src = items[current].querySelector('img').src;
    const alt = items[current].querySelector('img').alt;
    lbImg.src = src;
    lbImg.alt = alt;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function hide() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { show(i); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Bild vergrößern');
  });

  lbClose.addEventListener('click', hide);
  lbPrev.addEventListener('click', function () { show(current - 1); });
  lbNext.addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) hide(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

/* ── FAQ ACCORDION ── */
(function () {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── COOKIE / CONSENT BANNER ── */
(function () {
  const CONSENT_KEY = '414uda_consent';
  const banner = document.getElementById('cookie-banner');

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
  }
  function setConsent(accepted) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: accepted, ts: Date.now() }));
  }

  function applyConsent(accepted) {
    banner.classList.remove('show');
    if (accepted) {
      loadGoogleMaps();
    }
  }

  const consent = getConsent();
  if (consent === null) {
    banner.classList.add('show');
  } else {
    applyConsent(consent.accepted);
  }

  document.getElementById('cookie-accept').addEventListener('click', function () {
    setConsent(true);
    applyConsent(true);
  });
  document.getElementById('cookie-reject').addEventListener('click', function () {
    setConsent(false);
    applyConsent(false);
  });

  function loadGoogleMaps() {
    document.querySelectorAll('.map-consent-placeholder').forEach(function (ph) {
      ph.style.display = 'none';
    });
    document.querySelectorAll('.map-real-iframe').forEach(function (iframe) {
      iframe.classList.add('loaded');
    });
  }
})();

/* ── PROBETRAINING FORM ── */
(function () {
  const form    = document.getElementById('probetraining-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    /* honeypot check */
    if (form.querySelector('[name=_gotcha]').value) return;

    const data = new FormData(form);
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    });

    if (res.ok) {
      form.style.display = 'none';
      success.classList.add('active');
    } else {
      alert('Etwas ist schiefgelaufen. Bitte versuche es erneut oder schreib uns auf WhatsApp.');
    }
  });
})();

/* ── HERO PARALLAX (JS, iOS-safe) ── */
(function () {
  const heroBg = document.querySelector('#hero::before');
  /* We handle this purely in CSS with a pseudo-element – no JS needed.
     The pseudo-element with inset:-10% gives a subtle depth without
     background-attachment:fixed which breaks on iOS Safari. */
})();
