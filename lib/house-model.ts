import { Box3, Group, Mesh, MeshStandardMaterial, Object3D, Vector3, type Material } from "three";
import { baseHouseType, HOUSE_PROPORTIONS, type HouseType } from "./woning-types";
import { applyAttachedVariant } from "./house-variants";
import { updateCornerFacade, openDetachedWindows } from "./house-facades";
import { updateDetachedFacade, distinguishDoors, addDormerPanels, finishDetachedHouse, addPlasticProfiles, openPlintBijDeuren, addGevelbekleding, addLuifel, addAanbouw } from "./house-details";

// Work on an independent clone: neither animations nor highlights may mutate the loader cache.
export function prepareHouse(source: Group, type: HouseType, scan = false, hoekZijde?: "Links" | "Rechts") {
  const requestedType=type;
  type=baseHouseType(type);
  const scene = source.clone(true);
  // Rijwoningen (hoek- en tussenwoning) krijgen Nederlandse materialen en details naar referentiefoto's.
  scene.userData.nlRij = type === "hoekwoning";
  // Vrijstaand en twee-onder-een-kap: eigen stijl naar de referentiefoto's (zandkleurige steen, houten topgevel).
  scene.userData.nlVrij = type === "vrijstaand";
  // Elk woningtype een eigen uitstraling naar de referentiefoto's (zie STIJLEN in house-realism.ts).
  scene.userData.stijl = requestedType;
  scene.traverse(object => {
    if ((object as Mesh).isMesh) {
      const mesh = object as Mesh;
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone();
    }
  });
  scene.updateMatrixWorld(true);
  const facade = scene.getObjectByName("Buitengevel_voor") as Mesh | undefined;
  const brick = facade?.material;
  for (const root of scene.children) {
    if (root.name.startsWith("Schoorsteen")) root.traverse(part => {
      if ((part as Mesh).isMesh && part.name.startsWith("schacht") && brick && !Array.isArray(brick)) {
        const mesh = part as Mesh;
        for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) material.dispose();
        mesh.material = brick.clone();
      }
    });
  }

  // Thuisbatterij: Gijs plaatst de Sigenergy SigenStor. Die is wit met
  // lichtgrijze onderkant en een klein donker display (zie
  // public/images/maatregelen/thuisbatterij/thuisbatterij-sigenstor.png). Het GLB-model had een
  // zwarte kast met een groene strip; hier gecorrigeerd voor homepage én scan.
  scene.getObjectByName("Thuisbatterij")?.traverse(part => {
    const mesh = part as Mesh;
    if (!mesh.isMesh) return;
    const kleur = mesh.name === "batterij_accent" ? "#353b40" : mesh.name === "batterij_voet" ? "#b9bec2" : "#eceeec";
    for (const materiaal of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      const m = materiaal as MeshStandardMaterial;
      if (!m.isMeshStandardMaterial) continue;
      m.color.set(kleur);
      m.metalness = 0;
      m.roughness = mesh.name === "batterij_accent" ? 0.35 : 0.55;
    }
  });

  const dormer = scene.getObjectByName("Dakkapel");
  if (dormer) {
    const box = new Box3().setFromObject(dormer);
    const pivot = box.getCenter(new Vector3());
    pivot.y = box.min.y;
    const factor = new Vector3(type === "hoekwoning" ? 1.35 : 1.25, 1.3, 1.1);
    // The GLB dormer has a world-origin pivot. Scale about its own base instead.
    dormer.scale.multiply(factor);
    dormer.position.add(pivot.clone().multiply(new Vector3(1, 1, 1).sub(factor)));
    dormer.position.y += 0.35;
    // Rijwoningen hebben in het GLB maar één dakkapel; voor "2 dakkapellen" in de
    // scan komt er een tweede, identieke kopie naast de eerste (alleen in de scan,
    // dus alleen als de bewoner dat kan kiezen). Vrijstaande woningen hebben al
    // een voor- en achterdakkapel (zie finishDetachedHouse) en hoeven dit niet.
    if (scan && type === "hoekwoning") {
      const tweede = dormer.clone(true);
      tweede.name = "Dakkapel_2";
      tweede.traverse(part => { if ((part as Mesh).isMesh) { const mesh = part as Mesh; mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone(); } });
      scene.add(tweede);
    }
  }

  if (type === "hoekwoning") {
    updateCornerFacade(scene);
    distinguishDoors(scene,type);
    openPlintBijDeuren(scene);
    if (requestedType === "tussenwoning") addLuifel(scene);
    // Keep the outdoor unit visible beside the free side facade in the story's fixed camera.
    const heatPump = scene.getObjectByName("Warmtepomp_DeWarmte");
    if (heatPump) heatPump.position.z = 1.7;
    // De achterdeur staat (via distinguishDoors) op x=1.6; het grote
    // achterraam op de begane grond (Raam_achter_03, zie house-facades.ts)
    // loopt van x=-2.0 tot x=0.1. De enige vrije muurstrook op de begane
    // grond ligt daartussen; de thuisbatterij komt daar te staan.
    const battery = scene.getObjectByName("Thuisbatterij");
    if (battery) battery.position.x = 0.58;
    for (const child of scene.children) {
      if (child.name.startsWith("Zonnepaneel") && child.position.z > 0) child.position.x = Math.sign(child.position.x) * 1.95;
    }
    const neighbour = scene.getObjectByName("Buurwoning_rij");
    if (neighbour) {
      // Give the adjoining home the same bay width and facade rhythm as the selected house.
      const neighbourBody = neighbour.getObjectByName("buur_romp");
      const width = 5.28;
      const centre = -width;
      if (neighbourBody) {
        neighbourBody.scale.x = width / 4.2; neighbourBody.position.x = centre;
        // De muren van de buurwoning stopten 44 cm onder het dakvlak (zichtbare wig lucht onder het dak).
        // Trek de bovenkant op tot tegen de onderkant van de dakschilden.
        const romp = neighbourBody as Mesh;
        romp.geometry = romp.geometry.clone();
        romp.geometry.userData.owned = true;
        const pos = romp.geometry.getAttribute("position");
        for (let i = 0; i < pos.count; i++) if (pos.getY(i) > 2.6) pos.setY(i, pos.getY(i) + 0.44);
        pos.needsUpdate = true;
        romp.geometry.computeVertexNormals();
        romp.geometry.computeBoundingBox();
      }
      for (const child of [...neighbour.children]) {
        if (/^buur_(deur|kozijn|glas)/.test(child.name)) neighbour.remove(child);
        // Naamloze delen zijn de windveren: die horen op de (verbrede) kopgevel, niet midden op het dak.
        if ((child as Mesh).isMesh && !child.name.startsWith("buur_")) child.position.x = centre - width / 2;
        if (/^buur_(dakschild|goot|nok|plint)/.test(child.name)) {
          child.position.x = centre;
          child.scale.x = child.name === "buur_plint" ? width / 4.2 : width / 4.34;
        }
      }
      for (const child of scene.children) {
        if (/^(Raam_(voor|achter)_|Voordeur$|Achterdeur$)/.test(child.name)) {
          const copy = child.clone(true);
          copy.position.x += centre;
          // De buurwoning is een massief blok zonder gaten: zet de (verzonken) kozijnen weer op de gevel.
          copy.position.z += Math.sign(copy.position.z) * 0.07;
          copy.name = `buur_${child.name}`;
          neighbour.add(copy);
        }
      }
      neighbour.traverse(part => {
        if ((part as Mesh).isMesh) {
          const mesh = part as Mesh;
          if (mesh.geometry.userData.owned) mesh.geometry = mesh.geometry.clone();
          mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone();
          for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
            if ((material as MeshStandardMaterial).isMeshStandardMaterial) (material as MeshStandardMaterial).color.multiplyScalar(0.83);
          }
        }
      });
    }
  } else {
    for (const child of scene.children) {
      if (child.name.startsWith("Zonnepaneel") && child.position.x > 4) child.userData.garagePanel = true;
    }
    // The garage side stays quiet: one small attic window. Other side windows align with the front.
    const side = scene.getObjectByName("Zijraam_boven_garage");
    if (side) {
      side.name = "Raam_rechts_zolder";
      side.position.set(3.77, 3.75, 0);
      side.scale.set(1, 0.65, 0.8);
    }
    for (const name of ["Raam_links_02", "Raam_links_03"]) {
      const window = scene.getObjectByName(name);
      if (window) window.position.y = 1.6;
    }
    updateDetachedFacade(scene);
    distinguishDoors(scene,type);
    openPlintBijDeuren(scene);
    openDetachedWindows(scene);
    addGevelbekleding(scene, requestedType === "twee-onder-een-kap" ? ["rechts"] : ["links", "rechts"]);
    finishDetachedHouse(scene);
  }

  addDormerPanels(scene);
  if(scan)addPlasticProfiles(scene);
  scene.updateMatrixWorld(true);
  if ((scan || requestedType === "tussenwoning") && type === "hoekwoning") {
    const right = scene.getObjectByName("Buitengevel_rechts") as Mesh;
    const left = right.clone();
    left.name = "Buitengevel_links";
    left.position.x = -right.position.x;
    left.geometry = (source.getObjectByName("Buitengevel_rechts") as Mesh).geometry;
    left.material = Array.isArray(right.material) ? right.material.map(m => m.clone()) : right.material.clone();
    scene.add(left);
    // De bouwmuur deelde zijn buitenvlak met deze gekloonde gevel, wat flikkerde (z-fighting).
    // Laat de bouwmuur nu achter de gevel beginnen; de binnenkant blijft op dezelfde plek.
    const bouwmuur = scene.getObjectByName("Bouwmuur_links");
    if (bouwmuur) {
      scene.updateMatrixWorld(true);
      const huid = new Box3().setFromObject(left), muur = new Box3().setFromObject(bouwmuur);
      const f = (muur.max.x - huid.max.x - 0.005) / (muur.max.x - muur.min.x);
      if (f > 0.05 && f < 1) {
        const p = bouwmuur.position.x;
        bouwmuur.scale.x *= f;
        bouwmuur.position.x += muur.max.x - (p + (muur.max.x - p) * f);
      }
    }
  }
  if (scan || requestedType==="vrijstaand") for (const child of [...scene.children]) if (child.name.startsWith("Buurwoning")) { disposeHouse(child); scene.remove(child); }
  applyAttachedVariant(scene,source,requestedType,scan,hoekZijde);
  // Aanbouw is alleen in de scan te kiezen; na de gedeelde muren, zodat die ook bij de aanbouw grijs worden.
  if (scan) addAanbouw(scene);
  scene.scale.set(...HOUSE_PROPORTIONS[requestedType]);
  scene.updateMatrixWorld(true);
  const bounds = new Box3();
  for (const child of scene.children) {
    // Buurwoningen en de (optionele) aanbouw tellen niet mee, zodat de woning in beeld hetzelfde blijft.
    if (!/^(Buurwoning|Aanbouw|Fundering_aanbouw)/.test(child.name)) bounds.expandByObject(child);
  }
  const size = bounds.getSize(new Vector3());
  const scale = scan ? 3.3 / Math.max(size.x, size.y, size.z) : 3 / Math.max(12.1, size.x, size.y, size.z);
  const position = bounds.getCenter(new Vector3()).multiplyScalar(-scale);
  return { scene, scale, position, bounds };
}

export function disposeHouse(scene: Object3D) {
  const materials = new Set<Material>();
  scene.traverse(object => {
    if ((object as Mesh).isMesh) { const mesh = object as Mesh; if (mesh.geometry.userData.owned) mesh.geometry.dispose(); for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) materials.add(material); }
  });
  materials.forEach(material => material.dispose());
}
