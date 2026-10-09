import {createKit,controller} from './story-kit.js?v=385c95c03212';
export function createScene4(ctx){const k=createKit(ctx),{L,R,mat,hinge,oval,smooth}=k;k.waves();
 const f=k.fish(R,1.35,-1.0,.92),a=k.actor(L,-1.5,1.1,.58);
 const bubbles=Array.from({length:6},(_,i)=>{const g=hinge(L,-2.3+i*.25,.7);oval(g,0,0,.045,.06,mat('#c4edf1'));return g;});
 const sun=hinge(R,3.35,-2.4),moon=hinge(R,3.35,-2.4);oval(sun,0,2.5,.22,.22,mat('#efc46f'));oval(moon,0,2.5,.18,.23,mat('#d3edf0'));
 const steps=[['sink',8,'요나는 바닷속으로 내려갔어요. 그런데 하나님은 요나를 위해 큰 물고기를 준비하셨어요.'],['approach',6,'커다란 물고기가 요나에게 다가왔어요.'],['swallow',7,'물고기가 입을 크게 벌리고 요나를 꿀꺽 삼켰어요!'],['days',9,'요나는 물고기 배 속에서 사흘 밤낮을 지냈어요.'],['remember',6,'그 안에서 요나는 하나님을 떠올렸어요.'],['end',Infinity,'그 안에서 요나는 하나님을 떠올렸어요.']];
 return controller(steps,({state:s,open})=>{const i=s.index,t=s.time;k.pose(a);a.root.position.y=.38-.24*(i?1:smooth(0,4,t));a.root.visible=i<3;
 f.root.position.x=2.15-.8*(i>1?1:i===1?smooth(0,5,t):0);f.root.position.y=.16;f.tail.rotation.z=Math.sin(s.clock*2)*.07*open;
 const swallow=i===2?smooth(1.5,4,t):i>2?1:0;f.jaw.rotation.z=(i===2?-.5*smooth(0,1.5,t)*(1-smooth(4,5.5,t)):0)*open;
 f.mouth.visible=Math.abs(f.jaw.rotation.z)>.05;
 if(i===2){a.root.position.x=-1.5+1.6*swallow;a.root.position.z=1.1-2.25*swallow;a.root.visible=swallow<.9;f.rig.rotation.z=.035*Math.sin(Math.PI*smooth(5,6,t));}else f.rig.rotation.z=0;
 bubbles.forEach((b,n)=>{b.visible=i<2;b.position.y=.3+((s.clock*.25+n*.35)%1.8);});sun.visible=i===3&&Math.floor(t/1.5)%2===0;moon.visible=i===3&&!sun.visible;
 },k);
}
