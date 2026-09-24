import { Box3, Group, Mesh, MeshStandardMaterial, Object3D, Vector3, type Material } from "three";
import { baseHouseType, HOUSE_PROPORTIONS, type HouseType } from "./woning-types";
import { applyAttachedVariant } from "./house-variants";
import { updateCornerFacade, openDetachedWindows } from "./house-facades";
import { updateDetachedFacade, distinguishDoors, addDormerPanels, finishDetachedHouse, addPlasticProfiles } from "./house-details";

// Work on an independent clone: neither animations nor highlights may mutate the loader cache.
export function prepareHouse(source: Group, type: HouseType, scan = false) {
  const requestedType=type;
  type=baseHouseType(type);
  const scene = source.clone(true);
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
  }

  if (type === "hoekwoning") {
    updateCornerFacade(scene);
    distinguishDoors(scene,type);
    // Keep the outdoor unit visible beside the free side facade in the story's fixed camera.
    const heatPump = scene.getObjectByName("Warmtepomp_DeWarmte");
    if (heatPump) heatPump.position.z = 1.7;
    for (const child of scene.children) {
      if (child.name.startsWith("Zonnepaneel") && child.position.z > 0) child.position.x = Math.sign(child.position.x) * 1.95;
    }
    const neighbour = scene.getObjectByName("Buurwoning_rij");
    if (neighbour) {
      // Give the adjoining home the same bay width and facade rhythm as the selected house.
      const neighbourBody = neighbour.getObjectByName("buur_romp");
      const width = 5.28;
      const centre = -width;
      if (neighbourBody) { neighbourBody.scale.x = width / 4.2; neighbourBody.position.x = centre; }
      for (const child of [...neighbour.children]) {
        if (/^buur_(deur|kozijn|glas)/.test(child.name)) neighbour.remove(child);
        if (/^buur_(dakschild|goot|nok|plint)/.test(child.name)) {
          child.position.x = centre;
          child.scale.x = child.name === "buur_plint" ? width / 4.2 : width / 4.34;
        }
      }
      for (const child of scene.children) {
        if (/^(Raam_(voor|achter)_|Voordeur$|Achterdeur$)/.test(child.name)) {
          const copy = child.clone(true);
          copy.position.x += centre;
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
    openDetachedWindows(scene);
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
  }
  if (scan || requestedType==="vrijstaand") for (const child of [...scene.children]) if (child.name.startsWith("Buurwoning")) { disposeHouse(child); scene.remove(child); }
  applyAttachedVariant(scene,source,requestedType,scan);
  scene.scale.set(...HOUSE_PROPORTIONS[requestedType]);
  scene.updateMatrixWorld(true);
  const bounds = new Box3();
  for (const child of scene.children) {
    if (!child.name.startsWith("Buurwoning")) bounds.expandByObject(child);
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
