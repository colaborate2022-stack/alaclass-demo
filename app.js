/* =========================================================
   À La Class — page behaviour
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- data ------------------------------------- */
  // Each topic carries its own little flat icon, drawn on a 24x24 grid.
  var COURSES = [
    { name: 'Food Safety', icon:
      '<circle cx="12" cy="12" r="8.2" fill="#fff" stroke="#2e77f0" stroke-width="1.7"/>' +
      '<path d="M8.4 12.3l2.4 2.4 4.7-4.9" fill="none" stroke="#2e77f0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Customer Service', icon:
      '<circle cx="9" cy="8.6" r="3.3" fill="#2e77f0"/>' +
      '<path d="M3.2 19.5c0-3.4 2.6-5.8 5.8-5.8s5.8 2.4 5.8 5.8z" fill="#2e77f0"/>' +
      '<circle cx="17" cy="10.4" r="2.7" fill="#21b3d4"/>' +
      '<path d="M12.8 19.5c0-2.8 1.9-4.7 4.2-4.7s4.2 1.9 4.2 4.7z" fill="#21b3d4"/>' },
    { name: 'Housekeeping', icon:
      '<rect x="1.8" y="7.5" width="2.6" height="12" rx="1.3" fill="#1e58c4"/>' +
      '<rect x="1.8" y="13.6" width="20.4" height="5.9" rx="2.2" fill="#2e77f0"/>' +
      '<rect x="5.2" y="9.2" width="6.8" height="4.6" rx="2.3" fill="#e9f1fe"/>' +
      '<path d="M12.4 13.8v-1.6a2.6 2.6 0 0 1 2.6-2.6h5.2a2 2 0 0 1 2 2v2.2z" fill="#7fb0f8"/>' },
    { name: 'Bartending', icon:
      '<path d="M3.6 4.4h16.8L12 13.2z" fill="#21b3d4"/>' +
      '<rect x="11" y="12.6" width="2" height="6.4" fill="#1e58c4"/>' +
      '<rect x="7.4" y="18.4" width="9.2" height="2.3" rx="1.15" fill="#1e58c4"/>' +
      '<circle cx="16.4" cy="6.3" r="1.9" fill="#ff6b5e"/>' },
    { name: 'Barista Skills', icon:
      '<path d="M3.4 8.8h12.4v6.4a4.2 4.2 0 0 1-4.2 4.2H7.6a4.2 4.2 0 0 1-4.2-4.2z" fill="#2e77f0"/>' +
      '<path d="M16 10.4h1.9a2.7 2.7 0 0 1 0 5.4H16" fill="none" stroke="#2e77f0" stroke-width="1.8"/>' +
      '<path d="M7.6 2.8c-1 1.6 1 2.1 0 3.7M11.6 2.8c-1 1.6 1 2.1 0 3.7" fill="none" stroke="#9ec4fb" stroke-width="1.7" stroke-linecap="round"/>' },
    { name: 'Wine Service', icon:
      '<path d="M7.3 2.8h9.4l-.7 6.3a4.1 4.1 0 0 1-8 0z" fill="#c62828"/>' +
      '<rect x="11" y="12.8" width="2" height="6.2" fill="#1e58c4"/>' +
      '<rect x="7.4" y="18.5" width="9.2" height="2.3" rx="1.15" fill="#1e58c4"/>' },
    { name: 'Front Desk', icon:
      '<path d="M2.8 16.2a9.2 9.2 0 0 1 18.4 0z" fill="#2e77f0"/>' +
      '<rect x="1.6" y="16.2" width="20.8" height="3" rx="1.5" fill="#1e58c4"/>' +
      '<circle cx="12" cy="4.6" r="2" fill="#ffc93c"/>' },
    { name: 'Allergen Awareness', icon:
      '<path d="M12 3.2 22.2 20.4H1.8z" fill="#ffc93c"/>' +
      '<rect x="10.8" y="9.4" width="2.4" height="6" rx="1.2" fill="#21322c"/>' +
      '<circle cx="12" cy="17.6" r="1.4" fill="#21322c"/>' },
    { name: 'Fire Safety', icon:
      '<path d="M12 2.5c2.6 4.6-.9 5.6.9 8.3 1.3 1.9 3.6.5 3.6-2.3 2.7 2.8 3.5 5.5 3.5 7.8 0 4.1-3.6 6.2-8 6.2s-8-2.1-8-6.2c0-4.6 4.5-8.2 8-13.8z" fill="#ff9f43"/>' +
      '<path d="M12 12.6c1.4 2.3-.5 3.2.4 4.6.9.9 2.3 0 2.3-1.4 1.4 1.4 1.8 2.7 1.8 4 0 2.1-1.8 3-4.5 3s-4.5-.9-4.5-3c0-2.3 2.7-4.6 4.5-7.2z" fill="#ffd36b"/>' },
    { name: 'First Aid', icon:
      '<rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6" fill="#ff6b5e"/>' +
      '<path d="M10.1 6.4h3.8v3.7h3.7v3.8h-3.7v3.7h-3.8v-3.7H6.4v-3.8h3.7z" fill="#fff"/>' },
    { name: 'Upselling', icon:
      '<rect x="2.6" y="13.6" width="4.6" height="7.4" rx="1.8" fill="#9ec4fb"/>' +
      '<rect x="9.7" y="9.4" width="4.6" height="11.6" rx="1.8" fill="#4d90f4"/>' +
      '<rect x="16.8" y="4.2" width="4.6" height="16.8" rx="1.8" fill="#2e77f0"/>' },
    { name: 'Complaint Handling', icon:
      '<path d="M2.6 6a3.2 3.2 0 0 1 3.2-3.2h12.4A3.2 3.2 0 0 1 21.4 6v7.8a3.2 3.2 0 0 1-3.2 3.2h-7l-5.2 4.2 1.1-4.2a3.2 3.2 0 0 1-2.5-3.2z" fill="#8b5cf6"/>' +
      '<circle cx="8.4" cy="9.9" r="1.5" fill="#fff"/><circle cx="12" cy="9.9" r="1.5" fill="#fff"/><circle cx="15.6" cy="9.9" r="1.5" fill="#fff"/>' },
    { name: 'Table Service', icon:
      '<g stroke="#2e77f0" stroke-width="2" stroke-linecap="round" fill="none"><path d="M5.2 2.8v5M9.4 2.8v5M7.3 21v-9.2"/></g>' +
      '<path d="M4.3 7.8h6a.8.8 0 0 1 .78 1.2c-.6 1.7-2 2.6-3.78 2.6s-3.18-.9-3.78-2.6a.8.8 0 0 1 .78-1.2z" fill="#2e77f0"/>' +
      '<path d="M17.4 2.8c2.1 0 3.4 3.1 3.4 6.4 0 2.5-.9 4-2.3 4.4V21h-2.2V2.8z" fill="#1e58c4"/>' },
    { name: 'Kitchen Hygiene', icon:
      '<path d="M12 3.2c3.3 4.3 6.2 7.2 6.2 10.4a6.2 6.2 0 0 1-12.4 0c0-3.2 2.9-6.1 6.2-10.4z" fill="#21b3d4"/>' +
      '<circle cx="9.7" cy="13.8" r="1.8" fill="#fff" opacity=".75"/>' +
      '<circle cx="18.4" cy="5.4" r="2.1" fill="#9ee6f5"/>' },
    { name: 'Reservations', icon:
      '<rect x="2.6" y="4.6" width="18.8" height="16.4" rx="3.6" fill="#2e77f0"/>' +
      '<path d="M2.6 8.2h18.8V7.9a3.3 3.3 0 0 0-3.3-3.3H5.9A3.3 3.3 0 0 0 2.6 7.9z" fill="#1e58c4"/>' +
      '<rect x="6.3" y="2.2" width="2.7" height="5" rx="1.35" fill="#1e58c4"/>' +
      '<rect x="15" y="2.2" width="2.7" height="5" rx="1.35" fill="#1e58c4"/>' +
      '<g fill="#fff"><circle cx="8.4" cy="13.4" r="1.5"/><circle cx="12" cy="13.4" r="1.5"/><circle cx="15.6" cy="13.4" r="1.5"/><circle cx="8.4" cy="17.4" r="1.5"/><circle cx="12" cy="17.4" r="1.5"/></g>' },
    { name: 'Team Leadership', icon:
      '<path d="m12 2.2 3.05 6.18 6.82 1-4.94 4.81 1.17 6.79L12 17.77l-6.1 3.21 1.17-6.79L2.13 9.38l6.82-1z" fill="#ffc93c"/>' }
  ];


  var FOOTER = [
    { title: 'Privacy',   links: ['Community guidelines', 'Terms', 'Privacy policy', 'Cookie settings', 'Accessibility', 'Do not sell my info'] }
  ];

  /* ---------- helpers ---------------------------------- */
  function icoSVG(markup) {
    return '<svg class="tico" viewBox="0 0 24 24" aria-hidden="true">' + markup + '</svg>';
  }

  function el(id) { return document.getElementById(id); }

  /* ---------- course strip ----------------------------- */
  var rail = el('stripRail');
  if (rail) {
    COURSES.forEach(function (c, i) {
      var li = document.createElement('li');
      li.innerHTML = '<button type="button"' + (i === 0 ? ' aria-current="true"' : '') + '>' +
        icoSVG(c.icon) + '<span>' + c.name + '</span></button>';
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
    var row = COURSES.map(function (c) { return '<li>' + icoSVG(c.icon) + c.name + '</li>'; }).join('');
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
