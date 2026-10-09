import { Box3, BoxGeometry, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial, Object3D, Path, Shape, Vector3, type Material } from "three";
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
    // Kozijn in de muur (negge), vensterbank steekt uit, rollaag erboven (referentiefoto's).
    if(side==="links"||side==="rechts"){group.position.set(side==="links"?-3.69:3.69,y,x);group.rotation.y=side==="links"?-Math.PI/2:Math.PI/2;}
    else {group.position.set(x,y,side==="voor"?4.59:-4.59);if(side==="achter")group.rotation.y=Math.PI;}
    box(group,"kozijn_links",[.075,h,.1],[-w/2+.0375,0,0],"#efebe2");
    box(group,"kozijn_rechts",[.075,h,.1],[w/2-.0375,0,0],"#efebe2");
    box(group,"kozijn_boven",[w-.15,.075,.1],[0,h/2-.0375,0],"#efebe2");
    box(group,"kozijn_onder",[w-.15,.075,.1],[0,-h/2+.0375,0],"#efebe2");
    box(group,"glas",[w-.15,h-.15,.02],[0,0,-.015],name.includes("wc")||name.includes("badkamer")?"#a4bac0":"#648995");
    if(w>2.5) for(const fraction of [-1/6,1/6])box(group,"kozijn_stijl",[.06,h-.15,.09],[w*fraction,0,0],"#efebe2");
    else if(w>1.3)box(group,"kozijn_stijl",[.055,h-.15,.09],[w*.12,0,0],"#efebe2");
    box(group,"dorpel",[w+.1,.05,.16],[0,-h/2-.025,.07],"#4b4a45");
    (box(group,"rollaag",[w+.12,.11,.025],[0,h/2+.055,.0575],"#6b3526").material as MeshStandardMaterial).userData.rollaag=true;
    scene.add(group);
  }
}

export function distinguishDoors(scene: Group,type:HouseType) {
  for(const name of ["Voordeur","Achterdeur"]){
    const old=scene.getObjectByName(name);if(old)remove(scene,old);
    const front=name==="Voordeur", w=type==="vrijstaand"?1:.95, rij=type==="hoekwoning";
    // Rijwoning: witte voordeur; vrijstaand: donkere voordeur. Beide in de deuropening, zonder luifel (referentiefoto's).
    const door=new Group();door.name=name;
    door.position.set(front?(type==="vrijstaand"?-2.6:-1.55):(type==="vrijstaand"?2.3:1.6),type==="vrijstaand"?-1.65:-1.55, (front?1:-1)*(type==="vrijstaand"?4.59:3.79));
    if(!front)door.rotation.y=Math.PI;
    box(door,"deurblad",[w,2.1,.1],[0,0,0],front?(rij?"#eeebe3":"#2f3437"):"#d9dece");
    box(door,"deurkader_links",[.07,2.16,.16],[-w/2-.03,.03,0],"#eee8dc");
    box(door,"deurkader_rechts",[.07,2.16,.16],[w/2+.03,.03,0],"#eee8dc");
    box(door,"deurkader_boven",[w+.14,.07,.16],[0,1.08,0],"#eee8dc");
    box(door,"glas",front?[.2,1.25,.02]:[w-.2,1.22,.02],front?[-.12,.25,.06]:[0,.29,.07],front?"#2e3d42":"#83a8b1");
    box(door,"deurklink",[.05,.16,.08],[w*.32,-.02,.11],"#b9b8ae");
    if(front){
      box(door,"brievenbus",[.3,.055,.03],[0,-.37,.07],"#b9b8ae");
      box(door,"deurbel",[.07,.11,.08],[w/2+.15,.05,0],"#30352f");
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
    const panel=new Group();panel.name=`Zonnepaneel_dakkapel_${dormer.name}_${i+1}`;panel.userData.dormerPanel=true;panel.userData.dormerNaam=dormer.name;
    panel.position.set(centre.x+(i===0?-1:1)*(panelWidth+.06)/2,bounds.max.y+.065,centre.z);
    box(panel,"paneelframe",[panelWidth,.055,panelDepth],[0,0,0],"#4c5355");
    box(panel,"pv_cellen",[panelWidth-.04,.015,panelDepth-.04],[0,.035,0],"#182c3e");
    scene.add(panel);
  }
  }
}

/**
 * Aanbouw (uitbouw) tegen de achtergevel, alleen in de scan. Het GLB-model
 * kent geen aanbouw, dus die wordt hier opgebouwd uit de maten van de woning
 * zelf: zelfde vloerpeil en fundering, dezelfde baksteen (gekloond materiaal
 * van de achtergevel) en plint, plat dak met daktrim onder de ramen van de
 * verdieping, en een schuifpui naar de tuin.
 * Rijwoning: over de volle breedte tussen de bouwmuren. Vrijstaand en
 * twee-onder-een-kap: aan de woonkamerkant, zodat de achterdeur vrij blijft.
 * Wat door de aanbouw wordt ingebouwd (raam, achterdeur) krijgt
 * userData.onderAanbouw; installaties op die plek userData.aanbouwPositie,
 * de plek op de nieuwe achtergevel. HouseViewer past dit toe zodra de
 * bewoner "Aanbouw: ja" kiest. Aanroepen na applyAttachedVariant.
 */
export function addAanbouw(scene:Group){
  scene.updateMatrixWorld(true);
  const achter=scene.getObjectByName("Buitengevel_achter"), fundering=scene.getObjectByName("Fundering");
  if(!achter||!fundering)return;
  const rij=!scene.getObjectByName("Zijgevel_garage_buiten");
  const doos=(o:Object3D)=>new Box3().setFromObject(o);
  const gevel=doos(achter), fund=doos(fundering);
  const zijLinks=scene.getObjectByName("Buitengevel_links")??scene.getObjectByName("Bouwmuur_links");
  const zijRechts=scene.getObjectByName(rij?"Buitengevel_rechts":"Zijgevel_garage_buiten");
  const huisL=zijLinks?doos(zijLinks).min.x:gevel.min.x, huisR=zijRechts?doos(zijRechts).max.x:gevel.max.x;
  const gedeeldL=!!zijLinks?.userData.sharedWall, gedeeldR=rij&&!!zijRechts?.userData.sharedWall;
  const plint=scene.getObjectByName("Plinten"), plintH=plint?Math.max(.1,doos(plint).max.y-gevel.min.y):.16;

  const vloerY=gevel.min.y, gevelZ=gevel.min.z;
  // Onderkant van de laagste verdiepingsramen: het platte dak blijft daar ruim onder.
  const vensterbank=Math.min(...scene.children.filter(c=>/^Raam_achter/.test(c.name)).map(c=>doos(c).min.y).filter(y=>y>vloerY+2.2),vloerY+3.6);
  const hoogte=Math.min(3,vensterbank-.3-vloerY), diepte=rij?2.7:3;
  const L=huisL, R=rij?huisR:Math.min(huisR,huisL+4.6), breedte=R-L, midX=(L+R)/2;
  const achterZ=gevelZ-diepte, midZ=gevelZ-diepte/2, dikte=.22;

  const baksteen=(achter as Mesh).material as MeshStandardMaterial;
  const muur=(naam:string,maat:[number,number,number],pos:[number,number,number],gedeeld=false)=>{
    const m=box(aanbouw,naam,maat,pos,"#bdc6bd");
    if(!gedeeld){(m.material as MeshStandardMaterial).dispose();m.material=baksteen.clone();}
    return m;
  };
  const aanbouw=new Group();aanbouw.name="Aanbouw";
  const midY=vloerY+hoogte/2;
  // Zijmuren stoppen tegen de achtermuur: overlappende hoekstukken met een gedeeld buitenvlak flikkeren (z-fighting).
  const zijDiepte=diepte-dikte, zijMidZ=gevelZ-zijDiepte/2;
  muur("aanbouw_muur_links",[dikte,hoogte,zijDiepte],[L+dikte/2,midY,zijMidZ],gedeeldL);
  muur("aanbouw_muur_rechts",[dikte,hoogte,zijDiepte],[R-dikte/2,midY,zijMidZ],gedeeldR);
  muur("aanbouw_muur_achter",[breedte,hoogte,dikte],[midX,midY,achterZ+dikte/2]);
  // Donkere plint (trasraam), gelijk aan die van de woning; ook hier geen overlappende hoeken.
  const plintZijDiepte=zijDiepte-.01, plintZijMidZ=gevelZ-plintZijDiepte/2;
  for(const [naam,maat,pos,gedeeld] of [
    ["aanbouw_plint_achter",[breedte+.02,plintH,dikte+.02],[midX,vloerY+plintH/2,achterZ+dikte/2],false],
    ["aanbouw_plint_links",[dikte+.02,plintH,plintZijDiepte],[L+dikte/2,vloerY+plintH/2,plintZijMidZ],gedeeldL],
    ["aanbouw_plint_rechts",[dikte+.02,plintH,plintZijDiepte],[R-dikte/2,vloerY+plintH/2,plintZijMidZ],gedeeldR],
  ] as [string,[number,number,number],[number,number,number],boolean][]){
    const p=muur(naam,maat,pos,gedeeld);
    if(!gedeeld)(p.material as MeshStandardMaterial).userData.aanbouwPlint=true;
  }
  // Plat dak (EPDM) met aluminium daktrim rondom en een lichtkoepel.
  const dakY=vloerY+hoogte;
  box(aanbouw,"aanbouw_dak",[breedte+.04,.14,diepte+.02],[midX,dakY+.07,midZ-.01],"#2e3230");
  for(const [maat,pos] of [
    [[breedte+.1,.16,.05],[midX,dakY+.08,achterZ-.025]],
    [[.05,.16,diepte],[L-.025,dakY+.08,midZ]],
    [[.05,.16,diepte],[R+.025,dakY+.08,midZ]],
  ] as [[number,number,number],[number,number,number]][])box(aanbouw,"aanbouw_daktrim",maat,pos,"#9aa09c");
  box(aanbouw,"aanbouw_lichtkoepel_opstand",[.95,.14,.95],[midX,dakY+.21,midZ],"#e9ebe6");
  box(aanbouw,"aanbouw_lichtkoepel",[.8,.1,.8],[midX,dakY+.33,midZ],"#cfdfe3");
  // Wat nu tegen het stuk achtergevel staat dat wordt ingebouwd.
  const ingebouwd=scene.children.filter(o=>{
    const b=doos(o);if(b.isEmpty())return false;
    const cx=(b.min.x+b.max.x)/2;
    return cx>L&&cx<R&&b.max.z>gevelZ-1.2&&b.min.z<gevelZ+.2;
  });
  // Warmtepomp gaat op het platte dak (doel in userData.aanbouwDak, HouseViewer rekent de positie
  // uit); de batterij komt naast de deur tegen de nieuwe achtergevel.
  const installaties=ingebouwd.filter(o=>o.name==="Thuisbatterij");
  const installatieBreedte=installaties.reduce((som,o)=>{const b=doos(o);return som+(b.max.x-b.min.x)+.3;},0);
  // Altijd de warmtepomp zelf, ook als die nu nog elders staat: de homepage-maquette (maakCutaway)
  // zet hem later tegen de achtergevel, precies waar de aanbouw komt.
  const pomp=scene.getObjectByName("Warmtepomp_DeWarmte");
  // Doel: midden-onder van de pomp; z is de achtergevel van de woning (HouseViewer zet de pomp er
  // met zijn achterkant tegenaan).
  // Op een stuk achtergevel zonder raam erboven (de pomp mag niet voor een raam staan); lukt dat niet,
  // dan midden op het dak, los van de gevel.
  // HouseViewer kiest de plek en draaiing pas na de maquette (die draait de pomp nog), met deze vrije
  // stukken achtergevel (x van/tot, zonder raam of deur boven het aanbouwdak).
  if(pomp){
    const ramen=scene.children.filter(c=>/^(Raam_achter|Achterdeur)/.test(c.name)).map(doos).filter(r=>r.min.y<dakY+1.3&&r.max.y>dakY);
    const vrij:[number,number][]=[];let van=L+dikte+.05;
    for(const r of ramen.sort((a,b)=>a.min.x-b.min.x)){if(r.min.x-.08>van)vrij.push([van,r.min.x-.08]);van=Math.max(van,r.max.x+.08);}
    if(R-dikte-.05>van)vrij.push([van,R-dikte-.05]);
    pomp.userData.aanbouwDak={vrij,y:dakY+.14,gevelZ,midX:L+breedte*.74};
  }
  // Achterdeur en raam in de nieuwe achtergevel, in dezelfde kozijnkleur als de ramen van de woning.
  let kozijnKleur="#f1f1ec", deurKleur="#e8e5dc";
  scene.getObjectByName("Achterdeur")?.traverse(o=>{const m=(o as Mesh).material as MeshStandardMaterial|undefined;if((o as Mesh).isMesh&&m?.isMeshStandardMaterial&&/blad|deur/i.test(o.name))deurKleur="#"+m.color.getHexString();});
  for(const r of scene.children.filter(c=>/^Raam_achter/.test(c.name))){const k=r.getObjectByName("kozijn_links") as Mesh|undefined;if(k){kozijnKleur="#"+((k.material as MeshStandardMaterial).color.getHexString());break;}}
  const z=achterZ-.015, lijst=.07;
  const kozijn=(naam:string,x:number,y:number,b:number,h:number)=>{
    for(const [maat,px,py] of [[[b,lijst,lijst],x,y+h/2-lijst/2],[[b,lijst,lijst],x,y-h/2+lijst/2],[[lijst,h,lijst],x-b/2+lijst/2,y],[[lijst,h,lijst],x+b/2-lijst/2,y]] as [[number,number,number],number,number][])
      box(aanbouw,naam,maat,[px,py,z-.01],kozijnKleur);
  };
  const deurB=.95, deurH=Math.min(2.15,hoogte-.45), deurX=L+.55+deurB/2, deurY=vloerY+.05+deurH/2;
  box(aanbouw,"aanbouw_achterdeur_blad",[deurB-.12,deurH-.08,.04],[deurX,deurY-.02,z],deurKleur);
  box(aanbouw,"aanbouw_achterdeur_glas",[deurB-.42,deurH*.42,.02],[deurX,deurY+deurH*.18,z-.025],"#243339");
  kozijn("aanbouw_achterdeur_kozijn",deurX,deurY,deurB,deurH);
  box(aanbouw,"aanbouw_dorpel",[deurB+.1,.06,.2],[deurX,vloerY+.03,achterZ-.04],"#b9b6ad");
  // Raam midden tussen de deur en de hoek (vóór de plek van een eventuele thuisbatterij).
  const deurR=deurX+deurB/2, ruimte=R-dikte-installatieBreedte-deurR;
  const raamB=Math.max(1.2,Math.min(2.4,ruimte-.9)), raamH=Math.min(1.3,hoogte-1.15);
  const raamX=deurR+ruimte/2, raamY=vloerY+.9+raamH/2;
  box(aanbouw,"aanbouw_raam_glas",[raamB-.1,raamH-.1,.02],[raamX,raamY,z],"#243339");
  kozijn("aanbouw_raam_kozijn",raamX,raamY,raamB,raamH);
  // Eén kozijn met drie ramen: twee tussenstijlen.
  for(const dx of [-raamB/6,raamB/6])box(aanbouw,"aanbouw_raam_tussenstijl",[.06,raamH,.06],[raamX+dx,raamY,z-.012],kozijnKleur);
  box(aanbouw,"aanbouw_vensterbank",[raamB+.12,.05,.14],[raamX,raamY-raamH/2-.03,achterZ-.06],"#b9b6ad");
  for(const [x,h] of [[deurX,deurH],[raamX,raamH]] as [number,number][])box(aanbouw,"aanbouw_latei",[(x===deurX?deurB:raamB)+.2,.1,.03],[x,(x===deurX?deurY:raamY)+h/2+.07,achterZ-.015],"#c9c4ba");
  const puiX=raamX, puiB=raamB;
  scene.add(aanbouw);

  // Eigen fundering, los van de woning: blijft staan als het huis bij vloerisolatie optilt.
  const funderingAanbouw=new Group();funderingAanbouw.name="Fundering_aanbouw";
  const fm=box(funderingAanbouw,"fundering_aanbouw",[breedte-.04,vloerY-fund.min.y,diepte],[midX,(fund.min.y+vloerY)/2,midZ],"#000");
  (fm.material as MeshStandardMaterial).dispose();fm.material=((fundering as Mesh).material as MeshStandardMaterial).clone();
  scene.add(funderingAanbouw);

  // Ingebouwde raam/deur verbergen; installaties naast de schuifpui op de nieuwe achtergevel.
  for(const o of ingebouwd)if(/^(Raam_achter|Achterdeur)/.test(o.name)&&doos(o).min.y<dakY)o.userData.onderAanbouw=true;
  let x=puiX+puiB/2+.3;
  for(const o of installaties){
    const b=doos(o), w=b.max.x-b.min.x, midden=(b.min.x+b.max.x)/2;
    o.userData.aanbouwPositie=[o.position.x+(x+w/2-midden),o.position.z-diepte];
    x+=w+.3;
  }
}

export function finishDetachedHouse(scene:Group,scan=false){
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
    // Scan: de dakkapel loopt door tot zijn platte dak het dakvlak raakt (geen losse achterwand boven de
    // pannen); het deel onder het dakvlak knipt HouseViewer weg. Eerst verlengen, dan de voorkant kopiëren.
    const pannen=scene.getObjectByName("Dakpannen");
    if(scan&&pannen){
      const dak=new Box3().setFromObject(pannen),kapel=new Box3().setFromObject(old);
      const cz=(dak.min.z+dak.max.z)/2,helling=(dak.max.y-dak.min.y)/((dak.max.z-dak.min.z)/2);
      const achter=kapel.getCenter(new Vector3()).z<cz,buiten=achter?kapel.min.z:kapel.max.z;
      const raakZ=cz+(achter?-1:1)*((dak.max.y-kapel.max.y)/helling-.1);
      const f=Math.abs(buiten-raakZ)/(kapel.max.z-kapel.min.z);
      if(f>1&&Math.abs(old.rotation.y)<1e-6){old.scale.z*=f;old.position.z=buiten+(old.position.z-buiten)*f;}
    }
    const front=old.clone(true);front.name="Dakkapel_voor";
    front.rotation.y+=Math.PI;front.position.x=-old.position.x;front.position.z=-old.position.z;
    front.traverse(part=>{if((part as Mesh).isMesh){const mesh=part as Mesh;mesh.material=Array.isArray(mesh.material)?mesh.material.map(m=>m.clone()):mesh.material.clone();}});
    scene.add(front);scene.updateMatrixWorld(true);
    const obstacle=new Box3().setFromObject(front).expandByScalar(.08);
    for(const panel of [...scene.children].filter(p=>p.name.startsWith("Zonnepaneel")&&!p.userData.garagePanel)){
      if(!new Box3().setFromObject(panel).intersectsBox(obstacle))continue;
      // Scan: bij 0 of 1 dakkapel is de voorkant vrij en horen deze panelen er juist te liggen.
      if(scan){panel.userData.dakvlak="voor";panel.userData.onderKapel=true;}else remove(scene,panel);
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

/** Knipt de plint open bij voor- en achterdeur, zodat de (verzonken) deur tot op de drempel doorloopt. */
export function openPlintBijDeuren(scene: Group) {
  scene.updateMatrixWorld(true);
  const plinten = scene.getObjectByName("Plinten");
  if (!plinten) return;
  for (const naam of ["Voordeur", "Achterdeur"]) {
    const deur = scene.getObjectByName(naam);
    if (!deur) continue;
    const kader = new Box3();
    deur.traverse(d => { if ((d as Mesh).isMesh && /^(deurkader|deurblad)/.test(d.name)) kader.expandByObject(d); });
    if (kader.isEmpty()) continue;
    const voor = kader.getCenter(new Vector3()).z > 0;
    const plint = plinten.children.find(c => (c as Mesh).isMesh && c.name === (voor ? "plint_voor" : "plint_achter")) as Mesh | undefined;
    if (!plint) continue;
    const b = new Box3().setFromObject(plint);
    for (const [van, tot] of [[b.min.x, kader.min.x], [kader.max.x, b.max.x]]) {
      if (tot - van < 0.02) continue;
      const geometry = new BoxGeometry(tot - van, b.max.y - b.min.y, b.max.z - b.min.z); geometry.userData.owned = true;
      const deel = new Mesh(geometry, (plint.material as Material).clone());
      deel.name = plint.name;
      const midden = plinten.worldToLocal(new Vector3((van + tot) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2));
      deel.position.copy(midden);
      plinten.add(deel);
    }
    remove(scene, plint);
  }
}

/**
 * Donkere verticale houten bekleding in de topgevel (boven de goot), zoals bij
 * vrijstaande woningen op de referentiefoto's. Hangt aan de gevelmuur, zodat
 * hij meebeweegt met de spouw- en vloeranimaties.
 */
export function addGevelbekleding(scene: Group, zijden: ("links" | "rechts")[]) {
  scene.updateMatrixWorld(true);
  for (const zijde of zijden) {
    const muur = scene.getObjectByName(zijde === "links" ? "Buitengevel_links" : "Zijgevel_garage_buiten");
    if (!muur) continue;
    const shape = new Shape();
    shape.moveTo(-4.42, 2.72); shape.lineTo(4.42, 2.72); shape.lineTo(0, 5.42); shape.closePath();
    for (const raam of scene.children.filter(c => c.name.startsWith(`Raam_${zijde}_`))) {
      const box = new Box3().setFromObject(raam), c = box.getCenter(new Vector3()), m = box.getSize(new Vector3());
      if (c.y < 2.72) continue;
      // Na de rotatie loopt de horizontale as van de vorm links tegen de z-as in, rechts mee.
      const hole = new Path(), h = zijde === "links" ? -c.z : c.z;
      hole.moveTo(h - m.z / 2, c.y - m.y / 2); hole.lineTo(h - m.z / 2, c.y + m.y / 2); hole.lineTo(h + m.z / 2, c.y + m.y / 2); hole.lineTo(h + m.z / 2, c.y - m.y / 2); hole.closePath();
      shape.holes.push(hole);
    }
    const geometry = new ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: false, steps: 1 });
    const uv = geometry.getAttribute("uv");
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + 4.5) / 9, (uv.getY(i) - 2.7) / 2.8);
    geometry.translate(0, 0, -0.015);
    geometry.rotateY(zijde === "links" ? Math.PI / 2 : -Math.PI / 2);
    geometry.userData.owned = true;
    const materiaal = new MeshStandardMaterial({ color: "#3b4348", roughness: 0.85 });
    materiaal.userData.bekleding = true;
    const bekleding = new Mesh(geometry, materiaal);
    bekleding.name = `Gevelbekleding_${zijde}`;
    bekleding.position.set(zijde === "links" ? -3.755 : 3.755, 0, 0);
    scene.add(bekleding);
    bekleding.updateMatrixWorld(true);
    muur.attach(bekleding);
  }
}

/** Betonnen luifel boven de voordeur, zoals bij de tussenwoningen op referentiefoto 4. */
export function addLuifel(scene: Group) {
  const deur = scene.getObjectByName("Voordeur");
  if (!deur) return;
  box(deur, "entree_luifel", [1.3, 0.09, 0.42], [0, 1.2, 0.26], "#e3ddd0");
}
