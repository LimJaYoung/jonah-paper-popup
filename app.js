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
const openingLeft=new THREE.Group(),openingRight=new THREE.Group();
// Groups keep opening artwork and its hinge feet together.
for(const [leaf,group] of [[left,openingLeft],[right,openingRight]]){leaf.add(group);for(const child of [...leaf.children])if(child!==group&&(child.name.endsWith('-fold')||(child.isMesh&&child.geometry.parameters?.depth===.075)))group.attach(child);}
const boat=paper('boat',right,{x:2.22,w:3.45,h:2.78,z:.9,delay:.19,direction:-1,lift:.165,phase:4});
const jonah=paper('jonah',right,{x:3.0,w:.88,h:1.48,z:1.0,offset:.46,delay:.2,direction:-1,lift:.19,phase:4});
// The hull is a foreground paper ply so Jonah sits inside, in front of the sail.
const hullFace=boat.children[0].clone();hullFace.geometry=hullFace.geometry.clone();const hp=hullFace.geometry.attributes.position,hu=hullFace.geometry.attributes.uv;for(let i=0;i<hp.count;i++){if(hp.getY(i)>1){const original=hp.getY(i);hp.setY(i,.91);const bottomV=hu.getY(2);hu.setY(i,bottomV+(hu.getY(i)-bottomV)*.91/original);}}hp.needsUpdate=hu.needsUpdate=true;hullFace.position.z=.19;boat.add(hullFace);
for(const child of [...right.children])if(child.name.endsWith('-fold')||(child.isMesh&&child.geometry.parameters?.depth===.075))openingRight.attach(child);
const openingPieces=[...pieces];
const story={scene:0,phase:'idle',time:0,unfold:0,narrative:0,walk:0};
let updateStory,setupStory;
let progress=0,targetProgress=0,replaying=false,paused=false,last=performance.now(),swayTime=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth=(a,b,v)=>{const t=THREE.MathUtils.clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
function apply(p,time=0){whaleLeft.rotation.set(0,-Math.PI*(1-smooth(.12,.96,p)),0);leftHinge.rotation.z=-Math.PI*(1-p);updateCoverBinding(leftHinge.rotation.z);updatePageBinding(leftHinge.rotation.z);for(const it of openingPieces){const unfold=smooth(it.delay,.94,p);const sway=(reduce?0:Math.sin(time*.65+it.phase)*.012)*smooth(.94,1,p);it.pivot.rotation.x=it.direction*(Math.PI/2*(1-unfold)+sway);}
 slider.value=Math.round(p*1000);document.querySelector('#percentage').value=`${Math.round(p*100)}%`;document.querySelector('#state-label').textContent=p<.001?'닫힌 책':p>.999?(story.scene===0?'펼쳐진 바다':'펼쳐진 마을'):'펼쳐지는 중';}
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;const distance=Math.max(15.5,13.4/(2*Math.tan(THREE.MathUtils.degToRad(16))*camera.aspect));camera.position.copy(target).add(new THREE.Vector3(0,.88,2.2).normalize().multiplyScalar(distance));camera.lookAt(target);camera.updateProjectionMatrix();}window.addEventListener('resize',resize);resize();
function buttonPause(){document.querySelector('#pause').innerHTML=paused?'계속 재생 <span>▷</span>':'일시 정지 <span>Ⅱ</span>';document.querySelector('#pause').setAttribute('aria-label',paused?'움직임 계속 재생':'움직임 일시 정지');}
// Story controller owns all inputs, including the original book controls.
// initialization follows the story controller below
function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;if(!paused){swayTime+=dt;const diff=targetProgress-progress;progress+=Math.sign(diff)*Math.min(Math.abs(diff),dt/(reduce?.125:2.75));if(replaying&&progress===0){targetProgress=1;replaying=false}}apply(progress,swayTime);updateStory(paused?0:dt);renderer.render(scene,camera);requestAnimationFrame(frame)}// animation starts after scene assets load
// Deterministic QA access: no camera controls in the public scene.
window.popupBook={setProgress(p){progress=targetProgress=THREE.MathUtils.clamp(p,0,1);paused=true;replaying=false;buttonPause();apply(progress,0);renderer.render(scene,camera)},getState(){return {progress,paused,pieces:pieces.length,renderer:renderer.info.render}},audit(){scene.updateMatrixWorld(true);return pieces.map(it=>{const anchor=it.pivot.getWorldPosition(new THREE.Vector3());const local=it.parent.worldToLocal(anchor.clone());return {name:it.name,leaf:it.parent.name,anchor:[local.x,local.y,local.z],fold:it.pivot.rotation.x,closedFootprint:[it.min+it.pivot.position.x,it.max+it.pivot.position.x,it.pivot.position.z,it.pivot.position.z+it.direction*it.h]}})}};

// Scene 1 uses the original paper() silhouette, edge, back and hinge renderer.
setupStory=async()=>{
 await Promise.all(['nineveh','houses','jonah-back'].map(async n=>assets[n]=await asset(n)));
 const $=id=>document.getElementById(id);
 const text=(el,value)=>{if(el.textContent!==value)el.textContent=value;};
 const storyLeft=new THREE.Group(),storyRight=new THREE.Group();left.add(storyLeft);right.add(storyRight);
 const newPieces=[];
 const add=(name,parent,opts)=>{const p=paper(name,parent,opts);newPieces.push(pieces.pop());return p};
 add('houses',storyRight,{x:2.15,z:-2.8,w:4.3,h:2.25,direction:1,delay:0});
 add('houses',storyRight,{x:2.45,z:-2.05,w:3.7,h:1.9,direction:1,delay:.12,lift:.02});
 const gate=add('nineveh',storyRight,{x:2.3,z:-1.15,w:4.3,h:2.25,direction:1,delay:.2,lift:.035});
 const harborBoat=add('boat',storyLeft,{x:-3,z:-1.2,w:1.65,h:1.34,direction:1,delay:.85,lift:.025});
 add('houses',storyLeft,{x:-3.25,z:-2.4,w:1.8,h:.83,direction:1,delay:.35});
 // A small flat paper harbor and dock, kept secondary to the city.
 const harbor=new THREE.Mesh(new THREE.CircleGeometry(.94,40),new THREE.MeshStandardMaterial({map:grain('#75b9bb'),roughness:1}));harbor.rotation.x=-Math.PI/2;harbor.position.set(-3,.075,-.9);storyLeft.add(harbor);
 for(let i=0;i<5;i++)box(.23,.035,.85,cream,-2.65+i*.2,.11,-.4,storyLeft);
 // Paths are paper strips with a low scored fold; each belongs to its own leaf.
 const paths=[];
 function pathStrip(parent,x,z,length,angle){const pivot=new THREE.Group();pivot.position.set(x,.095,z);pivot.rotation.y=angle;parent.add(pivot);const m=box(.7,.018,length,new THREE.MeshStandardMaterial({map:grain('#f7eccf'),roughness:1}),0,0,-length/2,pivot);paths.push(pivot);return m;}
 pathStrip(storyRight,.33,2.3,1.45,0);pathStrip(storyRight,.34,.9,2.9,-.72);pathStrip(storyLeft,-.04,.9,3.15,.9);
 const hero=add('jonah',storyRight,{x:.35,z:1.25,w:1.2,h:2.15,direction:-1,delay:1.55,lift:.045});
 // Split the existing texture into articulated paper parts; no replacement face.
 const source=hero.children[0],baseGeo=source.geometry,uv=baseGeo.attributes.uv;
 hero.clear();const body=new THREE.Group();hero.add(body);
 function segment(x0,x1,y0,y1,px,py){const joint=new THREE.Group();joint.position.set(px,py,0);body.add(joint);const geo=new THREE.PlaneGeometry(x1-x0,y1-y0);geo.translate((x0+x1)/2-px,(y0+y1)/2-py,0);const gUV=geo.attributes.uv;for(let i=0;i<gUV.count;i++)gUV.setXY(i,THREE.MathUtils.lerp(uv.getX(0),uv.getX(1),(x0+.6+(x1-x0)*gUV.getX(i))/1.2),THREE.MathUtils.lerp(uv.getY(2),uv.getY(0),(y0+(y1-y0)*gUV.getY(i))/2.15));const mesh=new THREE.Mesh(geo,source.material.clone());mesh.material.side=THREE.FrontSide;mesh.position.z=.008;mesh.castShadow=true;mesh.receiveShadow=true;mesh.customDepthMaterial=source.customDepthMaterial;joint.add(mesh);
 // A separately illustrated reverse prevents a mirrored face on the back.
 const rear=assets['jonah-back'],rearGeo=geo.clone(),rearUV=rearGeo.attributes.uv;
 for(let i=0;i<rearUV.count;i++){
  const u=(gUV.getX(i)-uv.getX(0))/(uv.getX(1)-uv.getX(0));
  const v=(gUV.getY(i)-uv.getY(2))/(uv.getY(0)-uv.getY(2));
  rearUV.setXY(i,THREE.MathUtils.lerp(rear.x0/rear.iw,rear.x1/rear.iw,1-u),THREE.MathUtils.lerp(1-rear.y1/rear.ih,1-rear.y0/rear.ih,v));
 }
 const rearMesh=new THREE.Mesh(rearGeo,new THREE.MeshStandardMaterial({map:rear.tex,alphaTest:.94,roughness:1,side:THREE.BackSide}));
 rearMesh.position.z=-.008;rearMesh.castShadow=true;rearMesh.receiveShadow=true;
 rearMesh.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:rear.tex,alphaTest:.94,side:THREE.DoubleSide});
 joint.add(rearMesh);return joint;}
 const head=segment(-.6,.6,1.37,2.15,0,1.37);segment(-.6,.6,.26,1.37,0,.26);
 const footL=segment(-.6,0,0,.26,-.19,.26),footR=segment(0,.6,0,.26,.19,.26);
 const light=new THREE.PointLight(0xffce70,0,7,2);light.position.set(2.3,3,-.1);book.add(light);
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const gc=glowCanvas.getContext('2d'),grad=gc.createRadialGradient(64,64,0,64,64,64);grad.addColorStop(0,'rgba(255,208,102,.32)');grad.addColorStop(1,'rgba(255,220,139,0)');gc.fillStyle=grad;gc.fillRect(0,0,128,128);
 const glow=new THREE.Mesh(new THREE.PlaneGeometry(4.4,4.4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(glowCanvas),transparent:true,depthWrite:false,opacity:0}));glow.rotation.x=-Math.PI/2;glow.position.set(2.2,.15,-.6);storyRight.add(glow);
 // The outgoing right-hand artwork rides the FRONT of the actual turning leaf.
 // The incoming left-hand artwork is glued to its REVERSE, never a blank swap.
 const turn=new THREE.Group();turn.position.y=.34;book.add(turn);
 box(pw-.12,.025,pd-.18,cream,pw/2,0,0,turn);turn.visible=false;
 const reverse=new THREE.Group();reverse.rotation.z=-Math.PI;turn.add(reverse);
 const turnDuration=3;
 function mountTurn(){turn.add(openingRight);reverse.add(storyLeft);turn.visible=true;}
 function unmountTurn(){right.add(openingRight);left.add(storyLeft);turn.visible=false;}

 function label(id,text,cls='scene-label'){const el=document.createElement('div');el.id=id;el.className=cls;el.textContent=text;stage.appendChild(el);return el}
 const cityLabel=label('city-label','니느웨'),portLabel=label('port-label','항구'),speech=label('speech','나는 가기 싫은데…');
 const lines=['어느 날, 하나님이 요나를 부르셨어요.','요나야, 니느웨로 가렴. 사람들이 나쁜 행동을 멈추도록 말해 주렴.','하지만 요나는 니느웨에 가고 싶지 않았어요.','요나는 반대쪽으로 가는 배를 타기로 했어요.'];
 function say(text){if($('narration').textContent!==text)$('narration').textContent=text;}
 const locked=()=>['turn','return-turn'].includes(story.phase);
 function resetAct(){story.narrative=0;story.walk=0;story.unfold=0;hero.position.set(.35,.11,1.25);body.rotation.set(0,0,0);head.rotation.set(0,0,0);footL.rotation.set(0,0,0);footR.rotation.set(0,0,0);say('');}
 function begin(){if(story.scene!==0||locked()||progress<.999)return;resetAct();mountTurn();story.phase='turn';story.time=0;replaying=false;paused=false;buttonPause();}
 function previous(){if(locked()||progress<.999)return;if(story.scene===0){targetProgress=0;replaying=false;paused=false;buttonPause();return;}mountTurn();story.phase='return-turn';story.time=0;replaying=false;paused=false;targetProgress=1;buttonPause();}
 $('previous').onclick=previous;
 // A single primary action connects the closed book and every available spread.
 $('open').onclick=()=>{
  if(locked()||Math.abs(targetProgress-progress)>.001)return;
  if(progress<.999){targetProgress=1;replaying=false;paused=false;buttonPause();}
  else if(story.scene===0)begin();
  else if(story.phase==='narrate'){
   story.narrative=story.narrative<4?4:story.narrative<10?10:15;
   paused=false;buttonPause();
  }
 };
 $('replay').onclick=()=>{if(locked())return;targetProgress=0;replaying=true;paused=false;if(story.scene===1){resetAct();story.phase='reopen';}buttonPause()};
 $('pause').onclick=()=>{paused=!paused;buttonPause()};
 slider.addEventListener('input',()=>{if(locked())return;progress=targetProgress=Number(slider.value)/1000;replaying=false;apply(progress,swayTime)});
 function project(el,obj,x,y,z){const v=obj.localToWorld(new THREE.Vector3(x,y,z)).project(camera);el.style.left=`${(v.x*.5+.5)*stage.clientWidth}px`;el.style.top=`${(-v.y*.5+.5)*stage.clientHeight}px`;}
 function phase(next){story.phase=next;story.time=0;}
 updateStory=dt=>{
  const busy=locked();if(busy||progress>.999)story.time+=dt;
  if(locked()&&story.time>=turnDuration){
   const back=story.phase==='return-turn';unmountTurn();story.scene=back?0:1;
   if(back){resetAct();phase('idle');}else{story.unfold=1;phase('narrate');}
  }
  if(story.phase==='reopen'&&progress>.999){story.unfold=1;phase('narrate');}
  if(story.phase==='narrate'&&progress>.999){story.narrative+=dt;if(story.narrative>=15)phase('walk');}
  if(story.phase==='walk'){story.walk=THREE.MathUtils.clamp((story.time-.65)/2.8,0,1);if(story.walk===1){phase('arrived');say(lines[3]);}}
  const returning=story.phase==='return-turn',turning=locked();
  const travel=turning?smooth(0,turnDuration,story.time):0;
  const angleFraction=returning?1-travel:travel;
  // One continuous motion: closing the old spread and opening the new spread
  // meet at the vertical leaf. Fold amounts derive from that SAME page angle.
  const ocean=turning?smooth(.52,1,1-angleFraction):progress;
  const incoming=turning?smooth(.52,1,angleFraction):story.unfold;
  if(turning){
   turn.rotation.z=Math.PI*angleFraction;
   for(const it of openingPieces)it.pivot.rotation.x=it.direction*Math.PI/2*(1-smooth(it.delay,.94,ocean));
   whaleLeft.rotation.y=-Math.PI*(1-smooth(.12,.96,ocean));
  }
  // At the vertical crease the old spread has closed. Its right-hand art
  // stays on the hidden front; the next left-hand art reveals on the back.
  openingRight.visible=turning||story.scene===0;
  openingLeft.visible=turning?angleFraction<.52:story.scene===0;
  storyLeft.visible=turning||story.scene===1;
  storyRight.visible=turning?angleFraction>.06:story.scene===1;
  let unfold=turning?incoming*3:story.unfold*3;
  if(story.phase==='reopen')unfold=3;
  for(const it of newPieces){const a=smooth(it.delay,it.delay+1,unfold)*smooth(it.delay/8,.95,progress);it.pivot.rotation.x=it.direction*Math.PI/2*(1-a);}
  for(const path of paths)path.rotation.x=-.18*(1-smooth(.7,1.7,unfold));
  const t=story.narrative,walking=story.phase==='walk',atPort=story.phase==='arrived';
  const turnBody=t<4?smooth(0,3,t)*.17:t<10?.17:THREE.MathUtils.lerp(.17,-.42,smooth(11,14,t));
  const harborHeading=Math.atan2(-2.1-.35,-.1-1.25);
  const facing=walking?THREE.MathUtils.lerp(-.42,harborHeading,smooth(0,.65,story.time)):atPort?harborHeading:turnBody;
  body.rotation.y=facing*smooth(.4,1,progress)*smooth(0,2.5,unfold);
  const stepping=walking&&story.time>.65&&story.walk<1;
  body.rotation.z=stepping?-.04+Math.sin((story.time-.65)*10)*.035:0;
  head.rotation.x=walking||atPort?0:t<4?-.12*smooth(0,2,t):-.06;
  head.rotation.y=t>=10&&t<14?Math.sin((t-10)*3)*.17:0;
  head.rotation.z=t>=7&&t<10?Math.sin((t-7)*1.2)*.06:0;
  footL.rotation.x=stepping?Math.sin((story.time-.65)*10)*.55:0;footR.rotation.x=stepping?-Math.sin((story.time-.65)*10)*.55:0;
  hero.position.x=THREE.MathUtils.lerp(.35,-2.1,smooth(0,1,story.walk));hero.position.z=THREE.MathUtils.lerp(1.25,-.1,smooth(0,1,story.walk));
  // On an open book both pages are coplanar; reparent the walking paper to
  // the left leaf at the crease so closing also keeps it on its destination.
  const host=hero.position.x<0?storyLeft:storyRight;if(hero.parent!==host){host.add(hero);newPieces.find(p=>p.pivot===hero).parent=host;}
  const lightAmount=(story.scene===1||turning)?smooth(2.35,3,unfold)*smooth(.6,1,progress):0;light.intensity=lightAmount*3;glow.material.opacity=lightAmount;
  if(story.phase==='narrate')say(t<4?lines[0]:t<10?lines[1]:lines[2]);
  const active=story.scene===1&&progress>.999&&!turning;
  $('story-nav').hidden=story.scene!==1;$('narration').hidden=!active||['reopen'].includes(story.phase);
  $('previous').disabled=locked()||progress<.999||Math.abs(targetProgress-progress)>.001;
  cityLabel.hidden=portLabel.hidden=!(active&&unfold>=2.8);speech.hidden=!(active&&t>=12&&!walking&&!atPort);
  text($('story-hint'),atPort?'마지막 장면 · 요나가 항구에 도착했어요':locked()?'종이 이야기가 펼쳐지고 있어요…':'');
  for(const id of ['replay','progress'])$(id).disabled=locked();
  const movingBook=Math.abs(targetProgress-progress)>.001;
  $('open').title=progress<.999?'책 펼치기':story.scene===0?'다음 페이지':atPort?'마지막 장면입니다':walking?'요나가 항구로 걷고 있어요':'다음 이야기 구간';
  $('open').disabled=locked()||movingBook||(progress>.999&&story.scene===1&&story.phase!=='narrate');
  text(document.querySelector('h1'),story.scene===0?'종이 사이로, 바다가 피어나다.':'요나야, 니느웨로 가렴');
  text(document.querySelector('.intro'),story.scene===0?'책을 펼치면 시작되는 작은 모험':'하나의 부름, 두 갈래의 길');
  text(document.querySelector('.chapter'),story.scene===0?'오프닝 표지':'본문 씬 1');text($('scene-name'),story.scene===0?'바다 위의 요나':'요나야, 니느웨로 가렴');
  stage.setAttribute('aria-label',story.scene===0?'청록색 책이 열리며 파도와 배, 요나, 큰 물고기가 펼쳐지는 3D 종이 팝업북':'두 갈래 길 앞의 요나, 오른쪽 니느웨 성문과 왼쪽 작은 항구가 펼쳐진 종이 팝업북');
  if(turning)$('state-label').textContent=travel<.5?'페이지와 종이가 함께 접히는 중':'다음 페이지와 종이가 함께 펼쳐지는 중';
  stage.dataset.phase=story.phase;stage.dataset.scene=String(story.scene);stage.dataset.walk=String(story.walk);stage.dataset.oceanVisible=String(openingRight.visible);stage.dataset.pageAngle=turn.rotation.z.toFixed(3);stage.dataset.pageTurning=String(turn.visible);stage.dataset.unfold=unfold.toFixed(3);stage.dataset.oceanFold=ocean.toFixed(3);stage.dataset.artOnLeaf=String(openingRight.parent===turn&&storyLeft.parent===reverse);
  scene.updateMatrixWorld(true);project(cityLabel,gate,0,2.45,0);project(portLabel,harborBoat,0,1.65,0);project(speech,hero,.15,2.4,0);
 };
};
await setupStory();document.querySelector('#loading').remove();last=performance.now();requestAnimationFrame(frame);
