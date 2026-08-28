/* ==========================================================================
   CHATBOT.JS
   Drives the floating "Jeet's AI" widget. Answer content + matching logic
   live in data/chatbot-responses.js — this file only handles UI: opening
   the panel, rendering bubbles + follow-up chips, a typing indicator, a
   one-time boot sequence, and persisting the conversation for the tab
   session so a refresh doesn't wipe it.
   ========================================================================== */

(function () {
  const trigger = document.getElementById('chat-system-trigger');
  const panel = document.getElementById('chat-viewport-panel');
  const stream = document.getElementById('chat-messages-stream');
  const form = document.getElementById('assistant-input-form');
  const input = document.getElementById('assistant-input-field');
  const sendBtn = form ? form.querySelector('.chat-send-btn') : null;
  const chips = document.getElementById('suggested-chips-bar');
  const resetBtn = document.getElementById('chat-reset-btn');
  if (!trigger || !panel || !stream || !form || !input) return;

  const STORAGE_KEY = 'jeetAI_history_v1';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let hasOpenedOnce = false;
  let awaitingReply = false;

  /* ---------------------------------------------------------------- utils */

  function timestamp() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function saveHistory(history) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch (e) { /* storage unavailable, skip */ }
  }

  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  let history = loadHistory();

  /**
   * Very small, safe subset of markdown: **bold** and [label](https://...).
   * Builds DOM nodes directly instead of using innerHTML, so nothing typed
   * by a user (which never carries markdown, only plain text) can inject
   * markup — this only ever runs on our own static bot responses.
   */

  function renderRichText(container, text) {
    const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        container.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      if (match[1] !== undefined) {
        const strong = document.createElement('strong');
        strong.textContent = match[1];
        container.appendChild(strong);
      } else {
        const link = document.createElement('a');
        link.href = match[3];
        link.textContent = match[2];
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        container.appendChild(link);
      }
      lastIndex = pattern.lastIndex;
    }
    if (lastIndex < text.length) {
      container.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
  }
  
  function typeOutText(el, text, onDone) {
    const plain = text.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    let i = 0;
    const iv = setInterval(() => {
      el.textContent = plain.slice(0, ++i);
      stream.scrollTop = stream.scrollHeight;
      if (i >= plain.length) { clearInterval(iv); if (onDone) onDone(); }
    }, 18);
  }


  /* -------------------------------------------------------------- render */

  function addBubble(text, kind, opts) {
    opts = opts || {};
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble from-${kind}`;

    const textEl = document.createElement('div');
      bubble.appendChild(textEl);
      if (kind === 'bot') {
        typeOutText(textEl, text, () => {
          textEl.textContent = '';
          renderRichText(textEl, text);
        });
      } else {
        textEl.textContent = text;
      }

    if (kind === 'user' || kind === 'bot') {
      const time = document.createElement('div');
      time.className = 'chat-timestamp';
      time.textContent = timestamp();
      bubble.appendChild(time);
    }

    stream.appendChild(bubble);

    if (kind === 'bot' && opts.followUps && opts.followUps.length) {
      const row = document.createElement('div');
      row.className = 'chat-followups';
      opts.followUps.forEach((q) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip-action chip-action-mini';
        btn.textContent = q;
        btn.setAttribute('data-query', q);
        row.appendChild(btn);
      });
      stream.appendChild(row);
    }

    stream.scrollTop = stream.scrollHeight;

    if (opts.persist !== false) {
      history.push({ text, kind, followUps: opts.followUps || [] });
      saveHistory(history);
    }
    return bubble;
  }

  function replayHistory() {
    history.forEach((msg) => {
      addBubble(msg.text, msg.kind, { followUps: msg.followUps, persist: false });
    });
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    stream.appendChild(typing);
    stream.scrollTop = stream.scrollHeight;
    return typing;
  }

  function addBootLines() {
    const lines = ['> establishing uplink...', '> knowledge base loaded.'];
    lines.forEach((line, i) => {
      const el = document.createElement('div');
      el.className = 'chat-bubble from-system chat-boot-line';
      el.textContent = line;
      if (!reduceMotion) el.style.animationDelay = `${i * 0.18}s`;
      stream.appendChild(el);
    });
    stream.scrollTop = stream.scrollHeight;
  }

  /* ---------------------------------------------------------------- open */

  function openPanel() {
    panel.classList.remove('hidden');
    panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');

    if (!hasOpenedOnce) {
      hasOpenedOnce = true;
      if (history.length) {
        replayHistory();
      } else {
        addBootLines();
        addBubble("AI is Online, Ask any questions for Mr. Jeet's portfolio?", 'system');
      }
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

  /* --------------------------------------------------------------- query */

  function setBusy(isBusy) {
    awaitingReply = isBusy;
    input.disabled = isBusy;
    if (sendBtn) sendBtn.disabled = isBusy;
  }

  function handleQuery(text) {
    if (!text.trim() || awaitingReply) return;
    if (chips) chips.style.display = 'none';
    addBubble(text, 'user');
    setBusy(true);

    const typing = showTyping();
    const result = findChatbotAnswer(text);
    const delay = 350 + result.text.length * 14 + Math.random() * 300;
    setTimeout(() => {
      typing.remove();
      addBubble(result.text, 'bot', { followUps: result.followUps });
      setBusy(false);
      input.focus({ preventScroll: true });
    }, Math.min(delay, 2200));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleQuery(input.value);
    input.value = '';
  });

  // Delegated: handles both the static default chip bar AND the dynamic
  // per-answer follow-up chips (they share the .chip-action class).
  document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('chip-action')) {
      handleQuery(e.target.getAttribute('data-query'));
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      history = [];
      saveHistory(history);
      stream.innerHTML = '';
      hasOpenedOnce = false;
      if (chips) chips.style.display = '';
      openPanel();
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