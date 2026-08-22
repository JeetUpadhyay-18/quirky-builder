/* ==========================================================================
   MODAL.JS
   Opens/closes the "Review System Parameters" case-study modal.
   Content lives in data/case-studies.js — this file only renders it.
   ========================================================================== */

function displayCaseDetails(id) {
  const targetData = caseStudiesStaticData[id];
  if (!targetData) return;

  document.getElementById('modal-viewport-container').innerHTML = `
    <div style="margin-bottom: 10px;">
      <span style="font-size: 0.7rem; color: var(--ink-blue);" class="monospace">// ${targetData.meta}</span>
      <h3 style="font-size: 1.1rem; font-weight: bold; margin-top: 2px;">${targetData.title}</h3>
    </div>
    <div style="border-top: 1px dashed #000; padding-top: 10px; font-size: 0.85rem;">${targetData.body}</div>
  `;

  const overlay = document.getElementById('case-study-modal-overlay');
  overlay.style.display = 'flex';
  overlay.classList.remove('hidden');
  // Force a reflow so the transition below actually plays.
  void overlay.offsetWidth;
  overlay.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}

function hideCaseModal() {
  const overlay = document.getElementById('case-study-modal-overlay');
  overlay.classList.remove('is-visible');
  document.body.style.overflow = '';
  setTimeout(() => {
    overlay.style.display = 'none';
    overlay.classList.add('hidden');
  }, 200);
}

// Close on Escape, and on click outside the card.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('case-study-modal-overlay');
    if (overlay && overlay.classList.contains('is-visible')) hideCaseModal();
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('case-study-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideCaseModal();
    });
  }
});
