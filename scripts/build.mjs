import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const files=['index.html','style.css','app.js','scene2.js','scene3.js','story-kit.js','scene4.js','scene5.js','scene6.js','scene7.js','scene8.js','vessel.js'];
const sources=new Map(await Promise.all(files.map(async name=>[name,await readFile(name,'utf8')])));
// Version the complete module graph, not just the page URL: older cached scene
// modules and CSS must never be mixed with a newly deployed entry point.
const version=createHash('sha256').update([...sources.values()].join('\n')).digest('hex').slice(0,12);
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const [name,source] of sources){
 let output=source;
 if(name.endsWith('.js'))output=output.replace(/(['"])(\.\/([^'"?]+\.js))\1/g,(match,quote,path,target)=>sources.has(target)?`${quote}${path}?v=${version}${quote}`:match);
 if(name==='index.html')output=output.replace('href="style.css"',`href="style.css?v=${version}"`).replace('src="app.js"',`src="app.js?v=${version}"`);
 await writeFile(`dist/${name}`,output);
}
await cp('assets','dist/assets',{recursive:true,filter:file=>!file.endsWith('.md')});
await cp('vendor','dist/vendor',{recursive:true});
await writeFile('dist/.nojekyll','');
console.log(`Static site built in dist/ (${version})`);
