/* ==========================================================================
   CASE-STUDIES.JS (data module)
   Content for the "Review System Parameters" modal windows.
   Edit the text here — modal.js only handles rendering, not copy.
   ========================================================================== */

const caseStudiesStaticData = {
  'case-1': {
    title: 'Cipher (Number Deduction Game)',
    meta: 'Core Systems Architecture & Learning Node',
    body: `<p><strong>System Parameters:</strong> Handles active client-side canvas matrices, strict array checking validations, dynamic audio node oscillators, and game state mutation history trackers via a streamlined local data schema model.</p>
      <div class="modal-stack-block">
        <strong>Stack Integrations:</strong><br>
        • Web Audio API Core Synthesis Framework<br>
        • JavaScript Object Architecture State Tracking
      </div>`
  },
  'case-2': {
    title: 'Deep Learning Foundations',
    meta: 'Computational Core Lab Data',
    body: `<p><strong>System Parameters:</strong> Pure pythonic matrix tensor operations, building multi-head attention blocks, embedding calculations, and foundational structural transformer parameters built using standard backpropagation layers.</p>
      <div class="modal-stack-block">
        <strong>Stack Integrations:</strong><br>
        • Python / PyTorch Library Dependencies<br>
        • Tokenization Caching Strategies
      </div>`
  },
  'case-3': {
    title: 'Lean Six Sigma Black Belt Metrics',
    meta: 'Operational Logistics Refactor',
    body: `<p><strong>System Parameters:</strong> Structured data analysis tracking workflow bottlenecks, isolating critical inventory friction, and formulating automated validation checks over data loops to secure delivery performance scales.</p>
      <div class="modal-stack-block">
        <strong>Stack Integrations:</strong><br>
        • DMAIC Control &amp; Optimization Diagrams<br>
        • Process Flow Mapping Data Schemes
      </div>`
  },
  'case-4': {
    title: 'Zooper Retail Platform Optimization',
    meta: 'Product Strategy & User Retention Loops',
    body: `<p><strong>System Parameters:</strong> Behavioral event cohort modeling, optimizing critical referral mechanics loops, user data acquisition mapping, and defining clear North Star priority tracking criteria rules.</p>
      <div class="modal-stack-block">
        <strong>Stack Integrations:</strong><br>
        • Retention Curve Metric Analysis Panels<br>
        • Cohort Strategy Mapping Diagrams
      </div>`
  }
};


function toggleCaseStudy(btn) {
  const card = btn.closest('.case-card');
  const label = btn.querySelector('.reveal-text');
  
  card.classList.toggle('is-expanded');
  
  if (card.classList.contains('is-expanded')) {
    label.textContent = 'Close details';
  } else {
    label.textContent = 'Click to view Key aspects';
  }
}