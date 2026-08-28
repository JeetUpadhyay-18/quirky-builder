/* ==========================================================================
   CHATBOT-RESPONSES.JS (data module)
   ==========================================================================
   Topic -> keyword/response pairs for the site assistant, plus the matching
   engine. js/chatbot.js only handles rendering — all "knowledge" lives here.

   HOW MATCHING WORKS
   -------------------
   Each topic lists `keywords`. A keyword can be:
     - a phrase ("power bi")  -> matched if it appears anywhere in the raw
       input. Worth 3 points (phrases are unambiguous, so they win ties).
     - a single word ("python") -> matched if it appears as a whole token.
       Worth 2 points. If no exact token matches, we also try a light
       typo-tolerant match (edit distance <= 1 on words 4+ letters) worth
       1 point, so "pyhton" or "kaban" still land somewhere sensible.
   The topic with the highest total score wins, as long as it clears
   MIN_SCORE. Below that, the user gets the fallback with category chips
   instead of a wrong guess.

   TO ADD A NEW TOPIC: copy an existing block, give it a unique id, list
   keywords, write one or more responses (a random one is picked each time
   for a little variety), and optionally suggest 2 followUps.
   ========================================================================== */

const chatbotKnowledgeBase = [

  // ---------------------------------------------------------------- IDENTITY
  {
    id: 'identity',
    keywords: ['profile', 'yourself', 'jeet', 'introduce', 'intro', 'who is jeet', 'about jeet'],
    responses: [
      "**Jeet Upadhyay** — Technical Product Analyst & Builder with an engineering foundation, currently architecting agentic AI systems and scaling digital healthcare platforms, sir.",
      "Profile summary: a product builder who leans on LLM frameworks and automated workflows to move fast from **zero-to-one prototyping** through to production validation, sir."
    ],
    followUps: ["What's his current role?", 'Core skills', 'Show me projects']
  },

  // ------------------------------------------------------------ CURRENT ROLE
  {
    id: 'role-current',
    keywords: ['current role', 'current job', 'present role', 'right now', 'today', 'epc', 'epc tech', 'sun pharma', 'job', 'work', 'currently', 'company', 'role', 'position'],
    responses: [
      "Currently **Product Analyst / Builder at EPC Tech** (backed by Sun Pharma), since **January 2025** — owning product strategy, execution, and lifecycle for the **Medgami** platform, sir."
    ],
    followUps: ['Tell me about the support bot', 'What is Product Granth?', 'Growth & onboarding numbers']
  },
  {
    id: 'support-bot',
    keywords: ['support bot', 'customer support', 'medgami bot', 'conversational bot', 'zoho', 'chatbot project'],
    responses: [
      "Built and deployed the **Conversational Support Bot** for Medgami — across Web and Mobile — from zero-to-one, with guided flows for instant resolution and automated escalation to the **Zoho CRM** team for complex cases, sir."
    ],
    followUps: ['What is Product Granth?', 'Current role overview']
  },
  {
    id: 'product-granth',
    keywords: ['product granth', 'granth', 'search engine', 'admin bot', 'internal bot', 'ai search'],
    responses: [
      "**Product Granth** is an internal admin chatbot powered by lightweight GPT models, guiding operations teams step-by-step through workflows — paired with the spec and roadmap for an AI search engine surfacing high-relevance medical results for doctors, sir."
    ],
    followUps: ['Workflow tooling', 'Current role overview']
  },
  {
    id: 'workflow-tooling',
    keywords: ['workflow', 'tooling', 'prd generation', 'wireframe ideation', 'feature delivery', 'scoping'],
    responses: [
      "Embedded custom AI workflows — **Figma AI + GPT** — into early-stage scoping, PRD generation, and wireframe ideation, accelerating feature delivery lifecycles by **45%**, sir."
    ],
    followUps: ['Growth & onboarding numbers', 'AI & agentic skills']
  },
  {
    id: 'growth-onboarding',
    keywords: ['growth', 'onboarding', 'funnel', 'time to onboard', '65k', '90k', 'users'],
    responses: [
      "Scaled Medgami organically from **65K to 90K+ users**, and redesigned the onboarding funnel via behavioral analysis — cutting time-to-onboard **58%**, from two minutes down to fifty seconds, sir."
    ],
    followUps: ['Content pipeline numbers', 'Integrations & monetization']
  },
  {
    id: 'content-pipeline',
    keywords: ['content pipeline', 'publishing', 'summarization', 'gpt ingestion', 'articles', 'generative ai content'],
    responses: [
      "Engineered automated **Claude/GPT ingestion and summarization pipelines** for medical research and news — scaling daily publishing **400%**, from 50 to 250 articles a day, while cutting time-to-value, sir."
    ],
    followUps: ['Integrations & monetization', 'Key metrics overview']
  },
  {
    id: 'integrations-monetization',
    keywords: ['integration', 'monetization', 'revenue', 'webinar', 'payment gateway', 'journal access'],
    responses: [
      "Led end-to-end API integration for full-text journal access, cutting access time **99%** — from 24 hours to under 2 minutes — and launched a Zoom-integrated webinar and payment module driving a **20% lift** in platform revenue, sir."
    ],
    followUps: ['Previous role at Native', 'Key metrics overview']
  },

  // ----------------------------------------------------------- PREVIOUS ROLE
  {
    id: 'role-previous',
    keywords: ['previous', 'native', 'before', 'past job', 'associate', 'prior', 'last role', 'last company'],
    responses: [
      "Prior post: **Digital Technology & Analytics – Associate 3 at Native**, July 2022 to December 2024, leading data analytics execution and pipeline operations for proprietary B2B platforms, sir."
    ],
    followUps: ['What did he build there?', 'Education background']
  },
  {
    id: 'native-details',
    keywords: ['hrms', 'recruitment portal', 'kanban', 'bfsi', '80 lakhs', 'commercial impact', 'candidate tracker'],
    responses: [
      "At Native, he co-built a proprietary **B2B HRMS recruitment portal** with a Kanban candidate tracker and an LLM candidate-response summarizer, launched **Power BI** dashboards for the BFSI tech unit, and directly drove **₹80 Lakhs** in platform-enabled revenue, sir."
    ],
    followUps: ['Current role at EPC Tech', 'Education background']
  },

  // --------------------------------------------------------------- EDUCATION
  {
    id: 'education',
    keywords: ['education', 'college', 'degree', 'cpi', 'polytechnic', 'study', 'studied', 'university'],
    responses: [
      "Academic record: **B.Tech in Mechanical Engineering**, Sardar Patel College of Engineering, Mumbai (**8.93 CPI**) — preceded by a **Diploma in Mechanical Engineering**, Thakur Polytechnic, Mumbai (**94%**), sir."
    ],
    followUps: ['Certifications', 'Core skills']
  },
  {
    id: 'certificates',
    keywords: ['certificate', 'certification', 'course', 'udemy', 'anthropic course', 'mcp course'],
    responses: [
      "Certifications on file: **The Complete Agent and MCP Course** (Udemy), Claude Code in Action, AI Fluency Framework, Building with Claude API, Introduction to MCP + Advanced Topics (all Anthropic), **Lean Six Sigma Black Belt**, Power BI for Business Intelligence, and Microsoft Power Automate, sir."
    ],
    followUps: ['Education background', 'Core skills']
  },

  // ------------------------------------------------------------------ SKILLS
  {
    id: 'skills-overview',
    keywords: ['skill', 'skills', 'tech stack', 'capabilities', 'stack', 'expertise'],
    responses: [
      "Four stacks on record: **AI & Agentic Systems**, **Product Management**, **Data & Analytics**, and **Tools & Methodologies**. Ask about any one directly, sir."
    ],
    followUps: ['AI & agentic skills', 'Product management skills', 'Data & analytics skills']
  },
  {
    id: 'skills-ai',
    keywords: ['agentic', 'llm', 'openai sdk', 'gemini', 'langgraph', 'mcp', 'neural network', 'ai connector'],
    responses: [
      "**AI & Agentic Systems:** OpenAI SDK, agent building & deployment (Gemini), Figma AI, Rovo AI, Replit, Vercel, AI connectors, and a working depth in neural network architecture, sir."
    ],
    followUps: ['Product management skills', 'Data & analytics skills']
  },
  {
    id: 'skills-pm',
    keywords: ['product management', 'roadmap', 'gtm', 'prd', 'user research', 'product discovery', 'ideation', 'wireframing'],
    responses: [
      "**Product Management:** ideation, product discovery, GTM strategy, roadmapping, PRDs & scope documents, wireframing, user research, Figma, and prototyping, sir."
    ],
    followUps: ['AI & agentic skills', 'Data & analytics skills']
  },
  {
    id: 'skills-data',
    keywords: ['sql', 'python', 'power bi', 'clevertap', 'ab testing', 'a/b testing', 'system design', 'data analytics'],
    responses: [
      "**Data & Analytics:** SQL, Python, Power BI, CleverTap, A/B testing, and system design, sir."
    ],
    followUps: ['Tools & methodologies', 'AI & agentic skills']
  },
  {
    id: 'skills-tools',
    keywords: ['agile', 'scrum', 'postman', 'jira', 'methodolog'],
    responses: [
      "**Tools & Methodologies:** Agile/Scrum, Postman, Figma, and Jira workflow automation, sir."
    ],
    followUps: ['Core skills overview', "What's his current role?"]
  },

  // ---------------------------------------------------------------- PROJECTS
  {
    id: 'project-cipher',
    keywords: ['cipher', 'game', 'vibe coding', 'pet project', 'tap to start'],
    responses: [
      "**Cipher** — a pet project built via vibe coding: a tap-to-start browser game, sir. Purely for the love of building."
    ],
    followUps: ['Deep learning projects', 'Lean Six Sigma project']
  },
  {
    id: 'project-deep-learning',
    keywords: ['deep learning', 'transformer', 'bigram', 'mlp', 'pytorch', 'karpathy', 'multi-layer perceptron'],
    responses: [
      "Built a **Bigram Character Model**, a **Multi-Layer Perceptron**, and foundational **Transformer** components from scratch in Python/PyTorch, following Andrej Karpathy's neural network series, sir."
    ],
    followUps: ['Cipher game', 'AI & agentic skills']
  },
  {
    id: 'project-six-sigma',
    keywords: ['lean six sigma', 'black belt', 'dmaic', 'supply chain', 'research paper'],
    responses: [
      "Led a **Lean Six Sigma Black Belt** project using the DMAIC framework to isolate and eliminate supply chain inefficiencies, and published a research paper on Lean-Agile applications in healthcare logistics, sir."
    ],
    followUps: ['Zooper Retail case study', 'Certifications']
  },
  {
    id: 'project-case-study',
    keywords: ['zooper', 'retail case', 'nupi', 'loyalty platform', 'business analyst case'],
    responses: [
      "Authored an end-to-end Business Analyst case study on **Zooper Retail** (the NUPI Loyalty Platform), focused on user retention and loop mechanics, sir."
    ],
    followUps: ['Lean Six Sigma project', 'Deep learning projects']
  },
  {
    id: 'projects-overview',
    keywords: ['project', 'projects', 'side project', 'portfolio piece', 'built anything'],
    responses: [
      "On record: **Cipher** (a tap-to-start game), deep learning foundations from scratch (PyTorch), a **Lean Six Sigma Black Belt** project, and a Business Analyst case study on **Zooper Retail**. Ask about any one, sir."
    ],
    followUps: ['Cipher game', 'Deep learning projects', 'Lean Six Sigma project']
  },

  // ------------------------------------------------------------------ METRICS
  {
    id: 'metrics',
    keywords: ['metric', 'metrics', 'impact', 'numbers', 'result', 'achievement', 'stats', 'telemetry'],
    responses: [
      "Telemetry summary: **400%** publishing growth (50→250 articles/day), **90K+** users onboarded, **58%** faster onboarding, **45%** faster feature delivery, **99%** faster journal access, **20%** revenue lift, and **₹80L** in revenue driven at Native, sir."
    ],
    followUps: ['Current role details', 'Previous role details']
  },

  // ------------------------------------------------------------------ CONTACT
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'hire', 'connect', 'linkedin', 'hire him'],
    responses: [
      "I can facilitate direct communications, sir. Use the contact matrix at the page terminus to initiate transmission."
    ],
    followUps: ['Core skills', 'Projects overview']
  },

  // ------------------------------------------------------------- SMALL TALK
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'yo', 'greetings', 'sup'],
    responses: [
      "Systems online. Good to see you, sir — ask me anything about Jeet's work.",
      "Hello, sir. Ready when you are — try 'current role' or 'skills'."
    ],
    followUps: ['Current role', 'Core skills', 'Projects']
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'thx', 'appreciate'],
    responses: ["Always a pleasure, sir."]
  },
  {
    id: 'farewell',
    keywords: ['bye', 'goodbye', 'see ya', 'later', 'exit'],
    responses: ["Standing by, sir. Reach out anytime."]
  },
  {
    id: 'bot-identity',
    keywords: ['are you real', 'are you ai', 'are you a bot', 'who made you', 'your name'],
    responses: [
      "A rules-based assistant running entirely client-side on this portfolio, sir — no server, no external calls, just structured knowledge about Jeet."
    ]
  },
  {
    id: 'help',
    keywords: ['help', 'what can you do', 'what can i ask', 'options', 'commands'],
    responses: [
      "Ask about: current role, past role, education, skills, projects, metrics, certifications, or contact — I'll pull the relevant file, sir."
    ],
    followUps: ['Current role', 'Core skills', 'Projects']
  }
];

// Categories shown when nothing matches well enough.
const FALLBACK_CATEGORIES = ['Current role', 'Skills', 'Projects', 'Education', 'Metrics', 'Contact'];
const MIN_SCORE = 2;

function normalize(str) {
  return str.toLowerCase().replace(/[^\w\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Small edit-distance check so minor typos ("pyhton", "kaban") still land.
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 1) return 2; // short-circuit, we only care about <=1
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function scoreTopic(rawText, tokens, topic) {
  let score = 0;
  // Tracks which input tokens have already earned points for this topic,
  // so near-duplicate keywords in the same topic (e.g. "skill"/"skills",
  // "project"/"projects") can't both score off the same word in the query.
  const claimedTokens = new Set();

  for (const kw of topic.keywords) {
    if (kw.includes(' ')) {
      if (rawText.includes(kw)) score += 3;
      continue;
    }
    const exactToken = tokens.find((t) => t === kw && !claimedTokens.has(t));
    if (exactToken) {
      claimedTokens.add(exactToken);
      score += 2;
      continue;
    }
    // Prefix match handles simple word-form variants (certification/
    // certifications, project/projects) without a full stemmer.
    if (kw.length >= 4) {
      const prefixToken = tokens.find((t) => t.length >= 4 && !claimedTokens.has(t) && (t.startsWith(kw) || kw.startsWith(t)));
      if (prefixToken) {
        claimedTokens.add(prefixToken);
        score += 2;
        continue;
      }
      const fuzzyToken = tokens.find((t) => t.length >= 4 && !claimedTokens.has(t) && levenshtein(t, kw) <= 1);
      if (fuzzyToken) {
        claimedTokens.add(fuzzyToken);
        score += 1;
      }
    }
  }
  return score;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns { text, followUps } for a raw user query.
 */
function findChatbotAnswer(rawInput) {
  const rawText = normalize(rawInput);
  if (!rawText) {
    return { text: "Say the word, sir.", followUps: FALLBACK_CATEGORIES };
  }
  const tokens = rawText.split(' ');

  let best = null;
  let bestScore = 0;
  for (const topic of chatbotKnowledgeBase) {
    const s = scoreTopic(rawText, tokens, topic);
    if (s > bestScore) {
      bestScore = s;
      best = topic;
    }
  }

  if (best && bestScore >= MIN_SCORE) {
    return {
      text: pickRandom(best.responses),
      followUps: best.followUps || []
    };
  }

  return {
    text: "Query unparsed, sir. Try current role, skills, projects, education, metrics, or contact.",
    followUps: FALLBACK_CATEGORIES
  };
}