import { Box3, Group, Mesh, MeshStandardMaterial, Object3D } from "three";
import type { HouseType } from "./woning-types";

function dispose(object:Object3D){object.traverse(part=>{if((part as Mesh).isMesh){const mesh=part as Mesh;if(mesh.geometry.userData.owned)mesh.geometry.dispose();for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material])material.dispose();}});}
function independentCopy(object:Object3D){
  const copy=object.clone(true);
  copy.traverse(part=>{if((part as Mesh).isMesh){const mesh=part as Mesh;if(mesh.geometry.userData.owned)mesh.geometry=mesh.geometry.clone();mesh.material=Array.isArray(mesh.material)?mesh.material.map(m=>m.clone()):mesh.material.clone();}});
  return copy;
}

/**
 * Welke zijde bij dit woningtype de vrije (niet-gedeelde) gevel is, en dus de kant die in de
 * woningscan-doorsnede open mag: dezelfde regel die hierboven de `sharedWall`-vlag zet, maar als
 * pure functie zodat ook de camera-opstelling en de belichting (components/woning/HouseViewer.tsx,
 * HouseDaglicht) weten welke kant dat is zonder de geladen scene te hoeven doorzoeken.
 * - Hoekwoning zonder gekozen hoekZijde: geen gedeelde zijgevel bekend, dus een vaste, consistente kant.
 * - Hoekwoning met hoekZijde: de kant tegenover de gekozen buurzijde.
 * - Twee-onder-een-kap: "links" is altijd de gedeelde zijde (zie sharedSides hieronder), dus "rechts" open.
 * - Vrijstaand: geen gedeelde zijgevel; kies dezelfde vaste kant als bij een hoekwoning.
 * - Tussenwoning: beide zijgevels zijn gedeeld, dus geen zijgevel open — de voorgevel in plaats daarvan.
 */
export function getOpenSide(type:HouseType,hoekZijde?:"Links"|"Rechts"):"links"|"rechts"|"voor"{
  if(type==="tussenwoning")return "voor";
  if(type==="hoekwoning"&&hoekZijde)return hoekZijde==="Rechts"?"links":"rechts";
  return "rechts";
}

export function applyAttachedVariant(scene:Group,source:Group,type:HouseType,scan:boolean,hoekZijde?:"Links"|"Rechts"){
  // Bij een hoekwoning bepaalt de bewoner zelf aan welke kant de buurwoning staat (alleen in de scan,
  // dus alleen als hoekZijde is meegegeven); zonder die keuze blijft een hoekwoning zoals voorheen.
  if(type==="hoekwoning"){
    if(!hoekZijde)return;
    const side=hoekZijde==="Rechts"?"rechts":"links";
    for(const part of [...scene.children]){
      if(part.name.startsWith(`Raam_${side}_`)||part.name===`Spouwisolatie_${side}`){dispose(part);scene.remove(part);}
    }
    const wall=scene.getObjectByName(`Buitengevel_${side}`) as Mesh;
    const original=source.getObjectByName(`Buitengevel_${side}`) as Mesh|undefined;
    if(wall){
      if(original){if(wall.geometry.userData.owned)wall.geometry.dispose();wall.geometry=original.geometry;}
      wall.userData.sharedWall=true;
      if(scan){for(const material of Array.isArray(wall.material)?wall.material:[wall.material]){const mat=material as MeshStandardMaterial;mat.map=null;mat.color.set("#bdc6bd");}}
    }
    return;
  }
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
    // Geen vrije zijgevel: buitenunit tegen de achtergevel, links van de
    // achterdeur. Rechts van de deur staat de thuisbatterij; de eerdere
    // x=1.8 zette de unit half in de batterij en pal naast de deur.
    const pump=scene.getObjectByName("Warmtepomp_DeWarmte");if(pump){pump.position.x=-1.6;pump.position.z=-4.5;pump.rotation.y=Math.PI;}
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
    // Spiegel precies tegen de buitenkant van de gedeelde muur. De eerdere
    // vaste waarde (-6.2) lag binnen die muur, waardoor beide helften zo'n
    // 35 cm in elkaar schoven — zichtbaar bij de voordeuren met luifel.
    scene.updateMatrixWorld(true);
    const muur=scene.getObjectByName("Buitengevel_links");
    const spiegelX=muur?new Box3().setFromObject(muur).min.x:-3.1;
    neighbour.scale.x=-1;neighbour.position.x=2*spiegelX;scene.add(neighbour);
  }
}
