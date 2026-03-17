(function () {
  'use strict';

  // ── Fit Text ──
  // Scales h1 font-size so text fills container width edge-to-edge
  function fitText() {
    var el = document.querySelector('.title-bar h1');
    if (!el) return;
    var container = el.parentElement.tagName === 'A' ? el.parentElement.parentElement : el.parentElement;
    var width = container.clientWidth;
    if (width === 0) return;

    // Binary search for the right font size
    var lo = 8, hi = 500, mid;
    el.style.display = 'inline-block';
    while (hi - lo > 0.5) {
      mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';
      if (el.scrollWidth > width) {
        hi = mid;
      } else {
        lo = mid;
      }
    }
    el.style.fontSize = lo + 'px';
    el.style.display = 'block';

    // Update split container height
    var split = document.querySelector('.split-container');
    if (split) {
      var titleHeight = container.offsetHeight;
      split.style.height = 'calc(100vh - ' + titleHeight + 'px)';
    }
  }

  // Debounced resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitText, 50);
  });

  // Run fitText after font loads
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitText);
  } else {
    window.addEventListener('load', fitText);
  }
  // Also run immediately in case fonts are cached
  fitText();

  // ── Gallery Logic (main page only) ──
  var images = [];
  var currentIndex = -1;
  var state = 'a';

  var body = document.body;
  var photoEls = document.querySelectorAll('.photo-content img');
  var venueEls = document.querySelectorAll('.text-content .venue');
  var exhibitionEls = document.querySelectorAll('.text-content .exhibition');
  var dateEls = document.querySelectorAll('.text-content .date');

  // Skip gallery logic on info page
  var isMainPage = photoEls.length > 0;

  function pickRandom() {
    if (images.length === 0) return -1;
    if (images.length === 1) return 0;
    var next;
    do {
      next = Math.floor(Math.random() * images.length);
    } while (next === currentIndex);
    return next;
  }

  function display(index) {
    var item = images[index];
    if (!item) return;
    currentIndex = index;

    photoEls.forEach(function (el) {
      el.src = 'images/' + item.file;
      el.alt = item.venue + ' \u2014 ' + item.exhibition;
    });
    venueEls.forEach(function (el) { el.textContent = item.venue; });
    exhibitionEls.forEach(function (el) { el.textContent = item.exhibition; });
    dateEls.forEach(function (el) { el.textContent = item.date; });
  }

  function toggleState() {
    state = state === 'a' ? 'b' : 'a';
    body.classList.remove('state-a', 'state-b');
    body.classList.add('state-' + state);
  }

  function next() {
    var index = pickRandom();
    if (index === -1) return;
    display(index);
    toggleState();
    preloadNext();
  }

  function preloadNext() {
    var index = pickRandom();
    if (index === -1) return;
    var img = new Image();
    img.src = 'images/' + images[index].file;
  }

  if (isMainPage) {
    // Click handler — exclude info link and title link
    document.addEventListener('click', function (e) {
      if (e.target.closest('.info-link')) return;
      if (e.target.closest('.title-bar a')) return;
      next();
    });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        next();
      }
    });

    // Load data
    fetch('data/images.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        images = data;
        if (images.length > 0) {
          var first = Math.floor(Math.random() * images.length);
          display(first);
          preloadNext();
        }
      });
  }

  // Block context menu on images
  document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  // Block drag on images
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
})();
