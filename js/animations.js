/* ==========================================================================
   APEX — animations.js
   Scroll reveal. One IntersectionObserver, no libraries.

   What changed in this version, and why:

   1. SLOWER, LIGHTER.  Durations moved from .6–.7s to ~.95s and the travel
      distance dropped from 22px to 16px, so the movement reads as a settle
      rather than a jump. The durations themselves live in CSS (section 05 of
      style.css), not in here.

   2. IT REPLAYS BOTH WAYS.  The old build called io.unobserve() the first
      time an element appeared, so scrolling back up gave you a static page.
      Now an element resets once it has fully left the viewport, and it
      remembers which edge it left by — so it always enters from the side you
      are scrolling from. Up from below, down from above.

   3. NO BURST AT THE END OF THE PAGE.  Flicking to the bottom used to fire
      every remaining section at once. Two guards fix it: reveals are released
      through a small queue (REL_GAP apart), and when the scroll is moving
      quickly the per-item delay is dropped so nothing queues behind anything.

     01 Guards
     02 Which elements reveal
     03 Scroll velocity
     04 Release queue
     05 The observer
     06 Re-run after JSON renders
   ========================================================================== */

(function () {
  'use strict';

  var $$ = function (s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  };

  /* Tuning. Timings in milliseconds. */
  var REL_GAP   = 55;    /* minimum spacing between two reveals */
  var FAST_V    = 1.7;   /* px per ms — above this the scroll counts as fast */
  var RESET_PAD = 80;    /* px past the viewport edge before an element resets */

  /* 01 ─ GUARDS =========================================================== */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    document.documentElement.classList.add('anim-off');
  }

  if (reduced || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  /* 02 ─ WHICH ELEMENTS REVEAL ===========================================
     Anything already marked with data-anim, plus the containers listed here.
     Adding a section to a page is enough — it reveals without anyone having
     to remember the attribute. */
  var AUTO = [
    '.sec-head', '.edit-title',
    '.svc-card', '.day-item', '.work-card', '.stm-item',
    '.ppl-card', '.story-card', '.tst-card', '.vcard', '.cmp-cell',
    '.proc-step', '.sstory-step', '.sstory-media figure',
    '.detail-item', '.sdet', '.indc', '.wk',
    '.edit-media', '.edit-copy', '.safe-media', '.safe-list',
    '.inds-list', '.inds-preview', '.fmap-stage', '.fmap-copy',
    '.uni-stage', '.uni-detail', '.faq-list', '.hero-stats',
    '.cta-shot', '.form', '.ctc-side', '.map-holder', '.phero-meta'
  ].join(',');

  function mark(root) {
    $$(AUTO, root).forEach(function (el) {
      if (!el.hasAttribute('data-anim')) el.setAttribute('data-anim', 'up');
    });
    $$('.day-grid, .work-grid, .stm-list, .svc-wrap, .cmp-grid, .stories-grid', root)
      .forEach(function (el) {
        if (!el.hasAttribute('data-stagger')) el.setAttribute('data-stagger', '');
      });
  }

  /* 03 ─ SCROLL VELOCITY ==================================================
     Sampled on scroll. Used for one decision only: whether to honour the
     per-element delay or drop it. During a fast flick those delays stack into
     a visible cascade, which is the effect being fixed here. */
  var lastY = window.pageYOffset || 0;
  var lastT = Date.now();
  var vel   = 0;

  window.addEventListener('scroll', function () {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var t = Date.now();
    var dt = t - lastT;
    if (dt > 0) {
      vel   = Math.abs(y - lastY) / dt;
      lastY = y;
      lastT = t;
    }
  }, { passive: true });

  /* Velocity decays when the scroll stops, so a pause restores full stagger. */
  window.setInterval(function () {
    if (Date.now() - lastT > 140) vel = 0;
  }, 140);

  /* 04 ─ RELEASE QUEUE ====================================================
     Reveals are spaced at least REL_GAP apart. Ten sections arriving in one
     frame become ten reveals over half a second instead of a single flash. */
  var queue   = [];
  var pumping = false;

  function pump() {
    if (!queue.length) { pumping = false; return; }
    pumping = true;
    var el = queue.shift();
    if (el && el.isConnected && !el.classList.contains('is-revealed')) {
      var delay = parseFloat(el.getAttribute('data-delay')) || 0;
      var fast  = vel > FAST_V;
      el.style.transitionDelay = (fast ? 0 : delay) + 's';
      if (fast) el.setAttribute('data-quick', '1');
      else      el.removeAttribute('data-quick');
      el.classList.add('is-revealed');
    }
    window.setTimeout(pump, REL_GAP);
  }

  function release(el) {
    queue.push(el);
    if (!pumping) pump();
  }

  /* 05 ─ THE OBSERVER =====================================================
     Enter → reveal (queued).
     Leave → reset, but only once the element is properly clear of the
             viewport, recording which edge it left by so it re-enters from
             the correct direction next time. */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var el = e.target;

      if (e.isIntersecting) {
        if (el.classList.contains('is-revealed')) return;
        release(el);
        return;
      }

      if (!el.classList.contains('is-revealed')) return;

      /* Measure live rather than trusting e.boundingClientRect.
         On an instant jump — an anchor click, the End key, landing on a
         #hash — the observer delivers a batch whose rects describe where the
         element was before the jump. Acting on those strips is-revealed off
         elements that are, by the time the callback runs, on screen. That is
         what left the closing section blank after a jump to the foot of the
         page. The live rect is always current. */
      var r = el.getBoundingClientRect();
      var below = r.top    >  window.innerHeight + RESET_PAD;
      var above = r.bottom < -RESET_PAD;
      if (!below && !above) return;

      /* Below the fold → rises on return. Above it → drops in. */
      el.setAttribute('data-from', below ? 'below' : 'above');
      el.style.transitionDelay = '0s';
      el.classList.remove('is-revealed');

      var i = queue.indexOf(el);
      if (i > -1) queue.splice(i, 1);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

  function observe(root) {
    $$('[data-anim], [data-stagger], .lines, .img-reveal', root).forEach(function (el) {
      if (el.getAttribute('data-observed') === '1') return;
      el.setAttribute('data-observed', '1');
      io.observe(el);
    });
  }

  /* Anything already on screen at load reveals immediately, so the hero does
     not wait for a scroll event that may never arrive. */
  function primeAboveFold(root) {
    $$('[data-anim], [data-stagger], .lines', root).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) {
        window.setTimeout(function () { el.classList.add('is-revealed'); }, 80);
      }
    });
  }

  function run(root) {
    mark(root || document);
    observe(root || document);
  }

  /* SAFETY SWEEP =========================================================
     Whatever the observer does, one rule must hold: nothing that is on
     screen and has stopped moving may stay invisible. A jump to an anchor, a
     resize, a bfcache restore, an image finishing late and reflowing the page
     — any of these can land content in view without an intersection event
     that reveals it. This runs 180ms after the scroll settles and reveals
     anything visible that the observer missed. It is a backstop, not the
     mechanism: in normal scrolling it finds nothing to do. */
  var sweepTmr = null;

  function sweep() {
    var vh = window.innerHeight;
    $$('[data-anim], [data-stagger], .lines, .img-reveal').forEach(function (el) {
      if (el.classList.contains('is-revealed')) return;
      var r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        el.style.transitionDelay = '0s';
        el.classList.add('is-revealed');
      }
    });
  }

  function scheduleSweep() {
    window.clearTimeout(sweepTmr);
    sweepTmr = window.setTimeout(sweep, 180);
  }

  window.addEventListener('scroll', scheduleSweep, { passive: true });
  window.addEventListener('resize', scheduleSweep);
  window.addEventListener('load', scheduleSweep);
  window.addEventListener('pageshow', scheduleSweep);

  function boot() {
    try {
      run(document);
      primeAboveFold(document);
    } catch (err) {
      revealAll();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* 06 ─ RE-RUN AFTER JSON RENDERS ========================================
     render.js fires this once services, industries, people, the uniform, the
     FAQ and the work gallery have been written in. Those nodes did not exist
     when the observer was first set up. */
  document.addEventListener('apex:rendered', function () {
    try { run(document); } catch (err) { revealAll(); }
  });

})();
