(() => {
  'use strict';
  let installPrompt = null;
  let installButton = null;

  const standalone = () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;

  function ensureInstallButton() {
    if (installButton || standalone()) return;
    installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.textContent = 'INSTALL APP';
    installButton.setAttribute('aria-label', 'Install Dexter Walk Forge');
    Object.assign(installButton.style, {
      position: 'fixed', right: '12px', bottom: 'max(12px, env(safe-area-inset-bottom))', zIndex: '2147483647',
      minHeight: '44px', padding: '9px 13px', borderRadius: '999px', border: '1px solid #8a3441',
      background: '#ff334d', color: '#fff', font: '800 12px system-ui, sans-serif', letterSpacing: '.05em',
      boxShadow: '0 10px 34px #0009', cursor: 'pointer'
    });
    installButton.addEventListener('click', async () => {
      if (!installPrompt) return;
      installButton.disabled = true;
      try {
        await installPrompt.prompt();
        await installPrompt.userChoice;
      } finally {
        installPrompt = null;
        installButton.remove();
        installButton = null;
      }
    });
    document.body.appendChild(installButton);
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    ensureInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    installButton?.remove();
    installButton = null;
  });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(error => {
        console.warn('PWA service worker registration failed:', error);
      });
    }, { once: true });
  }
})();
