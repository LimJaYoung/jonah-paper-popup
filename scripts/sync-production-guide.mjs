import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const snapshot=path.join(root,'production-guidelines');
const renderer=path.join(root,'scripts/render-production-guide.mjs');
const shell=path.join(root,'public/guide.html');
const args=process.argv.slice(2);
if(args.length&&!(args.length===2&&args[0]==='--source-root'&&args[1]))throw Error('Use no arguments, or --source-root <PC project directory>');
function render(script,source,output){
 const result=spawnSync(process.execPath,[script,'--web','--source-root',source,'--output-dir',output,'--shell',shell],{cwd:root,stdio:'inherit'});
 if(result.error)throw result.error;if(result.status!==0)throw Error('Official guideline generation failed');
}
const allowed=p=>p==='AGENTS.md'||/^MASTER\/[A-Z_]+\.md$/.test(p)||/^STORIES\/[a-z0-9-]+\/STORY_RULES\.md$/.test(p)||/^DEPLOYMENT\/(WEB_CONTROL|AI_EXECUTOR)\.md$/.test(p);
const sha=buffer=>createHash('sha256').update(buffer).digest('hex');
if(args.length){
 const pc=path.resolve(args[1]);
 const pcRenderer=path.join(pc,'scripts/sync-production-guide.mjs');
 const staging=path.join(root,'.sites-runtime/guideline-import');
 render(pcRenderer,pc,staging);
 const manifest=JSON.parse(await readFile(path.join(staging,'guide-sources.json'),'utf8'));
 if(manifest.scope!=='official-guidelines-only')throw Error('Unexpected source scope');
 for(const entry of manifest.sources){
  if(!allowed(entry.path))throw Error('Non-guideline source refused: '+entry.path);
  const bytes=await readFile(path.join(pc,entry.path));
  if(sha(bytes)!==entry.sha256)throw Error('Source changed during import: '+entry.path);
  const target=path.join(snapshot,entry.path);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,bytes);
 }
 await copyFile(pcRenderer,renderer);
 await writeFile(path.join(snapshot,'source.json'),JSON.stringify({origin:'PC official production guidelines',guidelineVersion:manifest.guidelineVersion,rendererSource:'scripts/sync-production-guide.mjs',rendererSha256:sha(await readFile(renderer)),importedSources:manifest.sources},null,2)+'\n');
}
render(renderer,snapshot,path.join(root,'public'));
