import fs from 'node:fs';
import path from 'node:path';
import { injectDocumentHooks } from './html-document.mjs';

const root = process.cwd();
const out = path.join(root, '_site');
const files = [
  'index.html','timeforge.html','timeforge-core.js','timeforge-ui.js','timeforge-app.js',
  'manifest.webmanifest','sw.js','pwa-install.js','onboarding.js','offline.html'
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'icons'), { recursive: true });
for (const file of files) fs.copyFileSync(path.join(root, file), path.join(out, file));
for (const icon of ['icon-192.png','icon-512.png']) fs.copyFileSync(path.join(root, 'icons', icon), path.join(out, 'icons', icon));
fs.writeFileSync(path.join(out, '.nojekyll'), '');

const headHooks = [
  '<link rel="manifest" href="./manifest.webmanifest">',
  '<link rel="apple-touch-icon" href="./icons/icon-192.png">',
  '<meta name="mobile-web-app-capable" content="yes">'
].join('');
const bodyHook = [
  '<script src="./pwa-install.js" defer></script>',
  '<script src="./onboarding.js" defer></script>'
].join('');

for (const file of ['index.html','timeforge.html']) {
  const target = path.join(out, file);
  const source = fs.readFileSync(target, 'utf8');
  const html = injectDocumentHooks(source, {
    headHook: headHooks,
    bodyHook,
    headMarker: 'rel="manifest" href="./manifest.webmanifest"',
    bodyMarker: 'src="./onboarding.js"',
    label: file
  });
  fs.writeFileSync(target, html);
}
console.log(`PAGES BUILD PASS: ${files.length + 2} runtime assets staged in _site`);
