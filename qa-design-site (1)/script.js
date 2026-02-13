
(function () {
  const checkboxes = document.querySelectorAll('.bug-panel input[type="checkbox"][data-bug]');
  const resetBtn = document.getElementById('resetBtn');
  const randomizeBtn = document.getElementById('randomizeBtn');
  const body = document.body;

  // Show/Hide panel controls
  const hideBtn = document.getElementById('hideBugPanelBtn');
  const showFab = document.getElementById('showBugPanelFab');

  function setPanelHidden(hidden) {
    body.classList.toggle('bug-panel-hidden', hidden);
    try { localStorage.setItem('bugPanelHidden', hidden ? '1' : '0'); } catch (e) {}
  }

  // Restore hidden state
  try {
    const saved = localStorage.getItem('bugPanelHidden');
    if (saved === '1') setPanelHidden(true);
  } catch (e) {}

  hideBtn?.addEventListener('click', () => setPanelHidden(true));
  showFab?.addEventListener('click', () => setPanelHidden(false));

  // Keyboard shortcut: press "p" to toggle panel visibility
  window.addEventListener('keydown', (e) => {
    if (e.key && e.key.toLowerCase() === 'p' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const t = e.target;
      const isTyping = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (isTyping) return;
      setPanelHidden(!body.classList.contains('bug-panel-hidden'));
    }
  });

  function applyBugClass(bug, enabled) {
    const cls = 'bug-' + bug;
    body.classList.toggle(cls, enabled);

    if (bug === 'missing') {
      // swap one gallery image to a missing path to simulate 404
      const target = document.querySelector('#gallery img:nth-child(3)');
      if (!target) return;
      if (enabled) {
        target.dataset.originalSrc = target.getAttribute('src');
        target.setAttribute('src', 'assets/img/does-not-exist.png');
        target.classList.add('bug-missing');
      } else if (target.dataset.originalSrc) {
        target.setAttribute('src', target.dataset.originalSrc);
        target.classList.remove('bug-missing');
        delete target.dataset.originalSrc;
      }
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => applyBugClass(cb.dataset.bug, cb.checked));
  });

  resetBtn.addEventListener('click', () => {
    checkboxes.forEach(cb => cb.checked = false);
    body.className = body.className
      .split(' ')
      .filter(c => !c.startsWith('bug-'))
      .join(' ');

    // restore missing image if toggled before
    const target = document.querySelector('#gallery img:nth-child(3)');
    if (target && target.dataset.originalSrc) {
      target.setAttribute('src', target.dataset.originalSrc);
      target.classList.remove('bug-missing');
      delete target.dataset.originalSrc;
    }
  });

  randomizeBtn.addEventListener('click', () => {
    // Randomly toggle 2-5 bugs
    const bugs = Array.from(checkboxes);
    const n = Math.floor(Math.random() * 4) + 2;

    // reset first
    resetBtn.click();

    // shuffle
    for (let i = bugs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bugs[i], bugs[j]] = [bugs[j], bugs[i]];
    }

    bugs.slice(0, n).forEach(cb => { cb.checked = true; applyBugClass(cb.dataset.bug, true); });
  });
})();
