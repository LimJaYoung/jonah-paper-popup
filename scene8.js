import {createKit,controller} from './story-kit.js?v=3ea1974a6ec2';
import * as THREE from './vendor/three.module.js';
export function createScene8(ctx){const k=createKit(ctx),{L,R,mat,hinge,cut,oval,smooth}=k;
 k.city(R,2.5,-2.45,.7);const folk=[1.7,2.4,3.1].map((x,i)=>k.actor(R,x,-1.1,i===1?.25:.34,'sailor',0xf0d2a3));
 const animals=[];for(const x of [1.3,3.5]){const animal=hinge(R,x,-.25);animals.push(animal);const m=mat('#e6ccaa');oval(animal,0,.3,.23,.13,m);oval(animal,.22,.4,.1,.13,m);cut([[-.16,0],[-.1,0],[-.06,.3],[-.19,.3]],m,animal);cut([[.09,0],[.15,0],[.19,.3],[.06,.3]],m,animal);}
 const hut=hinge(L,-2.65,-1);cut([[-1,0],[-.87,0],[-.87,2],[.87,2],[.87,0],[1,0],[1,2.15],[-1,2.15]],mat('#c99f6c'),hut);cut([[-1.1,2.12],[0,2.45],[1.1,2.12]],mat('#eccea0'),hut);
 const a=k.actor(L,-2.4,1.1,.82),plant=hinge(L,-1.2,.2),stem=new THREE.Group();plant.add(stem);cut([[-.055,0],[.065,0],[.18,2.55],[.07,2.58]],mat('#749961'),stem);
 const leaves=Array.from({length:5},(_,i)=>{const g=new THREE.Group();g.position.set(.1,1.8+i*.17,0);stem.add(g);const m=mat('#73a878');cut([[0,0],[-.45,.36],[-1.05,.3],[-1.5,-.05],[-.8,-.3],[-.2,-.2]],m,g);g.rotation.y=i%2?Math.PI:0;k.hotspot(g,'leaf');return {g,m};});
 const worm=hinge(L,-1.15,.48);for(let j=0;j<4;j++)oval(worm,j*.065,.08,.055,.06,mat('#dca87c'));
 const light=new THREE.PointLight(0xffdc9c,0,12,2);light.position.set(0,4,1);R.add(light);
 const steps=[['upset',9,'요나는 니느웨가 용서받은 것이 못마땅했어요. 성 밖에 앉아 그 도시를 바라보았지요.'],['grow',8,'하나님은 요나 곁에 식물이 자라게 하셨어요. 넓은 잎이 시원한 그늘을 만들어 주었어요.'],['shade',6,'아, 시원하다.'],['wither',9,'다음 날 새벽, 하나님이 보내신 벌레가 식물을 갉아먹었어요. 식물은 시들고 말았지요.'],['heat',7,'뜨거운 바람이 불고 햇볕이 내리쬐자, 요나는 몹시 괴로워했어요.'],['lost',5,'그늘이 없어졌잖아요…'],['question1',9,'요나야, 너는 네가 기르지도 않은 이 식물을 아끼는구나.'],['question2',12,'그렇다면 니느웨의 많은 사람과 동물들을 내가 아끼는 것이 당연하지 않겠니?'],['end',Infinity,'하나님은 누구를 아끼셨을까요?','정답을 고르지 않아도 좋아요. 함께 이야기해 보세요.']];
 return controller(steps,({state:s,extras:e,open,active,dt})=>{const i=s.index,t=s.time,grow=i===1?smooth(0,4,t):i>1?1:0,wither=i===3?smooth(2,7,t):i>3?1:0;
 k.pose(a,{kneel:1,arms:i===0?1.9:i>=4&&i<6?1.0:2.3,cross:i===0?.8:0,turn:i>=7?1.0*smooth(0,5,t):0});a.neutral.visible=i!==2;a.head.rotation.y=i===0?-.3:i>=7?.25:0;
 stem.rotation.z=-Math.PI/2*(1-grow);plant.visible=i>=1;worm.visible=i===3;
 if(e.sway>0)e.sway=Math.max(0,e.sway-dt);
 leaves.forEach(({g,m},n)=>{g.rotation.z=(n%2?-.2:.2)+(1-smooth(n*.55,n*.55+2,i===1?t:10))*1.5+wither*1.35+(e.sway>0?.08*Math.sin(e.sway*6):0);g.rotation.x=-.45*(1-wither);m.color.setRGB(1+.9*wither,1+.15*wither,1-.5*wither);});
 animals.forEach((animal,n)=>animal.rotation.z=.018*Math.sin(s.clock*.7+n));
 folk.forEach((c,n)=>{k.pose(c);c.head.rotation.z=Math.sin(s.clock*.8+n)*.025;});light.intensity=active?(i>=4&&i<6?3.2:2)*open:0;
 },k,{readyAfter:{grow:4.2,wither:7,question2:5},onAction(key,{state,extras}){if(key==='leaf'&&state.index>=1&&state.index<=2&&!extras.sway)extras.sway=1.5;}});
}
