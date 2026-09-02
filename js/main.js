/* ==========================================================================
   APEX — main.js
   Interaction layer. No dependencies.
     01 Helpers
     02 Navigation + scroll progress
     03 Mobile panel
     04 Industries hover preview
     05 Facility map nodes
     06 Process steps
     07 Enquiry form
     08 Footer year
     09 Services dropdown
     10 Floating dock — WhatsApp + back to top
     11 Deep link into a single service
   ========================================================================== */

(function () {
  'use strict';

  /* 01 ─ HELPERS ========================================================= */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  document.documentElement.classList.remove('no-js');


  /* 02 ─ NAVIGATION ====================================================== */
  var nav      = $('#nav');
  var progress = $('#progress');
  var lastY    = 0;
  var ticking  = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (nav) {
      nav.classList.toggle('stuck', y > 24);
      /* Hide on downward scroll once well past the hero, show on upward */
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

  /* In-page anchors clear the fixed bar */
  $$('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    a.addEventListener('click', function (e) {
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* 04 ─ INDUSTRIES HOVER PREVIEW ======================================== */
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


  /* 05 ─ FACILITY MAP ====================================================
     Hover, focus or tap a node to read it. The previous build also cycled
     the nodes on a 2.6-second timer whenever the section was on screen;
     that ambient movement is gone. Nothing moves unless the visitor asks. */
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
  if (nodes.length) showNode(0);


  /* 06 ─ PROCESS STEPS =================================================== */
  var steps = $$('.proc-step');
  function showStep(i) {
    steps.forEach(function (s, k) { s.classList.toggle('on', k === i); });
  }
  steps.forEach(function (s, i) {
    s.addEventListener('mouseenter', function () { showStep(i); });
    s.addEventListener('click', function () { showStep(i); });
    s.addEventListener('focus', function () { showStep(i); });
  });


  /* 07 ─ ENQUIRY FORM ====================================================
     Front-end demo only. Nothing is transmitted and nothing is stored.
     To make it live, add an action URL to the <form> and remove
     e.preventDefault() below. See README section 6. */
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


  /* 08 ─ FOOTER YEAR ===================================================== */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });


  /* 09 ─ SERVICES DROPDOWN ===============================================
     The only dropdown in the bar. Three rules govern it:
       · "Services" stays a real link. Clicking the word opens the full
         services page, exactly as it did before.
       · Hovering opens the list. On a touch device the first tap opens it
         and the second follows the link, so the menu is reachable without a
         pointer.
       · Escape closes it and returns focus to the trigger.  */
  var drop = $('[data-drop]');

  if (drop) {
    var dropBtn  = $('.nav-drop-btn', drop);
    var closeTmr = null;

    function setDrop(open) {
      drop.classList.toggle('open', open);
      if (dropBtn) dropBtn.setAttribute('aria-expanded', String(open));
    }
    function openDrop()  { window.clearTimeout(closeTmr); setDrop(true); }
    function closeDrop(d){ window.clearTimeout(closeTmr);
                           closeTmr = window.setTimeout(function(){ setDrop(false); }, d || 0); }

    /* Pointer: open on enter, close on leave with a short grace period so
       crossing the gap between the word and the panel does not shut it. */
    drop.addEventListener('mouseenter', openDrop);
    drop.addEventListener('mouseleave', function () { closeDrop(160); });

    /* Keyboard: anything focused inside keeps it open. */
    drop.addEventListener('focusin',  openDrop);
    drop.addEventListener('focusout', function (e) {
      if (!drop.contains(e.relatedTarget)) closeDrop(60);
    });

    /* Touch: first tap opens, second tap follows the link. */
    if (dropBtn) {
      dropBtn.addEventListener('click', function (e) {
        var noHover = window.matchMedia('(hover:none)').matches;
        if (noHover && !drop.classList.contains('open')) {
          e.preventDefault();
          openDrop();
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drop.classList.contains('open')) {
        setDrop(false);
        if (dropBtn) dropBtn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!drop.contains(e.target)) setDrop(false);
    });

    /* The bar hides itself on downward scroll; a menu left hanging open
       inside a hidden bar is a ghost. Close it when the bar goes. */
    window.addEventListener('scroll', function () {
      if (nav && nav.classList.contains('hide')) setDrop(false);
    }, { passive: true });
  }

  /* Mobile panel: the chevron beside "Services" opens the sub-list. The word
     itself remains a link to the services page. */
  var svcToggle = $('#panelSvcToggle');
  var svcSub    = $('#panelSvcSub');
  if (svcToggle && svcSub) {
    svcToggle.addEventListener('click', function () {
      var open = svcToggle.getAttribute('aria-expanded') === 'true';
      svcToggle.setAttribute('aria-expanded', String(!open));
      svcSub.classList.toggle('open', !open);
    });
  }


  /* 10 ─ FLOATING DOCK ===================================================
     WhatsApp and back-to-top, injected once here rather than pasted into
     eight HTML files. The WhatsApp number comes from config.js, so it is set
     in one place. Back-to-top only appears past 620px — a button offering to
     take you to the top while you are at the top is clutter.

     The ring around the top button fills as you move down the page. */
  (function () {
    if ($('.dock')) return;

    var cfg = window.APEX_CONFIG || {};
    var wa  = cfg.whatsapp && (cfg.whatsapp.value || cfg.whatsapp);
    var num = wa ? String(wa).replace(/\D/g, '') : '';
    /* config.js marks unsupplied values with confirmed:false. That flag is the
       real test — the placeholder 910000000000 still contains a 9 and a 1, so
       looking for a non-zero digit is not enough on its own. */
    var waSet = !(cfg.whatsapp && cfg.whatsapp.confirmed === false);
    var waOk  = waSet && num.length > 9 && /[1-9]/.test(num.slice(2));

    var dock = document.createElement('div');
    dock.className = 'dock';

    {
      var msg = encodeURIComponent(
        'Hello Apex, I would like to enquire about facility management services.');
      var a = document.createElement('a');
      a.className = 'dock-btn dock-wa';
      /* Until the real number is in config.js the button still appears, but it
         goes to the contact form instead of opening a dead wa.me link. */
      a.href = waOk ? ('https://wa.me/' + num + '?text=' + msg) : 'contact.html';
      if (waOk) { a.target = '_blank'; a.rel = 'noopener'; }
      a.setAttribute('aria-label', waOk ? 'Message Apex on WhatsApp' : 'Contact Apex');
      a.setAttribute('data-tip', waOk ? 'WhatsApp us' : 'Contact us');
      a.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.29-.77.95-.94 1.15-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.29-.02-.45.13-.6.13-.13.3-.35.45-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.34M12.05 21.8h-.02a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97 1-3.62-.24-.37a9.79 9.79 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.03 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.4-4.4 9.81-9.8 9.81M20.5 3.5A11.7 11.7 0 0 0 12.05 0C5.56 0 .28 5.28.28 11.76c0 2.07.54 4.1 1.57 5.88L.18 24l6.5-1.7a11.72 11.72 0 0 0 5.37 1.36h.01c6.48 0 11.76-5.28 11.76-11.76 0-3.14-1.22-6.1-3.44-8.32"/></svg>';
      dock.appendChild(a);
    }

    var top = document.createElement('button');
    top.className = 'dock-top dock-btn';
    top.type = 'button';
    top.setAttribute('aria-label', 'Back to top');
    top.setAttribute('data-tip', 'Back to top');
    top.innerHTML =
      '<svg class="ring" viewBox="0 0 60 60" aria-hidden="true">' +
        '<circle cx="30" cy="30" r="28" stroke-dasharray="176" stroke-dashoffset="176"></circle>' +
      '</svg>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19V5M5 12l7-7 7 7"/></svg>';

    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      /* Send focus somewhere sensible rather than leaving it on a button that
         has just scrolled out of relevance. */
      var h1 = document.querySelector('h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    });
    dock.appendChild(top);
    document.body.appendChild(dock);

    var ring = $('circle', top);
    var CIRC = 176;

    function dockScroll() {
      var y   = window.pageYOffset || document.documentElement.scrollTop;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      top.classList.toggle('on', y > 620);
      if (ring) {
        var p = max > 0 ? Math.min(y / max, 1) : 0;
        ring.setAttribute('stroke-dashoffset', String(CIRC - CIRC * p));
      }
    }
    var dTick = false;
    window.addEventListener('scroll', function () {
      if (!dTick) { window.requestAnimationFrame(function () { dockScroll(); dTick = false; }); dTick = true; }
    }, { passive: true });
    dockScroll();
  })();


  /* 11 ─ DEEP LINK INTO A SINGLE SERVICE =================================
     services.html#service-security should land on that service, not at the
     top of a list of six. The detail blocks are written by render.js after
     this file runs, so wait for the render event before scrolling. */
  function jumpToHash() {
    var id = window.location.hash;
    if (!id || id.length < 2) return;
    var el;
    try { el = document.querySelector(id); } catch (e) { return; }
    if (!el) return;

    $$('.is-target').forEach(function (n) { n.classList.remove('is-target'); });
    el.classList.add('is-target');

    var y = el.getBoundingClientRect().top + window.pageYOffset - 96;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  document.addEventListener('apex:rendered', function () {
    window.setTimeout(jumpToHash, 90);
  });
  window.addEventListener('hashchange', jumpToHash);


})();
