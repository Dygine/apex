/* ==========================================================================
   APEX — animations.js
   Lenis smooth scroll + GSAP ScrollTrigger choreography.

   Every effect here is progressive enhancement. If GSAP or Lenis fail to load
   from their CDN, revealAll() runs and the site renders as a clean static
   page — nothing is ever left invisible or unreachable.
     01 Guards & fallback
     02 Lenis
     03 Reveals
     04 Hero
     05 Pinned image stack
     06 Sticky scroll story
     07 Horizontal rail
     08 Marquee
     09 Parallax
     10 Magnetic buttons
   ========================================================================== */

(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ────────────────────────────────────────────────────────────────────
     SCROLL FEEL — the two knobs worth touching.

     SMOOTH_SCROLL  false = native browser scrolling, the fastest possible
                    response. Scroll-triggered animation still works.
                    true  = Lenis eased scrolling (default).
     SCROLL_EASE    lower = snappier. 0.6 is quick, 1.2 is floaty.
     ──────────────────────────────────────────────────────────────────── */
  var SMOOTH_SCROLL = true;
  var SCROLL_EASE   = 0.75;

  var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 860px)').matches;


  /* 01 ─ GUARDS & FALLBACK ============================================== */
  function revealAll() {
    document.documentElement.classList.add('anim-off');
    $$('[data-anim]').forEach(function (el) { el.classList.add('is-revealed'); });
    $$('.line > span').forEach(function (s) { s.style.transform = 'none'; });
    $$('.img-reveal img').forEach(function (i) { i.style.transform = 'none'; });
    // The pinned sections rely on ScrollTrigger; show their content plainly
    $$('.stack-item').forEach(function (s) { s.style.opacity = 1; });
  }

  if (reduced || !window.gsap || !window.ScrollTrigger) {
    revealAll();
    return;
  }

  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  var ST = window.ScrollTrigger;
  ST.config({ limitCallbacks: true, ignoreMobileResize: true });


  /* 02 ─ LENIS ========================================================== */
  var lenis = null;
  if (SMOOTH_SCROLL && window.Lenis && !isMobile) {
    lenis = new window.Lenis({
      duration: SCROLL_EASE,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1.35,
      touchMultiplier: 1.8
    });
    window.__lenis = lenis;

    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // In-page anchors must go through Lenis or they fight each other
  $$('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    a.addEventListener('click', function (e) {
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });


  /* 03 ─ REVEALS ======================================================== */
  $$('[data-anim]').forEach(function (el) {
    var delay = parseFloat(el.getAttribute('data-delay')) || 0;
    gsap.to(el, {
      opacity: 1, y: 0, scale: 1, duration: 1, delay: delay, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onStart: function () { el.classList.add('is-revealed'); }
    });
  });

  // Headline lines rise out of their clipping mask
  $$('.lines').forEach(function (block) {
    var spans = $$('.line > span', block);
    if (!spans.length) return;
    gsap.set(spans, { yPercent: 108 });
    gsap.to(spans, {
      yPercent: 0, duration: 1.15, ease: 'power4.out', stagger: 0.09,
      scrollTrigger: { trigger: block, start: 'top 90%', once: true }
    });
  });

  // Images un-scale as they enter — a slow clip-style reveal
  $$('.img-reveal img').forEach(function (img) {
    gsap.to(img, {
      scale: 1, duration: 1.8, ease: 'power3.out',
      scrollTrigger: { trigger: img, start: 'top 92%', once: true }
    });
  });


  /* 04 ─ HERO =========================================================== */
  var hero = $('.hero');
  if (hero) {
    // Entrance: label, headline lines, supporting copy, actions, footer row
    var intro = gsap.timeline({ delay: 0.15 });
    var heroSpans = $$('.hero-title .line > span');

    gsap.set(heroSpans, { yPercent: 110 });

    intro
      .from('.hero-tag', { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out' })
      .to(heroSpans, { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.1 }, '-=0.55')
      .from('.hero-sub', { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out' }, '-=0.8')
      .from('.hero-actions .btn', { opacity: 0, y: 22, duration: 0.8, stagger: 0.09, ease: 'power3.out' }, '-=0.65')
      .from('.hero-foot', { opacity: 0, y: 26, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .from('.hero-card', {
        opacity: 0, y: 60, scale: 0.9, duration: 1.2, stagger: 0.12, ease: 'power3.out'
      }, '-=1.0');

    // Scroll-driven: background pushes in, content lifts and fades away
    gsap.to('.hero-bg', {
      scale: 1.18, yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.set(['.hero-in', '.hero-card'], { willChange: 'transform' });
    gsap.to('.hero-in', {
      yPercent: -14, opacity: 0.15, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    });

    // Each foreground card drifts at its own rate, which creates the depth
    var rates = [-150, -80, -220];
    $$('.hero-card').forEach(function (card, i) {
      gsap.to(card, {
        y: rates[i] || -120, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    });
  }


  /* 05 ─ PINNED IMAGE STACK ============================================= */
  /* Five images hand over to each other while the section is pinned.
     Each has its own entry vector so it reads as a composed sequence
     rather than a slideshow. Desktop only — mobile gets .stack-fallback. */
  var stack = $('.stack');
  if (stack && !isMobile) {
    var items = $$('.stack-item', stack);
    var counter = $('#stackNum');

    if (items.length) {
      // Opening state: first image centred, the rest staged off-screen
      gsap.set(items, { opacity: 0, scale: 0.86, xPercent: 0, yPercent: 0, rotate: 0 });
      gsap.set(items[0], { opacity: 1, scale: 1 });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: stack,
          start: 'top top',
          end: '+=' + (items.length * 36) + '%',
          pin: true,
          scrub: 0.25,
          anticipatePin: 1,
          onUpdate: function (self) {
            if (!counter) return;
            var n = Math.min(items.length, Math.floor(self.progress * items.length) + 1);
            counter.textContent = ('0' + n).slice(-2);
          }
        }
      });

      // 1 → 2: first slides left and shrinks, second arrives from the right
      tl.to(items[0], { xPercent: -62, scale: 0.72, opacity: 0.25, rotate: -3, duration: 1 })
        .fromTo(items[1], { xPercent: 90, opacity: 0, scale: 0.9 },
                          { xPercent: 6, opacity: 1, scale: 1, duration: 1 }, '<')

        // 2 → 3: third rises from behind the second
        .to(items[1], { xPercent: -34, yPercent: -6, scale: 0.8, opacity: 0.3, duration: 1 })
        .fromTo(items[2], { yPercent: 70, opacity: 0, scale: 0.82 },
                          { yPercent: 0, opacity: 1, scale: 1, duration: 1 }, '<')

        // 3 → 4: fourth scales up into the frame
        .to(items[2], { scale: 0.7, opacity: 0.22, xPercent: 40, duration: 1 })
        .fromTo(items[3], { scale: 0.55, opacity: 0, rotate: 3 },
                          { scale: 1, opacity: 1, rotate: 0, duration: 1 }, '<')

        // 4 → 5: fifth wipes across, fourth recedes
        .to(items[3], { xPercent: -70, opacity: 0.2, scale: 0.78, duration: 1 })
        .fromTo(items[4], { xPercent: 80, opacity: 0, scale: 0.92 },
                          { xPercent: 0, opacity: 1, scale: 1, duration: 1 }, '<')

        // Settle
        .to(items[4], { scale: 1.04, duration: 0.6 });

      // The heading drifts up over the whole sequence
      gsap.to('.stack-head', {
        yPercent: -40, opacity: 0.35, ease: 'none',
        scrollTrigger: { trigger: stack, start: 'top top', end: '+=' + (items.length * 36) + '%', scrub: true }
      });
    }
  }


  /* 06 ─ STICKY SCROLL STORY ============================================ */
  var story = $('.story');
  if (story) {
    var stSteps = $$('.story-step', story);
    var stImgs  = $$('.story-frame img', story);
    var stLabel = $('#storyLabel');

    stSteps.forEach(function (step, i) {
      ST.create({
        trigger: step,
        start: 'top 62%',
        end: 'bottom 62%',
        onToggle: function (self) {
          if (!self.isActive) return;
          stSteps.forEach(function (s, k) { s.classList.toggle('active', k === i); });
          stImgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
          if (stLabel) stLabel.textContent = step.getAttribute('data-label') || '';
        }
      });
    });

    if (stImgs.length) stImgs[0].classList.add('on');
    if (stSteps.length) stSteps[0].classList.add('active');
  }


  /* 07 ─ HORIZONTAL RAIL ================================================ */
  /* Vertical wheel movement drives horizontal travel while pinned. */
  var rail = $('.rail');
  if (rail && !isMobile) {
    var track = $('.rail-track', rail);
    var fill  = $('.rail-prog i', rail);

    if (track) {
      // Measure the real gap rather than parsing the --pad clamp() string,
      // which getPropertyValue returns unresolved (parseInt gave NaN).
      var distance = function () {
        return Math.max(0, track.scrollWidth - track.parentElement.clientWidth + 40);
      };

      gsap.to(track, {
        x: function () { return -distance(); },
        ease: 'none',
        scrollTrigger: {
          trigger: rail,
          start: 'top top',
          end: function () { return '+=' + distance(); },
          pin: true,
          scrub: 0.3,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: function (self) {
            if (fill) fill.style.width = (self.progress * 100).toFixed(1) + '%';
          }
        }
      });
    }
  }


  /* 08 ─ MARQUEE ======================================================== */
  /* Two rows travelling in opposite directions. Each row's markup is
     duplicated in the HTML, so animating to -50% loops seamlessly. */
  var marqTweens = [];
  $$('.marq-row').forEach(function (row, i) {
    var dir = row.getAttribute('data-dir') === 'right' ? 1 : -1;
    marqTweens.push(gsap.fromTo(row,
      { xPercent: dir === -1 ? 0 : -50 },
      { xPercent: dir === -1 ? -50 : 0, duration: 40 + i * 7, ease: 'none', repeat: -1 }
    ));
  });

  // Only run the marquee while it is on screen — two infinite tweens burning
  // frames behind 20,000px of page is wasted work.
  var marq = $('.marq');
  if (marq && marqTweens.length) {
    ST.create({
      trigger: marq, start: 'top bottom', end: 'bottom top',
      onToggle: function (self) {
        marqTweens.forEach(function (t) { self.isActive ? t.play() : t.pause(); });
      }
    });
    marqTweens.forEach(function (t) { t.pause(); });
  }

  // Same for the hero's ambient light, which is a large animated gradient
  if (hero) {
    ST.create({
      trigger: hero, start: 'top bottom', end: 'bottom top',
      onToggle: function (self) {
        var g = $('.hero-light');
        if (g) g.style.animationPlayState = self.isActive ? 'running' : 'paused';
      }
    });
  }


  /* 09 ─ PARALLAX ======================================================= */
  $$('[data-parallax]').forEach(function (el) {
    var amount = parseFloat(el.getAttribute('data-parallax')) || 12;
    gsap.to(el, {
      yPercent: -amount, ease: 'none',
      scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });


  /* 10 ─ MAGNETIC BUTTONS =============================================== */
  if (!isMobile && !window.matchMedia('(hover: none)').matches) {
    $$('[data-magnetic]').forEach(function (el) {
      var strength = 0.32;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * strength,
          y: (e.clientY - r.top - r.height / 2) * strength,
          duration: 0.5, ease: 'power3.out'
        });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' });
      });
    });
  }


  /* Recalculate after fonts and images settle, or pins land in the wrong place */
  window.addEventListener('load', function () { ST.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ST.refresh(); });
  }

})();
