import {createKit,controller} from './story-kit.js?v=029fccd2bdc5';
import * as THREE from './vendor/three.module.js';
export function createScene7(ctx){const k=createKit(ctx),{L,R,mat,hinge,smooth}=k;
 k.city(R,2.15,-2.5,1.08);k.add('houses',L,{x:-2.15,z:-2.2,w:3.9,h:2.6,direction:1});k.add('houses',L,{x:-2.6,z:-.6,w:2.6,h:1.45,direction:1});
 const a=k.actor(R,.6,1.65,.8),citizens=[[-3,1.35],[-1.8,1.2],[2,1.3],[3.25,1.25]].map(([x,z],i)=>{const c=k.actor(x<0?L:R,x,z,.58,'sailor',[0xffedce,0xffc2a2,0xffd779,0xc5e0d1][i]);k.hotspot(c.root,i<2?'reconcile':'return');return c;});
 const throne=hinge(R,2.8,-1.2);k.cut([[-.4,0],[.4,0],[.4,1.25],[-.4,1.25]],mat('#e4bd74'),throne);
 const king=k.actor(R,2.8,-1.15,.57,'sailor',0xe4b67c);const crown=k.cut([[-.24,0],[.24,0],[.28,.32],[.1,.2],[0,.4],[-.1,.2],[-.28,.32]],mat('#edc463'),king.head);crown.position.set(0,.67,.04);
 const gift=hinge(R,2.1,1.65);k.cut([[-.13,0],[.13,0],[.13,.25],[-.13,.25]],mat('#bd8957'),gift);
 const light=new THREE.PointLight(0xffdca0,0,14,2);light.position.set(0,4,1);R.add(light);
 const steps=[['preach',7,'니느웨에 도착한 요나는 하나님의 말씀을 전했어요.'],['warning',7,'사십 일이 지나면 니느웨가 무너질 거예요!'],['repent',10,'사람들은 하나님의 말씀을 믿고 자신의 잘못을 뉘우쳤어요. 왕도 자리에서 내려와 함께 뉘우쳤지요.'],['king',8,'나쁜 행동과 폭력을 멈추고, 하나님께 간절히 기도합시다.'],['change',10,'사람들은 나쁜 행동을 멈추고 달라지기 시작했어요.'],['forgiven',9,'하나님은 사람들이 달라진 모습을 보시고, 말씀하셨던 재앙을 내리지 않으셨어요.'],['uneasy',6,'그런데 요나는 이 일이 못마땅했어요.'],['end',Infinity,'그런데 요나는 이 일이 못마땅했어요.','시민을 눌러 화해와 돌려주는 행동을 다시 볼 수 있어요.']];
 return controller(steps,({state:s,extras:e,open,active,dt})=>{const i=s.index,t=s.time;k.pose(a,{arms:i<2?1.3:1.9,turn:i>=6?.7:0,cross:i>=6?.7:0});a.neutral.visible=i>=6;if(i>=6)a.head.rotation.y=.4;
 const descend=i===2?smooth(0,3,t):i>2?1:0;k.pose(king,{arms:2.3});king.root.position.y=.09+.5*(1-descend);king.root.position.z=-1.15+.55*descend;king.head.rotation.x=.28*descend;
 citizens.forEach(c=>{k.pose(c);c.head.rotation.x=i>=2&&i<4?.25:0;});
 if(e.replay){e.time+=dt;if(e.time>=7)e.replay=null;}
 const actionTime=i===4?t:e.replay?e.time:10,show=i===4||!!e.replay;
 if(show){if(!e.replay||e.replay==='reconcile')citizens.slice(0,2).forEach((c,n)=>{c.rig.rotation.y=n?-.25:.25;c.body.rotation.x=.24*Math.sin(Math.PI*smooth(0,4,actionTime));c.armL.rotation.z=2.1;c.armR.rotation.z=-2.1;});}
 const hand=show&&(!e.replay||e.replay==='return')?smooth(3,6,actionTime):i>=5?1:0;gift.position.set(2.1+1.05*hand,.65,1.65);if(show&&hand>0&&hand<1){citizens[2].armR.rotation.z=-1.5;citizens[3].armL.rotation.z=1.5;}
 light.intensity=active&&i>=5?3*open:0;
 },k,{onAction(key,{state,extras}){if(state.phase==='end'&&!extras.replay&&['reconcile','return'].includes(key)){extras.replay=key;extras.time=0;}}});
}
