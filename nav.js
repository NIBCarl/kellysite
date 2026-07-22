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
  const heroImage = document.querySelector('.kinfolk-hero-mat img, .hero-image-main');
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
      const parallax = y * 0.06;
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
  // FULL SCREEN MENU OVERLAY & MOBILE MENU
  // ─────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger-btn');
  const fullScreenMenu = document.getElementById('fullScreenMenu');
  const closeBtn = document.getElementById('closeBtn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const menuClose = document.getElementById('menu-close');

  function openFullScreenMenu() {
    if (fullScreenMenu) {
      fullScreenMenu.classList.add('active');
      fullScreenMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else if (mobileMenu) {
      mobileMenu.classList.add('open');
      if (menuBackdrop) menuBackdrop.classList.add('open');
      if (hamburger) hamburger.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeFullScreenMenu() {
    if (fullScreenMenu) {
      fullScreenMenu.classList.remove('active');
      fullScreenMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      if (menuBackdrop) menuBackdrop.classList.remove('open');
      if (hamburger) hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (hamburger) hamburger.addEventListener('click', openFullScreenMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeFullScreenMenu);
  if (menuClose) menuClose.addEventListener('click', closeFullScreenMenu);
  if (menuBackdrop) menuBackdrop.addEventListener('click', closeFullScreenMenu);

  if (fullScreenMenu) {
    fullScreenMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeFullScreenMenu);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeFullScreenMenu();
  });

  // ─────────────────────────────────────────────
  // GSAP SCROLLTRIGGER: ANIMATION 1 — PINNED BACKGROUND REVEAL
  // ─────────────────────────────────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    const pinnedSections = document.querySelectorAll('.backgroundReveal');
    pinnedSections.forEach(function (sec) {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false
      });
    });
  }

  // ─────────────────────────────────────────────
  // SCROLL REVEAL (High-Performance Calm Reveal)
  // ─────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
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

  // ─────────────────────────────────────────────
  // PARKER PALM SPRINGS TOP TICKER SLIDER
  // ─────────────────────────────────────────────
  const tickerSlides = document.querySelectorAll('.ticker-slide');
  const prevBtn = document.getElementById('ticker-prev');
  const nextBtn = document.getElementById('ticker-next');
  let currentTickerIndex = 0;
  let tickerTimer = null;

  function showTickerSlide(index) {
    if (!tickerSlides.length) return;
    tickerSlides.forEach(function (slide, i) {
      slide.classList.remove('active', 'exit-up');
      if (i === currentTickerIndex) slide.classList.add('exit-up');
    });
    currentTickerIndex = (index + tickerSlides.length) % tickerSlides.length;
    tickerSlides[currentTickerIndex].classList.add('active');
  }

  function nextTickerSlide() {
    showTickerSlide(currentTickerIndex + 1);
  }

  function startTickerAutoPlay() {
    if (tickerTimer) clearInterval(tickerTimer);
    tickerTimer = setInterval(nextTickerSlide, 5000);
  }

  if (tickerSlides.length) {
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        showTickerSlide(currentTickerIndex - 1);
        startTickerAutoPlay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextTickerSlide();
        startTickerAutoPlay();
      });
    }
    startTickerAutoPlay();
  }

  // ─────────────────────────────────────────────
  // PARKER PALM SPRINGS CONCIERGE WIDGET
  // ─────────────────────────────────────────────
  const conciergeSelect = document.getElementById('concierge-select');
  const conciergeBtn = document.getElementById('concierge-btn');

  if (conciergeSelect && conciergeBtn) {
    conciergeSelect.addEventListener('change', function () {
      const selectedTarget = conciergeSelect.value;
      conciergeBtn.setAttribute('href', selectedTarget);
    });
  }
})();
