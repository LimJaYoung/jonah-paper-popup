import * as THREE from './vendor/three.module.js';
const stage=document.querySelector('#stage'),slider=document.querySelector('#progress');
const scene=new THREE.Scene();
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;stage.appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(32,1,.1,100);const target=new THREE.Vector3(0,1.55,0);
scene.add(new THREE.HemisphereLight(0xfffcf0,0x83968d,1.8));const sun=new THREE.DirectionalLight(0xffefd1,2.5);sun.position.set(-5,9,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.1,far:30});sun.shadow.bias=-.0004;sun.shadow.normalBias=.02;sun.shadow.radius=3;scene.add(sun);
const fill=new THREE.DirectionalLight(0xccecf2,1.1);fill.position.set(6,5,-4);scene.add(fill);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({color:0x6a6046,opacity:.18}));ground.rotation.x=-Math.PI/2;ground.position.y=-.02;ground.receiveShadow=true;scene.add(ground);
function grain(color){const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,512,512);let seed=32;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};for(let i=0;i<46000;i++){const v=rand()>.5?255:25;ctx.strokeStyle=`rgba(${v},${v},${v},${rand()*.09})`;const x=rand()*512,y=rand()*512;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+rand()*4,y+rand()*1.5);ctx.stroke()}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);return t}
const creamMap=grain('#eee0bd'),tealMap=grain('#086c7b');
const cream=new THREE.MeshStandardMaterial({map:creamMap,roughness:1,bumpMap:creamMap,bumpScale:.025});const coverMat=new THREE.MeshStandardMaterial({map:tealMap,roughness:.96,bumpMap:tealMap,bumpScale:.045});
function box(w,h,d,mat,x,y,z,parent){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
const book=new THREE.Group();scene.add(book);const left=new THREE.Group(),right=new THREE.Group();left.name='left-page-hinge';right.name='right-page';const leftHinge=new THREE.Group();leftHinge.position.y=.5;left.position.y=-.16;right.position.y=.34;leftHinge.add(left);book.add(leftHinge,right);
const pw=4.65,pd=6.5;for(const [leaf,sign] of [[left,-1],[right,1]]){box(pw+.14,.13,pd+.2,coverMat,sign*(pw/2),-.22,0,leaf);for(let k=0;k<12;k++)box(pw-.045-k*.004,.014,pd-.09-k*.004,k%3===0?new THREE.MeshStandardMaterial({color:0xd6c49d,roughness:1}):cream,sign*(pw/2),-.15+k*.013,0,leaf);box(pw-.12,.035,pd-.18,cream,sign*pw/2,.027,0,leaf);}
// Foil artwork lives on the outside of the hinged cover.
const cc=document.createElement('canvas');cc.width=768;cc.height=1024;const cx=cc.getContext('2d');cx.fillStyle='#dcb65f';cx.textAlign='center';cx.font='24px Georgia';cx.fillText('J O N A H',384,395);cx.font='14px Georgia';cx.fillText('A PAPER OCEAN',384,434);cx.strokeStyle='#dfb85a';cx.lineWidth=3;for(let j=0;j<4;j++){cx.beginPath();for(let i=0;i<=210;i++){const x=280+i,y=535+j*18+Math.sin(i/22+j)*9;i?cx.lineTo(x,y):cx.moveTo(x,y)}cx.stroke()}cx.font='28px Georgia';cx.fillText('✧',384,326);cx.lineWidth=1;cx.strokeRect(47,55,674,914);const foilTex=new THREE.CanvasTexture(cc);foilTex.colorSpace=THREE.SRGBColorSpace;const foil=new THREE.Mesh(new THREE.PlaneGeometry(pw-.2,pd-.15),new THREE.MeshBasicMaterial({map:foilTex,transparent:true,side:THREE.DoubleSide}));foil.rotation.x=Math.PI/2;foil.rotation.z=Math.PI;foil.position.set(-pw/2,-.288,0);left.add(foil);
// Continuous flexible binding around the fixed spine axis. Both endpoints
// overlap their respective covers/pages, including while the left leaf rotates.
function bindingStrip(name, inset, depthFromAxis, thickness, length, material) {
 const segments=64, positions=new Float32Array((segments+1)*4*3), indices=[];
 for(let i=0;i<segments;i++)for(let side=0;side<4;side++){
  const a=i*4+side,b=i*4+(side+1)%4,c=(i+1)*4+side,d=(i+1)*4+(side+1)%4;
  indices.push(a,c,b,b,c,d);
 }
 indices.push(0,1,2,0,2,3,segments*4,segments*4+2,segments*4+1,segments*4,segments*4+3,segments*4+2);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setIndex(indices);
 const uvs=new Float32Array((segments+1)*4*2);for(let i=0;i<=segments;i++)for(let j=0;j<4;j++){uvs[(i*4+j)*2]=i/segments;uvs[(i*4+j)*2+1]=(j===0||j===3)?0:1;}geometry.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
 const mesh=new THREE.Mesh(geometry,material.clone());mesh.material.side=THREE.DoubleSide;mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;book.add(mesh);
 const start=Math.atan2(-depthFromAxis,inset),end=Math.atan2(-depthFromAxis,-inset),radius=Math.hypot(inset,depthFromAxis);
 let previousAngle=NaN;
 return angle=>{
  if(angle===previousAngle)return;previousAngle=angle;
  for(let i=0;i<=segments;i++){
   const a=THREE.MathUtils.lerp(start,end+angle,i/segments);
   for(let j=0;j<4;j++){
    const r=radius+(j<2?-1:1)*thickness/2,k=(i*4+j)*3;
    positions[k]=Math.cos(a)*r;positions[k+1]=.5+Math.sin(a)*r;positions[k+2]=(j===0||j===3?-1:1)*length/2;
   }
  }
  geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();
 };
}
const updateCoverBinding=bindingStrip('continuous-teal-spine',.09,.38,.13,pd+.2,coverMat);
const updatePageBinding=bindingStrip('continuous-cream-gutter',.12,.1155,.025,pd-.18,cream);
const loader=new THREE.TextureLoader();const assets={};
// Read alpha to retain original handmade silhouettes; no rectangular billboard shadows.
async function asset(name){const tex=await loader.loadAsync(`./assets/${name}.png`);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();const c=document.createElement('canvas');c.width=tex.image.width;c.height=tex.image.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(tex.image,0,0);const pix=ctx.getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=0,y1=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(pix[(y*c.width+x)*4+3]>238){x0=Math.min(x,x0);x1=Math.max(x,x1);y0=Math.min(y,y0);y1=Math.max(y,y1)}return {tex,pix,iw:c.width,ih:c.height,x0,y0,x1,y1};}
const pieces=[];
function paper(name,parent,{x=0,z=0,w,h,min=-w/2,max=w/2,delay=0,direction=-1,phase=0,lift=.01,offset=0,tint=0xffffff}){const a=assets[name];const pivot=new THREE.Group();pivot.name=name+'-fold';pivot.position.set(x,.065+lift,z);parent.add(pivot);const width=max-min;const geo=new THREE.PlaneGeometry(width,h);geo.translate((min+max)/2,h/2+offset,0);const u0=(a.x0+(min/w+.5)*(a.x1-a.x0))/a.iw,u1=(a.x0+(max/w+.5)*(a.x1-a.x0))/a.iw,v0=1-a.y1/a.ih,v1=1-a.y0/a.ih;const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,THREE.MathUtils.lerp(u0,u1,uv.getX(i)),THREE.MathUtils.lerp(v0,v1,uv.getY(i)));
const mat=new THREE.MeshStandardMaterial({map:a.tex,alphaTest:.94,roughness:1,color:tint,side:THREE.FrontSide});const face=new THREE.Mesh(geo,mat);face.position.z=.011;face.castShadow=true;face.receiveShadow=true;face.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:a.tex,alphaTest:.94,side:THREE.DoubleSide});pivot.add(face);
const backMat=new THREE.MeshStandardMaterial({map:a.tex,alphaTest:.94,roughness:1,side:THREE.BackSide});backMat.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.rgb = vec3(0.79,0.72,0.56) * (0.94 + 0.06 * diffuseColor.r);');};const back=new THREE.Mesh(geo,backMat);back.position.z=-.011;back.castShadow=true;back.customDepthMaterial=face.customDepthMaterial;pivot.add(back);
// A thin cut edge follows occupied alpha cells, rather than the image rectangle.
const nx=Math.ceil(width*65),ny=Math.ceil(h*65),occupied=[];for(let j=0;j<ny;j++){occupied[j]=[];for(let i=0;i<nx;i++){const u=THREE.MathUtils.lerp(u0,u1,(i+.5)/nx),v=THREE.MathUtils.lerp(v0,v1,(j+.5)/ny);occupied[j][i]=a.pix[(Math.min(a.ih-1,Math.floor((1-v)*a.ih))*a.iw+Math.min(a.iw-1,Math.floor(u*a.iw)))*4+3]>239;}}
const positions=[];function edge(xa,ya,xb,yb){positions.push(xa,ya,-.01,xb,yb,-.01,xb,yb,.01,xa,ya,-.01,xb,yb,.01,xa,ya,.01)}for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)if(occupied[j][i]){const xa=min+i*width/nx,xb=xa+width/nx,ya=j*h/ny+offset,yb=ya+h/ny;if(!occupied[j][i-1])edge(xa,ya,xa,yb);if(!occupied[j][i+1])edge(xb,yb,xb,ya);if(!occupied[j-1]?.[i])edge(xb,ya,xa,ya);if(!occupied[j+1]?.[i])edge(xa,yb,xb,yb)}const eg=new THREE.BufferGeometry();eg.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));eg.computeVertexNormals();pivot.add(new THREE.Mesh(eg,new THREE.MeshStandardMaterial({color:0xe9d9b7,roughness:1,side:THREE.DoubleSide})));
// Narrow hinge foot, rigidly parented to the leaf throughout the opening.
box(width,lift+.015,.075,cream,x+(min+max)/2,.05+(lift+.015)/2,z,parent);
pieces.push({pivot,parent,w,h,min,max,delay,direction,phase,lift,name});return pivot;}
await Promise.all(['whale','waves','waves-middle','boat','jonah'].map(async n=>assets[n]=await asset(n)));
for(const [leaf,side] of [[left,-1],[right,1]]){
 const bounds=w=>side<0?{min:-w/2,max:0}:{min:0,max:w/2};
 paper('waves',leaf,{w:8.6,h:2.35,z:-2.7,delay:.04,direction:1,lift:.01,phase:0,...bounds(8.6),tint:0xbce5e4});

 paper('waves-middle',leaf,{w:8.55,h:2.5,z:.3,delay:.18,direction:-1,lift:.09,phase:2,...bounds(8.55)});
 paper('waves',leaf,{w:8.65,h:1.6,z:2.85,delay:.27,direction:-1,lift:.13,phase:3,...bounds(8.65)});
}
const whaleRight=paper('whale',right,{w:7.5,h:4.3,min:0,max:3.75,z:-1.8,delay:.1,direction:1,lift:.046,phase:1});
const whaleLeft=paper('whale',right,{w:7.5,h:4.3,min:-3.75,max:0,z:-1.8,delay:.1,direction:1,lift:.046,phase:1});
// A second, vertical crease folds the broad whale into the right-hand page.
right.remove(right.children[right.children.indexOf(whaleLeft)+1]);right.remove(whaleLeft);whaleRight.add(whaleLeft);whaleLeft.position.set(0,0,0);pieces.splice(pieces.findIndex(p=>p.pivot===whaleLeft),1);
const boat=paper('boat',right,{x:2.22,w:3.45,h:2.78,z:.9,delay:.19,direction:-1,lift:.165,phase:4});
const jonah=paper('jonah',right,{x:3.0,w:.88,h:1.48,z:1.0,offset:.46,delay:.2,direction:-1,lift:.19,phase:4});
// The hull is a foreground paper ply so Jonah sits inside, in front of the sail.
const hullFace=boat.children[0].clone();hullFace.geometry=hullFace.geometry.clone();const hp=hullFace.geometry.attributes.position,hu=hullFace.geometry.attributes.uv;for(let i=0;i<hp.count;i++){if(hp.getY(i)>1){const original=hp.getY(i);hp.setY(i,.91);const bottomV=hu.getY(2);hu.setY(i,bottomV+(hu.getY(i)-bottomV)*.91/original);}}hp.needsUpdate=hu.needsUpdate=true;hullFace.position.z=.19;boat.add(hullFace);
let progress=0,targetProgress=0,replaying=false,paused=false,last=performance.now(),swayTime=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth=(a,b,v)=>{const t=THREE.MathUtils.clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
function apply(p,time=0){whaleLeft.rotation.set(0,-Math.PI*(1-smooth(.12,.96,p)),0);leftHinge.rotation.z=-Math.PI*(1-p);updateCoverBinding(leftHinge.rotation.z);updatePageBinding(leftHinge.rotation.z);for(const it of pieces){const unfold=smooth(it.delay,.94,p);const sway=(reduce?0:Math.sin(time*.65+it.phase)*.012)*smooth(.94,1,p);it.pivot.rotation.x=it.direction*(Math.PI/2*(1-unfold)+sway);}
 slider.value=Math.round(p*1000);document.querySelector('#percentage').value=`${Math.round(p*100)}%`;document.querySelector('#state-label').textContent=p<.001?'닫힌 책':p>.999?'펼쳐진 바다':'펼쳐지는 중';}
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;const distance=Math.max(15.5,13.4/(2*Math.tan(THREE.MathUtils.degToRad(16))*camera.aspect));camera.position.copy(target).add(new THREE.Vector3(0,.88,2.2).normalize().multiplyScalar(distance));camera.lookAt(target);camera.updateProjectionMatrix();}window.addEventListener('resize',resize);resize();
function buttonPause(){document.querySelector('#pause').innerHTML=paused?'계속 재생 <span>▷</span>':'일시 정지 <span>Ⅱ</span>';document.querySelector('#pause').setAttribute('aria-label',paused?'움직임 계속 재생':'움직임 일시 정지');}
document.querySelector('#open').onclick=()=>{targetProgress=1;replaying=false;paused=false;buttonPause()};document.querySelector('#close').onclick=()=>{targetProgress=0;replaying=false;paused=false;buttonPause()};document.querySelector('#replay').onclick=()=>{targetProgress=0;replaying=true;paused=false;buttonPause()};document.querySelector('#pause').onclick=()=>{paused=!paused;buttonPause()};slider.addEventListener('input',()=>{progress=Number(slider.value)/1000;targetProgress=progress;replaying=false;apply(progress,swayTime)});
document.querySelector('#loading').remove();
function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;if(!paused){swayTime+=dt;const diff=targetProgress-progress;progress+=Math.sign(diff)*Math.min(Math.abs(diff),dt/(reduce?.125:2.75));if(replaying&&progress===0){targetProgress=1;replaying=false}}apply(progress,swayTime);renderer.render(scene,camera);requestAnimationFrame(frame)}requestAnimationFrame(frame);
// Deterministic QA access: no camera controls in the public scene.
window.popupBook={setProgress(p){progress=targetProgress=THREE.MathUtils.clamp(p,0,1);paused=true;replaying=false;buttonPause();apply(progress,0);renderer.render(scene,camera)},getState(){return {progress,paused,pieces:pieces.length,renderer:renderer.info.render}},audit(){scene.updateMatrixWorld(true);return pieces.map(it=>{const anchor=it.pivot.getWorldPosition(new THREE.Vector3());const local=it.parent.worldToLocal(anchor.clone());return {name:it.name,leaf:it.parent.name,anchor:[local.x,local.y,local.z],fold:it.pivot.rotation.x,closedFootprint:[it.min+it.pivot.position.x,it.max+it.pivot.position.x,it.pivot.position.z,it.pivot.position.z+it.direction*it.h]}})}};
