import * as THREE from './vendor/three.module.js';

// Shared original ship artwork, articulated cast, and cabin for scenes 2 and 3.
export function createVessel({R,add,assets,cream,grain,box,actorTemplate}){
 const wood=new THREE.MeshStandardMaterial({map:grain('#bd8b56'),roughness:1});
 const dark=new THREE.MeshStandardMaterial({color:0x514936,roughness:1});
 const gold=new THREE.MeshStandardMaterial({map:grain('#dcad55'),roughness:1});
 const ship=new THREE.Group();ship.position.set(1.4,0,.65);R.add(ship);
 const boat=add('boat',ship,{w:3.05,h:2.46,direction:-1,delay:1,lift:.055});
 // Split the original boat artwork at the hull edge: the sail can tilt at its foot.
 const original=[boat.children[0],boat.children[1]],sourceGeo=original[0].geometry,sourceUV=sourceGeo.attributes.uv;
 boat.clear();
 function boatLayer(y0,y1,parent,anchorY=0,frontOnly=false){
  const geo=new THREE.PlaneGeometry(3.05,y1-y0);geo.translate(0,(y0+y1)/2-anchorY,0);const uv=geo.attributes.uv;
  for(let i=0;i<uv.count;i++)uv.setXY(i,THREE.MathUtils.lerp(sourceUV.getX(0),sourceUV.getX(1),uv.getX(i)),THREE.MathUtils.lerp(sourceUV.getY(2),sourceUV.getY(0),(y0+(y1-y0)*uv.getY(i))/2.46));
  for(const src of frontOnly?[original[0]]:original){const m=new THREE.Mesh(geo,src.material);m.position.z=frontOnly?.3:src.position.z;m.castShadow=true;m.receiveShadow=true;m.customDepthMaterial=src.customDepthMaterial;parent.add(m);}
 }
 boatLayer(0,.82,boat);
 const sail=new THREE.Group();sail.position.y=.82;boat.add(sail);boatLayer(.82,2.46,sail,.82);
 boatLayer(0,.82,boat,0,true);
 // Build articulated actors from the same existing six paper joints.
 function actor(parent,size,skin){
  const root=new THREE.Group(),body=actorTemplate.clone(true);root.add(body);root.scale.setScalar(size);parent.add(root);
  body.rotation.set(0,0,0);body.children.forEach(p=>p.rotation.set(0,0,0));
  if(skin)body.traverse(m=>{if(!m.isMesh)return;const old=m.material.side===THREE.FrontSide?assets.jonah:assets['jonah-back'],a=assets.sailor; m.geometry=m.geometry.clone();const uv=m.geometry.attributes.uv;
   for(let i=0;i<uv.count;i++){const u=(uv.getX(i)-old.x0/old.iw)/((old.x1-old.x0)/old.iw),v=(uv.getY(i)-(1-old.y1/old.ih))/((old.y1-old.y0)/old.ih);uv.setXY(i,THREE.MathUtils.lerp(a.x0/a.iw,a.x1/a.iw,u),THREE.MathUtils.lerp(1-a.y1/a.ih,1-a.y0/a.ih,v));}
   m.material=m.material.clone();m.material.map=a.tex;m.material.color.set(skin);m.customDepthMaterial=new THREE.MeshDepthMaterial({map:a.tex,alphaTest:.94,depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});
  });
  return {root,body,head:body.children[0],armL:body.children[1],armR:body.children[2],footL:body.children[4],footR:body.children[5]};
 }
 const sailorA=actor(boat,.43,0xffffff),sailorB=actor(boat,.4,0xe6d8a6);
 sailorA.root.position.set(.45,.62,.15);sailorB.root.position.set(1.01,.6,.14);
 // Layered entry with an opaque hinged cover. Jonah stays behind real paper.
 const cabin=new THREE.Group();cabin.position.set(-.62,.58,.18);boat.add(cabin);
 box(.76,.8,.025,dark,0,.4,0,cabin);
 box(.09,.84,.05,wood,-.415,.4,.065,cabin);box(.09,.84,.05,wood,.415,.4,.065,cabin);box(.94,.12,.05,cream,0,.85,.065,cabin);
 const cover=new THREE.Group();cover.position.set(-.38,0,.09);cabin.add(cover);
 box(.76,.8,.025,cream,.38,.4,0,cover);box(.06,.06,.018,gold,.64,.38,.025,cover);
 return {ship,boat,sail,actor,sailorA,sailorB,cabin,cover};
}
