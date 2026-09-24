import { Group, Mesh, MeshStandardMaterial, Object3D } from "three";
import type { HouseType } from "./woning-types";

function dispose(object:Object3D){object.traverse(part=>{if((part as Mesh).isMesh){const mesh=part as Mesh;if(mesh.geometry.userData.owned)mesh.geometry.dispose();for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material])material.dispose();}});}
function independentCopy(object:Object3D){
  const copy=object.clone(true);
  copy.traverse(part=>{if((part as Mesh).isMesh){const mesh=part as Mesh;if(mesh.geometry.userData.owned)mesh.geometry=mesh.geometry.clone();mesh.material=Array.isArray(mesh.material)?mesh.material.map(m=>m.clone()):mesh.material.clone();}});
  return copy;
}

export function applyAttachedVariant(scene:Group,source:Group,type:HouseType,scan:boolean){
  if(type!=="tussenwoning"&&type!=="twee-onder-een-kap")return;
  const sharedSides=type==="tussenwoning"?["links","rechts"]:["links"];
  for(const side of sharedSides){
    for(const part of [...scene.children]){
      if(part.name.startsWith(`Raam_${side}_`)||part.name===`Spouwisolatie_${side}`){dispose(part);scene.remove(part);}
    }
    const wall=scene.getObjectByName(`Buitengevel_${side}`) as Mesh;
    const original=source.getObjectByName(`Buitengevel_${side}`) as Mesh|undefined;
    if(wall){
      if(original){if(wall.geometry.userData.owned)wall.geometry.dispose();wall.geometry=original.geometry;}
      else if(type==="tussenwoning"){if(wall.geometry.userData.owned)wall.geometry.dispose();wall.geometry=(source.getObjectByName("Buitengevel_rechts") as Mesh).geometry;}
      wall.userData.sharedWall=true;
      if(scan){for(const material of Array.isArray(wall.material)?wall.material:[wall.material]){const mat=material as MeshStandardMaterial;mat.map=null;mat.color.set("#bdc6bd");}}
    }
  }
  if(type==="tussenwoning"){
    const pump=scene.getObjectByName("Warmtepomp_DeWarmte");if(pump){pump.position.x=1.8;pump.position.z=-4.5;pump.rotation.y=Math.PI;}
    if(!scan){const neighbour=scene.getObjectByName("Buurwoning_rij");if(neighbour){const right=independentCopy(neighbour);right.name="Buurwoning_rechts";right.scale.x*=-1;scene.add(right);}}
  }else if(!scan){
    for(const part of [...scene.children])if(part.name.startsWith("Buurwoning")){dispose(part);scene.remove(part);}
    const neighbour=new Group();neighbour.name="Buurwoning_tweeling";
    for(const part of scene.children){
      if(/^(Spouwisolatie|Dakisolatie|Vloerisolatie|Warmtepomp|Zijgevel_garage_isolatie)/.test(part.name))continue;
      const copy=independentCopy(part);copy.name=`buur_${part.name}`;
      copy.traverse(child=>{if((child as Mesh).isMesh){const mesh=child as Mesh;for(const mat of Array.isArray(mesh.material)?mesh.material:[mesh.material])if((mat as MeshStandardMaterial).isMeshStandardMaterial)(mat as MeshStandardMaterial).color.multiplyScalar(.9);}});
      neighbour.add(copy);
    }
    // Dichterbij dan de eerdere -7.5: bij de rustcamera van de landingspagina
    // (nog niet gescrold, dus nog geen uitgezoomde weergave) viel de
    // gespiegelde buurwoning grotendeels buiten beeld, waardoor twee-onder-
    // een-kap nauwelijks van een vrijstaande woning te onderscheiden was.
    neighbour.scale.x=-1;neighbour.position.x=-6.2;scene.add(neighbour);
  }
}
