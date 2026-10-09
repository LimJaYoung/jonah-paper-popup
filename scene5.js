import {createKit,controller} from './story-kit.js?v=78f8a5e6eb7c';
import * as THREE from './vendor/three.module.js';
export function createScene5(ctx){const k=createKit(ctx),{L,R,hinge,mat,cut,smooth}=k;
 // Nested arch silhouettes have open centers, like a layered paper theatre.
 for(let i=0;i<3;i++)for(const side of [-1,1]){const root=hinge(side<0?L:R,0,-2.5+i*.75),outer=4.15-i*.48,inner=outer-.48,h=3.5-i*.4;const pts=[];for(let j=0;j<=24;j++){const a=Math.PI/2+j*Math.PI/48;pts.push([-side*outer*Math.cos(a),h*Math.sin(a)]);}pts.push([side*outer,0],[side*inner,0]);for(let j=24;j>=0;j--){const a=Math.PI/2+j*Math.PI/48;pts.push([-side*inner*Math.cos(a),(h-.35)*Math.sin(a)]);}cut(pts,mat(['#245b78','#3c989f','#83c9cd'][i]),root);}
 const dais=hinge(R,1,.7);k.folds.pop();const pad=k.oval(dais,0,0,1.15,.85,mat('#f7e8c8'));pad.rotation.x=-Math.PI/2;
 const a=k.actor(R,1,.8,1.03);k.hotspot(a.root,'prayer');
 const light=new THREE.PointLight(0xffd791,0,9,2);light.position.set(1,3.8,.7);R.add(light);
 const steps=[['quiet',6,'물고기 배 속에서 요나는 하나님께 기도했어요.'],['invite',Infinity,'물고기 배 속에서 요나는 하나님께 기도했어요.',''],['raise',7,'하나님, 제 기도를 들어주세요.'],['bow',9,'깊은 바다에서 부르짖을 때, 제 목소리를 들어 주셨어요.'],['thanks',8,'저를 살려 주셔서 감사해요. 하나님께 감사하며 약속을 지킬게요.'],['heard',6,'하나님은 요나의 기도를 들으셨어요.'],['end',Infinity,'하나님은 요나의 기도를 들으셨어요.','다음 페이지로 이어가요.']];
 const chapter=controller(steps,({state:s,open,active})=>{const i=s.index,t=s.time;let kneel=1,bow=.18,arms=2.2;
 if(i===2){kneel=1-smooth(0,2,t);bow=.18*(1-smooth(0,2,t));arms=2.2*(1-smooth(1,3.5,t));}
 if(i===3){kneel=smooth(1,3,t);bow=1.35*smooth(3,6,t);arms=2.55*smooth(0,2,t)*(1-smooth(3,6,t));}
 if(i>=4){bow=1.35*(1-smooth(0,3,i===4?t:8));arms=1.7*smooth(0,3,i===4?t:8);}
 k.pose(a,{kneel,bow,arms});const reach=i===3?smooth(3,6,t):i===4?1-smooth(0,3,t):0;a.armL.rotation.x=a.armR.rotation.x=.95*reach;light.intensity=active?(1.4+(i>=4?smooth(0,4,t):0))*open:0;
 },k,{readyAfter:{raise:3.5,bow:6,thanks:4,invite:.3},onAction(key,{state,next}){if(key!=='prayer')return;if(state.phase==='invite')next();else if(state.phase==='end'){state.index=2;state.phase='raise';state.time=0;}}});
 const callout=document.createElement('div');callout.className='voyage-callout prayer-callout';callout.hidden=true;
 callout.innerHTML='<span>요나를 눌러 보세요.</span><svg aria-hidden="true"><path/><path class="arrow-tip"/></svg>';ctx.stage.appendChild(callout);
 const anchor=document.createElement('span'),update=chapter.update,reset=chapter.reset;
 chapter.update=args=>{
  update(args);
  callout.hidden=!(args.active&&args.progress>.999&&['invite','end'].includes(chapter.state.phase));
  callout.style.animationPlayState=args.paused?'paused':'running';
  if(callout.hidden)return;
  callout.querySelector('span').textContent=chapter.state.phase==='end'?'요나를 눌러 기도를 다시 보세요.':'요나를 눌러 보세요.';
  args.project(anchor,a.root,0,1.25,0);
  const stage=ctx.stage,bx=parseFloat(anchor.style.left),by=parseFloat(anchor.style.top);
  const x=Math.max(12,Math.min(stage.clientWidth-callout.offsetWidth-12,bx+25));
  const y=Math.max(8,by-callout.offsetHeight-65);
  callout.style.left=`${x}px`;callout.style.top=`${y}px`;
  const svg=callout.querySelector('svg'),sx=callout.offsetWidth*.55,sy=callout.offsetHeight,ex=bx-x,ey=by-y-15;
  svg.setAttribute('viewBox',`${-x} ${-y} ${stage.clientWidth} ${stage.clientHeight}`);
  Object.assign(svg.style,{left:`${-x}px`,top:`${-y}px`,width:`${stage.clientWidth}px`,height:`${stage.clientHeight}px`});
  svg.querySelector('path').setAttribute('d',`M${sx} ${sy+4} Q${sx} ${ey-20} ${ex} ${ey}`);
  svg.querySelector('.arrow-tip').setAttribute('d',`M${ex-5} ${ey-11} L${ex} ${ey} L${ex+12} ${ey-3}`);
 };
 chapter.reset=()=>{reset();callout.hidden=true;};
 return chapter;

}
