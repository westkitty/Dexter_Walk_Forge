import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const root = process.cwd();
const siteIndex = process.argv.indexOf('--site');
const site = siteIndex >= 0 ? process.argv[siteIndex + 1] : null;
const read = p => fs.readFileSync(path.join(root, p));
const text = p => read(p).toString('utf8');

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

new vm.Script(text('sw.js'), { filename: 'sw.js' });
new vm.Script(text('pwa-install.js'), { filename: 'pwa-install.js' });
assert.match(text('sw.js'), /caches\.open\(CACHE\)/);
assert.match(text('sw.js'), /self\.clients\.claim/);
assert.match(text('pwa-install.js'), /beforeinstallprompt/);
assert.match(text('pwa-install.js'), /serviceWorker\.register\('\.\/sw\.js'/);

const workflow = text('.github/workflows/pages.yml');
for (const required of ['actions/checkout@v6','actions/configure-pages@v5','actions/upload-pages-artifact@v4','actions/deploy-pages@v4','pages: write','id-token: write','node verify.mjs','node timeforge-verify.mjs','node pwa-verify.mjs','node scripts/build-pages.mjs']) assert(workflow.includes(required));

if (site) {
  for (const file of ['index.html','timeforge.html','manifest.webmanifest','sw.js','pwa-install.js','offline.html','icons/icon-192.png','icons/icon-512.png']) assert(fs.existsSync(path.join(root, site, file)), `${file} missing from ${site}`);
  for (const file of ['index.html','timeforge.html']) {
    const html = fs.readFileSync(path.join(root, site, file), 'utf8');
    assert(html.includes('rel="manifest" href="./manifest.webmanifest"'));
    assert(html.includes('src="./pwa-install.js"'));
  }
}
console.log(`PWA VERIFY PASS${site ? ` (${site})` : ''}: manifest, icons, service worker, install flow, Pages workflow${site ? ', and built HTML hooks' : ''}`);
