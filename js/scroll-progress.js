/* ==========================================================================
   SCROLL-PROGRESS.JS
   Drives the thin top progress bar AND the top-right "skim tracker" —
   a ring + percentage + cheeky status label that gets more visual weight
   than the average scroll-progress footnote, per the brief.
   ========================================================================== */

(function () {
  const bar = document.getElementById('scroll-progress-bar');
  const pctEl = document.getElementById('skim-pct');
  const labelEl = document.getElementById('skim-label');
  const ringFill = document.getElementById('skim-ring-fill');
  if (!bar || !ringFill) return;

  const RADIUS = Number(ringFill.getAttribute('r'));
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  ringFill.style.strokeDasharray = `${CIRCUMFERENCE}`;

  const messages = [
    [0, 'Hey there'],
    [15, "you're reading now"],
    [35, 'committed. respect.'],
    [55, 'its a relationship!'],
    [75, "almost there!"],
    [95, 'you actually made it']
  ];

  function update() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));

    bar.style.width = pct + '%';
    ringFill.style.strokeDashoffset = `${CIRCUMFERENCE * (1 - pct / 100)}`;

    if (pctEl) pctEl.textContent = `${Math.round(pct)}%`;

    if (labelEl) {
      let msg = messages[0][1];
      for (const [threshold, text] of messages) {
        if (pct >= threshold) msg = text;
      }
      labelEl.textContent = msg;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
