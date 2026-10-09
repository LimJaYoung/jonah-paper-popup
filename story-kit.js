import * as THREE from './vendor/three.module.js';
export function createKit(ctx){
 const {left,right,paper,pieces,assets,grain,smooth}=ctx,L=new THREE.Group(),R=new THREE.Group();left.add(L);right.add(R);
 const folds=[],actors=[],targets=[];let foldAmount=1;
 const mat=color=>new THREE.MeshStandardMaterial({map:grain(color),roughness:1,side:THREE.DoubleSide});
 const add=(name,parent,opts)=>{const p=paper(name,parent,opts);folds.push(pieces.pop());return p;};
 function hinge(parent,x,z){const g=new THREE.Group();g.position.set(x,.09,z);parent.add(g);folds.push({pivot:g,direction:z<0?1:-1});return g;}
 function cut(points,material,parent){const s=new THREE.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.025,bevelEnabled:false}),material);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 function oval(parent,x,y,rx,ry,material){const pts=Array.from({length:48},(_,i)=>[x+rx*Math.cos(i*Math.PI/24),y+ry*Math.sin(i*Math.PI/24)]);return cut(pts,material,parent);}
 function textured(name,points,parent,anchor=[0,0],w=1.2,h=2.15){const a=assets[name],s=new THREE.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();const g=new THREE.ShapeGeometry(s),p=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,THREE.MathUtils.lerp(a.x0/a.iw,a.x1/a.iw,p.getX(i)/w+.5),THREE.MathUtils.lerp(1-a.y1/a.ih,1-a.y0/a.ih,p.getY(i)/h));g.translate(-anchor[0],-anchor[1],0);const material=new THREE.MeshStandardMaterial({map:a.tex,alphaTest:.94,roughness:1,side:THREE.DoubleSide});const mesh=new THREE.Mesh(g,material);mesh.castShadow=mesh.receiveShadow=true;mesh.customDepthMaterial=new THREE.MeshDepthMaterial({map:a.tex,alphaTest:.94,depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});parent.add(mesh);
  if(name==='jonah'){
   mesh.material.side=THREE.FrontSide;mesh.position.z=.008;
   const rear=assets['jonah-back'],backGeo=g.clone(),backUV=backGeo.attributes.uv;
   for(let i=0;i<backUV.count;i++){const u=(uv.getX(i)-a.x0/a.iw)/((a.x1-a.x0)/a.iw),v=(uv.getY(i)-(1-a.y1/a.ih))/((a.y1-a.y0)/a.ih);backUV.setXY(i,THREE.MathUtils.lerp(rear.x0/rear.iw,rear.x1/rear.iw,1-u),THREE.MathUtils.lerp(1-rear.y1/rear.ih,1-rear.y0/rear.ih,v));}
   const back=new THREE.Mesh(backGeo,new THREE.MeshStandardMaterial({map:rear.tex,alphaTest:.94,roughness:1,side:THREE.BackSide}));back.position.z=-.008;back.castShadow=back.receiveShadow=true;parent.add(back);
  }
  return mesh;}
 function actor(parent,x,z,size=1,name='jonah',tint=0xffffff){
  const root=hinge(parent,x,z),rig=new THREE.Group(),body=new THREE.Group();root.add(rig);rig.scale.setScalar(size);rig.add(body);
  function part(x0,x1,y0,y1,px,py,host=body){const j=new THREE.Group();j.position.set(px,py,0);host.add(j);const mesh=textured(name,[[x0,y0],[x1,y0],[x1,y1],[x0,y1]],j,[px,py]);mesh.material.color.set(tint);return j;}
  const head=part(-.23,.23,1.37,2.15,0,1.37),armL=part(-.6,-.23,1.37,2.15,-.23,1.42),armR=part(.23,.6,1.37,2.15,.23,1.42);
  part(-.6,.6,.85,1.37,0,.85);
  // Two linked thigh/calf chains preserve the original robe artwork and rigid paper size.
  const legs=[[-.6,0,-.19],[0,.6,.19]].map(([x0,x1,px])=>{const thigh=part(x0,x1,.43,.85,px,.85,rig);const calf=new THREE.Group();calf.position.set(0,-.42,0);thigh.add(calf);textured(name,[[x0,0],[x1,0],[x1,.43],[x0,.43]],calf,[px,.43]);return {thigh,calf};});
  const neutral=new THREE.Group();neutral.position.z=.035;head.add(neutral);oval(neutral,.035,.405,.09,.055,mat('#70472e'));const lip=cut([[-.025,.405],[.095,.405],[.095,.397],[-.025,.397]],mat('#38281f'),neutral);lip.position.z=.028;neutral.visible=false;const a={root,rig,body,head,armL,armR,legs,x,z,size,neutral};actors.push(a);return a;
 }
 function pose(a,{kneel=0,bow=0,arms=2.55,turn=0,cross=0}={}){
  kneel*=foldAmount;bow*=foldAmount;turn*=foldAmount;cross*=foldAmount;a.root.position.set(a.x,.09,a.z);a.rig.position.set(0,-.43*kneel,0);a.rig.rotation.set(0,turn,0);a.body.rotation.set(bow,0,0);a.body.position.set(0,.85*(1-Math.cos(bow)), -.85*Math.sin(bow));
  a.head.rotation.set(.12*kneel,0,0);a.armL.rotation.set(-cross,0,arms);a.armR.rotation.set(-cross,0,-arms);
  a.legs.forEach(({thigh,calf})=>{thigh.rotation.x=-Math.PI/2*kneel;calf.rotation.x=Math.PI/2*kneel;});
 }
 function fish(parent,x,z,size=1){
  const root=hinge(parent,x,z),rig=new THREE.Group();root.add(rig);rig.scale.setScalar(size);
  // Cut the original whale at its mouth seam. The lower paper jaw pivots at its right corner.
  const seam=[[-2.1,1.68],[-1.75,1.69],[-1.4,1.57],[-1.05,1.34],[-.75,1.08]];
  const upper=new THREE.Group();rig.add(upper);
  textured('whale',[...seam,[-.75,0],[.95,0],[.95,2.6],[-2.1,2.6]],upper,[0,0],4.2,2.6);
  const tail=new THREE.Group();tail.position.set(.95,.7,0);rig.add(tail);textured('whale',[[.95,0],[2.1,0],[2.1,2.6],[.95,2.6]],tail,[.95,.7],4.2,2.6);
  const jaw=new THREE.Group();jaw.position.set(-.75,1.08,.025);rig.add(jaw);textured('whale',[[-2.1,0],[-.75,0],...seam.slice().reverse()],jaw,[-.75,1.08],4.2,2.6);
  const mouth=cut([[-2.02,1.64],[-.72,1.08],[-1.1,.55],[-1.95,.85]],mat('#254957'),rig);mouth.position.z=-.08;
  return {root,rig,jaw,tail,mouth,x,z};
 }
 function waves(){for(let layer=0;layer<3;layer++)for(const [parent,min,max] of [[L,-4.3,0],[R,0,4.3]])add(layer===1?'waves-middle':'waves',parent,{w:8.6,h:[2.1,.65,.8][layer],min,max,z:[-2.65,-.15,2.45][layer],direction:layer? -1:1,tint:[0xbde6ed,0x76c9ce,0x3eafba][layer]});}
 function city(parent,x,z,size=1){return add('nineveh',parent,{x,z,w:3.6*size,h:2.1*size,direction:1});}
 function hotspot(obj,key){obj.traverse(n=>{if(n.isMesh)n.userData.action=key;});targets.push(obj);}
 function fold(amount){foldAmount=amount;for(const f of folds)f.pivot.rotation.x=f.direction*Math.PI/2*(1-amount);}
 return {...ctx,L,R,folds,actors,targets,mat,add,hinge,cut,oval,actor,pose,fish,waves,city,hotspot,fold};
}
export function controller(steps,animate,kit,{onAction}={}){
 const state={index:0,time:0,clock:0,phase:steps[0][0],replaying:false},extras={};
 function reset(){Object.assign(state,{index:0,time:0,clock:0,phase:steps[0][0],replaying:false});for(const k of Object.keys(extras))delete extras[k];}
 function advance(){if(state.index<steps.length-1){state.index++;state.time=0;state.phase=steps[state.index][0];}}
 function canNext(){return state.phase==='end'||steps[state.index][1]===Infinity&&state.time>=2;}
 function next(){if(state.phase!=='end'&&canNext())advance();}
 function action(key){if(onAction)onAction(key,{state,extras,next,advance});}
 function update({dt,active,unfold,progress,paused}){const open=kit.smooth(0,3,unfold)*kit.smooth(.35,1,progress);if(active&&progress>.999&&!paused){state.time+=dt;state.clock+=dt;if(state.time>=steps[state.index][1])advance();}kit.fold(open);animate({state,extras,open,active,dt:active&&!paused?dt:0});}
 return {L:kit.L,R:kit.R,state,extras,targets:kit.targets,reset,update,next,canNext,action,caption:()=>steps[state.index][2],hint:()=>steps[state.index][3]|| (state.phase==='end'?'다음 페이지로 이어가요.':''),steps};
}
