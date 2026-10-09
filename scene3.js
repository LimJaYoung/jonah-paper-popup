import * as THREE from './vendor/three.module.js';
import {createVessel} from './vessel.js?v=b3b9c8e3c0f4';

export function createStorm({left,right,paper,pieces,assets,cream,grain,box,actorTemplate,stage,smooth}){
 const L=new THREE.Group(),R=new THREE.Group();left.add(L);right.add(R);
 const folds=[],waves=[],clouds=[];
 const add=(name,parent,opts)=>{const p=paper(name,parent,opts);folds.push(pieces.pop());return p;};
 const {ship,boat,sail,actor,sailorA,sailorB,cabin,cover}=createVessel({R,add,assets,cream,grain,box,actorTemplate});
 ship.position.set(.35,.15,.2);
 const jonah=actor(boat,.58);
 // Prayer cutouts are attached to the deck, so they follow the ship and page fold.
 const prayerArt=assets['sailor-praying'];
 const prayingSailors=[0,1].map(n=>{
  const h=n?.76:.8,w=h*(prayerArt.x1-prayerArt.x0)/(prayerArt.y1-prayerArt.y0);
  const geometry=new THREE.PlaneGeometry(w,h);geometry.translate(0,h/2,0);
  const uv=geometry.attributes.uv;
  for(let i=0;i<uv.count;i++)uv.setXY(i,THREE.MathUtils.lerp(prayerArt.x0/prayerArt.iw,prayerArt.x1/prayerArt.iw,uv.getX(i)),THREE.MathUtils.lerp(1-prayerArt.y1/prayerArt.ih,1-prayerArt.y0/prayerArt.ih,uv.getY(i)));
  const material=new THREE.MeshStandardMaterial({map:prayerArt.tex,alphaTest:.94,roughness:1,side:THREE.DoubleSide,color:n?0xe6d8a6:0xffffff});
  const figure=new THREE.Mesh(geometry,material);figure.position.set(n?.65:-.35,.65,.65);figure.castShadow=figure.receiveShadow=true;
  figure.customDepthMaterial=new THREE.MeshDepthMaterial({map:prayerArt.tex,alphaTest:.94,depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});
  figure.visible=false;boat.add(figure);return figure;
 });
 const wood=new THREE.MeshStandardMaterial({map:grain('#bd8b56'),roughness:1});
 // All extra props are thin, textured paper; no new raster artwork is required.
 function cutout(points,material,parent){const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:false}),material);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 for(let layer=0;layer<3;layer++)for(const [parent,min,max] of [[L,-4.3,0],[R,0,4.3]]){
  const p=add(layer===1?'waves-middle':'waves',parent,{w:8.6,h:[1.65,1.1,.95][layer],min,max,z:[-1.5,.95,2.45][layer],direction:layer===0?1:-1,lift:.025,delay:0,tint:[0x73adb9,0x84cddc,0x347e9c][layer]});waves.push({p,layer});
 }
 const cloudMat=new THREE.MeshStandardMaterial({map:grain('#8cabb7'),roughness:1,side:THREE.DoubleSide});
 for(const side of [-1,1]){
  const root=new THREE.Group();root.position.set(side*2.1,.1,-2.45);(side<0?L:R).add(root);
  cutout([[-1.85,0],[-1.85,.9],[-1.6,1.12],[-1.25,1.14],[-1.12,1.45],[-.78,1.6],[-.42,1.45],[-.15,1.75],[.25,1.8],[.57,1.51],[.92,1.57],[1.2,1.28],[1.65,1.2],[1.85,.88],[1.85,0]],cloudMat,root);clouds.push({root,side});
 }
 const oars=[sailorA,sailorB].map((a,i)=>{const p=new THREE.Group();boat.add(p);p.position.set(i?1:-.65,.88,.46);cutout([[-.025,0],[.025,0],[.035,-.7],[.13,-.85],[.1,-1.15],[-.1,-1.15],[-.13,-.85],[-.035,-.7]],wood,p);return p;});
 const crates=[0,1].map(i=>{const p=new THREE.Group();boat.add(p);box(.27,.26,.045,wood,0,.13,0,p);box(.035,.24,.01,cream,0,.13,.03,p);box(.25,.025,.01,cream,0,.13,.03,p);return p;});
 const splash=new THREE.Group();R.add(splash);splash.position.set(.75,.12,2.5);cutout([[-.35,0],[-.5,.32],[-.2,.2],[-.1,.55],[.06,.2],[.3,.4],[.26,.1],[.45,0]],new THREE.MeshStandardMaterial({map:grain('#d5eff0'),roughness:1}),splash);
 const warm=new THREE.PointLight(0xffd58e,0,8,2);warm.position.set(0,3,0);R.add(warm);
 const dialogue=document.createElement('div');dialogue.id='storm-dialogue';dialogue.className='storm-dialogue';dialogue.hidden=true;dialogue.setAttribute('role','status');dialogue.setAttribute('aria-live','polite');stage.appendChild(dialogue);
 const sleep=document.createElement('div');sleep.className='scene-label';sleep.textContent='쿨…';sleep.hidden=true;stage.appendChild(sleep);
 const steps=[
  ['wind',9,'그때, 하나님이 바다에 큰 바람을 보내셨어요. 잔잔하던 바다에 거센 폭풍이 일었어요.'],
  ['cargo',9,'배가 크게 흔들렸어요. 선원들은 두려워하며 배를 가볍게 하려고 짐을 바다에 내렸어요.'],
  ['wake',11,'그런데 요나는 배 안에서 깊이 잠들어 있었어요. 선장이 요나를 깨웠어요.','선장: “일어나세요! 하나님께 기도해 주세요!”'],
  ['confess',14,'요나는 자신이 하나님을 피해 도망가고 있다고 말했어요.','요나: “이 폭풍이 나 때문인 줄 알아요. 나를 바다에 내려놓으세요. 그러면 바다가 잠잠해질 거예요.”'],
  ['row',11,'선원들은 요나를 구하려고 힘껏 노를 저었어요. 하지만 파도는 더욱 거세졌어요.'],
  ['lower',10,'선원들은 하나님께 기도한 뒤, 요나를 조심스럽게 바다에 내려놓았어요.'],
  ['calm',7,'그러자 거센 바람이 멎고, 바다가 잠잠해졌어요.'],
  ['worship',6,'선원들은 무릎을 꿇고 두 손을 모아 하나님께 기도했어요.'],
  ['end',Infinity,'바다에 내려간 요나는 어떻게 되었을까요?']
 ];
 const state={index:0,time:0,clock:0,phase:'wind'};
 function reset(){Object.assign(state,{index:0,time:0,clock:0,phase:'wind'});dialogue.hidden=sleep.hidden=true;prayingSailors.forEach(p=>p.visible=false);sailorA.root.visible=sailorB.root.visible=true;}
 function advance(){if(state.index<steps.length-1){state.index++;state.time=0;state.phase=steps[state.index][0];}}
 // Keep full reading and action time; next can advance only after that beat is ready.
 function canNext(){return state.index<8&&state.time>=steps[state.index][1]-2;}
 function next(){if(canNext())advance();}
 function pose(a){a.root.rotation.set(0,0,0);a.body.rotation.set(0,0,0);a.head.rotation.set(0,0,0);a.armL.rotation.set(0,0,2.55);a.armR.rotation.set(0,0,-2.55);a.footL.rotation.set(0,0,0);a.footR.rotation.set(0,0,0);}
 function update({dt,active,unfold,progress,paused,project}){
  if(active&&progress>.999&&!paused){state.time+=dt;state.clock+=dt;if(state.time>=steps[state.index][1])advance();}
  const {index:i,time:t,clock:c}=state,open=smooth(.04,.94,unfold/3)*smooth(.35,1,progress);
  const settled=i===5?smooth(8,10,t):i>=6?1:0;
  const intensity=i===0?smooth(1,4,t):i===3?.5:1;
  const strength=intensity*(1-settled),amplitude=(.14*strength+.004*settled)*open;
  for(const f of folds)f.pivot.rotation.x=f.direction*Math.PI/2*(1-open);
  waves.forEach(({p,layer})=>{const angle=(1.13-.72*strength)+Math.sin(c*1.9-layer*.85)*.09*strength; p.rotation.x=(layer===0?1:-1)*(Math.PI/2*(1-open)+angle*open);});
  clouds.forEach(({root,side})=>{root.rotation.x=Math.PI/2*(1-open);root.position.x=side*(2.1-.22*strength+.28*settled);});
  ship.position.set(.35,.15,.2);ship.rotation.set(0,0,Math.sin(c*1.9)*amplitude);
  if(i===4)ship.position.x+=.32*Math.sin(Math.PI*2*Math.min(t,9)/4.5)*Math.sin(Math.PI*Math.min(t,9)/9);
  sail.rotation.z=(-.08*strength+Math.sin(c*3)*.025*strength)*open;
  warm.intensity=active?settled*2:0;
  [jonah,sailorA,sailorB].forEach(pose);
  sailorA.root.position.set(.35,.62,.34);sailorB.root.position.set(1.03,.6,.34);sailorA.root.scale.setScalar(.43);sailorB.root.scale.setScalar(.4);
  sailorA.body.rotation.z=-.1*strength;sailorA.armL.rotation.z=1.15+settled*1.4;
  sailorB.body.rotation.z=.07*strength;
  jonah.root.position.set(-.62,.16,.07);jonah.body.rotation.z=-.55;cover.rotation.y=0;
  if(i>=2){
   const wake=i===2?t:11,exit=smooth(4,8,wake);
   cover.rotation.y=-1.45*smooth(1,2,wake)*(1-smooth(8,10,wake));
   sailorA.root.position.x=THREE.MathUtils.lerp(.35,-.05,smooth(0,2,wake))+.4*smooth(6,9,wake);
   sailorA.body.rotation.z=-.22*(1-smooth(5,8,wake));sailorA.armL.rotation.z=1.2;
   jonah.root.position.set(THREE.MathUtils.lerp(-.62,.05,exit),.16+.46*smooth(2,5,wake),THREE.MathUtils.lerp(.07,.39,smooth(3,5,wake)));
   jonah.body.rotation.z=-.55*(1-smooth(2,4,wake));jonah.head.rotation.x=-.16*(1-smooth(3,5,wake));
   jonah.footL.rotation.x=Math.sin(wake*9)*.35*(exit>0&&exit<1?1:0);jonah.footR.rotation.x=-jonah.footL.rotation.x;
  }
  if(i===3){jonah.head.rotation.x=.2*(1-smooth(2,5,t));sailorA.head.rotation.y=.3*Math.sin(t);sailorB.head.rotation.y=-.3*Math.sin(t);}
  oars.forEach((p,n)=>{p.visible=i===4;p.rotation.z=(n?.8:-.8)+Math.sin(t*2.8+n*.3)*.28;if(i===4){const a=n?sailorB:sailorA;a.root.position.x=n?1:-.65;a.armL.rotation.z=1.7+Math.sin(t*2.8)*.22;a.armR.rotation.z=-1.7+Math.sin(t*2.8)*.22;a.body.rotation.x=Math.sin(t*2.8)*.08;}});
  crates.forEach((p,n)=>{const drop=i<1?0:i===1?smooth(2+n*2.6,4+n*2.6,t):1;p.position.set(.65+n*.33+.35*drop,.66-1.8*drop,.4+1.3*drop);p.rotation.z=drop*.45;p.visible=drop<1;if(i===1&&drop>0&&drop<1)sailorB.armR.rotation.z=-1.3;});
  if(i>=5){
   const lower=i===5?t:10,approach=smooth(2,4,lower),down=smooth(5,8,lower);
   sailorA.root.position.x=THREE.MathUtils.lerp(.35,-.35,approach);sailorB.root.position.x=THREE.MathUtils.lerp(1.03,.65,approach);
   sailorA.head.rotation.x=sailorB.head.rotation.x=.2*(1-settled);
   sailorA.armR.rotation.z=-1.7;sailorB.armL.rotation.z=1.7;
   jonah.root.position.set(.05+.28*approach,.62-1.85*down,.39+2*down);jonah.body.rotation.z=0;
   // The foreground layer occludes him first; hide only once fully below the paper sea.
   jonah.root.visible=down<1;
  }else jonah.root.visible=true;
  const praying=i>=7;
  [sailorA,sailorB].forEach((a,n)=>{
   a.root.visible=!praying;
   prayingSailors[n].visible=praying;
   prayingSailors[n].rotation.z=0;
   if(i===6){a.armL.rotation.z=2.55;a.armR.rotation.z=-2.55;a.head.rotation.x=.12;}
  });
  splash.visible=i===5&&t>=8&&t<8.7;splash.scale.setScalar(.7+.2*Math.sin((t-8)*Math.PI/.7));
  dialogue.hidden=!(active&&steps[i][3]&&progress>.999);dialogue.textContent=steps[i][3]||'';
  sleep.hidden=!(active&&i<2&&progress>.999);project(sleep,cabin,0,1.2,.15);
  Object.assign(stage.dataset,{stormPraying:String(praying),stormPhase:state.phase,stormTime:t.toFixed(2),stormStrength:strength.toFixed(3),stormRoll:ship.rotation.z.toFixed(3),stormJonahY:jonah.root.position.y.toFixed(3),stormJonahVisible:String(jonah.root.visible),stormOars:String(i===4),stormFold:open.toFixed(3)});
 }
 reset();return {L,R,state,reset,update,next,canNext,caption:()=>steps[state.index][2],hint:()=>state.index===8?'현재 마지막 장면이에요 · 큰 물고기는 다음 이야기에 등장해요.':''};
}
