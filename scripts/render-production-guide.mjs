import {readFile,writeFile,rename,readdir,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const args=process.argv.slice(2),options={};
for(let i=0;i<args.length;i++){
 if(args[i]==='--web'){options.web=true;continue;}
 if(!['--source-root','--output-dir','--shell'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--'))throw Error('Invalid guide argument '+args[i]);
 options[args[i].slice(2)]=args[++i];
}
const root=options['source-root']?pathToFileURL(path.resolve(options['source-root'])+path.sep):new URL('../',import.meta.url);
const output=options['output-dir']?path.resolve(options['output-dir']):fileURLToPath(new URL('DASHBOARD/',root));
const docs=new Map(),links=[];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const anchor=p=>'doc-'+p.replace(/[^a-zA-Z0-9]+/g,'-');
const master=['GUIDELINE_AUDIT','DESIGN_ANIMATION_PROTOCOL','INDEX','IMPLEMENTATION_STATUS','STORY_GUIDE','DESIGN_SYSTEM','AUDIO_GUIDE','ANIMATION_GUIDE','QA_CHECKLIST','LAYOUT_PARITY','VIDEO_EXPORT','SERIES_GUIDE','YOUTUBE_AUTOMATION','HANDOFF','PRODUCTION_RECORD_TEMPLATE','STORY_TEMPLATE','GUIDELINE_HISTORY'];
const paths=['AGENTS.md','MASTER/PRODUCTION_PLAYBOOK.md',...master.map(x=>`MASTER/${x}.md`)];
const storyIds=(await readdir(new URL('STORIES/',root),{withFileTypes:true})).filter(x=>x.isDirectory()).map(x=>x.name).sort();
for(const id of storyIds)for(const f of options.web?['STORY_RULES']:['PRODUCTION_NOTES','STORY_RULES'])paths.push(`STORIES/${id}/${f}.md`);
if(!options.web)paths.push('STORIES/01-jonah/JONAH_SCRIPT_CASTING.md','STORIES/01-jonah/IMPLEMENTATION_REFERENCE.md','STORIES/02-noah/SCRIPT_DRAFT.md','STORIES/02-noah/reconstruction-19/SOURCE_MOTION_PLAN.md');
paths.push('DEPLOYMENT/WEB_CONTROL.md','DEPLOYMENT/AI_EXECUTOR.md');
if(!options.web)paths.push('DEPLOYMENT/PRIVATE_PREVIEW.md');
for(const p of paths)docs.set(p,await readFile(new URL(p,root),'utf8'));
const play='MASTER/PRODUCTION_PLAYBOOK.md',body=docs.get(play);
const sections=[...body.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(m=>({title:m[1],text:m[0]}));
function section(prefix){const x=sections.find(x=>x.title.startsWith(prefix));if(!x)throw Error('Missing playbook section '+prefix);return x.text;}
const targetId=p=>p===play?'procedure':anchor(p);
function resolve(ref,source){
 const token=ref.split('#')[0];
 const candidates=[path.posix.normalize(path.posix.join(path.posix.dirname(source),token)),token,`MASTER/${token}`];
 return candidates.find(p=>docs.has(p));
}
function link(label,ref,source){
 if(/^https?:\/\//.test(ref))return `<a href="${esc(ref)}" target="_blank" rel="noreferrer">${label}</a>`;
 const p=resolve(ref,source);if(p){const id=targetId(p);links.push(id);return `<a href="#${id}">${label}</a>`;}
 // Unserved source/history files are labels, not broken browser links.
 return label;
}
function inline(text,source){
 const tokens=[];const save=html=>`\u0000${tokens.push(html)-1}\u0000`;
 text=text.replace(/!\[([^\]]*)\]\((\/guide-references\/[a-z0-9-]+\.(?:jpg|png|webp))\)/g,(_,alt,src)=>save(`<a href="${esc(src)}" target="_blank" rel="noreferrer"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" style="display:block;width:100%;height:auto;border-radius:8px"></a>`));
 text=text.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,ref)=>save(link(esc(label),ref,source)));
 text=text.replace(/`([^`]+)`/g,(_,code)=>save(link(`<code>${esc(code)}</code>`,code,source)));
 text=esc(text).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
 return text.replace(/\u0000(\d+)\u0000/g,(_,n)=>tokens[Number(n)]);
}
function md(text,source){
 const lines=text.split('\n');let html='',list='';const close=()=>{if(list){html+=`</${list}>`;list='';}};
 for(let i=0;i<lines.length;i++){
  const line=lines[i];if(line.startsWith('|')){close();html+='<div class="table-wrap"><table>';let first=true;
   while(i<lines.length&&lines[i].startsWith('|')){const cells=lines[i].split('|').slice(1,-1);if(!cells.every(c=>/^\s*[-:]+\s*$/.test(c))){const tag=first?'th':'td';html+='<tr>'+cells.map(c=>`<${tag}>${inline(c.trim(),source)}</${tag}>`).join('')+'</tr>';first=false;}i++;}i--;html+='</table></div>';continue;}
  const li=line.match(/^(?:- |\d+\. )(.*)/);if(li){const tag=/^\d/.test(line)?'ol':'ul';if(list!==tag){close();html+=`<${tag}>`;list=tag;}html+=`<li>${inline(li[1],source)}</li>`;continue;}close();
  const h=line.match(/^(#{1,6}) (.*)/);if(h){const level=Math.min(5,h[1].length+1);html+=`<h${level}>${inline(h[2],source)}</h${level}>`;}else if(line.startsWith('> '))html+=`<blockquote>${inline(line.slice(2),source)}</blockquote>`;else if(line.trim())html+=`<p>${inline(line,source)}</p>`;
 }close();return html;
}
const label=p=>p.endsWith('PRODUCTION_RECORD_TEMPLATE.md')?'작품 기록 양식':p.endsWith('SOURCE_MOTION_PLAN.md')?'노아 19장면 동작 원문':docs.get(p).split('\n')[0].replace(/^# /,'');
const source=p=>`<span class="source">원문 · ${esc(p)}</span>`;
function detail(p,title=label(p)){return `<details id="${anchor(p)}"><summary>${esc(title)}</summary>${source(p)}${md(docs.get(p),p)}</details>`;}
const chips=files=>`<div class="links">${files.map(p=>link(esc(label(p)),p,play)).join('')}</div>`;
const stageDocs={0:['IMPLEMENTATION_STATUS','STORY_TEMPLATE'],1:['STORY_GUIDE','STORY_TEMPLATE','DESIGN_SYSTEM','AUDIO_GUIDE','ANIMATION_GUIDE'],2:['QA_CHECKLIST'],3:['PRODUCTION_RECORD_TEMPLATE'],4:['STORY_GUIDE','AUDIO_GUIDE'],5:['ANIMATION_GUIDE','AUDIO_GUIDE'],6:['LAYOUT_PARITY','VIDEO_EXPORT'],7:['QA_CHECKLIST','VIDEO_EXPORT'],8:['QA_CHECKLIST'],9:['PRODUCTION_RECORD_TEMPLATE','QA_CHECKLIST'],10:['YOUTUBE_AUTOMATION'],11:['SERIES_GUIDE','YOUTUBE_AUTOMATION'],12:['YOUTUBE_AUTOMATION'],13:['HANDOFF','PRODUCTION_RECORD_TEMPLATE'],14:['HANDOFF']};
const version=body.match(/^버전 ([^\n]+)/m)?.[1];if(!version)throw Error('Missing official guideline version');
const reading=`<section id="reading"><h2><span>1</span> 작업 전 읽는 순서</h2><p>공식 지침 버전 ${esc(version)}</p>${source(play)}${md(section('2.'),play)}${options.web?'<p>웹에는 공식 지침과 작품별 확정 규칙을 표시합니다. 실제 제작 기록·현재 승인 증거는 PC 원본에서 확인합니다.</p>':''}${detail('AGENTS.md','코덱스 시작 규칙 · AGENTS.md')}${chips(['MASTER/DESIGN_ANIMATION_PROTOCOL.md','MASTER/IMPLEMENTATION_STATUS.md','MASTER/INDEX.md','MASTER/GUIDELINE_HISTORY.md'])}<div class="stories">${storyIds.map(id=>`<div><b>${esc(id)}</b>${chips((options.web?['STORY_RULES']:['PRODUCTION_NOTES','STORY_RULES']).map(f=>`STORIES/${id}/${f}.md`))}</div>`).join('')}</div><details><summary>제작 방향과 지시 적용 기준</summary>${md(section('1.')+section('3.'),play)}</details></section>`;
const procedure=`<section id="procedure"><h2><span>2</span> 단계별 제작 절차</h2>${source(play)}${md(section('5.'),play)}${Array.from({length:15},(_,i)=>{const n=String(i).padStart(2,'0');return `<details id="stage-${n}" class="stage"><summary>${esc(sections.find(s=>s.title.startsWith(n+'.')).title)}</summary>${md(section(n+'.'),play)}${chips(stageDocs[i].map(x=>`MASTER/${x}.md`))}</details>`;}).join('')}</section>`;
const quality=`<section id="quality"><h2><span>3</span> 검수와 통과 조건</h2>${source(play)}${md(section('4.'),play)}${detail('MASTER/QA_CHECKLIST.md')}${chips(['MASTER/LAYOUT_PARITY.md','MASTER/VIDEO_EXPORT.md'])}</section>`;
const resume=`<section id="resume"><h2><span>4</span> 수정·재개 방법</h2>${source(play)}${md(section('6.')+section('7.'),play)}${detail('MASTER/HANDOFF.md')}${detail('MASTER/PRODUCTION_RECORD_TEMPLATE.md')}</section>`;
const displayed=new Set(['AGENTS.md',play,'MASTER/QA_CHECKLIST.md','MASTER/HANDOFF.md','MASTER/PRODUCTION_RECORD_TEMPLATE.md']);
const references=`<section id="references"><h2>세부 지침과 작품별 기록</h2><p>위 절차에서 연결한 문서를 여기에서 읽을 수 있습니다.</p>${paths.filter(p=>!displayed.has(p)).map(p=>detail(p)).join('')}</section>`;
const content=reading+procedure+quality+resume+references;
const css=`@font-face{font-family:Pretendard;src:url(/assets/fonts/PretendardVariable.woff2);font-display:swap}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:18px}body{margin:0;background:#f7f5ee;color:#244e51;font:15px/1.3 Pretendard,system-ui,sans-serif;letter-spacing:-.02em}header,main{max-width:1080px;margin:auto;padding:24px}header{padding-bottom:12px}header p{margin:4px 0;color:#627771}h1{font-size:27px;margin:0 0 8px}h2{font-size:23px;margin:0 0 18px;line-height:1.5}h2 span{display:inline-grid;place-items:center;width:32px;height:32px;margin-right:8px;border-radius:50%;background:#245a5d;color:white;font-size:17px}h3{font-size:19px}h4{font-size:16px}nav{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}a{color:#246b71;text-underline-offset:3px}nav a,.links a{display:inline-block;background:#eaf0e8;border:1px solid #d9e3d7;border-radius:7px;padding:5px 10px;text-decoration:none;font-size:13px}section{background:#fffef9;border:1px solid #dedfd3;border-radius:12px;padding:24px;margin-bottom:22px}section:target,details:target{outline:2px solid #79a798;outline-offset:3px}details{border:1px solid #dce3d8;border-radius:8px;padding:12px 16px;margin:12px 0;scroll-margin-top:18px}summary{font-size:16px;font-weight:650;cursor:pointer}details[open]>summary{border-bottom:1px solid #e3e7dd;padding-bottom:10px;margin-bottom:14px}.source{display:block;color:#75877e;font-size:11px;margin:4px 0 14px;overflow-wrap:anywhere}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px;margin:14px 0}td,th{border:1px solid #dce3d8;padding:9px 11px;text-align:left;vertical-align:top}th{background:#eff3e9}p,li{overflow-wrap:anywhere}code{background:#eef1e8;padding:1px 3px;font-size:.9em}ul,ol{padding-left:24px}li{margin:7px 0}.links{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}.stories{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:20px 0}.stories>div{padding:12px;background:#f7f6ee;border-radius:8px}blockquote{border-left:3px solid #9db7a4;margin:15px 0;padding:8px 16px;background:#f7f7ed}@media(max-width:600px){header,main{padding:14px}section{padding:16px}h1{font-size:22px}h2{font-size:19px}}@media print{details{break-inside:auto}nav{display:none}body{background:white}}`;
const page=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>열려라 성경동화 · 제작 지침</title><style>${css}</style></head><body><header><h1>열려라 성경동화 제작 지침</h1><p>작업을 시작하고, 검수하고, 다음 작업으로 이어가는 순서</p><nav aria-label="제작 지침 순서"><a href="#reading">1 읽는 순서</a><a href="#procedure">2 제작 절차</a><a href="#quality">3 검수·통과</a><a href="#resume">4 수정·재개</a><a href="#references">세부 문서·작품 기록</a></nav></header><main>${content}</main><script>function reveal(){const e=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(e){let p=e;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}e.scrollIntoView();}}addEventListener('hashchange',reveal);reveal();addEventListener('beforeprint',()=>document.querySelectorAll('details').forEach(e=>{e.dataset.printOpen=e.open;e.open=true}));addEventListener('afterprint',()=>document.querySelectorAll('details').forEach(e=>e.open=e.dataset.printOpen==='true'));</script></body></html>`;
let rendered=page;
if(options.shell){
 const shell=await readFile(path.resolve(options.shell),'utf8');
 if((shell.match(/<main>/g)||[]).length!==1||(shell.match(/<\/main>/g)||[]).length!==1)throw Error('Guide shell must have one main element');
 rendered=shell.replace(/<main>[\s\S]*?<\/main>/,()=>`<main>${content}</main>`);
}
const ids=new Set([...rendered.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
for(const id of links)if(!ids.has(id))throw Error('Broken generated link '+id);
const sha=s=>createHash('sha256').update(s).digest('hex');
const manifest={guidelineVersion:version,scope:options.web?'official-guidelines-only':'pc-guidelines-and-records',sources:paths.map(p=>({path:p,sha256:sha(docs.get(p))})),outputSha256:sha(rendered),internalLinks:links.length,stages:Array.from({length:15},(_,i)=>`stage-${String(i).padStart(2,'0')}`),sections:['reading','procedure','quality','resume','references']};
await mkdir(output,{recursive:true});
for(const [p,text] of [['guide.html',rendered],['guide-sources.json',JSON.stringify(manifest,null,2)+'\n']]){const target=path.join(output,p),tmp=target+'.tmp';await writeFile(tmp,text);await rename(tmp,target);}
console.log(`Production guide synchronized: ${paths.length} source documents, 00–14 stages, ${links.length} internal links (${manifest.scope}).`);
