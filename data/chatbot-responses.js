/* ==========================================================================
   CHATBOT-RESPONSES.JS (data module)
   Keyword -> answer pairs for the site assistant. Add a new entry any
   time you want the assistant to be able to answer a new question —
   js/chatbot.js only handles matching + rendering, not the content.
   ========================================================================== */

// In data/chatbot-responses.js
const chatbotKnowledgeBase = [
  {
    keywords: ['current', 'role', 'now', 'today', 'epc', 'sun pharma', 'job', 'work', 'doing'],
    answer: "At present, Mr. Upadhyay is directing product architecture at EPC Tech (Sun Pharma), orchestrating platforms such as Medgami, sir."
  },
  {
    keywords: ['previous', 'native', 'before', 'past job', 'associate', '2022', '2024'],
    answer: "Prior records indicate he was stationed at Native until December 2024, managing B2B analytics and platform metrics."
  },
  {
    keywords: ['who', 'about', 'profile'],
    answer: "Jeet Upadhyay is a Technical Product Analyst & AI Architect specializing in agentic systems and high-scale health tech."
  },
  {
    keywords: ['metric', 'impact', 'number', 'result'],
    answer: "Telemetry scan complete: 400% publishing expansion, 100K+ active medical professionals, and onboarding latency reduced by 50%."
  },
  {
    keywords: ['skill', 'capability', 'tech'],
    answer: "Primary diagnostics reveal expertise in Agentic Stacks (LangGraph, MCP), Systems Strategy, and Automated Data Pipelines."
  },
  {
    keywords: ['contact', 'email', 'reach', 'hire'],
    answer: "I can facilitate direct communications, sir. Utilize the contact matrix at the page terminus to initiate transmission."
  },
  {
    keywords: ['case', 'project', 'cipher', 'game'],
    answer: "Accessing archives: Featured deployments include Cipher, deep learning foundation models, and Lean Six Sigma optimizations."
  }
];

function findChatbotAnswer(rawInput) {
  const sanitized = rawInput.toLowerCase();
  for (const entry of chatbotKnowledgeBase) {
    for (const word of entry.keywords) {
      if (sanitized.includes(word)) return entry.answer;
    }
  }
  return "Query unparsed, sir. Shall I scan for 'role', 'capabilities', 'projects', or 'telemetry'?";
}