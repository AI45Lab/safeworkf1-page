/**
 * Homepage: scroll-triggered animations (Intersection Observer)
 */

(function () {
  'use strict';

  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.1,
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
    observer.observe(el);
  });
})();
