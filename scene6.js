import {createKit,controller} from './story-kit.js?v=702ede878764';
import * as THREE from './vendor/three.module.js';
export function createScene6(ctx){const k=createKit(ctx),{L,R,mat,hinge,smooth}=k;
 for(let n=0;n<2;n++)k.add('waves',L,{x:-2.2,z:n?1.7:-1.9,w:4.2,h:n?.7:1.2,direction:n?-1:1});
 const f=k.fish(L,-2.15,-.45,.85);f.rig.scale.x=-.85;
 const road=hinge(R,2,1),roadMesh=k.cut([[-.8,-1.6],[.7,-1.6],[1.8,2.4],[1.3,2.4]],mat('#efcf8b'),road);k.folds.pop();roadMesh.rotation.x=-Math.PI/2;k.hotspot(road,'path');k.city(R,3,-2.5,.4);
 const a=k.actor(R,.7,.9,.75),ripple=hinge(R,.25,.8);k.cut([[-.4,0],[.5,.18],[1.1,0],[.5,-.12]],mat('#90d4d6'),ripple);
 const light=new THREE.PointLight(0xffd48a,0,7,2);light.position.set(2,2.4,.5);R.add(light);
 const steps=[['arrive',9,'하나님이 말씀하시자, 큰 물고기가 요나를 육지에 뱉어 놓았어요.'],['stand',8,'요나는 몸을 일으켰어요. 다시 땅을 밟게 되었지요.'],['call',9,'요나야, 니느웨로 가서 내가 전하는 말을 사람들에게 알려 주렴.'],['invite',Infinity,'요나는 이번에는 고개를 끄덕였어요.','길을 눌러 요나와 함께 가요. · 다음으로도 이어갈 수 있어요.'],['walk',8,'이번에는 요나가 하나님의 말씀을 따라 니느웨로 갔어요.'],['end',Infinity,'이번에는 요나가 하나님의 말씀을 따라 니느웨로 갔어요.']];
 return controller(steps,({state:s,open,active})=>{const i=s.index,t=s.time,arr=i===0?smooth(1.5,4.5,t):1,stand=i===1?smooth(0,4,t):i>1?1:0;
 k.pose(a,{kneel:1-stand,bow:.75*(1-stand),arms:i===1?2.3+.15*Math.sin(t*5)*(1-smooth(5,7,t)):2.55,turn:i>=3?-.45:0});a.root.position.x=-.5+1.2*arr;a.root.visible=i!==0||t>1.5;
 f.jaw.rotation.z=i===0?-.5*smooth(0,1,t)*(1-smooth(4.5,6,t)):0;f.root.position.z=-.45-(i>=1?1.3*smooth(2,7,i===1?t:8):0);f.root.visible=i<2;f.mouth.visible=Math.abs(f.jaw.rotation.z)>.05;f.tail.rotation.z=.05*Math.sin(s.clock*2)*open;ripple.visible=i===0&&t>1&&t<6;
 if(i>=2)a.head.rotation.x=.12*Math.sin(Math.min(t,3)*3)*(1-smooth(2,4,t));
 if(i>=4){const w=i===4?smooth(0,6,t):1;a.root.position.set(.7+2.1*w,.09,.9-2.45*w);a.rig.rotation.y=-.45;a.legs.forEach(({thigh},n)=>thigh.rotation.x=Math.sin(t*8+n*Math.PI)*.2*(w<1?1:0));a.armL.rotation.x=.12*Math.sin(t*8)*(w<1?1:0);}
 light.intensity=active&&i>=2?2*open:0;
 },k,{onAction(key,{state,next}){if(key==='path'&&state.phase==='invite')next();}});
}
