/* ==========================================================================
   APEX — hero.js
   Two things, both home-page only:

     01 The rotating hero
     02 Letter-by-letter type

   No dependencies. If either throws, the hero still shows a photograph and
   readable text — every effect here is an enhancement over markup that is
   already complete.
   ========================================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 01 ROTATING HERO ──────────────────────────────────────────────────
     Cross-fade, not slide. A slide puts a hard vertical seam down the middle
     of the screen with a different photograph either side of it, which reads
     as a glitch rather than a transition. Fading, one photograph simply
     becomes the next.

     Underneath the fade each photograph pushes in slowly. The push runs
     longer than the slide is held, so it never finishes and freezes — the
     picture is still moving when it hands over. */
  /* One photograph per service line, so the rotation says something rather
     than just moving. staff-team.jpg is deliberately not here — it is a
     six-panel contact sheet, which reads as a broken grid at full bleed. */
  var SLIDES = [
    { src: 'assets/images/staff/staff-supervisor.jpg',         pos: 'center 40%' },
    { src: 'assets/images/staff/staff-security-team.jpg',      pos: 'center 42%' },
    { src: 'assets/images/staff/staff-technical-team.jpg',     pos: 'center 44%' },
    { src: 'assets/images/staff/staff-housekeeping-lobby.jpg', pos: 'center 46%' },
    { src: 'assets/images/staff/staff-landscape-team.jpg',     pos: 'center 48%' }
  ];

  var HOLD = 6000;   /* ms each photograph is held */

  function heroSlider() {
    var stage = document.querySelector('[data-hero-slides]');
    if (!stage) return;

    var dotWrap = document.querySelector('[data-hero-dots]');
    var slides  = [];
    var dots    = [];
    var i       = 0;
    var timer   = null;

    /* Slide 0 is already in the HTML so it can start downloading immediately.
       Adopt it rather than replacing it — replacing would throw away a
       request the browser has already made. */
    var first = stage.querySelector('.hslide');
    if (first) {
      slides.push(first);
      var fimg = first.querySelector('img');
      if (fimg) fimg.style.objectPosition = SLIDES[0].pos;
    }

    for (var n = 1; n < SLIDES.length; n++) {
      var d = document.createElement('div');
      d.className = 'hslide';
      var im = document.createElement('img');
      im.src = SLIDES[n].src;
      im.alt = '';
      im.loading = 'lazy';
      im.decoding = 'async';
      im.style.objectPosition = SLIDES[n].pos;
      d.appendChild(im);
      stage.appendChild(d);
      slides.push(d);
    }

    if (slides.length < 2) return;
    stage.setAttribute('data-ready', '1');

    /* Dots double as the control for anyone who wants to stop waiting. */
    if (dotWrap) {
      slides.forEach(function (s, k) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'hero-dot' + (k === 0 ? ' on' : '');
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Image ' + (k + 1) + ' of ' + slides.length);
        b.setAttribute('aria-selected', k === 0 ? 'true' : 'false');
        b.addEventListener('click', function () { go(k); restart(); });
        dotWrap.appendChild(b);
        dots.push(b);
      });
    }

    function go(next) {
      if (next === i) return;
      slides[i].classList.remove('is-active');
      slides[i].classList.add('is-leaving');
      slides[next].classList.remove('is-leaving');
      slides[next].classList.add('is-active');
      dots.forEach(function (d, k) {
        d.classList.toggle('on', k === next);
        d.setAttribute('aria-selected', k === next ? 'true' : 'false');
      });
      i = next;
    }

    function tick() { go((i + 1) % slides.length); }
    function start()   { timer = window.setInterval(tick, HOLD); }
    function stop()    { window.clearInterval(timer); }
    function restart() { stop(); start(); }

    /* Nothing should animate in a tab nobody is looking at. */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else restart();
    });

    if (!reduced) start();
  }


  /* ── 02 LETTER-BY-LETTER TYPE ──────────────────────────────────────────
     Each character becomes its own span and arrives on its own delay.

     Accessibility: the split spans are marked aria-hidden and the original
     string is put back on the element as aria-label, so a screen reader hears
     one sentence rather than twenty-three separate letters. Without that this
     effect is actively hostile to anyone not reading with their eyes.

     Spaces get a span too, with a fixed width, so a line can still break
     normally — wrapping the words in a nowrap container would push the
     headline off a phone screen. */
  function splitLetters(el) {
    if (el.getAttribute('data-split') === '1') return;

    var text  = el.textContent.replace(/\s+/g, ' ').trim();
    var step  = parseFloat(el.getAttribute('data-letter-step')) || 40;
    var after = parseFloat(el.getAttribute('data-letter-after')) || 0;

    /* Walk the original nodes so inline markup — the <b> around the second
       headline line — survives the split and can still be coloured. */
    var out = document.createDocumentFragment();
    var idx = 0;

    /* Letters are grouped into word spans. An inline-block per character
       gives the browser a legal break point between every pair of letters,
       which is why the first build wrapped "sheet." as "s / heet." — the
       word span is nowrap, and the plain space between words is the only
       place a line is allowed to break. */
    function walk(node, target) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {

        if (child.nodeType === 3) {
          var parts = child.nodeValue.split(/(\s+)/);
          parts.forEach(function (part) {
            if (part === '') return;
            if (/^\s+$/.test(part)) {
              /* A real space between two inline-blocks: the break point. */
              target.appendChild(document.createTextNode(' '));
              idx++;
              return;
            }
            var word = document.createElement('span');
            word.className = 'wrd';
            part.split('').forEach(function (ch) {
              var s = document.createElement('span');
              s.className = 'ltr';
              s.textContent = ch;
              s.style.transitionDelay = (after + idx * step / 1000) + 's';
              idx++;
              word.appendChild(s);
            });
            target.appendChild(word);
          });
          return;
        }

        if (child.nodeType === 1) {
          var clone = child.cloneNode(false);
          walk(child, clone);
          target.appendChild(clone);
        }
      });
    }

    walk(el, out);

    el.setAttribute('aria-label', text);
    el.textContent = '';
    el.appendChild(out);
    el.setAttribute('data-split', '1');
    el.classList.add('is-split');

    /* One aria-hidden on the parent would hide the label too, so it goes on
       each generated span instead. */
    Array.prototype.slice.call(el.querySelectorAll('.ltr')).forEach(function (s) {
      s.setAttribute('aria-hidden', 'true');
    });
  }

  function runLetters() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-letters]'));
    if (!els.length) return;

    if (reduced) {
      els.forEach(function (el) { el.classList.add('is-split', 'is-in'); });
      return;
    }

    els.forEach(splitLetters);

    /* One frame for the browser to apply the start state before the class
       that transitions away from it. Without this the letters are simply
       there and nothing animates. */
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        els.forEach(function (el) { el.classList.add('is-in'); });
      });
    });
  }


  function boot() {
    try { heroSlider(); } catch (e) { /* the first photograph still shows */ }
    try { runLetters(); } catch (e) {
      /* If the split fails the text must not stay invisible. */
      Array.prototype.slice.call(document.querySelectorAll('[data-letters]'))
        .forEach(function (el) { el.classList.add('is-split', 'is-in'); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
