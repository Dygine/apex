/* ==========================================================================
   APEX INTEGRATED FACILITY MANAGEMENT — demo interactions
   --------------------------------------------------------------------------
   Plain ES5+/vanilla JavaScript. No libraries, no build step, no backend.
   Contents:
     1. Sticky navbar + scroll progress
     2. Mobile menu
     3. Scroll spy (active nav link)
     4. Scroll reveal
     5. Counter animation
     6. Process timeline draw
     7. Integrated hub node cycle
     8. Enquiry form (demo only)
     9. Back to top
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };


  /* ======================================================================
     1. STICKY NAVBAR + SCROLL PROGRESS
     Adds .is-stuck past 40px, which compacts the bar and switches it to
     the light theme. Also drives the hairline progress bar.
     ====================================================================== */
  var nav       = $('#nav');
  var progress  = $('#navProgress');
  var toTop     = $('#toTop');
  var ticking   = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    nav.classList.toggle('is-stuck', y > 40);

    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

    toTop.hidden = y < 600;

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();


  /* ======================================================================
     2. MOBILE MENU
     ====================================================================== */
  var toggle = $('#navToggle');
  var links  = $('#navLinks');
  var scrim  = $('#navScrim');

  function setMenu(open) {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    scrim.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  scrim.addEventListener('click', function () { setMenu(false); });

  // Close after choosing a destination
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Reset the menu if the viewport grows back to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 980 && links.classList.contains('is-open')) setMenu(false);
  });


  /* ======================================================================
     3. SCROLL SPY — highlights the section currently in view
     ====================================================================== */
  var navLinks = $$('.nav-link');
  var sections = navLinks
    .map(function (l) { return $(l.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle('is-current', l.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }


  /* ======================================================================
     4. SCROLL REVEAL — one calm fade-up, used everywhere
     ====================================================================== */
  var revealables = $$('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { revealer.observe(el); });
  }


  /* ======================================================================
     5. COUNTER ANIMATION — runs once when the stats strip enters view
     ====================================================================== */
  function countUp(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10) || 0;
    var duration = 1600;
    var start    = null;

    function step(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);           // ease-out cubic
      el.textContent = Math.round(target * eased);
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var counters = $$('.counter');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-target'); });
  } else {
    var countObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { countObs.observe(el); });
  }


  /* ======================================================================
     6. PROCESS TIMELINE — draws the rail and lights each dot in sequence
     ====================================================================== */
  var proc = $('#proc');
  if (proc && 'IntersectionObserver' in window) {
    var procObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        proc.classList.add('is-drawn');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.25 });
    procObs.observe(proc);
  } else if (proc) {
    proc.classList.add('is-drawn');
  }


  /* ======================================================================
     7. INTEGRATED HUB — cycles the active service node
     Pauses on hover/focus so the visitor can read it, and stops entirely
     when reduced motion is requested.
     ====================================================================== */
  var ring = $('#hubRing');
  if (ring) {
    var nodes   = $$('.hub-node', ring);
    var readout = $('#hubReadout');
    var index   = 0;
    var timer   = null;
    var paused  = false;

    function activate(i) {
      index = i;
      nodes.forEach(function (n, k) { n.classList.toggle('is-active', k === i); });
      if (readout) readout.textContent = nodes[i].getAttribute('data-service');
    }

    function start() {
      if (reduceMotion || timer) return;
      timer = window.setInterval(function () {
        if (!paused) activate((index + 1) % nodes.length);
      }, 2000);
    }

    nodes.forEach(function (n, i) {
      n.addEventListener('mouseenter', function () { paused = true; activate(i); });
      n.addEventListener('mouseleave', function () { paused = false; });
      n.addEventListener('focus',      function () { paused = true; activate(i); });
      n.addEventListener('blur',       function () { paused = false; });
      n.addEventListener('click',      function () { activate(i); });
    });

    // Only run the cycle while the section is on screen
    if ('IntersectionObserver' in window) {
      var ringObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            start();
          } else if (timer) {
            window.clearInterval(timer);
            timer = null;
          }
        });
      }, { threshold: 0.2 });
      ringObs.observe(ring);
    } else {
      start();
    }
  }


  /* ======================================================================
     8. ENQUIRY FORM — demo only
     Validates in the browser and shows a confirmation message.
     Nothing is sent anywhere and nothing is stored.
     ====================================================================== */
  var form  = $('#enquiryForm');
  var done  = $('#formDone');
  var reset = $('#formReset');

  function fieldOf(input) { return input.closest('.field'); }

  function showError(input, message) {
    var field = fieldOf(input);
    if (!field) return;
    field.classList.add('has-error');
    var err = $('[data-err]', field);
    if (err) err.textContent = message;
  }

  function clearError(input) {
    var field = fieldOf(input);
    if (field) field.classList.remove('has-error');
  }

  function validate() {
    var ok = true;

    var name = $('#f-name');
    if (name.value.trim().length < 2) { showError(name, 'Enter your name.'); ok = false; }
    else clearError(name);

    var phone  = $('#f-phone');
    var digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10) { showError(phone, 'Enter a valid phone number.'); ok = false; }
    else clearError(phone);

    var email = $('#f-email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      showError(email, 'Enter a valid email address.'); ok = false;
    } else clearError(email);

    var service = $('#f-service');
    if (!service.value) { showError(service, 'Choose the service you need.'); ok = false; }
    else clearError(service);

    return ok;
  }

  if (form) {
    // Clear an error as soon as the visitor starts fixing it
    $$('input, select, textarea', form).forEach(function (input) {
      input.addEventListener('input',  function () { clearError(input); });
      input.addEventListener('change', function () { clearError(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validate()) {
        var firstBad = $('.has-error input, .has-error select, .has-error textarea', form);
        if (firstBad) firstBad.focus();
        return;
      }

      // Demo behaviour: swap the form for a confirmation panel
      form.hidden = true;
      done.hidden = false;
      done.setAttribute('tabindex', '-1');
      done.focus();
    });
  }

  if (reset) {
    reset.addEventListener('click', function () {
      form.reset();
      $$('.field', form).forEach(function (f) { f.classList.remove('has-error'); });
      done.hidden = true;
      form.hidden = false;
      $('#f-name').focus();
    });
  }


  /* ======================================================================
     9. BACK TO TOP
     ====================================================================== */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

})();
