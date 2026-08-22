document.addEventListener('DOMContentLoaded', () => {
  const nodes = document.querySelectorAll('.satellite-node, .core-node');
  const inspectorPanel = document.getElementById('inspector-panel');

  if (!nodes.length || !inspectorPanel) return;

  const scopeData = {
    core: {
      tag: 'CORE ROLE',
      title: 'Product Analyst — EPC Tech',
      list: [
        'Orchestrating cross-functional execution across engineering, design, and growth teams.',
        'Bridging technical API requirements directly with doctor user experience loops.'
      ],
      skills: ['Ecosystem Management', 'Roadmapping', 'PRDs', 'Stakeholder Sync']
    },
    tech: {
      tag: 'TECH & ENGINEERING',
      title: 'Automation & Pipelines',
      list: [
        'Built Claude news extraction pipelines for medical feeds.',
        'Created Jira automations cutting ideation-to-ticket time by <span class="hl-yellow">-45%</span>.'
      ],
      skills: ['Claude API', 'Jira Automation', 'Python Scripts', 'Kafka Workflows']
    },
    ux: {
      tag: 'UX & DESIGN',
      title: 'Specs & Wireframes',
      list: [
        'Authored Figma API specs and interactive wireframe flows.',
        'Managed design system component synchronization across mobile & web.'
      ],
      skills: ['Figma Specs', 'Wireframing', 'Design Systems', 'User Journeys']
    },
    crm: {
      tag: 'CRM & DOCTORS',
      title: 'Community & Group Buy',
      list: [
        'Architected closed-group "Community" module for specialist doctors.',
        'Designed group-buy cost splitting logic for high-value article requests.'
      ],
      skills: ['Closed Communities', 'Group-Buy Logic', 'Doctor Engagement']
    },
    analytics: {
      tag: 'DATA & ANALYTICS',
      title: 'Funnel & Tracking Specs',
      list: [
        'Mapped behavioral conversion funnels across doctor touchpoints.',
        'Wrote CleverTap event tracking specs for real-time feature telemetry.'
      ],
      skills: ['CleverTap', 'Funnel Analytics', 'SQL Queries', 'Telemetry Specs']
    },
    growth: {
      tag: 'GROWTH & SCALE',
      title: 'User Scale & Onboarding',
      list: [
        'Scaled platform reach to <span class="hl-yellow">100K+</span> active doctor users.',
        'Cut user onboarding flow time down to <span class="hl-yellow">50 seconds</span>.'
      ],
      skills: ['100K+ Scale', 'Onboarding Optimization', 'Content Curation']
    },
    native: {
      tag: 'PREVIOUS CHAPTER',
      title: 'Native — HR Tech Roots',
      list: [
        'Closed <span class="hl-yellow">₹80L+</span> in enterprise sales.',
        'Built internal HRM product for team operations and shipped operational dashboards.'
      ],
      skills: ['Enterprise Sales', 'HRM Product', 'Operations Dashboards']
    }
  };

  function renderInspector(scopeKey) {
    const data = scopeData[scopeKey];
    if (!data) return;

    const listHtml = data.list.map(item => `<li>${item}</li>`).join('');
    const skillsHtml = data.skills.map(skill => `<span>${skill}</span>`).join('');

    inspectorPanel.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-header">
          <span class="badge-tag">${data.tag}</span>
          <h3>${data.title}</h3>
        </div>
        <ul class="inspector-list">
          ${listHtml}
        </ul>
        <div class="capability-pills">
          ${skillsHtml}
        </div>
      </div>
    `;
  }

  // Handle Node Clicks / Hovers
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      renderInspector(node.dataset.scope);
    });

    node.addEventListener('mouseenter', () => {
      renderInspector(node.dataset.scope);
    });
  });
});