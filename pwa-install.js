(() => {
  'use strict';
  let installPrompt = null;
  let installButton = null;
  let compactQuery = null;

  const standalone = () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent || '') && !window.MSStream;
  const canUseServiceWorker = () => location.protocol === 'https:' || ['localhost','127.0.0.1'].includes(location.hostname);

  function placeInstallButton() {
    if (!installButton) return;
    const compact = compactQuery?.matches ?? window.innerWidth <= 680;
    installButton.style.bottom = compact
      ? 'calc(154px + env(safe-area-inset-bottom))'
      : 'calc(92px + env(safe-area-inset-bottom))';
  }

  function removeInstallButton() {
    installButton?.remove();
    installButton = null;
    compactQuery?.removeEventListener?.('change', placeInstallButton);
    compactQuery = null;
  }

  function ensureInstallButton(mode = 'prompt') {
    if (installButton || standalone()) return;
    installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.textContent = mode === 'ios' ? 'ADD TO HOME' : 'INSTALL APP';
    installButton.setAttribute('aria-label', mode === 'ios' ? 'Show Add to Home Screen instructions' : 'Install Dexter Walk Forge');
    Object.assign(installButton.style, {
      position: 'fixed', right: '12px', zIndex: '2147483647', minHeight: '44px', padding: '9px 13px',
      borderRadius: '999px', border: '1px solid #8a3441', background: '#ff334d', color: '#fff',
      font: '800 12px system-ui, sans-serif', letterSpacing: '.05em', boxShadow: '0 10px 34px #0009', cursor: 'pointer'
    });
    compactQuery = window.matchMedia?.('(max-width: 680px)') || null;
    compactQuery?.addEventListener?.('change', placeInstallButton);
    placeInstallButton();

    installButton.addEventListener('click', async () => {
      if (mode === 'ios') {
        alert('In Safari, tap Share, then Add to Home Screen. Dexter Walk Forge will launch like an app and keep its project data local.');
        return;
      }
      if (!installPrompt) return;
      installButton.disabled = true;
      try {
        await installPrompt.prompt();
        await installPrompt.userChoice;
      } finally {
        installPrompt = null;
        removeInstallButton();
      }
    });
    document.body.appendChild(installButton);
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    ensureInstallButton('prompt');
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    removeInstallButton();
  });

  window.addEventListener('load', () => {
    if (isIos() && !standalone()) ensureInstallButton('ios');
  }, { once: true });

  if ('serviceWorker' in navigator && canUseServiceWorker()) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(error => {
        console.warn('PWA service worker registration failed:', error);
      });
    }, { once: true });
  }
})();
