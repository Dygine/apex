/* ==========================================================================
   APEX — RENDER LAYER
   --------------------------------------------------------------------------
   Reads js/config.js and data/*.json and writes them into the page. Anything
   with a [data-render] hook is filled here, so no page needs editing to change
   a service, an industry, a question or a phone number.

   Data source order:
     1. fetch('data/*.json')  — the real source of truth. Works on any server,
                                including GitHub Pages and VS Code Live Server.
     2. window.APEX_DATA      — offline snapshot in js/data.js, used only when
                                the page is opened straight from disk (file://),
                                where fetch() is blocked by the browser.
   After editing a JSON file run `node tools/build-data.js` to refresh (2).
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.APEX_CONFIG || {};
  var DATA = null;

  /* ── 01 ─ HELPERS ─────────────────────────────────────────────────────── */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* A config field may be {value, confirmed} or a plain string. */
  function val(f) { return f && typeof f === 'object' ? f.value : f; }
  function ok(f) { return f && typeof f === 'object' ? f.confirmed !== false : !!f; }

  function load() {
    var names = ['services', 'industries', 'projects', 'faq', 'team', 'uniform'];
    return Promise.all(names.map(function (n) {
      return fetch('data/' + n + '.json')
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (j) { return [n, j]; });
    })).then(function (pairs) {
      var o = {};
      pairs.forEach(function (p) { o[p[0]] = p[1]; });
      return o;
    }).catch(function () {
      /* file:// or offline — fall back to the snapshot. */
      return window.APEX_DATA || null;
    });
  }

  /* ── 02 ─ COMPANY DETAILS ─────────────────────────────────────────────── */
  function renderConfig() {
    if (!CFG.companyName) return;

    document.documentElement.classList.toggle('is-demo', CFG.demoMode !== false);

    $$('[data-cfg]').forEach(function (el) {
      var key = el.getAttribute('data-cfg');
      var field = CFG[key];
      var text = val(field);
      if (text == null) return;
      el.textContent = text;
      if (!ok(field)) {
        el.classList.add('tbc');
        el.setAttribute('title', 'To be confirmed by the client');
      }
    });

    /* Telephone links */
    $$('[data-cfg-tel]').forEach(function (el) {
      var raw = val(CFG.phone) || '';
      el.textContent = raw;
      el.setAttribute('href', 'tel:' + raw.replace(/[^\d+]/g, ''));
      if (!ok(CFG.phone)) { el.classList.add('tbc'); el.removeAttribute('href'); }
    });

    /* Email links */
    $$('[data-cfg-mail]').forEach(function (el) {
      var raw = val(CFG.email) || '';
      el.textContent = raw;
      el.setAttribute('href', 'mailto:' + raw);
      if (!ok(CFG.email)) { el.classList.add('tbc'); el.removeAttribute('href'); }
    });

    /* WhatsApp */
    $$('[data-cfg-wa]').forEach(function (el) {
      var raw = val(CFG.whatsapp) || '';
      el.setAttribute('href', 'https://wa.me/' + raw.replace(/[^\d]/g, ''));
      if (!ok(CFG.whatsapp)) { el.classList.add('tbc'); el.removeAttribute('href'); }
    });

    /* Address */
    $$('[data-cfg-address]').forEach(function (el) {
      var a = CFG.address || {};
      var parts = [a.line1, a.city, a.state, a.pin].filter(Boolean);
      el.innerHTML = parts.map(esc).join('<br>');
      if (a.confirmed === false) el.classList.add('tbc');
    });

    /* CTA labels */
    $$('[data-cfg-cta]').forEach(function (el) {
      var k = el.getAttribute('data-cfg-cta');
      if (CFG[k]) el.textContent = CFG[k];
    });

    /* Copyright year */
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ── 03 ─ SERVICES (home scroll sequence) ─────────────────────────────── */
  function renderServiceScroll() {
    var host = $('[data-render="service-scroll"]');
    if (!host || !DATA.services) return;
    var list = DATA.services.services.filter(function (s) { return s.active !== false; });

    var media = list.map(function (s, i) {
      return '<figure class="svc-figure' + (i === 0 ? ' is-active' : '') + '" data-svc-fig="' + i + '">' +
        '<img src="' + esc(s.image) + '" alt="' + esc(s.alt) + '" loading="lazy" decoding="async">' +
        '<figcaption class="svc-figcap"><span class="mono">' + esc(s.number) + '</span>' + esc(s.title) + '</figcaption>' +
        '</figure>';
    }).join('');

    var panels = list.map(function (s, i) {
      return '<article class="svc-panel" data-svc-panel="' + i + '" id="service-' + esc(s.id) + '">' +
        '<span class="svc-num mono">' + esc(s.number) + '</span>' +
        '<h3 class="svc-title">' + esc(s.title) + '</h3>' +
        '<p class="svc-short">' + esc(s.short) + '</p>' +
        '<ul class="svc-labels">' + s.labels.map(function (l) {
          return '<li>' + esc(l) + '</li>';
        }).join('') + '</ul>' +
        '<a class="link" href="services.html#service-' + esc(s.id) + '">See how we run it</a>' +
        /* Mobile gets the image inline instead of the pinned stage. */
        '<figure class="svc-panel-img"><img src="' + esc(s.image) + '" alt="' + esc(s.alt) +
        '" loading="lazy" decoding="async"></figure>' +
        '</article>';
    }).join('');

    host.innerHTML =
      '<div class="svc-stage" aria-hidden="true">' + media +
      '<span class="svc-count mono"><b data-svc-count>01</b> / ' +
      String(list.length).padStart(2, '0') + '</span></div>' +
      '<div class="svc-panels">' + panels + '</div>';

    /* Swap the pinned image as each panel comes into view. */
    var figs = $$('[data-svc-fig]', host);
    var counter = $('[data-svc-count]', host);
    if (!('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = +e.target.getAttribute('data-svc-panel');
        figs.forEach(function (f, fi) { f.classList.toggle('is-active', fi === i); });
        if (counter) counter.textContent = String(i + 1).padStart(2, '0');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    $$('[data-svc-panel]', host).forEach(function (p) { io.observe(p); });
  }

  /* ── 04 ─ SERVICES (services page detail) ─────────────────────────────── */
  function renderServiceDetail() {
    var host = $('[data-render="service-detail"]');
    if (!host || !DATA.services) return;
    host.innerHTML = DATA.services.services
      .filter(function (s) { return s.active !== false; })
      .map(function (s, i) {
        return '<article class="sdet' + (i % 2 ? ' sdet--flip' : '') + '" id="service-' + esc(s.id) + '">' +
          '<figure class="sdet-img reveal-img"><img src="' + esc(s.image) + '" alt="' + esc(s.alt) +
          '" loading="lazy" decoding="async"></figure>' +
          '<div class="sdet-body">' +
          '<span class="sdet-num mono">' + esc(s.number) + '</span>' +
          '<h2 class="sdet-title">' + esc(s.title) + '</h2>' +
          '<p class="sdet-lead">' + esc(s.short) + '</p>' +
          '<p class="sdet-copy">' + esc(s.description) + '</p>' +
          '<h3 class="sdet-sub mono">Where it applies</h3>' +
          '<ul class="sdet-list">' + (s.applications || []).map(function (a) {
            return '<li>' + esc(a) + '</li>';
          }).join('') + '</ul>' +
          '<ul class="svc-labels">' + s.labels.map(function (l) {
            return '<li>' + esc(l) + '</li>';
          }).join('') + '</ul>' +
          '</div></article>';
      }).join('');
  }

  /* ── 05 ─ INDUSTRIES ──────────────────────────────────────────────────── */
  function renderIndustries() {
    /* Home page — reuses the existing .inds-* component so the proven hover
       styling still applies; only the content now comes from JSON. */
    var rows = $('[data-render="industries-rows"]');
    var prev = $('[data-render="industries-preview"]');
    if (rows && prev && DATA.industries) {
      var list = DATA.industries.industries;
      var arrow = '<svg class="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

      rows.innerHTML = list.map(function (n, i) {
        return '<a class="inds-row" href="industries.html#ind-' + esc(n.id) + '" ' +
          'data-name="' + esc(n.title) + '" data-kind="' + esc(n.brief) + '">' +
          '<span class="idx">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<h3>' + esc(n.title) + '</h3>' + arrow + '</a>';
      }).join('');

      prev.innerHTML = list.map(function (n) {
        return '<img src="' + esc(n.image) + '" alt="' + esc(n.alt) + '" loading="lazy" decoding="async">';
      }).join('') +
        '<div class="cap"><b id="indName"></b><span id="indKind"></span></div>';

      var iRows = $$('.inds-row', rows);
      var iImgs = $$('img', prev);
      var nameEl = $('#indName', prev);
      var kindEl = $('#indKind', prev);

      function showInd(i) {
        iRows.forEach(function (r, k) { r.classList.toggle('on', k === i); });
        iImgs.forEach(function (m, k) { m.classList.toggle('on', k === i); });
        if (nameEl) nameEl.textContent = iRows[i].getAttribute('data-name') || '';
        if (kindEl) kindEl.textContent = iRows[i].getAttribute('data-kind') || '';
      }
      iRows.forEach(function (r, i) {
        r.addEventListener('mouseenter', function () { showInd(i); });
        r.addEventListener('focus', function () { showInd(i); });
      });
      if (iRows.length) showInd(0);
    }

    var grid = $('[data-render="industries-grid"]');
    if (grid && DATA.industries) {
      grid.innerHTML = DATA.industries.industries.map(function (n, i) {
        return '<article class="indc" id="ind-' + esc(n.id) + '">' +
          '<figure class="indc-img"><img src="' + esc(n.image) + '" alt="' + esc(n.alt) +
          '" loading="lazy" decoding="async"></figure>' +
          '<div class="indc-body">' +
          '<span class="mono indc-i">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<h2 class="indc-t">' + esc(n.title) + '</h2>' +
          '<p class="indc-b">' + esc(n.brief) + '</p>' +
          '<ul class="indc-needs">' + (n.needs || []).map(function (d) {
            return '<li>' + esc(d) + '</li>';
          }).join('') + '</ul></div></article>';
      }).join('');
    }
  }

  /* ── 06 ─ PEOPLE ──────────────────────────────────────────────────────── */
  function renderPeople() {
    var host = $('[data-render="people"]');
    if (!host || !DATA.team) return;
    host.innerHTML = DATA.team.roles.map(function (p, i) {
      return '<article class="ppl-card" data-ppl="' + i + '">' +
        '<figure class="ppl-img"><img src="' + esc(p.image) + '" alt="' + esc(p.alt) +
        '" loading="lazy" decoding="async"></figure>' +
        '<span class="ppl-label mono">' + esc(p.label) + '</span>' +
        '<h3 class="ppl-role">' + esc(p.role) + '</h3>' +
        '<p class="ppl-line">' + esc(p.line) + '</p></article>';
    }).join('');
  }

  /* ── 07 ─ UNIFORM SHOWCASE ────────────────────────────────────────────── */
  function renderUniform() {
    var host = $('[data-render="uniform"]');
    if (!host || !DATA.uniform) return;
    var u = DATA.uniform;

    host.innerHTML =
      '<div class="uni-stage">' +
        '<figure class="uni-photo"><img src="' + esc(u.photo.image) + '" alt="' + esc(u.photo.alt) +
        '" loading="lazy" decoding="async"></figure>' +
        u.spec.map(function (s) {
          return '<button class="uni-dot" type="button" data-uni="' + esc(s.id) + '" ' +
            'style="left:' + s.x + '%;top:' + s.y + '%" ' +
            'aria-label="' + esc(s.title) + ' — ' + esc(s.detail) + '">' +
            '<span class="mono">' + esc(s.code) + '</span></button>';
        }).join('') +
      '</div>' +
      '<div class="uni-detail">' +
        '<div class="uni-readout" aria-live="polite">' +
          u.spec.map(function (s, i) {
            return '<div class="uni-item' + (i === 0 ? ' is-active' : '') + '" data-uni-item="' + esc(s.id) + '">' +
              '<span class="uni-code mono">' + esc(s.code) + '</span>' +
              '<h3 class="uni-title">' + esc(s.title) + '</h3>' +
              '<p class="uni-copy">' + esc(s.detail) + '</p></div>';
          }).join('') +
        '</div>' +
        '<ol class="uni-index">' + u.spec.map(function (s, i) {
          return '<li><button type="button" data-uni="' + esc(s.id) + '"' +
            (i === 0 ? ' class="is-active"' : '') + '>' +
            '<span class="mono">' + esc(s.code) + '</span>' + esc(s.title) + '</button></li>';
        }).join('') + '</ol>' +
        '<a class="link" href="assets/brand/apex-uniform-spec.svg" target="_blank" rel="noopener">' +
        'Open the full uniform specification</a>' +
      '</div>';

    function select(id) {
      $$('[data-uni-item]', host).forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-uni-item') === id);
      });
      $$('[data-uni]', host).forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-uni') === id);
      });
    }
    $$('[data-uni]', host).forEach(function (b) {
      b.addEventListener('click', function () { select(b.getAttribute('data-uni')); });
      b.addEventListener('mouseenter', function () { select(b.getAttribute('data-uni')); });
    });
    select(u.spec[0].id);
  }

  /* ── 08 ─ FAQ ─────────────────────────────────────────────────────────── */
  function renderFaq() {
    var host = $('[data-render="faq"]');
    if (!host || !DATA.faq) return;
    host.innerHTML = DATA.faq.faq.map(function (f, i) {
      return '<div class="faq-item">' +
        '<h3 class="faq-q"><button type="button" id="faq-b' + i + '" aria-expanded="false" aria-controls="faq-a' + i + '">' +
        '<span>' + esc(f.q) + '</span><i class="faq-mark" aria-hidden="true"></i></button></h3>' +
        '<div class="faq-a" id="faq-a' + i + '" role="region" aria-labelledby="faq-b' + i + '" hidden>' +
        '<p>' + esc(f.a) + '</p></div></div>';
    }).join('');

    $$('.faq-q button', host).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        /* One panel open at a time. */
        $$('.faq-q button', host).forEach(function (o) {
          o.setAttribute('aria-expanded', 'false');
          var p = document.getElementById(o.getAttribute('aria-controls'));
          if (p) { p.hidden = true; p.style.maxHeight = ''; }
          o.closest('.faq-item').classList.remove('is-open');
        });
        if (!open) {
          btn.setAttribute('aria-expanded', 'true');
          var panel = document.getElementById(btn.getAttribute('aria-controls'));
          panel.hidden = false;
          panel.style.maxHeight = panel.scrollHeight + 'px';
          btn.closest('.faq-item').classList.add('is-open');
        }
      });
    });
  }

  /* ── 09 ─ WORK / PROJECTS ─────────────────────────────────────────────── */
  function renderWork() {
    var host = $('[data-render="work"]');
    if (!host || !DATA.projects) return;
    var list = DATA.projects.projects;
    var cats = ['All'].concat(list.map(function (p) { return p.category; })
      .filter(function (c, i, a) { return a.indexOf(c) === i; }));

    var filters = $('[data-render="work-filters"]');
    if (filters) {
      filters.innerHTML = cats.map(function (c, i) {
        return '<button type="button" class="wf' + (i === 0 ? ' is-active' : '') +
          '" data-filter="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + '</button>';
      }).join('');
    }

    host.innerHTML = list.map(function (p, i) {
      return '<article class="wk" data-cat="' + esc(p.category) + '" data-wk="' + i + '">' +
        '<button class="wk-open" type="button" aria-label="Open details for ' + esc(p.title) + '">' +
        '<figure class="wk-img"><img src="' + esc(p.image) + '" alt="' + esc(p.alt) +
        '" loading="lazy" decoding="async"></figure>' +
        (p.demo ? '<span class="demo-tag">Demo project</span>' : '') +
        '<span class="wk-cat mono">' + esc(p.category) + '</span>' +
        '<h3 class="wk-t">' + esc(p.title) + '</h3>' +
        '<p class="wk-m mono">' + esc(p.meta) + '</p>' +
        '<p class="wk-s">' + esc(p.scope) + '</p></button></article>';
    }).join('');

    /* Filtering */
    if (filters) {
      $$('.wf', filters).forEach(function (b) {
        b.addEventListener('click', function () {
          var f = b.getAttribute('data-filter');
          $$('.wf', filters).forEach(function (o) {
            var on = o === b;
            o.classList.toggle('is-active', on);
            o.setAttribute('aria-pressed', on);
          });
          $$('.wk', host).forEach(function (card) {
            var show = f === 'All' || card.getAttribute('data-cat') === f;
            card.classList.toggle('is-hidden', !show);
          });
        });
      });
    }

    /* Lightbox */
    var lb = $('[data-render="lightbox"]');
    if (!lb) return;
    var last = null;

    function open(i) {
      var p = list[i];
      lb.innerHTML =
        '<div class="lb-inner" role="dialog" aria-modal="true" aria-label="' + esc(p.title) + '">' +
          '<button class="lb-close" type="button" aria-label="Close">&times;</button>' +
          '<figure class="lb-img"><img src="' + esc(p.image) + '" alt="' + esc(p.alt) + '"></figure>' +
          '<div class="lb-body">' +
            (p.demo ? '<span class="demo-tag">Demo project</span>' : '') +
            '<span class="mono lb-cat">' + esc(p.category) + '</span>' +
            '<h2>' + esc(p.title) + '</h2>' +
            '<p class="mono lb-meta">' + esc(p.meta) + '</p>' +
            '<h3 class="mono">The facility</h3><p>' + esc(p.brief) + '</p>' +
            '<h3 class="mono">How it would be run</h3><p>' + esc(p.approach) + '</p>' +
            '<h3 class="mono">Scope</h3><p>' + esc(p.scope) + '</p>' +
            '<p class="lb-note">' + esc(p.outcome) + '</p>' +
          '</div>' +
        '</div>';
      lb.classList.add('is-open');
      document.body.classList.add('locked');
      var c = $('.lb-close', lb);
      if (c) c.focus();
    }

    function close() {
      lb.classList.remove('is-open');
      document.body.classList.remove('locked');
      lb.innerHTML = '';
      if (last) last.focus();
    }

    $$('.wk-open', host).forEach(function (b) {
      b.addEventListener('click', function () {
        last = b;
        open(+b.closest('.wk').getAttribute('data-wk'));
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
    });
  }

  /* ── 10 ─ SERVICE OPTIONS IN THE ENQUIRY FORM ─────────────────────────── */
  function renderFormOptions() {
    var sel = $('[data-render="service-options"]');
    if (sel && DATA.services) {
      DATA.services.services.filter(function (s) { return s.active !== false; })
        .forEach(function (s) {
          var o = document.createElement('option');
          o.value = s.title; o.textContent = s.title;
          sel.appendChild(o);
        });
      var all = document.createElement('option');
      all.value = 'Integrated — all services';
      all.textContent = 'Integrated — all services';
      sel.appendChild(all);
    }
    var fac = $('[data-render="facility-options"]');
    if (fac && DATA.industries) {
      DATA.industries.industries.forEach(function (n) {
        var o = document.createElement('option');
        o.value = n.title; o.textContent = n.title;
        fac.appendChild(o);
      });
      var other = document.createElement('option');
      other.value = 'Other'; other.textContent = 'Other';
      fac.appendChild(other);
    }
  }

  /* ── 11 ─ BOOT ────────────────────────────────────────────────────────── */
  function boot() {
    renderConfig();
    load().then(function (d) {
      if (!d) { document.documentElement.classList.add('data-failed'); return; }
      DATA = d;
      renderServiceScroll();
      renderServiceDetail();
      renderIndustries();
      renderPeople();
      renderUniform();
      renderFaq();
      renderWork();
      renderFormOptions();
      /* Tell the animation layer that new nodes exist. */
      document.dispatchEvent(new CustomEvent('apex:rendered'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();

/* ==========================================================================
   SCROLL STORY DRIVER
   Advances the pinned sequence on the process page as the track scrolls past.
   Pure IntersectionObserver-free maths so it works with or without GSAP, and
   the reduced-motion stylesheet un-pins the whole thing anyway.
   ========================================================================== */
(function () {
  'use strict';

  function init() {
    var track = document.getElementById('procTrack');
    if (!track) return;

    var steps = [].slice.call(track.querySelectorAll('.sstory-step'));
    var figs  = [].slice.call(track.querySelectorAll('.sstory-media figure'));
    var bars  = [].slice.call(track.querySelectorAll('.sstory-bar i'));
    if (!steps.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      steps.forEach(function (s) { s.classList.add('is-active'); });
      return;
    }

    var current = -1;
    function set(i) {
      if (i === current) return;
      current = i;
      steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      figs.forEach(function (f, k) { f.classList.toggle('is-active', k === i); });
      bars.forEach(function (b, k) { b.classList.toggle('on', k <= i); });
    }

    var ticking = false;
    function update() {
      ticking = false;
      var r = track.getBoundingClientRect();
      var travel = r.height - window.innerHeight;
      if (travel <= 0) { set(0); return; }
      var p = Math.min(1, Math.max(0, -r.top / travel));
      set(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
