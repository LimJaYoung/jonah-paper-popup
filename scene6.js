import {createKit,controller} from './story-kit.js?v=63088aaa58c0';
import * as THREE from './vendor/three.module.js';
export function createScene6(ctx){const k=createKit(ctx),{L,R,mat,hinge,smooth}=k;
 for(let n=0;n<2;n++)k.add('waves',L,{x:-2.2,z:n?1.7:-1.9,w:4.2,h:n?.7:1.2,direction:n?-1:1});
 const f=k.fish(L,-2.15,-.45,.85);f.rig.scale.x=-.85;
 // A tapered paper road follows one curve from the foreground into the gate.
 const route=new THREE.CatmullRomCurve3([new THREE.Vector3(.3,0,2.7),new THREE.Vector3(1.45,0,1.35),new THREE.Vector3(2.95,0,-.1),new THREE.Vector3(2.65,0,-1.3),new THREE.Vector3(3,0,-2.5)]);
 const road=hinge(R,0,0);k.folds.pop();
 function roadShape(extra,color,y){
  const left=[],right=[];
  for(let n=0;n<=64;n++){const t=n/64,p=route.getPoint(t),d=route.getTangent(t),w=.48*(1-t)+.13*t+extra;
   left.push([p.x-d.z*w,-p.z-d.x*w]);right.push([p.x+d.z*w,-p.z+d.x*w]);}
  const m=k.cut([...left,...right.reverse()],mat(color),road);m.rotation.x=-Math.PI/2;m.position.y=y;return m;
 }
 roadShape(.04,'#c8b885',0);roadShape(0,'#efdab0',.028);k.hotspot(road,'path');k.city(R,3,-2.5,.4);
 // A layered paper tree beside the road, attached to the right page.
 const tree=hinge(R,3.8,.45);
 k.cut([[-.12,0],[.14,0],[.08,.95],[.35,1.3],[.28,1.36],[.02,1.13],[-.13,1.48],[-.2,1.42],[-.06,.95]],mat('#97704c'),tree);
 [[-.3,1.55,.43,.43,'#698c62'],[.28,1.62,.4,.44,'#557c59'],[0,1.95,.43,.42,'#769869'],[-.08,1.55,.38,.4,'#83a472']].forEach(([x,y,rx,ry,c],n)=>{const crown=k.oval(tree,x,y,rx,ry,mat(c));crown.position.z=.025*n;});
 const walkStart=.24,landing=route.getPoint(walkStart),mouthExit=new THREE.Vector3();

 const a=k.actor(R,landing.x,landing.z,.75),ripple=hinge(R,.25,.8);k.cut([[-.4,0],[.5,.18],[1.1,0],[.5,-.12]],mat('#90d4d6'),ripple);
 const light=new THREE.PointLight(0xffd48a,0,7,2);light.position.set(2,2.4,.5);R.add(light);
 const steps=[['arrive',9,'하나님이 말씀하시자, 큰 물고기가 요나를 육지에 뱉어 놓았어요.'],['stand',8,'요나는 몸을 일으켰어요. 다시 땅을 밟게 되었지요.'],['call',9,'요나야, 니느웨로 가서 내가 전하는 말을 사람들에게 알려 주렴.'],['invite',Infinity,'요나는 이번에는 고개를 끄덕였어요.','길을 눌러 요나와 함께 가요. · 다음으로도 이어갈 수 있어요.'],['walk',8,'이번에는 요나가 하나님의 말씀을 따라 니느웨로 갔어요.'],['end',Infinity,'이번에는 요나가 하나님의 말씀을 따라 니느웨로 갔어요.']];
 return controller(steps,({state:s,open,active})=>{const i=s.index,t=s.time,arr=i===0?smooth(1.2,3.4,t):1,stand=i===1?smooth(0,4,t):i>1?1:0;
 a.rig.scale.setScalar(.75);k.pose(a,{kneel:1-stand,bow:.75*(1-stand),arms:i===1?2.3+.15*Math.sin(t*5)*(1-smooth(5,7,t)):2.55,turn:i>=3?-.45:0});a.root.visible=i!==0||t>1.2;
 f.setMouth((i===0?smooth(0,1,t)*(1-smooth(3.4,4.5,t)):0)*open);f.root.position.z=-.45-(i>=1?1.3*smooth(2,7,i===1?t:8):0);f.root.visible=i<2;f.tail.rotation.z=.05*Math.sin(s.clock*2)*open;ripple.visible=i===0&&t>1&&t<6;
 // Derive the launch point from the mirrored fish's lip, not the shore actor's depth.
 f.rig.updateWorldMatrix(true,false);R.updateWorldMatrix(true,false);
 mouthExit.set(-2.02,1.28,.18);f.rig.localToWorld(mouthExit);R.worldToLocal(mouthExit);
 if(i===0){
  k.pose(a,{kneel:smooth(.75,1,arr),bow:.75*smooth(.75,1,arr),arms:2.55});
  a.root.position.set(THREE.MathUtils.lerp(mouthExit.x,landing.x,arr),THREE.MathUtils.lerp(mouthExit.y-.25,.09,arr)+.7*Math.sin(Math.PI*arr),THREE.MathUtils.lerp(mouthExit.z,landing.z,arr));
  a.rig.scale.setScalar(THREE.MathUtils.lerp(.3,.75,smooth(0,.65,arr)));
  a.rig.rotation.z=-1.05*(1-smooth(.25,1,arr));
 }else if(i<4)a.root.position.set(landing.x,.09,landing.z);
 if(i>=2)a.head.rotation.x=.12*Math.sin(Math.min(t,3)*3)*(1-smooth(2,4,t));
 if(i>=4){const w=i===4?smooth(0,6,t):1;const p=route.getPoint(walkStart+(1-walkStart)*w),d=route.getTangent(walkStart+(1-walkStart)*w);a.root.position.set(p.x,.09,p.z);a.rig.rotation.y=Math.atan2(d.x,d.z);a.rig.scale.setScalar(.75*(1-.55*w));a.legs.forEach(({thigh},n)=>thigh.rotation.x=Math.sin(t*8+n*Math.PI)*.2*(w<1?1:0));a.armL.rotation.x=.12*Math.sin(t*8)*(w<1?1:0);}
 light.intensity=active&&i>=2?2*open:0;
 },k,{readyAfter:{arrive:6,stand:7,call:4,invite:.3,walk:6},onAction(key,{state,next}){if(key==='path'&&state.phase==='invite')next();}});
}
