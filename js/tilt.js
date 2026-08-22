/* ==========================================================================
   TILT.JS
   Cheap 3D tilt-on-hover for any element with .tilt-card — mouse position
   inside the card drives a small perspective rotation.
   ========================================================================== */

(function () {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  // Skip on touch-only devices where hover doesn't apply anyway.
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  if (!supportsHover) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${py * -4}deg) rotateY(${px * 4}deg) translateY(-2px)`;
      card.style.boxShadow = '4px 6px 10px rgba(0,0,0,0.08)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();
