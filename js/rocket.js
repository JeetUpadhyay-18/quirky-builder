/* ==========================================================================
   ROCKET.JS
   Builds a zigzag path (left -> right -> left) down the full document,
   then walks the rocket figure along it with lerp smoothing so it feels
   buttery instead of jerky, plus a tilt based on horizontal velocity
   to sell the "swinging on a string" feel. Click it for a one-liner.
   ========================================================================== */

(function () {
  const svg = document.getElementById('string-svg');
  const pathEl = document.getElementById('string-path');
  const figure = document.getElementById('string-figure');
  const speech = document.getElementById('figure-speech');
  const layer = document.getElementById('scroll-string-layer');
  if (!svg || !pathEl || !figure || !layer) return;

  let totalLen = 0;
  let target = { x: 0, y: 0 };
  let current = { x: 0, y: 0 };
  let prevX = 0;
  let started = false;
  let lastScrollY = 0;
  let flipTarget = 0;   // 0 = nose-up (flying up), 180 = nose-down (flying down)
  let flipCurrent = 0;

  const oneLiners = [
    'String theory, product edition.',
    'This is basically me multitasking.',
    "Yes, I read the whole PRD. No, I didn't enjoy it.",
    'Currently swinging between scope and sanity.',
    'Ask me about my backlog. Please don\u2019t.',
    'I promise the demo will work this time.',
    'Still faster than getting design sign-off.',
    'Somewhere, a sprint is being over-committed.'
  ];

function buildPath() {
  const docH = document.documentElement.scrollHeight;
  const vw = window.innerWidth;
  layer.style.height = docH + 'px';
  svg.setAttribute('height', docH);
  svg.style.height = docH + 'px';

  const isNarrow = vw < 980;

  // 1. Explicit Safe Bounds
  const leftX = isNarrow ? Math.max(20, vw * 0.08) : Math.max(300, vw * 0.28); 
  const rightX = isNarrow ? (vw * 0.82) : Math.max(leftX + 100, Math.min(vw - 80, vw * 0.88));

  // 2. Start Y position aligned with the photo on the right
  const startY = isNarrow ? 220 : 280; 

  // 3. Start ON THE RIGHT side
  let points = [{ x: rightX, y: startY }];
  let y = startY;
  let targetRight = false; // Next point should go LEFT

  const segH = Math.max(420, Math.min(650, docH / 9));

  while (y < docH - 120) {
    y += segH;
    points.push({ x: targetRight ? rightX : leftX, y: y });
    targetRight = !targetRight;
  }

  // Build SVG Path
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }

  pathEl.setAttribute('d', d);
  totalLen = pathEl.getTotalLength();

  // Reset starting position to the first point on the right
  if (!started && totalLen > 0) {
    const p0 = pathEl.getPointAtLength(0);
    current.x = target.x = prevX = p0.x;
    current.y = target.y = p0.y;
  }
}


  function updateTarget() {
    if (!totalLen) return;
    const scrollTop = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    const pt = pathEl.getPointAtLength(progress * totalLen);
    target.x = pt.x;
    target.y = pt.y;

    // Scrolling down = rocket descending the page = flip to nose-down.
    // Scrolling up = rocket climbing back up = nose-up (default takeoff pose).
    const delta = scrollTop - lastScrollY;
    if (Math.abs(delta) > 0.5) {
      flipTarget = delta > 0 ? 180 : 0;
    }
    lastScrollY = scrollTop;
  }

  // UPDATE THE loop() FUNCTION IN js/rocket.js

  function loop() {
    current.x += (target.x - current.x) * 0.09;
    current.y += (target.y - current.y) * 0.09;
    
    let diff = flipTarget - flipCurrent;
    diff = ((diff + 180) % 360 + 360) % 360 - 180;
    flipCurrent = (flipCurrent + diff * 0.06 + 360) % 360;

    const dx = current.x - prevX;
    prevX = current.x;
    const tilt = Math.max(-16, Math.min(16, dx * 2.2));

    // 1. Rotate the rocket figure container as normal
    figure.style.transform = `translate(${current.x - 30}px, ${current.y - 96}px) rotate(${flipCurrent + tilt}deg)`;

    // 2. DYNAMIC FIX: Counter-rotate speech bubble so text stays right-side up!
    if (speech) {
      speech.style.transform = `translateX(-50%) rotate(${-flipCurrent - tilt}deg)`;
      
      // Toggle flipped class when nose is pointing down (descending)
      if (Math.abs(flipCurrent - 180) < 45) {
        speech.classList.add('descending');
      } else {
        speech.classList.remove('descending');
      }
    }

    requestAnimationFrame(loop);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildPath(); updateTarget(); }, 150);
  });
  window.addEventListener('scroll', updateTarget, { passive: true });

  if (speech) {
    figure.addEventListener('click', () => {
      speech.textContent = oneLiners[Math.floor(Math.random() * oneLiners.length)];
      speech.classList.add('show');
      clearTimeout(figure._speechTimer);
      figure._speechTimer = setTimeout(() => speech.classList.remove('show'), 2200);

      figure.classList.add('launching');
      clearTimeout(figure._launchTimer);
      figure._launchTimer = setTimeout(() => figure.classList.remove('launching'), 450);
    });
  }

  window.addEventListener('load', () => {
    buildPath();
    updateTarget();
    started = true;
    loop();
    setTimeout(buildPath, 600); // re-measure once fonts/images settle document height
  });
})();