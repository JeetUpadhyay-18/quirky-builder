/* ==========================================================================
   NAV.JS
   Two responsibilities:
   1. Hide the top bar while scrolling down, reveal it again when the user
      scrolls back up (and keep the skim-tracker in sync with it).
   2. Highlight the nav link for whichever section is currently in view,
      via IntersectionObserver, so the nav always matches where you are.
   ========================================================================== */

(function () {
  const nav = document.getElementById('global-navbar');
  const skimTracker = document.getElementById('skim-tracker');
  if (!nav) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const REVEAL_THRESHOLD = 9;   // ignore tiny scroll jitters
  const TOP_SAFE_ZONE = 0;      // always show nav near the very top of the page

  function onScroll() {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;

    nav.classList.toggle('nav-scrolled', currentY > 4);

    if (currentY < TOP_SAFE_ZONE) {
      nav.classList.remove('nav-hidden');
      if (skimTracker) skimTracker.classList.remove('nav-hidden-sync');
    } else if (Math.abs(delta) > REVEAL_THRESHOLD) {
      const scrollingDown = delta > 0;
      nav.classList.toggle('nav-hidden', scrollingDown);
      if (skimTracker) skimTracker.classList.toggle('nav-hidden-sync', scrollingDown);
    }

    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ---- Active-section highlighting ---- */
  const navLinks = document.querySelectorAll('#nav-links a[data-section]');
  const sections = Array.from(navLinks)
    .map((a) => document.getElementById(a.getAttribute('data-section')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove('nav-active'));
          const match = document.querySelector(`#nav-links a[data-section="${entry.target.id}"]`);
          if (match) match.classList.add('nav-active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach((sec) => observer.observe(sec));
  }
})();


// <=============Side Nav====================>
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('section[id]');

  // Smooth Click Scrolling & Top Anchor Fix
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');

      // If clicking Introduction, force scroll to absolute top of page
      if (targetId === '#intro') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ScrollSpy: Highlights links automatically based on scroll position
  function updateActiveLinkOnScroll() {
    const scrollPosition = window.scrollY;

    // At the top of the page, activate Introduction
    if (scrollPosition < 120) {
      navLinks.forEach(l => l.classList.remove('active'));
      const introLink = document.querySelector('.sidebar-link[href="#intro"]');
      if (introLink) introLink.classList.add('active');
      return;
    }

    // Otherwise detect active section
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar-link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveLinkOnScroll);
  updateActiveLinkOnScroll(); // Initial call
});