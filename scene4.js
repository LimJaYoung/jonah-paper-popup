import * as THREE from './vendor/three.module.js';
import {createKit,controller} from './story-kit.js?v=77e96b36aa37';
export function createScene4(ctx){const k=createKit(ctx),{L,R,mat,hinge,oval,smooth}=k;k.waves();
 // Three paper-cut seaweed silhouettes, rooted on their own page hinges.
 const seaweed=[];
 function plant(parent,x,z,type,size){
  const root=hinge(parent,x,z);root.scale.setScalar(size);seaweed.push(root);
  const colors=['#477b61','#256f70','#8b7850'],leaf=mat(colors[type]),vein=mat('#abc58c');
  function ribbon(base,lean,height,width,phase=0){
   const edge=Array.from({length:25},(_,i)=>{const t=i/24;return {x:base+lean*t+Math.sin(t*7+phase)*.1*t,y:t*height,w:width*Math.sin(Math.PI*t)*(.8+.2*Math.sin(t*25))+.012};});
   const m=k.cut([...edge.map(p=>[p.x-p.w,p.y]),...edge.slice().reverse().map(p=>[p.x+p.w,p.y])],leaf,root);
   const stem=k.cut([...edge.map(p=>[p.x-.008,p.y]),...edge.slice().reverse().map(p=>[p.x+.008,p.y])],vein,root);stem.position.z=.03;
  }
  if(type===0){ // Broad, ruffled wakame blades.
   ribbon(-.12,-.4,1.3,.16);ribbon(0,.05,1.75,.23,1);ribbon(.12,.46,1.45,.19,2);
  }else if(type===1){ // Long, narrow kelp ribbons.
   [-.28,-.12,.05,.2].forEach((b,n)=>ribbon(b,(n-1.5)*.2,1.6+(n%2)*.45,.065,n));
  }else{ // Branched seaweed with small oval fronds.
   ribbon(0,.1,1.5,.025);
   for(let n=0;n<6;n++)for(const side of [-1,1]){
    const y=.25+n*.19,x=.06*y,tip=x+side*(.4-n*.035);
    k.cut([[x,y],[tip,y+.22],[tip,y+.25],[x+.018,y+.04]],leaf,root);
    oval(root,tip,y+.24,.14,.07,leaf);
   }
  }
 }
 plant(L,-3.35,-1.75,1,1);plant(R,3.65,-1.95,0,.85);
 plant(L,-3.1,.9,0,.85);plant(R,3.65,1.25,2,.85);
 plant(L,-1.6,2.05,2,.55);plant(R,2.45,2.15,1,.5);
 const f=k.fish(R,1.35,-1.0,.92),a=k.actor(L,-1.5,1.1,.58);
 const bubbles=Array.from({length:6},(_,i)=>{const g=hinge(L,-2.3+i*.25,.7);oval(g,0,0,.045,.06,mat('#c4edf1'));return g;});
 const sun=hinge(R,3.35,-2.4),moon=hinge(R,3.35,-2.4);oval(sun,0,2.5,.22,.22,mat('#efc46f'));oval(moon,0,2.5,.18,.23,mat('#d3edf0'));
 const steps=[['sink',8,'요나는 바닷속으로 내려갔어요. 그런데 하나님은 요나를 위해 큰 물고기를 준비하셨어요.'],['approach',6,'커다란 물고기가 요나에게 다가왔어요.'],['swallow',7,'물고기가 입을 크게 벌리고 요나를 꿀꺽 삼켰어요!'],['days',9,'요나는 물고기 배 속에서 사흘 밤낮을 지냈어요.'],['remember',6,'그 안에서 요나는 하나님을 떠올렸어요.'],['end',Infinity,'그 안에서 요나는 하나님을 떠올렸어요.']];
 return controller(steps,({state:s,open})=>{const i=s.index,t=s.time;
 seaweed.forEach((p,n)=>{p.rotation.z=Math.sin(s.clock*.8+n)*.035*open;});
 // Jonah stays in the water; only the fish travels toward him.
 k.pose(a,{arms:1.8});a.rig.rotation.z=(-.9+Math.sin(s.clock*1.15)*.12)*open;a.rig.scale.setScalar(.44);
 a.root.position.set(-1.5,1.05+Math.sin(s.clock*1.35)*.11,.82);a.root.visible=i<3;
 const approach=i===1?smooth(0,5,t):i>1?1:0;
 const lunge=i===2?smooth(1.3,3.7,t):i>2?1:0;
 const retreat=i===2?smooth(4.8,6.5,t):i>2?1:0;
 f.root.position.set(2.15-.6*approach-1.6*lunge+1.4*retreat,.16,-1+1.6*approach-1.6*retreat);
 f.tail.rotation.z=Math.sin(s.clock*(i===2?4:2))*.09*open;
 f.setMouth((i===2?smooth(0,1.3,t)*(1-smooth(3.7,4.7,t)):0)*open);
 // The advancing mouth passes over Jonah before he is concealed inside it.
 if(i===2){
  const caught=smooth(2.4,3.65,t);
  // Capture happens in front of the dark mouth opening, never behind the body.
  a.root.position.x=-1.5+(f.root.position.x-1.7+1.5)*caught;
  a.root.position.y=THREE.MathUtils.lerp(a.root.position.y,1.38,caught);
  a.rig.scale.setScalar(.44*(1-.94*caught));a.root.visible=caught<.995;
 }
 f.rig.rotation.z=i===2?.035*Math.sin(Math.PI*smooth(4.7,5.5,t)):0;

 bubbles.forEach((b,n)=>{b.visible=i<2;b.position.y=.3+((s.clock*.25+n*.35)%1.8);});sun.visible=i===3&&Math.floor(t/1.5)%2===0;moon.visible=i===3&&!sun.visible;
 },k,{readyAfter:{sink:4,approach:5,swallow:6.5,days:4.5,remember:.6}});
}
