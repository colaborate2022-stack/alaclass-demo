/* =========================================================
   Wordly — page behaviour
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- data ------------------------------------- */
  // Flags are drawn as simple stripe/disc geometry so nothing has to load.
  var COURSES = [
    { name: 'English',    flag: { h: ['#00247d', '#ffffff', '#cf142b'] } },
    { name: 'Spanish',    flag: { h: ['#c60b1e', '#ffc400', '#c60b1e'] } },
    { name: 'French',     flag: { v: ['#0055a4', '#ffffff', '#ef4135'] } },
    { name: 'German',     flag: { h: ['#000000', '#dd0000', '#ffce00'] } },
    { name: 'Italian',    flag: { v: ['#008c45', '#f4f5f0', '#cd212a'] } },
    { name: 'Portuguese', flag: { v: ['#046a38', '#046a38', '#da291c'], disc: '#ffe000' } },
    { name: 'Japanese',   flag: { h: ['#ffffff'], disc: '#bc002d' } },
    { name: 'Korean',     flag: { h: ['#ffffff'], disc: '#cd2e3a' } },
    { name: 'Chinese',    flag: { h: ['#ee1c25'], disc: '#ffde00' } },
    { name: 'Hindi',      flag: { h: ['#ff9933', '#ffffff', '#138808'], disc: '#000080' } },
    { name: 'Dutch',      flag: { h: ['#ae1c28', '#ffffff', '#21468b'] } },
    { name: 'Turkish',    flag: { h: ['#e30a17'], disc: '#ffffff' } },
    { name: 'Swedish',    flag: { h: ['#006aa7'], disc: '#fecc00' } },
    { name: 'Greek',      flag: { h: ['#0d5eaf', '#ffffff', '#0d5eaf'] } },
    { name: 'Polish',     flag: { h: ['#ffffff', '#dc143c'] } },
    { name: 'Arabic',     flag: { h: ['#007a3d', '#ffffff', '#000000'] } }
  ];

  var FOOTER = [
    { title: 'About us',  links: ['Courses', 'Mission', 'Approach', 'Efficacy', 'Handbook', 'Careers', 'Press', 'Investors', 'Contact'] },
    { title: 'Products',  links: ['Wordly', 'Wordly for Schools', 'Wordly Kids', 'Wordly Music', 'Wordly Chess', 'Proficiency Test', 'Podcast'] },
    { title: 'Apps',      links: ['Wordly for Android', 'Wordly for iOS', 'Wordly for Web', 'Offline mode'] },
    { title: 'Help',      links: ['Wordly FAQs', 'Schools FAQs', 'Test FAQs', 'Status', 'Report a bug'] },
    { title: 'Privacy',   links: ['Community guidelines', 'Terms', 'Privacy policy', 'Cookie settings', 'Accessibility', 'Do not sell my info'] }
  ];

  /* ---------- helpers ---------------------------------- */
  function flagSVG(spec) {
    var w = 26, h = 19, out = '', bands, i, band;
    bands = spec.v || spec.h || ['#ccc'];
    band = (spec.v ? w : h) / bands.length;
    for (i = 0; i < bands.length; i++) {
      out += spec.v
        ? '<rect x="' + (i * band) + '" y="0" width="' + band + '" height="' + h + '" fill="' + bands[i] + '"/>'
        : '<rect x="0" y="' + (i * band) + '" width="' + w + '" height="' + band + '" fill="' + bands[i] + '"/>';
    }
    if (spec.disc) out += '<circle cx="' + (w / 2) + '" cy="' + (h / 2) + '" r="5" fill="' + spec.disc + '"/>';
    return '<svg class="flag" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + out + '</svg>';
  }

  function el(id) { return document.getElementById(id); }

  /* ---------- course strip ----------------------------- */
  var rail = el('stripRail');
  if (rail) {
    COURSES.forEach(function (c, i) {
      var li = document.createElement('li');
      li.innerHTML = '<button type="button"' + (i === 0 ? ' aria-current="true"' : '') + '>' +
        flagSVG(c.flag) + '<span>' + c.name + '</span></button>';
      rail.appendChild(li);
    });

    rail.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      rail.querySelectorAll('button').forEach(function (b) { b.removeAttribute('aria-current'); });
      btn.setAttribute('aria-current', 'true');
    });

    var navs = document.querySelectorAll('.strip-nav');
    function syncNavs() {
      var max = rail.scrollWidth - rail.clientWidth - 1;
      navs.forEach(function (b) {
        var back = b.dataset.dir === '-1';
        b.disabled = back ? rail.scrollLeft <= 0 : rail.scrollLeft >= max;
      });
    }
    navs.forEach(function (b) {
      b.addEventListener('click', function () {
        rail.scrollBy({ left: Number(b.dataset.dir) * Math.round(rail.clientWidth * 0.75), behavior: reduced ? 'auto' : 'smooth' });
      });
    });
    rail.addEventListener('scroll', syncNavs, { passive: true });
    window.addEventListener('resize', syncNavs);
    syncNavs();
  }

  /* ---------- language menu ---------------------------- */
  var langBtn = el('langBtn'), langMenu = el('langMenu'), langCurrent = el('langCurrent');
  if (langBtn && langMenu) {
    COURSES.forEach(function (c) {
      var li = document.createElement('li');
      li.innerHTML = '<button type="button">' + flagSVG(c.flag) + '<span>' + c.name + '</span></button>';
      langMenu.appendChild(li);
    });

    function closeMenu() {
      langMenu.hidden = true;
      langBtn.setAttribute('aria-expanded', 'false');
    }
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = langMenu.hidden;
      langMenu.hidden = !open;
      langBtn.setAttribute('aria-expanded', String(open));
    });
    langMenu.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      langCurrent.textContent = btn.querySelector('span').textContent;
      closeMenu();
      langBtn.focus();
    });
    document.addEventListener('click', function (e) {
      if (!langMenu.hidden && !langMenu.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !langMenu.hidden) { closeMenu(); langBtn.focus(); }
    });
  }

  /* ---------- footer ----------------------------------- */
  var cols = el('footCols');
  if (cols) {
    FOOTER.forEach(function (col) {
      var div = document.createElement('div');
      div.innerHTML = '<h3>' + col.title + '</h3><ul>' +
        col.links.map(function (l) { return '<li><a href="#start">' + l + '</a></li>'; }).join('') +
        '</ul>';
      cols.appendChild(div);
    });
  }

  var marquee = el('marquee');
  if (marquee) {
    var row = COURSES.map(function (c) { return '<li>' + flagSVG(c.flag) + c.name + '</li>'; }).join('');
    marquee.innerHTML = row + row; // duplicated so the -50% loop is seamless
  }

  /* ---------- sticky header shadow --------------------- */
  var header = el('siteHeader');
  function onScrollHeader() {
    header.classList.toggle('is-stuck', window.scrollY > 4);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- scroll reveal ---------------------------- */
  var targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduced) {
    targets.forEach(function (t) { t.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- parallax drift --------------------------- */
  var drift = el('drift');
  if (drift && !reduced) {
    var layers = Array.prototype.slice.call(drift.children).map(function (node) {
      var base = getComputedStyle(node).transform;
      return { node: node, depth: Number(node.dataset.depth || 0), base: base === 'none' ? '' : base };
    });
    var ticking = false;

    function paint() {
      var box = drift.getBoundingClientRect();
      var progress = (window.innerHeight - box.top) / (window.innerHeight + box.height); // 0 -> 1
      var shift = (progress - 0.5) * 2;
      layers.forEach(function (l) {
        l.node.style.transform = 'translate3d(0,' + (shift * l.depth).toFixed(1) + 'px,0) ' + l.base;
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }
})();
