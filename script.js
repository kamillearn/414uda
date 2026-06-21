const GH_IMG = 'https://raw.githubusercontent.com/kamillearn/414uda/main/images/';

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
  const cta      = document.getElementById('cta-float');
  const closeBtn = document.getElementById('cta-float-close');
  let dismissed  = false;

  closeBtn.addEventListener('click', function () {
    dismissed = true;
    cta.classList.remove('visible');
  });

  window.addEventListener('scroll', function () {
    if (dismissed) return;
    const hero  = document.getElementById('hero');
    const probe = document.getElementById('probetraining');
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
    const img = items[current].querySelector('img');
    /* Use the full-res webp for lightbox (swap -thumb for full) */
    lbImg.src = img.dataset.full || img.src;
    lbImg.alt = img.alt;
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
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

/* ── FAQ ACCORDION ── */
(function () {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── PRICE ROW → SCROLL TO PROBETRAINING ── */
(function () {
  const probeSection = document.getElementById('probetraining');
  document.querySelectorAll('.price-row').forEach(function (row) {
    row.addEventListener('click', function () {
      if (probeSection) {
        probeSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    /* keyboard accessibility */
    row.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (probeSection) probeSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

/* ── COOKIE / CONSENT BANNER ── */
(function () {
  const CONSENT_KEY = '414uda_consent';
  const banner      = document.getElementById('cookie-banner');

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
  }
  function setConsent(accepted) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted, ts: Date.now() }));
  }
  function applyConsent(accepted) {
    banner.classList.remove('show');
    if (accepted) loadGoogleMaps();
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
    document.querySelectorAll('.map-consent-placeholder').forEach(ph => ph.style.display = 'none');
    document.querySelectorAll('.map-real-iframe').forEach(iframe => iframe.classList.add('loaded'));
  }
})();

/* ── PROBETRAINING FORM ── */
(function () {
  const form    = document.getElementById('probetraining-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (form.querySelector('[name=_gotcha]').value) return; /* honeypot */

    const data = new FormData(form);
    const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
    if (res.ok) {
      form.style.display = 'none';
      success.classList.add('active');
    } else {
      alert('Etwas ist schiefgelaufen. Bitte versuche es erneut oder schreib uns auf WhatsApp.');
    }
  });
})();

/* ── SWIPE HINT ANIMATION ── */
(function () {
  const isMobile = () => window.innerWidth <= 768;

  function attachSwipeHint(container) {
    if (!container) return;

    /* Add CSS scroll-hint class so the animation plays on load */
    container.classList.add('scroll-hint');

    let active = true;
    let loopTimer;

    function stop() {
      active = false;
      clearTimeout(loopTimer);
      /* Remove CSS hint class permanently once user interacts */
      container.classList.remove('scroll-hint');
      container.removeEventListener('touchstart',  stop);
      container.removeEventListener('scroll',      stop);
      container.removeEventListener('pointerdown', stop);
    }

    container.addEventListener('touchstart',  stop, { once: true, passive: true });
    container.addEventListener('scroll',      stop, { once: true, passive: true });
    container.addEventListener('pointerdown', stop, { once: true, passive: true });

    function peek() {
      if (!active || !isMobile()) return;
      const hasOverflow = container.scrollWidth > container.clientWidth + 4;
      if (!hasOverflow) { loopTimer = setTimeout(peek, 5000); return; }

      const peekPx = 48;
      const durMs  = 650;
      const start  = performance.now();

      function frame(now) {
        if (!active) return;
        const t = Math.min((now - start) / durMs, 1);
        container.scrollLeft = Math.sin(t * Math.PI) * peekPx;
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          container.scrollLeft = 0;
          if (active) loopTimer = setTimeout(peek, 5000);
        }
      }
      requestAnimationFrame(frame);
    }

    loopTimer = setTimeout(peek, 1800);
  }

  document.querySelectorAll('.swipe-container').forEach(attachSwipeHint);
  attachSwipeHint(document.querySelector('.video-swipe'));
})();

/* ── TAP-TO-SLIDE (center tapped card in swipe containers) ── */
(function () {
  document.querySelectorAll('.swipe-container').forEach(function (container) {
    container.querySelectorAll('.schedule-day').forEach(function (card) {
      card.addEventListener('click', function () {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });
  });

  const videoSwipe = document.querySelector('.video-swipe');
  if (videoSwipe) {
    videoSwipe.querySelectorAll('.video-card').forEach(function (card) {
      card.addEventListener('click', function () {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });
  }
})();

/* ── VIDEO GALLERY MODAL ── */
(function () {
  const modal    = document.getElementById('video-grid-modal');
  const openBtn  = document.getElementById('more-videos-btn');
  const closeBtn = modal && modal.querySelector('.close-grid-btn');

  if (!modal || !openBtn) return;

  function openVideoModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeVideoModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openVideoModal);
  closeBtn.addEventListener('click', closeVideoModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeVideoModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeVideoModal();
  });
})();
