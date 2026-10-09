import {createVessel} from './vessel.js?v=0859e94a50ba';
import * as THREE from './vendor/three.module.js';

// Uses the same paper renderer, actor artwork and page-local coordinate system.
export function createVoyage({left,right,paper,pieces,assets,cream,grain,box,actorTemplate,stage,smooth}){
 const L=new THREE.Group(),R=new THREE.Group();left.add(L);right.add(R);
 const folds=[],waves=[];
 const waterMat=new THREE.MeshStandardMaterial({map:grain('#a5cfca'),roughness:1});
 for(const [parent,x0,x1] of [[L,-1.8,0],[R,0,4.35]]){
  const water=new THREE.Shape();water.moveTo(x0,-2.7);water.lineTo(x1,-2.7);water.lineTo(x1,2.5);water.bezierCurveTo(x1-.3,2.75,x0+.25,2.6,x0,2.4);water.closePath();
  const geometry=new THREE.ExtrudeGeometry(water,{depth:.008,bevelEnabled:false,curveSegments:20});geometry.rotateX(-Math.PI/2);
  const mesh=new THREE.Mesh(geometry,waterMat);mesh.position.y=.062;mesh.receiveShadow=true;parent.add(mesh);
 }

 function add(name,parent,options){const pivot=paper(name,parent,options);folds.push(pieces.pop());return pivot;}
 const wood=new THREE.MeshStandardMaterial({map:grain('#bd8b56'),roughness:1});
 const dark=new THREE.MeshStandardMaterial({color:0x514936,roughness:1});
 const gold=new THREE.MeshStandardMaterial({map:grain('#dcad55'),roughness:1});
 // The existing houses are one layered cutout; use a cropped cluster of four.
 add('houses',L,{x:-2.7,z:-2.25,w:3.2,h:1.55,min:-1.4,max:1.4,direction:1,delay:0});
 for(let layer=0;layer<3;layer++){
  const z=[-2.5,-.4,2.35][layer],h=[.68,.48,.52][layer];
  for(const [parent,min,max] of [[L,-1.8,0],[R,0,4.3]]){
   const p=add(layer===1?'waves-middle':'waves',parent,{w:8.6,h,min,max,z,delay:.45+layer*.12,direction:layer===0?1:-1,lift:.015+layer*.015,tint:layer===0?0xc8e9ea:0xffffff});waves.push({p,layer});
  }
 }
 const dock=new THREE.Group();dock.position.set(-1.8,.09,.8);L.add(dock);
 for(let i=0;i<10;i++)box(.22,.07,1.05,wood,-1.1+i*.24,.49,0,dock);
 for(const x of [-1,-.15,1])box(.09,.48,.09,wood,x,.22,.4,dock);
 const plank=new THREE.Group();plank.position.set(-.55,.61,.8);L.add(plank);
 box(.9,.035,.4,wood,.45,0,0,plank);box(.9,.008,.025,gold,.45,.025,.18,plank);
 const {ship,boat,sail,actor,sailorA,sailorB,cabin,cover}=createVessel({R,add,assets,cream,grain,box,actorTemplate});
 const heroHinge=new THREE.Group();heroHinge.position.set(-1,.62,.85);L.add(heroHinge);
 const jonah=actor(heroHinge,.58); // original face, clothing, rear and shoulder hinges
 const sleep=document.createElement('div');sleep.className='scene-label';sleep.textContent='쿨…';sleep.hidden=true;stage.appendChild(sleep);
 const hit=document.createElement('button');hit.id='voyage-boat';hit.className='boat-target';hit.setAttribute('aria-label','배를 눌러 요나 승선');hit.title='배를 눌러 요나의 여행을 이어가 보세요.';hit.hidden=true;stage.appendChild(hit);
 const callout=document.createElement('div');callout.className='voyage-callout';callout.hidden=true;
 callout.innerHTML='<span>배를 눌러 요나의 여행을<br>이어가 보세요.</span><svg viewBox="0 0 120 80" aria-hidden="true"><path d="M105 4 Q100 45 18 65"/><path class="arrow-tip" d="m25 54-10 12 16 3"/></svg>';
 stage.appendChild(callout);
 const lines=[
  '요나는 항구에서 다시스로 가는 배를 찾았어요. 니느웨와는 반대쪽으로 가는 배였지요.',
  '요나는 뱃삯을 내고 배에 올랐어요. 하나님을 피해 멀리 떠나려 했어요.',
  '바람을 받은 배가 천천히 항구를 떠났어요.',
  '요나는 배 안쪽으로 내려갔어요. 그리고 깊이 잠들었지요.',
  '그런데, 잠잠하던 바다에 무슨 일이 생기려는 걸까요?'
 ];
 const state={phase:'intro',time:0,travel:0,board:0,cabin:0,clock:0};
 function setPhase(p){state.phase=p;state.time=0;}
 function reset(){Object.assign(state,{phase:'intro',time:0,travel:0,board:0,cabin:0,clock:0});L.add(heroHinge);heroHinge.position.set(-1,.62,.85);heroHinge.rotation.set(0,0,0);ship.position.set(1.4,0,.65);ship.rotation.set(0,0,0);plank.rotation.set(0,0,0);cover.rotation.y=0;jonah.root.position.set(0,0,0);jonah.body.rotation.set(0,.45,0);sleep.hidden=hit.hidden=callout.hidden=true;}
 function board(){if(state.phase!=='ready')return;setPhase('boarding');}
 hit.onclick=board;
 function next(){if(state.phase==='intro'){setPhase('ready');return;}board();}
 function pose(a,stride=0,wave=0){a.armL.rotation.set(stride*.2,0,2.55);a.armR.rotation.set(-stride*.2,0,-2.55+wave);a.footL.rotation.x=stride*.45;a.footR.rotation.x=-stride*.45;}
 function update({dt,active,unfold,progress,paused,project}){
  const running=active&&progress>.999&&!paused;
  if(running){state.time+=dt;state.clock+=dt;
   if(state.phase==='intro'&&state.time>=6)setPhase('ready');
   if(state.phase==='boarding'){state.board=smooth(0,3.2,state.time);if(state.time>=3.2){
    // Preserve the final page-space position when joining the moving ship.
    boat.add(heroHinge);heroHinge.position.set(0,.62,.16);setPhase('paid');
   }}
   if(state.phase==='paid'&&state.time>=2.2)setPhase('retract');
   if(state.phase==='retract'&&state.time>=1.1)setPhase('sailing');
   if(state.phase==='sailing'){state.travel=smooth(0,6,state.time);if(state.time>=6)setPhase('look');}
   if(state.phase==='look'&&state.time>=1.6)setPhase('cabin');
   if(state.phase==='cabin'){state.cabin=smooth(0,4,state.time);if(state.time>=4)setPhase('sleep');}
   if(state.phase==='sleep'&&state.time>=.6)setPhase('end');
  }
  const openness=smooth(0,3,unfold)*smooth(.35,1,progress),motion=openness*(active?1:0);
  for(const p of folds)p.pivot.rotation.x=p.direction*Math.PI/2*(1-smooth(.04,.94,unfold/3)*smooth(p.delay/8,.95,progress));
  waves.forEach(({p,layer})=>p.rotation.x+=Math.sin(state.clock*.7+layer*1.4)*.012*motion);
  dock.rotation.x=-.13*(1-smooth(.04,.94,unfold/3));
  const onboard=state.board>=1;
  if(!onboard){
   // The hinge remains page attached until Jonah actually reaches the deck.
   const p=state.board;heroHinge.position.set(THREE.MathUtils.lerp(-1,1.4,p),THREE.MathUtils.lerp(.62,.74,p),THREE.MathUtils.lerp(.85,.81,p));
   const host=heroHinge.position.x<0?L:R;if(heroHinge.parent!==host)host.add(heroHinge);
   heroHinge.rotation.x=-Math.PI/2*(1-smooth(.04,.94,unfold/3)*smooth(.3,1,progress));
  }else{heroHinge.rotation.x=0;heroHinge.position.set(0,.62,.16);}
  ship.position.x=1.4+state.travel*1.45; // 15.6% of the 9.3-unit spread; hull edge <=4.38.
  ship.position.y=onboard&&state.travel>0?Math.sin(state.clock*.8)*.025*motion:0;
  ship.rotation.z=Math.sin(state.clock*.72)*.008*motion*(state.travel>0?1:0);
  sail.rotation.z=Math.sin(state.clock*.6)*.009*motion;
  const retract=state.phase==='retract'?smooth(0,1.1,state.time):['sailing','look','cabin','sleep','end'].includes(state.phase)?1:0;
  plank.rotation.z=retract*Math.PI/2;
  const walking=state.phase==='boarding';const stride=walking?Math.sin(state.time*10):0;
  pose(jonah,stride);jonah.body.rotation.set(0,walking?.55:.35,walking?stride*.025:0);
  // Sailors fold at their feet as part of the vessel and remain on its deck.
  for(const [i,a] of [sailorA,sailorB].entries()){
   a.root.rotation.x=-Math.PI/2*(1-smooth(.04,.94,unfold/3)*smooth(.4,1,progress));
   pose(a,0,i===0&&['intro','ready','retract'].includes(state.phase)?1.65+Math.sin(state.clock*2)*.16:0);
   a.head.rotation.z=Math.sin(state.clock*.65+i)*.04*motion;
   a.body.rotation.y=i===0?-.18:.16+Math.sin(state.clock*.5)*.04*motion;
  }
  if(state.phase==='look')jonah.body.rotation.y=THREE.MathUtils.lerp(.35,-.65,smooth(0,.8,state.time));
  const entering=['cabin','sleep','end'].includes(state.phase);
  if(entering){
   const t=state.phase==='cabin'?state.time:4;
   jonah.body.rotation.y=THREE.MathUtils.lerp(-.65,-2.7,smooth(0,1,t));
   heroHinge.position.x=THREE.MathUtils.lerp(0,-.62,smooth(0,1.2,t));
   heroHinge.position.y=.62-.5*smooth(1.2,3.2,t);
   heroHinge.position.z=.16-.09*smooth(.8,1.7,t);
   pose(jonah,t<1.2?Math.sin(t*10):0);
   cover.rotation.y=-1.3*smooth(0,.7,t)*(1-smooth(2.8,4,t));
  }else cover.rotation.y=0;
  sleep.hidden=!(active&&['sleep','end'].includes(state.phase)&&progress>.999);
  hit.hidden=!(active&&state.phase==='ready'&&progress>.999);hit.disabled=paused;
  project(hit,boat,0,1.1,.1);project(sleep,cabin,0,1.2,.15);
  callout.hidden=hit.hidden;
  if(!callout.hidden){
   const boatX=parseFloat(hit.style.left),boatY=parseFloat(hit.style.top);
   const x=Math.max(12,Math.min(stage.clientWidth-callout.offsetWidth-12,boatX+25));
   const y=Math.max(8,boatY-callout.offsetHeight-65);
   callout.style.left=`${x}px`;callout.style.top=`${y}px`;
   const svg=callout.querySelector('svg'),startX=callout.offsetWidth*.55,startY=callout.offsetHeight;
   const endX=boatX-x,endY=boatY-y-25;
   svg.setAttribute('viewBox',`${-x} ${-y} ${stage.clientWidth} ${stage.clientHeight}`);
   svg.style.left=`${-x}px`;svg.style.top=`${-y}px`;
   svg.style.width=`${stage.clientWidth}px`;svg.style.height=`${stage.clientHeight}px`;
   svg.querySelector('path').setAttribute('d',`M${startX} ${startY+4} Q${startX} ${endY-20} ${endX} ${endY}`);
   svg.querySelector('.arrow-tip').setAttribute('d',`M${endX-5} ${endY-11} L${endX} ${endY} L${endX+12} ${endY-3}`);
  }
  // Diagnostics read by browser QA; scene logic has no timer outside this update.
  stage.dataset.voyagePhase=state.phase;stage.dataset.shipX=ship.position.x.toFixed(3);stage.dataset.boarded=String(onboard);stage.dataset.onShip=String(heroHinge.parent===boat);stage.dataset.cabinProgress=state.cabin.toFixed(3);
 }
 function caption(){return ['intro','ready'].includes(state.phase)?lines[0]:['boarding','paid','retract'].includes(state.phase)?lines[1]:state.phase==='sailing'?lines[2]:state.phase==='end'?lines[4]:lines[3];}
 function hint(){return state.phase==='end'?'다음 이야기는 폭풍 장면이에요.':' '}
 reset();return {L,R,state,reset,next,update,caption,hint,hideUI(){sleep.hidden=hit.hidden=callout.hidden=true;},canNext(){return ['intro','ready','end'].includes(state.phase);}};
}
