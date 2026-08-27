document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.ide-sidebar');
  const editorBody = document.getElementById('editor-body');
  const tabName = document.getElementById('tab-name');
  const breadcrumb = document.getElementById('editor-breadcrumb');

  if (!sidebar || !editorBody) return;

  const fileData = {
    role: {
      folder: 'epc-tech', filename: 'product.js', badge: 'ORCHESTRATOR', title: 'Product Analyst — EPC Tech (Backed by Sun Pharma)',
      bullets: [
        'Scaled Medgami platform from 65K to 100K users',
        'Redesigned the onboarding funnel, Slashed the onboarding time from 2 mins to 50 seconds',
        'Orchestrating the communication between all verticals.'
      ],
      tags: ['Ecosystem Management', 'Roadmapping', 'PRDs', 'Stakeholder Sync']
    },
    tech: {
      folder: 'epc-tech', filename: 'tech.js', badge: 'TECH & ENGINEERING', title: 'AI & Chatbot',
      bullets: [
        'Built Claude news extraction pipelines for Medical feeds & Article summaries.',
        'Building a Customer Support bot 0-1 for quick assistance for doctors.',
        'Created workflow automations from Ideation to Deployment cutting time by <span class="hl-yellow">-45%</span>.'
      ],
      tags: ['Claude API', 'Jira Automation', 'Python Scripts', 'ChatBot']
    },
    ux: {
      folder: 'epc-tech', filename: 'ux.js', badge: 'UX & DESIGN', title: 'Specs & Wireframes',
      bullets: [
        'Extensively worked on Figma AI for generating working prototype models for new features.',
        'Conducted competitor analysis, benchmarking, customer interviews and surveys to give the best frictionless experience!'
      ],
      tags: ['Figma Specs', 'Wireframing', 'Design Systems', 'User Journeys']
    },
    crm: {
      folder: 'epc-tech', filename: 'crm.js', badge: 'CRM & DOCTORS', title: 'Customer Support/Experience',
      bullets: [
        'Created an internal Product granth bot using smaller AI model for solving product related queries',
        'Automating the ticketing journey to product basis the priority and impact'
      ],
      tags: ['Closed Communities', 'Group-Buy Logic', 'Doctor Engagement']
    },
    analytics: {
      folder: 'epc-tech', filename: 'analytics.js', badge: 'DATA & ANALYTICS', title: 'Funnel & Tracking Specs',
      bullets: [
        'End-to-end analytics performed using GA and Clevertap to identify the correct problem statement.',
        'Quering using SQL, reporting and structuring the correct data points for senior stakeholders.'
      ],
      tags: ['CleverTap', 'Funnel Analytics', 'SQL Queries', 'Telemetry Specs']
    },
    growth: {
      folder: 'epc-tech', filename: 'growth.js', badge: 'GROWTH & SCALE', title: 'User Scale & Onboarding',
      bullets: [
        'Increased engagement from 10% to 25% for Journal Article Module',
        'Increased news publishing from 50 to 250 integrating Claude AI within the system'
      ],
      tags: ['100K+ Scale', 'Onboarding Optimization', 'Content Curation']
    },
    native: {
      folder: 'native-co', filename: 'hr-tech.js', badge: 'PREVIOUS CHAPTER', title: 'Native — HR Tech Roots',
      bullets: [
        'Built internal HRM product for team operations',
        'Implementation of Kanban system for correct candidate tracking',
        'Created a complete PowerBI Dashboard for end-to-end market research for candidates.',
        'Closed <span class="hl-yellow">₹80L+</span> in enterprise sales.',
      ],
      tags: ['Enterprise Sales', 'HRM Product', 'Operations Dashboards']
    }
  };

  function renderFile(key) {
    const data = fileData[key];
    if (!data) return;

    const bulletLines = data.bullets.map((b, i) => `
      <div class="code-line"><span class="ln">${i + 2}</span><span class="code-text"> * ${b}</span></div>
    `).join('');

    const tagsHtml = data.tags.map(t => `<span class="tag-pill">${t}</span>`).join('');

    editorBody.innerHTML = `
      <span class="file-badge">${data.badge}</span>
      <h3 class="file-title">${data.title}</h3>
      <div class="code-block">
        <div class="code-line"><span class="ln">1</span><span class="code-text">/**</span></div>
        ${bulletLines}
        <div class="code-line"><span class="ln">${data.bullets.length + 2}</span><span class="code-text"> */</span></div>
      </div>
      <div class="tags-row">
        <span class="tags-label">tags:</span>
        ${tagsHtml}
      </div>
    `;
    editorBody.classList.remove('editor-body');
    void editorBody.offsetWidth;
    editorBody.classList.add('editor-body');

    tabName.textContent = data.filename;
    breadcrumb.textContent = `${data.folder} › ${data.filename}`;
  }

  // Folder collapse/expand
  sidebar.querySelectorAll('.folder-header').forEach(header => {
    header.addEventListener('click', () => {
      const key = header.dataset.folderToggle;
      const list = sidebar.querySelector(`[data-folder-list="${key}"]`);
      const chevron = header.querySelector('.chevron');
      const isOpen = !list.classList.contains('collapsed');

      list.classList.toggle('collapsed');
      chevron.textContent = isOpen ? '▸' : '▾';
      header.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // File selection
  sidebar.querySelectorAll('.file-row').forEach(row => {
    row.addEventListener('click', () => {
      sidebar.querySelectorAll('.file-row').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      renderFile(row.dataset.file);
    });
  });

  // Initial render
  renderFile('role');
});