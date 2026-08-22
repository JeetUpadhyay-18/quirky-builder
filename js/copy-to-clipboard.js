/* ==========================================================================
   COPY-TO-CLIPBOARD.JS
   Small dopamine hit on the contact block: click a .copy-line and it
   swaps its text for a confirmation toast, then reverts.
   ========================================================================== */

(function () {
  document.querySelectorAll('.copy-line').forEach((el) => {
    el.addEventListener('click', () => {
      const original = el.textContent;
      const toast = el.getAttribute('data-copy-toast') || 'Copied.';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(original).catch(() => {});
      }
      el.textContent = toast;
      setTimeout(() => { el.textContent = original; }, 1600);
    });
  });
})();
