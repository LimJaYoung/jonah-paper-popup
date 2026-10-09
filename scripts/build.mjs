import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'style.css', 'app.js']) await cp(file, `dist/${file}`);
await cp('assets', 'dist/assets', { recursive: true, filter: file => !file.endsWith('.md') });
await cp('vendor', 'dist/vendor', { recursive: true });
await writeFile('dist/.nojekyll', '');
console.log('Static site built in dist/');
