/* ==========================================================================
   APEX — main.js
   Interaction layer. No dependencies; runs whether or not GSAP loads.
     01 Helpers
     02 Navigation + scroll progress
     03 Mobile panel
     04 Custom cursor
     05 Industries hover preview
     06 Facility map nodes
     07 Process accordion
     08 Counters
     09 Operations bars
     10 Enquiry form
     11 Footer year
   ========================================================================== */

(function () {
  'use strict';

  /* 01 ─ HELPERS ========================================================= */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch   = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  document.documentElement.classList.remove('no-js');


  /* 02 ─ NAVIGATION ====================================================== */
  var nav      = $('#nav');
  var progress = $('#progress');
  var lastY    = 0;
  var ticking  = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (nav) {
      nav.classList.toggle('stuck', y > 30);
      // Hide on downward scroll once well past the hero, show on upward
      if (y > 600 && y > lastY + 4) nav.classList.add('hide');
      else if (y < lastY - 4 || y < 200) nav.classList.remove('hide');
    }

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();


  /* 03 ─ MOBILE PANEL ==================================================== */
  var burger = $('#burger');
  var panel  = $('#panel');

  function setPanel(open) {
    if (!panel || !burger) return;
    panel.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);
    // Lenis must stop while the panel is open or the page scrolls behind it
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setPanel(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  $$('#panel a').forEach(function (a) {
    a.addEventListener('click', function () { setPanel(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel && panel.classList.contains('open')) {
      setPanel(false);
      if (burger) burger.focus();
    }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860 && panel && panel.classList.contains('open')) setPanel(false);
  });


  /* 04 ─ CUSTOM CURSOR =================================================== */
  /* Desktop pointers only. Never on touch, never with reduced motion. */
  if (!touch && !reduced && window.innerWidth > 860) {
    var cur = $('#cursor');
    if (cur) {
      var label = $('.cursor-label', cur);
      var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      var tx = cx, ty = cy, shown = false;

      window.addEventListener('mousemove', function (e) {
        tx = e.clientX; ty = e.clientY;
        if (!shown) { cur.classList.add('on'); shown = true; }
      }, { passive: true });

      (function loop() {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        cur.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
        window.requestAnimationFrame(loop);
      })();

      // data-cursor="VIEW" enlarges the dot and prints a word inside it
      $$('[data-cursor]').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          cur.classList.add('is-big');
          if (label) label.textContent = el.getAttribute('data-cursor');
        });
        el.addEventListener('mouseleave', function () {
          cur.classList.remove('is-big');
          if (label) label.textContent = '';
        });
      });

      $$('a, button, .inds-row, .fmap-node, .proc-step').forEach(function (el) {
        if (el.hasAttribute('data-cursor')) return;
        el.addEventListener('mouseenter', function () { cur.classList.add('is-ring'); });
        el.addEventListener('mouseleave', function () { cur.classList.remove('is-ring'); });
      });

      document.addEventListener('mouseleave', function () { cur.classList.remove('on'); shown = false; });
    }
  }


  /* 05 ─ INDUSTRIES HOVER PREVIEW ======================================== */
  var indRows = $$('.inds-row');
  var indImgs = $$('.inds-preview img');
  var indName = $('#indName');
  var indKind = $('#indKind');

  function showIndustry(i) {
    indRows.forEach(function (r, k) { r.classList.toggle('on', k === i); });
    indImgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
    if (indName) indName.textContent = indRows[i].getAttribute('data-name') || '';
    if (indKind) indKind.textContent = indRows[i].getAttribute('data-kind') || '';
  }

  indRows.forEach(function (row, i) {
    row.addEventListener('mouseenter', function () { showIndustry(i); });
    row.addEventListener('focus', function () { showIndustry(i); });
    row.addEventListener('click', function () { showIndustry(i); });
  });
  if (indRows.length) showIndustry(0);


  /* 06 ─ FACILITY MAP ==================================================== */
  var nodes    = $$('.fmap-node');
  var wires    = $$('.fmap-svg .wire');
  var infoName = $('#fmName');
  var infoText = $('#fmText');
  var infoTags = $('#fmTags');
  var infoIdx  = $('#fmIdx');

  function showNode(i) {
    nodes.forEach(function (n, k) { n.classList.toggle('on', k === i); });
    wires.forEach(function (w, k) { w.classList.toggle('lit', k === i); });

    var n = nodes[i];
    if (infoName) infoName.textContent = n.getAttribute('data-name') || '';
    if (infoText) infoText.textContent = n.getAttribute('data-desc') || '';
    if (infoIdx)  infoIdx.textContent  = n.getAttribute('data-idx') || '';
    if (infoTags) {
      infoTags.innerHTML = '';
      (n.getAttribute('data-tags') || '').split('|').forEach(function (t) {
        if (!t) return;
        var li = document.createElement('li');
        li.textContent = t;
        infoTags.appendChild(li);
      });
    }
  }

  nodes.forEach(function (n, i) {
    n.addEventListener('mouseenter', function () { showNode(i); });
    n.addEventListener('focus', function () { showNode(i); });
    n.addEventListener('click', function () { showNode(i); });
  });

  // Gentle idle cycle so the section reads as live before anyone touches it
  if (nodes.length) {
    showNode(0);
    var idle = 0, timer = null, paused = false;

    function startCycle() {
      if (reduced || timer) return;
      timer = window.setInterval(function () {
        if (paused) return;
        idle = (idle + 1) % nodes.length;
        showNode(idle);
      }, 2600);
    }
    function stopCycle() { if (timer) { window.clearInterval(timer); timer = null; } }

    var stage = $('.fmap-stage');
    if (stage) {
      stage.addEventListener('mouseenter', function () { paused = true; });
      stage.addEventListener('mouseleave', function () { paused = false; });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? startCycle() : stopCycle(); });
      }, { threshold: 0.25 }).observe($('.fmap') || document.body);
    } else {
      startCycle();
    }
  }


  /* 07 ─ PROCESS ACCORDION =============================================== */
  var steps  = $$('.proc-step');
  var procBg = $$('.proc-bg img');

  function showStep(i) {
    steps.forEach(function (s, k) { s.classList.toggle('on', k === i); });
    procBg.forEach(function (b, k) { b.classList.toggle('on', k === i); });
  }
  steps.forEach(function (s, i) {
    s.addEventListener('mouseenter', function () { showStep(i); });
    s.addEventListener('click', function () { showStep(i); });
    s.addEventListener('focus', function () { showStep(i); });
  });
  if (steps.length) showStep(0);


  /* 08 ─ COUNTERS ======================================================== */
  function countTo(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var dur = 1700, t0 = null;

    if (reduced) { el.textContent = target; return; }

    function tick(now) {
      if (t0 === null) t0 = now;
      var p = Math.min((now - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e);
      if (p < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es, o) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        countTo(e.target);
        o.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
  }


  /* 09 ─ OPERATIONS BARS ================================================= */
  var bars = $$('.ops-bar i');
  if (bars.length && 'IntersectionObserver' in window) {
    var bo = new IntersectionObserver(function (es, o) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        bars.forEach(function (b, k) {
          window.setTimeout(function () {
            b.style.width = (b.getAttribute('data-val') || 0) + '%';
          }, k * 140);
        });
        o.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    bo.observe($('.ops-board') || bars[0]);
  } else {
    bars.forEach(function (b) { b.style.width = (b.getAttribute('data-val') || 0) + '%'; });
  }


  /* 10 ─ ENQUIRY FORM ==================================================== */
  /* Front-end demo only. Nothing is transmitted and nothing is stored.
     To make it live, add an action URL to the <form> and remove
     e.preventDefault() below. See README section 8. */
  var form = $('#enquiry');
  var okBox = $('#formOk');

  function field(el) { return el.closest('.f'); }
  function fail(el, msg) {
    var f = field(el); if (!f) return;
    f.classList.add('err');
    var m = $('.msg', f); if (m) m.textContent = msg;
  }
  function pass(el) { var f = field(el); if (f) f.classList.remove('err'); }

  if (form) {
    // Keep the floating label lifted once a select has a value
    $$('select', form).forEach(function (s) {
      s.addEventListener('change', function () { s.classList.toggle('filled', !!s.value); });
    });
    $$('input, select, textarea', form).forEach(function (el) {
      el.addEventListener('input', function () { pass(el); });
      el.addEventListener('change', function () { pass(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      var name = $('#c-name');
      if (name.value.trim().length < 2) { fail(name, 'Enter your name'); ok = false; } else pass(name);

      var phone = $('#c-phone');
      if (phone.value.replace(/\D/g, '').length < 10) {
        fail(phone, 'Enter a valid phone number'); ok = false;
      } else pass(phone);

      var mail = $('#c-email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim())) {
        fail(mail, 'Enter a valid email address'); ok = false;
      } else pass(mail);

      var type = $('#c-type');
      if (type && !type.value) { fail(type, 'Choose a facility type'); ok = false; } else if (type) pass(type);

      if (!ok) {
        var bad = $('.f.err input, .f.err select, .f.err textarea', form);
        if (bad) bad.focus();
        return;
      }

      form.style.display = 'none';
      if (okBox) {
        okBox.classList.add('on');
        okBox.setAttribute('tabindex', '-1');
        okBox.focus();
      }
    });
  }

  var again = $('#formAgain');
  if (again) {
    again.addEventListener('click', function () {
      form.reset();
      $$('.f', form).forEach(function (f) { f.classList.remove('err'); });
      $$('select', form).forEach(function (s) { s.classList.remove('filled'); });
      if (okBox) okBox.classList.remove('on');
      form.style.display = '';
      $('#c-name').focus();
    });
  }


  /* 11 ─ FOOTER YEAR ===================================================== */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

})();
