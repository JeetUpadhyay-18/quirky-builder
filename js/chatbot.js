/* ==========================================================================
   CHATBOT.JS
   Drives the floating "Ask Assistant" widget. Answer content lives in
   data/chatbot-responses.js — this file only handles the UI: opening the
   panel, rendering message bubbles, and a brief typing indicator so a
   reply feels like a reply instead of an instant text dump.
   ========================================================================== */

(function () {
  const trigger = document.getElementById('chat-system-trigger');
  const panel = document.getElementById('chat-viewport-panel');
  const stream = document.getElementById('chat-messages-stream');
  const form = document.getElementById('assistant-input-form');
  const input = document.getElementById('assistant-input-field');
  const chips = document.getElementById('suggested-chips-bar');
  if (!trigger || !panel || !stream || !form || !input) return;

  let hasGreeted = false;

  function addBubble(text, kind) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble from-${kind}`;
    bubble.textContent = text;
    stream.appendChild(bubble);
    stream.scrollTop = stream.scrollHeight;
    return bubble;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    stream.appendChild(typing);
    stream.scrollTop = stream.scrollHeight;
    return typing;
  }

  function openPanel() {
    panel.classList.remove('hidden');
    panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    if (!hasGreeted) {
      addBubble('AI is Online, Ask any questions for Mr. Jeet\'s portfolio?', 'system');
      hasGreeted = true;
    }
    input.focus({ preventScroll: true });
  }

  function closePanel() {
    panel.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    setTimeout(() => panel.classList.add('hidden'), 200);
  }

  trigger.addEventListener('click', () => {
    if (panel.classList.contains('is-open')) closePanel();
    else openPanel();
  });

  function handleQuery(text) {
    if (!text.trim()) return;
    addBubble(text, 'user');

    const typing = showTyping();
    const delay = 420 + Math.random() * 380; // small human-ish pause
    setTimeout(() => {
      typing.remove();
      addBubble(findChatbotAnswer(text), 'bot');
    }, delay);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleQuery(input.value);
    input.value = '';
  });

  if (chips) {
    chips.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip-action')) {
        handleQuery(e.target.getAttribute('data-query'));
      }
    });
  }

  // Close on outside click / Escape for a more app-like feel.
  document.addEventListener('click', (e) => {
    if (!panel.classList.contains('is-open')) return;
    const container = document.getElementById('interactive-chat-container');
    if (container && !container.contains(e.target)) closePanel();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
  });
})();
