import { Box3, BoxGeometry, Group, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import type { HouseType } from "./woning-types";

function box(parent: Object3D, name: string, size: [number,number,number], position: [number,number,number], color: string) {
  const geometry = new BoxGeometry(...size); geometry.userData.owned = true;
  const mesh = new Mesh(geometry,new MeshStandardMaterial({color,roughness:name.includes("glas")?.15:.7}));
  mesh.name=name; mesh.position.set(...position); parent.add(mesh); return mesh;
}
function remove(scene:Group, object:Object3D) {
  object.traverse(part=>{ if((part as Mesh).isMesh){const mesh=part as Mesh; (Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>m.dispose()); if(mesh.geometry.userData.owned)mesh.geometry.dispose();} });
  scene.remove(object);
}

export function updateDetachedFacade(scene: Group) {
  for(const root of [...scene.children])if(/^(Raam_|Kozijn_|Raamdorpels|Zijraam_boven_garage)/.test(root.name))remove(scene,root);
  const windows: [string,string,number,number,number,number][] = [
    ["Raam_voor_01","voor",1.2,-.95,3.1,1.85],
    ["Raam_voor_wc","voor",-1.65,-1.05,.42,.8],
    ["Raam_voor_slaapkamer_01","voor",-2.4,1.6,1.5,1.4],
    ["Raam_voor_badkamer","voor",-.25,1.95,1.2,.7],
    ["Raam_voor_slaapkamer_02","voor",2,1.6,1.7,1.4],
    ["Raam_achter_01","achter",-1.8,1.6,1.8,1.4],
    ["Raam_achter_02","achter",1.8,1.6,1.8,1.4],
    ["Raam_achter_03","achter",-1.1,-.95,2.8,1.85],
    ["Raam_links_01","links",1.9,-.95,1.8,1.65],
    ["Raam_links_02","links",1.9,1.6,1.4,1.4],
    ["Raam_links_03","links",-1.8,1.6,1.4,1.4],
    ["Raam_rechts_zolder","rechts",0,3.9,.8,.9],
  ];
  for(const [name,side,x,y,w,h] of windows){
    const group=new Group();group.name=name;
    if(side==="links"||side==="rechts"){group.position.set(side==="links"?-3.77:3.77,y,x);group.rotation.y=side==="links"?-Math.PI/2:Math.PI/2;}
    else {group.position.set(x,y,side==="voor"?4.66:-4.66);if(side==="achter")group.rotation.y=Math.PI;}
    box(group,"kozijn_links",[.085,h,.16],[-w/2+.0425,0,0],"#e9e1ce");
    box(group,"kozijn_rechts",[.085,h,.16],[w/2-.0425,0,0],"#e9e1ce");
    box(group,"kozijn_boven",[w-.17,.085,.16],[0,h/2-.0425,0],"#e9e1ce");
    box(group,"kozijn_onder",[w-.17,.085,.16],[0,-h/2+.0425,0],"#e9e1ce");
    box(group,"glas",[w-.17,h-.17,.03],[0,0,.025],name.includes("wc")||name.includes("badkamer")?"#a4bac0":"#648995");
    if(w>2.5) for(const fraction of [-1/6,1/6])box(group,"kozijn_stijl",[.065,h-.17,.16],[w*fraction,0,0],"#e9e1ce");
    else if(w>1.3)box(group,"kozijn_stijl",[.06,h-.17,.16],[w*.12,0,0],"#e9e1ce");
    box(group,"dorpel",[w+.1,.06,.25],[0,-h/2-.025,.02],"#53564e");
    scene.add(group);
  }
}

export function distinguishDoors(scene: Group,type:HouseType) {
  for(const name of ["Voordeur","Achterdeur"]){
    const old=scene.getObjectByName(name);if(old)remove(scene,old);
    const front=name==="Voordeur", w=type==="vrijstaand"?1:.95;
    const door=new Group();door.name=name;
    door.position.set(front?(type==="vrijstaand"?-2.6:-1.55):(type==="vrijstaand"?2.3:1.6),type==="vrijstaand"?-1.65:-1.55, (front?1:-1)*(type==="vrijstaand"?4.73:3.93));
    if(!front)door.rotation.y=Math.PI;
    box(door,"deurblad",[w,2.1,.1],[0,0,0],front?"#164b3b":"#d9dece");
    box(door,"deurkader_links",[.07,2.16,.16],[-w/2-.03,.03,0],"#eee8dc");
    box(door,"deurkader_rechts",[.07,2.16,.16],[w/2+.03,.03,0],"#eee8dc");
    box(door,"deurkader_boven",[w+.14,.07,.16],[0,1.08,0],"#eee8dc");
    box(door,"glas",front?[.16,.95,.02]:[w-.2,1.22,.02],front?[-.2,.3,.07]:[0,.29,.07],"#83a8b1");
    box(door,"deurklink",[.05,.16,.08],[w*.32,-.02,.11],"#b9b8ae");
    if(front){
      box(door,"brievenbus",[.3,.055,.03],[0,-.37,.07],"#b9b8ae");
      box(door,"deurbel",[.07,.11,.08],[w/2+.15,.05,0],"#30352f");
      box(door,"entree_luifel",[w+.45,.085,.7],[0,1.43,.22],"#eee8dc");
      box(door,"entree_stoep",[w+.35,.1,.8],[0,-1.07,.27],"#a9a799");
    }
    scene.add(door);
  }
}

export function addDormerPanels(scene:Group) {
  scene.updateMatrixWorld(true);
  for(const dormer of scene.children.filter(p=>p.name.startsWith("Dakkapel"))){
  const roof=dormer.getObjectByName("dakkapel_dakrand"), template=scene.children.find(p=>p.name.startsWith("Zonnepaneel"));
  if(!roof||!template)return;
  const bounds=new Box3().setFromObject(roof),size=bounds.getSize(new Vector3()),centre=bounds.getCenter(new Vector3());
  // Two compact illustrative panels fit within the roof edge; exact installation needs a roof assessment.
  const panelWidth=Math.min(1.1,(size.x-.24)/2),panelDepth=Math.min(1.45,size.z-.16);
  if(panelWidth<.85||panelDepth<1.1)return;
  for(let i=0;i<2;i++){
    const panel=new Group();panel.name=`Zonnepaneel_dakkapel_${dormer.name}_${i+1}`;panel.userData.dormerPanel=true;
    panel.position.set(centre.x+(i===0?-1:1)*(panelWidth+.06)/2,bounds.max.y+.065,centre.z);
    box(panel,"paneelframe",[panelWidth,.055,panelDepth],[0,0,0],"#4c5355");
    box(panel,"pv_cellen",[panelWidth-.04,.015,panelDepth-.04],[0,.035,0],"#182c3e");
    scene.add(panel);
  }
  }
}

export function finishDetachedHouse(scene:Group){
  const garage=scene.getObjectByName("Garage") as Group;
  const rear=garage?.getObjectByName("garage_muur_achter") as Mesh;
  const side=garage?.getObjectByName("garage_muur_rechts") as Mesh;
  if(garage&&rear&&side){
    rear.geometry.computeBoundingBox();side.geometry.computeBoundingBox();
    const w=rear.geometry.boundingBox!.getSize(new Vector3()).x,d=side.geometry.boundingBox!.getSize(new Vector3()).z;
    box(garage,"garage_vloer",[w,.18,d],[0,-.09,0],"#96978e");
  }
  const old=scene.getObjectByName("Dakkapel");
  if(old){
    const front=old.clone(true);front.name="Dakkapel_voor";
    front.rotation.y+=Math.PI;front.position.x=-old.position.x;front.position.z=-old.position.z;
    front.traverse(part=>{if((part as Mesh).isMesh){const mesh=part as Mesh;mesh.material=Array.isArray(mesh.material)?mesh.material.map(m=>m.clone()):mesh.material.clone();}});
    scene.add(front);scene.updateMatrixWorld(true);
    const obstacle=new Box3().setFromObject(front).expandByScalar(.08);
    for(const panel of [...scene.children].filter(p=>p.name.startsWith("Zonnepaneel")&&!p.userData.garagePanel)){
      if(new Box3().setFromObject(panel).intersectsBox(obstacle))remove(scene,panel);
    }
  }
}

export function addPlasticProfiles(scene:Group){
  for(const window of scene.children.filter(p=>p.name.startsWith("Raam_"))){
    const pvc=new Group();pvc.name="Kunststof_profiel";pvc.visible=false;
    for(const old of window.children.filter(p=>p.name.startsWith("kozijn"))){
      const mesh=old as Mesh; if(!mesh.isMesh)continue;
      const fresh=mesh.clone();fresh.geometry=mesh.geometry.clone();fresh.geometry.userData.owned=true;
      fresh.material=new MeshStandardMaterial({color:"#f7f7ef",roughness:.3});fresh.name="pvc_profiel";
      fresh.scale.set(1.1,1.1,1.8);fresh.position.z+=.035;pvc.add(fresh);
    }
    const glass=window.getObjectByName("glas") as Mesh;
    if(glass){glass.geometry.computeBoundingBox();const size=glass.geometry.boundingBox!.getSize(new Vector3());
      for(const sign of [-1,1]){
        box(pvc,"pvc_rubber",[.023,size.y,.025],[sign*size.x/2,0,.11],"#2a3432");
        box(pvc,"pvc_rubber",[size.x,.023,.025],[0,sign*size.y/2,.11],"#2a3432");
      }
    }
    window.add(pvc);
  }
}
