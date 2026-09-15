import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { documentBoundaries, injectDocumentHooks, firstInlineScript } from './scripts/html-document.mjs';

const root = process.cwd();
const siteIndex = process.argv.indexOf('--site');
const site = siteIndex >= 0 ? process.argv[siteIndex + 1] : null;
const read = p => fs.readFileSync(path.join(root, p));
const text = p => read(p).toString('utf8');
const headHook = '<link rel="manifest" href="./manifest.webmanifest">';
const installHook = '<script src="./pwa-install.js" defer></script>';
const guideHook = '<script src="./onboarding.js" defer></script>';
const bodyHook = installHook + guideHook;

const manifest = JSON.parse(text('manifest.webmanifest'));
assert.equal(manifest.name, 'Dexter Walk Forge');
assert.equal(manifest.start_url, './');
assert.equal(manifest.scope, './');
assert.equal(manifest.display, 'standalone');
for (const size of ['192x192','512x512']) assert(manifest.icons.some(icon => icon.sizes === size && icon.type === 'image/png'));
assert(manifest.shortcuts.some(x => x.url === './timeforge.html'));

for (const [file, expected] of [['icons/icon-192.png',192],['icons/icon-512.png',512]]) {
  const b = read(file);
  assert.equal(b.toString('ascii', 1, 4), 'PNG');
  assert.equal(b.readUInt32BE(16), expected);
  assert.equal(b.readUInt32BE(20), expected);
}

const sw = text('sw.js');
const install = text('pwa-install.js');
const onboarding = text('onboarding.js');
new vm.Script(sw, { filename: 'sw.js' });
new vm.Script(install, { filename: 'pwa-install.js' });
new vm.Script(onboarding, { filename: 'onboarding.js' });
assert.match(sw, /caches\.open\(CACHE\)/);
assert.match(sw, /key\.startsWith\(CACHE_PREFIX\)/, 'service worker must only clean Dexter Walk Forge cache keys');
assert.doesNotMatch(sw, /filter\(key => key !== CACHE\)/, 'service worker must not delete unrelated origin caches');
assert.match(sw, /cache\.match\(request\)/, 'runtime cache lookup must stay inside the app cache');
assert.match(sw, /\.\/onboarding\.js/, 'interactive guide must be available offline');
assert.match(install, /beforeinstallprompt/);
assert.match(install, /ADD TO HOME/, 'iOS install fallback missing');
assert.match(install, /serviceWorker\.register\('\.\/sw\.js'/);

for (const required of [
  /DWF_GUIDE/,
  /TAKE THE GUIDED TOUR/,
  /PRACTICE THE BUTTONS/,
  /PRACTICE BRANCHING/,
  /Capture → decide → Forge|CAPTURE[\s\S]{0,500}DECIDE[\s\S]{0,500}FORGE/i,
  /Source Lens/,
  /Selective merge/
]) assert.match(onboarding, required, `onboarding missing ${required}`);
assert.match(onboarding, /localStorage/, 'tutorial completion must persist locally');
assert.match(onboarding, /prefers-reduced-motion/, 'tutorial must respect reduced motion');
assert.match(onboarding, /aria-modal/, 'tutorial must expose modal semantics');
assert.match(onboarding, /SKIP FOR NOW/, 'first-run tutorial needs a non-blocking skip path');

const synthetic = '<!doctype html><html><head><title>T</title></head><body><script>const nested=`<html><body>trap</body></html>`;globalThis.ok=true;</script><main>real page</main></body></html>';
const syntheticScript = firstInlineScript(synthetic);
const syntheticBuilt = injectDocumentHooks(synthetic, {
  headHook,
  bodyHook,
  headMarker: 'manifest.webmanifest',
  bodyMarker: 'onboarding.js',
  label: 'synthetic-regression'
});
assert.equal(firstInlineScript(syntheticBuilt), syntheticScript, 'PWA injection corrupted an inline script containing nested HTML');
new vm.Script(firstInlineScript(syntheticBuilt), { filename: 'synthetic-inline.js' });
const syntheticBounds = documentBoundaries(syntheticBuilt, 'synthetic-built');
const syntheticHookPos = syntheticBuilt.indexOf(bodyHook);
assert(syntheticHookPos > syntheticBuilt.indexOf('</script>'), 'PWA body hooks must come after the real inline script');
assert.equal(syntheticBuilt.slice(syntheticHookPos + bodyHook.length, syntheticBounds.bodyClose).trim(), '', 'PWA body hooks must sit at the outer body boundary');

const workflow = text('.github/workflows/pages.yml');
for (const required of ['actions/checkout@v6','actions/configure-pages@v5','actions/upload-pages-artifact@v4','actions/deploy-pages@v4','pages: write','id-token: write','node verify.mjs','node timeforge-verify.mjs','node pwa-verify.mjs','node scripts/build-pages.mjs']) assert(workflow.includes(required));

if (site) {
  for (const file of ['index.html','timeforge.html','manifest.webmanifest','sw.js','pwa-install.js','onboarding.js','offline.html','icons/icon-192.png','icons/icon-512.png']) assert(fs.existsSync(path.join(root, site, file)), `${file} missing from ${site}`);
  for (const file of ['index.html','timeforge.html']) {
    const source = text(file);
    const html = fs.readFileSync(path.join(root, site, file), 'utf8');
    const bounds = documentBoundaries(html, `${site}/${file}`);
    const hookPos = html.indexOf(bodyHook);
    assert(html.includes(headHook), `${file}: manifest hook missing`);
    assert(hookPos >= 0, `${file}: PWA/tutorial hooks missing`);
    assert.equal(html.indexOf(installHook), hookPos, `${file}: install hook must precede guide hook`);
    assert.equal(html.indexOf(guideHook), hookPos + installHook.length, `${file}: guide hook must immediately follow install hook`);
    assert.equal(html.slice(hookPos + bodyHook.length, bounds.bodyClose).trim(), '', `${file}: PWA/tutorial hooks are not at the outer body boundary`);

    const sourceInline = firstInlineScript(source);
    const builtInline = firstInlineScript(html);
    if (sourceInline !== null) {
      assert.equal(builtInline, sourceInline, `${file}: Pages build changed the first inline script`);
      new vm.Script(builtInline, { filename: `${file}:inline` });
    }
  }
}
console.log(`PWA VERIFY PASS${site ? ` (${site})` : ''}: manifest, icons, scoped service worker, install flow, interactive onboarding, parser-safe injection${site ? ', built HTML script integrity, and outer-boundary hooks' : ''}`);
