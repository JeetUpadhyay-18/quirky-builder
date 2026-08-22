/* ==========================================================================
   REVEAL.JS
   Adds a quiet fade+rise entrance to any element carrying
   .reveal-on-scroll the first time it crosses into the viewport.
   This is what makes the page feel alive while you scroll, instead of
   the whole layout just being "there" the moment it loads.
   ========================================================================== */

(function () {
  const targets = document.querySelectorAll('.reveal-on-scroll');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach((el) => observer.observe(el));
})();