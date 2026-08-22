## File map

```
index.html                 → all page markup, references the files below
css/
  variables.css             → colors, spacing, type scale (edit once, changes everywhere)
  base.css                  → reset + global type + form fields
  layout.css                → container, top nav (incl. hide-on-scroll), section rhythm, grids
  components.css             → buttons, cards, chips, stamps, modal, footer, scroll-reveal
  experience.css            → the "Professional Milestones" timeline + filter bar
  chatbot.css               → the floating "Ask Assistant" widget
  animations.css            → scroll progress bar, skim tracker, rocket figurine
js/
  nav.js                    → nav hide/show on scroll + active-link highlighting
  scroll-progress.js        → drives the progress bar + skim tracker readout
  rocket.js                 → the swinging rocket figure that follows scroll
  reveal.js                 → fade/rise-in animation for sections as you scroll
  tilt.js                   → 3D tilt-on-hover for cards
  copy-to-clipboard.js      → click-to-copy on the contact lines
  modal.js                  → opens/closes the case-study modal
  experience.js             → expand/collapse + tag-filtering for the timeline
  chatbot.js                → the assistant widget's open/close + message logic
data/
  case-studies.js           → content shown inside the case-study modal
  chatbot-responses.js      → keyword → answer pairs for the assistant
images/
  profile-sketch.svg        → About section illustration
  tools-doodle.svg          → Capabilities section illustration
  favicon.svg               → browser tab icon
```

## Making common edits

- **Change any color, spacing, or font size sitewide** → `css/variables.css`.
- **Add/edit an experience achievement** → find the relevant `.achievement-tile`
  in `index.html` (inside `#experience`), duplicate the block, set `data-tag`
  to one of `growth` / `ai` / `workflow` / `metrics`.
- **Add a new case study** → add an entry to `data/case-studies.js`, then add
  a matching `<button onclick="displayCaseDetails('case-N')">` in `index.html`.
- **Teach the assistant a new answer** → add an entry to
  `data/chatbot-responses.js`.
- **Swap an image** → drop the new file in `images/` and point the relevant
  `<img src="images/...">` at it.
- **Nav links** → `#nav-links` in `index.html`; each `data-section` value
  must match a section's `id` so active-highlighting and scroll offsets stay
  correct.

## Notes

- The rocket SVG is kept inline in `index.html` (rather than as a separate
  `<img>`) because its hover/scroll animations target individual internal
  parts (`.fig-body-fill`, `.flame`, etc.) — that only works with inline SVG.
- Respects `prefers-reduced-motion` for anyone with motion sensitivity.
