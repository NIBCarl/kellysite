/* =================================================================
   FEINIX HAUS — Shared nav + interaction script
   Loaded on every page. Handles:
   - Sticky header on scroll
   - Reading progress bar
   - Cinematic smooth scroll for in-page anchors
   - Mobile menu open/close
   - Scroll-reveal animations
   - FAQ accordions
   - Back-to-top
   - Newsletter + apply form confirmation states
   ================================================================= */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;

  // ─────────────────────────────────────────────
  // CINEMATIC SMOOTH SCROLL
  // ─────────────────────────────────────────────
  let smoothScrollAnim = null;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function smoothScrollTo(targetY, duration) {
    if (smoothScrollAnim) cancelAnimationFrame(smoothScrollAnim);
    const startY = window.scrollY;
    const distance = targetY - startY;
    const dur = Math.max(450, Math.min(duration != null ? duration : 1100, 1400));
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / dur, 1);
      window.scrollTo(0, startY + distance * easeOutCubic(t));
      if (t < 1) smoothScrollAnim = requestAnimationFrame(step);
      else smoothScrollAnim = null;
    }
    smoothScrollAnim = requestAnimationFrame(step);
  }

  function scrollToElement(target) {
    if (!target) return;
    const headerHeight = 80;
    const rect = target.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - headerHeight + 2;
    if (prefersReducedMotion || !supportsSmoothScroll) {
      window.scrollTo(0, targetY);
    } else {
      const distance = Math.abs(targetY - window.scrollY);
      const duration = Math.min(300 + distance * 0.25, 1300);
      smoothScrollTo(targetY, duration);
    }
  }

  // Intercept every in-page anchor (only same-page #links; not cross-page links)
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      scrollToElement(target);
    });
  });

  // ─────────────────────────────────────────────
  // RAF-THROTTLED SCROLL HANDLERS
  // ─────────────────────────────────────────────
  const header = document.getElementById('site-header');
  const progressBar = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const heroImage = document.querySelector('.hero-image-main');
  const scrollCue = document.querySelector('.scroll-cue');

  let scrollTicking = false;
  let lastScrollY = window.scrollY;

  function onScrollFrame() {
    const y = lastScrollY;
    if (header) {
      if (y > 60) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
    if (backToTop) {
      if (y > 500) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }
    if (heroImage && !prefersReducedMotion && y < window.innerHeight) {
      const parallax = y * 0.08;
      heroImage.style.transform = 'translate3d(0,' + parallax + 'px,0)';
    } else if (heroImage && !prefersReducedMotion) {
      heroImage.style.transform = '';
    }
    if (scrollCue) scrollCue.style.opacity = Math.max(0, 1 - y / 300);
    scrollTicking = false;
  }

  function requestScrollFrame() {
    lastScrollY = window.scrollY;
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScrollFrame);
    }
  }
  window.addEventListener('scroll', requestScrollFrame, { passive: true });
  onScrollFrame();

  // ─────────────────────────────────────────────
  // MOBILE MENU
  // ─────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const menuClose = document.getElementById('menu-close');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    menuBackdrop.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    menuBackdrop.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) closeMenu();
  });

  // ─────────────────────────────────────────────
  // SCROLL REVEAL
  // ─────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('visible'); });
  }

  // ─────────────────────────────────────────────
  // FAQ ACCORDION
  // ─────────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('open');
        const oa = other.querySelector('.faq-answer');
        if (oa) oa.style.maxHeight = null;
        const oq = other.querySelector('.faq-question');
        if (oq) oq.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ─────────────────────────────────────────────
  // BACK TO TOP
  // ─────────────────────────────────────────────
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      const hero = document.getElementById('hero') || document.getElementById('main');
      scrollToElement(hero);
    });
  }

  // ─────────────────────────────────────────────
  // NEWSLETTER FORM
  // ─────────────────────────────────────────────
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      const button = this.querySelector('button');
      const originalText = button.textContent;
      button.textContent = 'Thank you ✓';
      button.style.background = '#2b7a4b';
      input.value = '';
      setTimeout(function () {
        button.textContent = originalText;
        button.style.background = '';
      }, 2500);
    });
  }

  // ─────────────────────────────────────────────
  // APPLY FORM
  // ─────────────────────────────────────────────
  const applyForm = document.getElementById('apply-form');
  if (applyForm) {
    applyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const button = this.querySelector('button[type="submit"]');
      const originalHTML = button.innerHTML;
      button.innerHTML = 'Application received ✓';
      button.style.background = '#2b7a4b';
      button.style.borderColor = '#2b7a4b';
      this.querySelectorAll('input, textarea').forEach(function (f) { f.value = ''; });
      setTimeout(function () {
        button.innerHTML = originalHTML;
        button.style.background = '';
        button.style.borderColor = '';
      }, 3500);
    });
  }

  // ─────────────────────────────────────────────
  // TOPIC FILTER CHIPS (From the Margins page)
  // ─────────────────────────────────────────────
  const topicChips = document.querySelectorAll('.topic-chip');
  if (topicChips.length) {
    topicChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const topic = chip.getAttribute('data-topic');
        topicChips.forEach(function (c) { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        document.querySelectorAll('.archive-card').forEach(function (card) {
          const cardTopic = card.getAttribute('data-topic');
          if (topic === 'all' || cardTopic === topic) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
})();
