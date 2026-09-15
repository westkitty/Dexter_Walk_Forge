(() => {
  'use strict';

  const APP = /Timeforge/i.test(document.title) ? 'timeforge' : 'dwf';
  const PREFIX = 'dwf-guide-v2';
  const SEEN_KEY = `${PREFIX}:${APP}:seen`;
  const DONE_KEY = `${PREFIX}:${APP}:done`;
  const REDUCED = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let activeTarget = null;
  let activeTour = null;
  let previousFocus = null;

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };

  const visible = el => {
    if (!el) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  };

  const pick = selectors => {
    for (const selector of selectors) {
      const match = [...document.querySelectorAll(selector)].find(visible);
      if (match) return match;
    }
    return null;
  };

  const esc = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);

  function installStyles() {
    if (document.getElementById('dwfGuideStyles')) return;
    const style = document.createElement('style');
    style.id = 'dwfGuideStyles';
    style.textContent = `
      .dwf-guide-launch{display:inline-flex!important;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:8px 11px;border:1px solid #7b3440;border-radius:12px;background:#28151a;color:#fff;font:850 11px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.08em;cursor:pointer;touch-action:manipulation}
      .dwf-guide-launch::before{content:"?";display:grid;place-items:center;width:19px;height:19px;border-radius:50%;background:#ff3854;color:white;font-size:12px;font-weight:1000}
      .dwf-guide-launch:focus-visible{outline:3px solid #ff718388;outline-offset:2px}
      .dwf-guide-target{position:relative!important;z-index:10002!important;outline:3px solid #ff6176!important;outline-offset:5px!important;box-shadow:0 0 0 8px rgba(255,56,84,.18)!important}
      .dwf-guide-overlay{position:fixed;inset:0;z-index:10000;background:rgba(2,2,5,.78);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:14px;color:#f7f5f1;font:15px/1.48 system-ui,-apple-system,"Segoe UI",sans-serif}
      .dwf-guide-panel{width:min(760px,100%);max-height:min(88vh,820px);overflow:auto;border:1px solid #454550;border-radius:20px;background:linear-gradient(180deg,#17171d,#0f0f13);box-shadow:0 28px 90px #000c;padding:18px}
      .dwf-guide-eyebrow{color:#ff8d9c;font-size:10px;font-weight:950;letter-spacing:.14em;text-transform:uppercase}
      .dwf-guide-title{margin:6px 0 8px;font-size:clamp(24px,6vw,42px);line-height:1.02;letter-spacing:-.025em}
      .dwf-guide-lead{margin:0;color:#b9b7c0;font-size:15px}
      .dwf-guide-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:17px 0}
      .dwf-guide-flow>div{padding:12px;border:1px solid #363640;border-radius:14px;background:#111116}
      .dwf-guide-flow b{display:block;margin-bottom:4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
      .dwf-guide-flow span{color:#aaa8b2;font-size:12px}
      .dwf-guide-num{display:inline-grid!important;place-items:center;width:25px;height:25px;margin-bottom:8px!important;border-radius:9px;background:#ff3854;color:#fff!important;font-size:12px!important}
      .dwf-guide-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
      .dwf-guide-btn{min-height:44px;padding:9px 13px;border:1px solid #3c3c46;border-radius:11px;background:#1d1d24;color:#fff;font:850 12px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}
      .dwf-guide-btn.primary{background:#ff3854;border-color:#ff3854}
      .dwf-guide-btn.ghost{background:transparent;color:#bbb9c3}
      .dwf-guide-btn:focus-visible{outline:3px solid #ff718388;outline-offset:2px}
      .dwf-guide-note{margin-top:13px;padding:11px;border:1px solid #574126;border-radius:12px;background:#1a120c;color:#f2d2a2;font-size:12px}
      .dwf-guide-glossary{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:15px}
      .dwf-guide-term{padding:11px;border:1px solid #31313a;border-radius:12px;background:#111116}
      .dwf-guide-term b{display:block;margin-bottom:3px;font-size:12px}
      .dwf-guide-term span{color:#aaa8b2;font-size:12px}
      .dwf-guide-tour{position:fixed;z-index:10003;width:min(390px,calc(100vw - 24px));padding:15px;border:1px solid #4a4a54;border-radius:16px;background:#121218;color:#f8f6f2;box-shadow:0 24px 80px #000d;font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
      .dwf-guide-tour h2{margin:5px 0 7px;font-size:20px;line-height:1.15}
      .dwf-guide-tour p{margin:0;color:#bbb9c2}
      .dwf-guide-tour code{padding:2px 5px;border-radius:6px;background:#26262f;color:#fff}
      .dwf-guide-progress{height:4px;margin:12px 0;border-radius:999px;background:#2d2d35;overflow:hidden}
      .dwf-guide-progress i{display:block;height:100%;background:#ff3854}
      .dwf-guide-tourbar{display:flex;align-items:center;gap:7px;margin-top:12px}
      .dwf-guide-tourbar .dwf-guide-btn{min-height:40px;padding:8px 11px}
      .dwf-guide-spacer{flex:1}
      .dwf-guide-step{color:#8d8b95;font-size:10px;font-weight:900;letter-spacing:.11em;text-transform:uppercase}
      .dwf-guide-practice{margin-top:15px;padding:14px;border:1px solid #363640;border-radius:15px;background:#0d0d11}
      .dwf-guide-thought{padding:12px;border-left:3px solid #ff3854;border-radius:0 11px 11px 0;background:#17171d;font-weight:750}
      .dwf-guide-choicegrid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin-top:11px}
      .dwf-guide-choicegrid button{min-height:44px;padding:7px 5px;border:1px solid #3c3c46;border-radius:10px;background:#1b1b22;color:#fff;font:800 10px/1.2 system-ui;cursor:pointer}
      .dwf-guide-choicegrid button.good{border-color:#3d865b;background:#193023}
      .dwf-guide-choicegrid button.bad{border-color:#7a3540;background:#2b171c}
      .dwf-guide-feedback{min-height:48px;margin-top:10px;padding:10px;border-radius:10px;background:#17171d;color:#c8c6cd;font-size:12px}
      .dwf-guide-feedback strong{color:#fff}
      .dwf-guide-inline{display:flex;align-items:center;gap:8px;margin:8px 0;padding:9px 10px;border:1px dashed #4a3a3f;border-radius:12px;background:#170f12;color:#c7c5cc;font-size:11px}
      .dwf-guide-inline button{margin-left:auto;min-height:34px;padding:6px 9px;border:1px solid #60343b;border-radius:9px;background:#25151a;color:#fff;font-weight:850;cursor:pointer}
      @media(max-width:680px){.dwf-guide-overlay{align-items:flex-end;padding:8px}.dwf-guide-panel{max-height:82vh;border-radius:18px 18px 12px 12px}.dwf-guide-flow{grid-template-columns:1fr}.dwf-guide-glossary{grid-template-columns:1fr}.dwf-guide-choicegrid{grid-template-columns:repeat(2,1fr)}.dwf-guide-choicegrid button:last-child{grid-column:1/-1}.dwf-guide-tour{left:9px!important;right:9px!important;width:auto!important;bottom:calc(82px + env(safe-area-inset-bottom))!important;top:auto!important}.dwf-guide-launch{padding:7px 9px;font-size:10px}}
      @media(prefers-reduced-motion:reduce){.dwf-guide-target,.dwf-guide-tour,.dwf-guide-overlay{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  function makeButton(text, action, className = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `dwf-guide-btn ${className}`.trim();
    button.textContent = text;
    button.addEventListener('click', action);
    return button;
  }

  function trapFocus(root, event) {
    if (event.key !== 'Tab') return;
    const focusable = [...root.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(visible);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function modalShell(label) {
    closeModal();
    previousFocus = document.activeElement;
    const overlay = document.createElement('div');
    overlay.id = 'dwfGuideOverlay';
    overlay.className = 'dwf-guide-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', label);
    const panel = document.createElement('section');
    panel.className = 'dwf-guide-panel';
    overlay.appendChild(panel);
    overlay.addEventListener('click', event => { if (event.target === overlay) closeModal(); });
    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); closeModal(); }
      trapFocus(overlay, event);
    });
    document.body.appendChild(overlay);
    requestAnimationFrame(() => panel.querySelector('button')?.focus());
    return { overlay, panel };
  }

  function closeModal() {
    const overlay = document.getElementById('dwfGuideOverlay');
    if (overlay) overlay.remove();
    previousFocus?.focus?.();
    previousFocus = null;
  }

  const dwfTerms = [
    ['Feature', 'This should exist in the product. It is accepted scope, not necessarily MVP-critical.'],
    ['Critical', 'This feature is essential to the first viable version. Use sparingly.'],
    ['Lock decision', 'Freeze an accepted product choice so later rambling does not casually undo it.'],
    ['Park', 'Good idea, wrong time. Keep it visible without letting it contaminate the current build.'],
    ['Reject', 'Explicit non-goal. Preserve the idea as evidence that you intentionally do not want it.'],
    ['Forge readiness', 'A heuristic showing how buildable the current thought pile is. It is guidance, not a game score.']
  ];

  const timeforgeTerms = [
    ['Checkpoint', 'A read-only historical state. Scrub to it; fork if you want to continue from there.'],
    ['Branch', 'A safe alternate version of the product. Changes stay isolated until you merge them.'],
    ['Fork', 'Create a new branch from the exact state you are viewing. Nothing on main changes.'],
    ['Compare', 'See the semantic differences between branches instead of comparing raw files.'],
    ['Selective merge', 'Choose only the branch changes worth keeping and apply those to the target branch.'],
    ['Source Lens', 'Shows the walk evidence and lineage behind a product item so you can answer “why is this here?”']
  ];

  function flowMarkup() {
    if (APP === 'timeforge') return `
      <div class="dwf-guide-flow">
        <div><span class="dwf-guide-num">1</span><b>LOAD</b><span>Bring in a walk you already care about. Timeforge is optional aftercare, not where you start.</span></div>
        <div><span class="dwf-guide-num">2</span><b>FORK</b><span>Scrub to any checkpoint and branch from it without rewriting your main idea.</span></div>
        <div><span class="dwf-guide-num">3</span><b>COMPARE + MERGE</b><span>See what changed, then bring back only the changes that won.</span></div>
      </div>`;
    return `
      <div class="dwf-guide-flow">
        <div><span class="dwf-guide-num">1</span><b>CAPTURE</b><span>Walk. Ramble. Type. Do not organize yourself first. Every thought becomes durable raw material.</span></div>
        <div><span class="dwf-guide-num">2</span><b>DECIDE</b><span>Turn thoughts into product truth: feature, critical, locked decision, parked idea, or explicit rejection.</span></div>
        <div><span class="dwf-guide-num">3</span><b>FORGE</b><span>When the shape is clear enough, generate a build-ready implementation handoff from the state you created.</span></div>
      </div>`;
  }

  function openHub({ firstRun = false } = {}) {
    store.set(SEEN_KEY, '1');
    const { panel } = modalShell(APP === 'timeforge' ? 'Timeforge interactive guide' : 'Dexter Walk Forge interactive guide');
    const terms = APP === 'timeforge' ? timeforgeTerms : dwfTerms;
    panel.innerHTML = `
      <div class="dwf-guide-eyebrow">${firstRun ? 'First launch · 90-second orientation' : 'Interactive guide'}</div>
      <h1 class="dwf-guide-title">${APP === 'timeforge' ? 'Timeforge, without the version-control headache.' : 'Dexter Walk Forge, in plain English.'}</h1>
      <p class="dwf-guide-lead">${APP === 'timeforge'
        ? 'You do not need Timeforge to capture a walk. Use it when you have a product direction worth preserving while you experiment.'
        : 'The app has one job: let you think out loud without organizing first, then turn that mess into a buildable product plan.'}</p>
      ${flowMarkup()}
      <div class="dwf-guide-actions" id="dwfGuideHubActions"></div>
      <div class="dwf-guide-note">${APP === 'timeforge'
        ? '<strong>Permission to ignore this screen:</strong> if you have not finished a useful walk yet, go back to Dexter Walk Forge. Timeforge is for alternate timelines, provenance, and selective merging after the idea exists.'
        : '<strong>The rule that makes the whole app make sense:</strong> capture first, judge second. Do not stop your walk to write a specification. Ramble now; promote, lock, park, reject, and Forge later.'}</div>
      <h2 style="margin:18px 0 7px;font-size:13px;letter-spacing:.11em;text-transform:uppercase">Plain-English glossary</h2>
      <div class="dwf-guide-glossary">${terms.map(([name, desc]) => `<div class="dwf-guide-term"><b>${esc(name)}</b><span>${esc(desc)}</span></div>`).join('')}</div>
    `;
    const actions = panel.querySelector('#dwfGuideHubActions');
    actions.append(
      makeButton('TAKE THE GUIDED TOUR', () => { closeModal(); startTour(); }, 'primary'),
      makeButton(APP === 'timeforge' ? 'PRACTICE BRANCHING' : 'PRACTICE THE BUTTONS', () => openPractice()),
      makeButton(firstRun ? 'SKIP FOR NOW' : 'CLOSE', () => closeModal(), 'ghost')
    );
  }

  const dwfTour = [
    { selectors: ['#start', '#mic'], title: '1. Start a walk — voice is optional.', body: 'Tap <strong>START WALK</strong> if you want continuous browser speech capture. If the microphone is unavailable, nothing is lost: typed capture remains the first-class fallback.' },
    { selectors: ['#input'], title: '2. Ramble here. Do not pre-organize.', body: 'Say or type one thought at a time. Example: <code>Make offline capture a feature</code>. Press <strong>Cmd/Ctrl+Enter</strong> to capture typed text quickly.' },
    { selectors: ['.quick'], title: '3. This row is your product judgment.', body: '<strong>Feature</strong> = keep it. <strong>Critical</strong> = MVP-essential. <strong>Lock</strong> = accepted decision. <strong>Park</strong> = later. <strong>Reject</strong> = explicit non-goal. These are not five versions of “favorite.”' },
    { selectors: ['.specpanel', '[class*="specpanel"]', '.metrics'], title: '4. Live Spec Reactor = the app thinking back.', body: 'It continuously derives themes, tensions, critical path, and Forge readiness from your captured state. Readiness is a heuristic for “could another agent build this?” — not a score you need to grind.' },
    { selectors: ['#finish'], title: '5. Get home / Forge when the idea has shape.', body: 'This ends the walk and moves you toward a structured handoff. You are not asking the app to magically build software; you are turning your decisions into an implementation-ready specification.' },
    { selectors: ['[data-view="forge"]'], title: '6. Forge is the deliverable view.', body: 'Forge turns the walk into features, MVP scope, acceptance criteria, constraints, decisions, open questions, risks, and an implementation prompt. This is where the ramble becomes work another agent can execute.' },
    { selectors: ['[data-view="map"]', '[data-view="history"]'], title: '7. Map and History are supporting tools.', body: '<strong>Map</strong> visualizes relationships and dependencies. <strong>History</strong> protects previous walks and recovery paths. You can ignore both on your first walk.' },
    { selectors: ['#help'], title: '8. You never have to memorize the command language.', body: 'The built-in <strong>?</strong> menu lists phrases like “make that critical,” “park that,” “decision: …,” and “build that.” The new <strong>GUIDE</strong> button reopens this tutorial any time.' }
  ];

  const timeforgeTour = [
    { selectors: ['#loadLocalBtn', '#demoBtn', '#importBtn'], title: '1. Start by loading an existing walk.', body: 'Use local DWF state, import a backup/session, or load the safe demo. Timeforge should not be the first screen you learn; it operates on a product direction that already exists.' },
    { selectors: ['#timeRange'], title: '2. The slider is a real product time machine.', body: 'Scrub backward through immutable checkpoints. You are inspecting historical product state, not looking at screenshots. Historical checkpoints stay read-only.' },
    { selectors: ['#forkBtn', '#newBranchBtn'], title: '3. Fork before you experiment.', body: 'Fork creates an isolated alternate timeline from the state you are viewing. Try the risky idea there. Main does not change until you explicitly merge something back.' },
    { selectors: ['#lens'], title: '4. Source Lens answers “why is this here?”', body: 'Select an idea and Source Lens shows the raw walk evidence and Timeforge lineage behind it. Legacy v3 links are labeled inferred when the old app never stored a durable source ID.' },
    { selectors: ['[data-view="compare"]'], title: '5. Compare branches semantically.', body: 'Compare reports meaningful product differences — additions, removals, decisions, constraints, questions, and changed idea state — rather than making you diff JSON by hand.' },
    { selectors: ['[data-view="compare"]'], title: '6. Merge only what won.', body: 'The selective merge panel lets you check only the changes worth keeping. Unselected branch changes stay isolated. This is the important part: experimentation does not become accidental scope.' },
    { selectors: ['[data-view="memory"]'], title: '7. Memory looks across walks.', body: 'Project Memory surfaces recurring ideas, durable constraints, resurfacing rejected ideas, and unresolved questions. It helps distinguish a passing thought from something you keep rediscovering.' },
    { selectors: ['[data-view="recipes"]'], title: '8. Recipes turn state into useful handoffs.', body: 'Choose a deterministic output for the job: build handoff, coding-agent task, issue sequence, MVP cut, QA matrix, or cold-start handoff. Same product truth, different delivery shape.' }
  ];

  function clearTourTarget() {
    activeTarget?.classList.remove('dwf-guide-target');
    activeTarget = null;
  }

  function stopTour({ complete = false } = {}) {
    clearTourTarget();
    document.getElementById('dwfGuideTour')?.remove();
    if (activeTour?.onKey) document.removeEventListener('keydown', activeTour.onKey, true);
    activeTour = null;
    if (complete) store.set(DONE_KEY, '1');
  }

  function positionTour(card, target) {
    if (innerWidth <= 680) return;
    const pad = 12;
    const width = Math.min(390, innerWidth - pad * 2);
    const cardHeight = card.offsetHeight || 250;
    if (!target) {
      card.style.left = `${Math.max(pad, (innerWidth - width) / 2)}px`;
      card.style.top = `${Math.max(pad, (innerHeight - cardHeight) / 2)}px`;
      return;
    }
    const rect = target.getBoundingClientRect();
    let left = rect.right + 14;
    if (left + width > innerWidth - pad) left = Math.max(pad, rect.left - width - 14);
    let top = Math.max(pad, rect.top);
    if (top + cardHeight > innerHeight - pad) top = Math.max(pad, innerHeight - cardHeight - pad);
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  function startTour() {
    stopTour();
    const steps = APP === 'timeforge' ? timeforgeTour : dwfTour;
    const card = document.createElement('aside');
    card.id = 'dwfGuideTour';
    card.className = 'dwf-guide-tour';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', `${APP === 'timeforge' ? 'Timeforge' : 'Dexter Walk Forge'} guided tour`);
    document.body.appendChild(card);
    const tour = { index: 0, steps, card, onKey: null };
    activeTour = tour;

    const render = () => {
      clearTourTarget();
      const step = steps[tour.index];
      const target = pick(step.selectors || []);
      if (target) {
        activeTarget = target;
        target.classList.add('dwf-guide-target');
        target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center', inline: 'nearest' });
      }
      card.innerHTML = `
        <div class="dwf-guide-step">Step ${tour.index + 1} of ${steps.length}</div>
        <h2>${step.title}</h2>
        <p>${step.body}</p>
        <div class="dwf-guide-progress"><i style="width:${((tour.index + 1) / steps.length) * 100}%"></i></div>
        <div class="dwf-guide-tourbar">
          <button type="button" class="dwf-guide-btn ghost" data-tour="exit">EXIT</button>
          <span class="dwf-guide-spacer"></span>
          <button type="button" class="dwf-guide-btn" data-tour="back" ${tour.index === 0 ? 'disabled' : ''}>BACK</button>
          <button type="button" class="dwf-guide-btn primary" data-tour="next">${tour.index === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
        </div>`;
      card.querySelector('[data-tour="exit"]').onclick = () => stopTour();
      card.querySelector('[data-tour="back"]').onclick = () => { if (tour.index > 0) { tour.index -= 1; render(); } };
      card.querySelector('[data-tour="next"]').onclick = () => {
        if (tour.index >= steps.length - 1) { stopTour({ complete: true }); openDone(); }
        else { tour.index += 1; render(); }
      };
      requestAnimationFrame(() => {
        positionTour(card, target);
        card.querySelector('[data-tour="next"]')?.focus({ preventScroll: true });
      });
    };

    tour.onKey = event => {
      if (!activeTour || document.getElementById('dwfGuideOverlay')) return;
      if (event.key === 'Escape') { event.preventDefault(); stopTour(); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); card.querySelector('[data-tour="next"]')?.click(); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); card.querySelector('[data-tour="back"]')?.click(); }
    };
    document.addEventListener('keydown', tour.onKey, true);
    window.addEventListener('resize', () => activeTour && positionTour(card, activeTarget), { passive: true });
    render();
  }

  function openDone() {
    const { panel } = modalShell('Tutorial complete');
    panel.innerHTML = `
      <div class="dwf-guide-eyebrow">Tour complete</div>
      <h1 class="dwf-guide-title">${APP === 'timeforge' ? 'You now know the only Timeforge loop that matters.' : 'You now know the only Walk Forge loop that matters.'}</h1>
      <p class="dwf-guide-lead">${APP === 'timeforge'
        ? 'Load → inspect history → fork → experiment → compare → selectively merge.'
        : 'Capture → decide → Forge. Everything else exists to make that loop safer or more useful.'}</p>
      <div class="dwf-guide-actions" id="dwfGuideDoneActions"></div>`;
    const actions = panel.querySelector('#dwfGuideDoneActions');
    actions.append(
      makeButton(APP === 'timeforge' ? 'PRACTICE BRANCHING' : 'PRACTICE THE BUTTONS', () => openPractice(), 'primary'),
      makeButton('BACK TO THE APP', () => closeModal())
    );
  }

  const dwfPractice = [
    { thought: '“The app must never lose typed thoughts if the microphone dies.”', best: 'Critical', why: 'That is a must-have first-slice behavior. Marking it Critical says “this feature is necessary for the MVP,” not merely “I like it.”' },
    { thought: '“The product will stay local-first; no account is required for the core walk.”', best: 'Lock decision', why: 'That is an accepted governing choice. Locking it protects the decision from being casually reversed by later brainstorming.' },
    { thought: '“Someday it could sync walks across a team workspace.”', best: 'Park', why: 'Potentially useful, but not required now. Park preserves it as later scope without letting it inflate the current build.' },
    { thought: '“Require users to sign in before they can capture anything.”', best: 'Reject', why: 'That conflicts with the local-first core. Rejecting it records an explicit non-goal instead of letting the same idea quietly return later.' },
    { thought: '“Export the Forge summary as Markdown.”', best: 'Feature', why: 'That is useful accepted scope, but nothing in the statement makes it inherently MVP-critical. Feature is the normal “yes, build this” state.' }
  ];

  const tfPractice = [
    { thought: 'You want to try a cloud-sync direction without risking the current local-first product.', best: 'Fork', why: 'Fork first. The experiment belongs on an isolated branch until you know whether it deserves to affect main.' },
    { thought: 'You want to know why an old “offline recovery” feature exists before deleting it.', best: 'Source Lens', why: 'Source Lens shows the raw walk evidence and lineage behind the item, so the deletion decision has context.' },
    { thought: 'A branch contains five changes, but only two actually improved the product.', best: 'Selective merge', why: 'Compare the branch, select only the two winning differences, and merge those. The other three remain isolated.' },
    { thought: 'You keep independently rediscovering the same constraint across several walks.', best: 'Memory', why: 'Project Memory is where recurrence becomes visible. Repeated ideas and durable constraints stop looking like isolated notes.' }
  ];

  function openPractice() {
    const items = APP === 'timeforge' ? tfPractice : dwfPractice;
    const choices = APP === 'timeforge'
      ? ['Fork', 'Source Lens', 'Compare', 'Selective merge', 'Memory']
      : ['Feature', 'Critical', 'Lock decision', 'Park', 'Reject'];
    let index = 0;
    let answered = false;
    const { panel } = modalShell(APP === 'timeforge' ? 'Timeforge practice lab' : 'Dexter Walk Forge practice lab');

    const render = () => {
      answered = false;
      const item = items[index];
      panel.innerHTML = `
        <div class="dwf-guide-eyebrow">Safe practice · changes nothing in your project</div>
        <h1 class="dwf-guide-title" style="font-size:28px">${APP === 'timeforge' ? 'Choose the right Timeforge move.' : 'What should this thought become?'}</h1>
        <p class="dwf-guide-lead">Scenario ${index + 1} of ${items.length}. Pick an answer; this sandbox never touches your saved walk.</p>
        <div class="dwf-guide-practice">
          <div class="dwf-guide-thought">${esc(item.thought)}</div>
          <div class="dwf-guide-choicegrid" id="dwfPracticeChoices"></div>
          <div class="dwf-guide-feedback" id="dwfPracticeFeedback">Choose the action that best matches the product meaning.</div>
        </div>
        <div class="dwf-guide-actions" id="dwfPracticeActions"></div>`;
      const grid = panel.querySelector('#dwfPracticeChoices');
      for (const choice of choices) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = choice.toUpperCase();
        button.addEventListener('click', () => {
          if (answered) return;
          const correct = choice === item.best;
          button.classList.add(correct ? 'good' : 'bad');
          const feedback = panel.querySelector('#dwfPracticeFeedback');
          if (correct) {
            answered = true;
            feedback.innerHTML = `<strong>Exactly.</strong> ${esc(item.why)}`;
            [...grid.children].forEach(node => { node.disabled = true; if (node.textContent.toLowerCase() === item.best.toLowerCase()) node.classList.add('good'); });
            panel.querySelector('#dwfPracticeNext').disabled = false;
          } else {
            feedback.innerHTML = '<strong>Not the best fit.</strong> Try again. Ask what the thought means to the product, not how strongly you feel about it.';
            setTimeout(() => button.classList.remove('bad'), 650);
          }
        });
        grid.appendChild(button);
      }
      const actions = panel.querySelector('#dwfPracticeActions');
      actions.append(makeButton('CLOSE PRACTICE', () => openHub(), 'ghost'));
      const next = makeButton(index === items.length - 1 ? 'FINISH PRACTICE' : 'NEXT SCENARIO', () => {
        if (!answered) return;
        if (index === items.length - 1) { store.set(DONE_KEY, '1'); openDone(); }
        else { index += 1; render(); }
      }, 'primary');
      next.id = 'dwfPracticeNext';
      next.disabled = true;
      actions.appendChild(next);
    };
    render();
  }

  function addContextualHint() {
    if (APP !== 'dwf' || document.getElementById('dwfQuickMeaning')) return;
    const quick = document.querySelector('.quick');
    if (!quick) return;
    const hint = document.createElement('div');
    hint.id = 'dwfQuickMeaning';
    hint.className = 'dwf-guide-inline';
    hint.innerHTML = '<span><strong>Confused by Feature / Critical / Lock / Park / Reject?</strong> Learn them safely before touching your walk.</span>';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'PRACTICE';
    button.addEventListener('click', openPractice);
    hint.appendChild(button);
    quick.insertAdjacentElement('afterend', hint);
  }

  function installLauncher() {
    if (document.getElementById('dwfGuideLaunch')) return;
    const button = document.createElement('button');
    button.id = 'dwfGuideLaunch';
    button.type = 'button';
    button.className = 'dwf-guide-launch';
    button.textContent = 'GUIDE';
    button.setAttribute('aria-label', 'Open interactive guide');
    button.addEventListener('click', () => openHub());
    const actions = document.querySelector('.topactions');
    const help = APP === 'timeforge' ? document.getElementById('helpBtn') : document.getElementById('help');
    if (actions) actions.insertBefore(button, help || actions.firstChild);
    else document.body.appendChild(button);
  }

  function boot() {
    installStyles();
    installLauncher();
    addContextualHint();
    window.DWF_GUIDE = Object.freeze({ open: openHub, tour: startTour, practice: openPractice });
    if (!store.get(SEEN_KEY)) setTimeout(() => openHub({ firstRun: true }), 550);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
