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
    var names = ['services', 'industries', 'projects', 'faq', 'team', 'uniform',
                 'clients', 'feedback'];
    /* Resolve per file rather than all-or-nothing. Promise.all rejects on the
       first failure, so a single missing JSON used to blank every rendered
       section on the page. A file that 404s now yields null and only its own
       section stays empty. */
    return Promise.all(names.map(function (n) {
      return fetch('data/' + n + '.json')
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (j) { return [n, j]; })
        .catch(function () { return [n, null]; });
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
      var parts = [a.line1, a.line2, a.city, a.state, a.pin].filter(Boolean);
      el.innerHTML = parts.map(esc).join('<br>');
      if (a.confirmed === false) el.classList.add('tbc');
    });

    /* GST number — printed wherever [data-cfg-gst] appears */
    $$('[data-cfg-gst]').forEach(function (el) {
      var g = CFG.gst;
      if (!g) return;
      el.textContent = val(g);
      if (!ok(g)) el.classList.add('tbc');
    });

    /* CTA labels */
    $$('[data-cfg-cta]').forEach(function (el) {
      var k = el.getAttribute('data-cfg-cta');
      if (CFG[k]) el.textContent = CFG[k];
    });

    /* Copyright year */
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ── 03 ─ SERVICES (home) ────────────────────────────────────────
     One card per service line, each with its own photograph. This used to be
     a pinned stage plus six full-height panels, which meant six screens of
     scrolling to read six short paragraphs. */

  /* ── TRUSTED BY ────────────────────────────────────────────────────────
     Two copies of the list run end to end so the rail can scroll seamlessly:
     when the first copy has moved exactly its own width the second is in the
     identical position, and the animation restarts invisibly. The duplicate
     is aria-hidden so it is not read out twice. */
  /* Two letters, from two words if there are two, otherwise from one.
     Taking only word-initials gave "Multi-speciality" a single "M". */
  function initials(name) {
    var words = String(name || '?').replace(/[^A-Za-z ]/g, ' ').trim().split(/\s+/);
    if (words.length > 1) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return words[0].slice(0, 2).toUpperCase();
  }

  function renderClients() {
    var host = $('[data-render="clients"]');
    if (!host || !DATA.clients) return;
    var list = DATA.clients.clients || [];
    if (!list.length) return;

    /* An <img> when a logo file is given, the monogram fallback when it is
       not — so a half-supplied list still renders as one even wall rather
       than logos next to text plates. */
    function plate(c, dup) {
      var inner = c.logo
        ? '<img src="' + esc(c.logo) + '" alt="' + esc(c.name) + '" ' +
          'loading="lazy" decoding="async" width="300" height="60">'
        : '<span class="cplate-mark" aria-hidden="true">' + esc(initials(c.name)) + '</span>' +
          '<span class="cplate-txt"><b>' + esc(c.name) + '</b>' +
          '<span>' + esc(c.sector || '') + '</span></span>';

      return '<li class="cplate' + (c.logo ? ' cplate--logo' : '') + '"' +
        (dup ? ' aria-hidden="true"' : '') + '>' + inner + '</li>';
    }

    var once = list.map(function (c) { return plate(c, false); }).join('');
    var dup  = list.map(function (c) { return plate(c, true);  }).join('');
    host.innerHTML = '<ul class="cplates">' + once + dup + '</ul>';

    /* Show the note only while at least one entry is unconfirmed. */
    var note = $('[data-clients-note]');
    if (note && list.some(function (c) { return c.confirmed === false; })) {
      note.hidden = false;
    }
  }

  /* ── FEEDBACK ──────────────────────────────────────────────────────────
     A horizontal rail rather than a three-up grid. The grid capped the page
     at three quotes and made a fourth a layout problem; the rail scrolls, is
     swipeable on touch, and the arrow buttons page it on a desktop. */
  function renderFeedback() {
    var host = $('[data-render="feedback"]');
    if (!host || !DATA.feedback) return;
    var list = DATA.feedback.feedback || [];
    if (!list.length) return;

    host.innerHTML = list.map(function (f) {
      var n = Math.max(0, Math.min(5, parseInt(f.rating, 10) || 5));
      var stars = '';
      for (var i = 0; i < 5; i++) {
        stars += '<svg class="star' + (i < n ? ' on' : '') + '" viewBox="0 0 24 24" ' +
                 'fill="currentColor" aria-hidden="true">' +
                 '<path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45L2.6 9.45l6.5-.95Z"/></svg>';
      }
      return '<figure class="fb-card">' +
        '<div class="fb-stars" role="img" aria-label="' + n + ' out of 5">' + stars + '</div>' +
        '<blockquote class="fb-quote">' + esc(f.quote) + '</blockquote>' +
        '<figcaption class="fb-by">' +
          '<span class="fb-av" aria-hidden="true">' + esc(f.initials || '') + '</span>' +
          '<span class="fb-who"><b>' + esc(f.name) + '</b>' +
          '<span>' + esc(f.role || '') + '</span></span>' +
        '</figcaption>' +
      '</figure>';
    }).join('');

    var note = $('[data-fb-note]');
    if (note && list.some(function (f) { return f.confirmed === false; })) {
      note.hidden = false;
    }

    /* Arrows page by one card width. */
    var prev = $('[data-fb-prev]');
    var next = $('[data-fb-next]');
    function step(dir) {
      var card = $('.fb-card', host);
      var by = card ? card.getBoundingClientRect().width + 20 : 340;
      host.scrollBy({ left: dir * by, behavior: 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    function syncArrows() {
      if (!prev || !next) return;
      var max = host.scrollWidth - host.clientWidth - 2;
      prev.disabled = host.scrollLeft <= 2;
      next.disabled = host.scrollLeft >= max;
    }
    host.addEventListener('scroll', syncArrows, { passive: true });
    syncArrows();
  }

  function renderServiceScroll() {
    var host = $('[data-render="service-scroll"]');
    if (!host || !DATA.services) return;
    var list = DATA.services.services.filter(function (s) { return s.active !== false; });

    /* The whole card is the link. The old build put a "See how we run it"
       text link at the bottom, which meant a 400px card with a 140px target.
       Now the article is an anchor and the arrow is an affordance, not the
       only thing you can hit. */
    host.innerHTML = list.map(function (s) {
      return '<a class="svc-card" id="service-' + esc(s.id) + '" ' +
             'href="services.html#service-' + esc(s.id) + '">' +
        '<figure class="svc-figure">' +
          '<img src="' + esc(s.image) + '" alt="' + esc(s.alt) + '" loading="lazy" decoding="async">' +
          '<span class="svc-num">' + esc(s.number) + '</span>' +
          '<span class="svc-name">' + esc(s.title) + '</span>' +
        '</figure>' +
        '<div class="svc-body">' +
          '<p class="svc-short">' + esc(s.short) + '</p>' +
          '<ul class="svc-labels">' + s.labels.slice(0, 4).map(function (l) {
            return '<li>' + esc(l) + '</li>';
          }).join('') + '</ul>' +
          '<span class="svc-go">' +
            '<span>See how we run it</span>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
          '</span>' +
        '</div>' +
      '</a>';
    }).join('');
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
      renderClients();
      renderFeedback();
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

/* The pinned scroll-story driver that used to live here has been removed.
   The process page now lays its five stages out in sequence rather than
   pinning one screen and swapping the copy as you scroll, so there is no
   position to compute. */
