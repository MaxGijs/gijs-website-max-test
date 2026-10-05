import { Box3, BoxGeometry, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial, Path, Shape, Vector3, type Object3D } from "three";

type Opening = { name: string; side: "voor" | "achter" | "rechts"; x: number; y: number; width: number; height: number };
// Deuropeningen (voordeur voor, achterdeur achter): alleen een gat in de muur, de deur zelf komt uit distinguishDoors.
const deurOpeningen: Opening[] = [
  { name: "deur_voor", side: "voor", x: -1.55, y: -1.525, width: 1.08, height: 2.11 },
  { name: "deur_achter", side: "achter", x: 1.6, y: -1.525, width: 1.08, height: 2.11 },
];
const openings: Opening[] = [
  { name: "Raam_voor_01", side: "voor", x: 1.1, y: -.95, width: 2.1, height: 1.6 },
  { name: "Raam_voor_wc", side: "voor", x: -.55, y: -1.05, width: .38, height: .8 },
  { name: "Raam_voor_02", side: "voor", x: 1.1, y: 1.55, width: 1.3, height: 1.35 },
  { name: "Raam_voor_badkamer", side: "voor", x: -1.1, y: 1.9, width: 1.3, height: .65 },
  { name: "Raam_achter_01", side: "achter", x: -1.1, y: 1.55, width: 1.3, height: 1.35 },
  { name: "Raam_achter_02", side: "achter", x: 1.1, y: 1.55, width: 1.3, height: 1.35 },
  { name: "Raam_achter_03", side: "achter", x: -.95, y: -.95, width: 2.1, height: 1.6 },
  { name: "Raam_rechts_zolder", side: "rechts", x: 0, y: 3.55, width: .6, height: .7 },
];

export function updateCornerFacade(scene: Group) {
  for (const root of [...scene.children]) {
    if (/^(Raam_|Kozijn_|Raamdorpels)/.test(root.name)) {
      root.traverse(child => { if ((child as Mesh).isMesh) { const m = (child as Mesh).material; (Array.isArray(m) ? m : [m]).forEach(material => material.dispose()); } });
      scene.remove(root);
    }
  }
  const backDoor = scene.getObjectByName("Achterdeur");
  const frontDoor = scene.getObjectByName("Voordeur");
  if (backDoor && frontDoor) {
    const replacement = frontDoor.clone(true);
    replacement.name = "Achterdeur"; replacement.rotation.y = Math.PI;
    replacement.position.set(1.6, -1.55, -3.87);
    replacement.traverse(child => { if ((child as Mesh).isMesh) { const mesh = child as Mesh; mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone(); } });
    backDoor.traverse(child => { if ((child as Mesh).isMesh) { const m = (child as Mesh).material; (Array.isArray(m) ? m : [m]).forEach(material => material.dispose()); } });
    scene.remove(backDoor); scene.add(replacement);
  }
  for (const opening of openings) {
    const group = new Group(); group.name = opening.name;
    // Het kozijn ligt in de muur (zichtbare negge), niet ervoor: zo zit het bij Nederlandse rijwoningen.
    if (opening.side === "rechts") { group.rotation.y = Math.PI / 2; group.position.set(2.59, opening.y, opening.x); }
    else { group.position.set(opening.x, opening.y, opening.side === "voor" ? 3.79 : -3.79); if (opening.side === "achter") group.rotation.y = Math.PI; }
    const bar = (name: string, w: number, h: number, depth: number, x: number, y: number, z: number, color: string) => {
      const geometry = new BoxGeometry(w, h, depth); geometry.userData.owned = true;
      const mesh = new Mesh(geometry, new MeshStandardMaterial({ color, roughness: name === "glas" ? .15 : .7 }));
      mesh.name = name; mesh.position.set(x, y, z); group.add(mesh);
      return mesh;
    };
    const { width: w, height: h } = opening;
    bar("kozijn_links", .065, h, .1, -w/2+.0325, 0, 0, "#f1eee7");
    bar("kozijn_rechts", .065, h, .1, w/2-.0325, 0, 0, "#f1eee7");
    bar("kozijn_boven", w-.13, .065, .1, 0, h/2-.0325, 0, "#f1eee7");
    bar("kozijn_onder", w-.13, .065, .1, 0, -h/2+.0325, 0, "#f1eee7");
    bar("glas", w-.13, h-.13, .02, 0, 0, -.015, "#78939b");
    if (w > 1.2) bar("kozijn_midden", .05, h-.13, .09, w*.15, 0, .005, "#f1eee7");
    // Vensterbank steekt een paar centimeter uit de gevel; daarboven een rollaag (stenen op hun kant).
    bar("dorpel", w+.1, .05, .16, 0, -h/2-.025, .07, "#4b4a45");
    const rollaag = bar("rollaag", w+.12, .11, .025, 0, h/2+.055, .0575, "#6b3526");
    (rollaag.material as MeshStandardMaterial).userData.rollaag = true;
    scene.add(group);
  }
  // Replace the three wall layers with real openings, retaining their own materials.
  for (const side of ["voor", "achter", "rechts"] as const) {
    for (const prefix of ["Buitengevel", "Spouwisolatie", "Binnenmuur"]) {
      const mesh = scene.getObjectByName(`${prefix}_${side}`) as Mesh | undefined;
      if (!mesh?.isMesh) continue;
      const right = side === "rechts", shape = new Shape();
      const halfWidth = right ? 3.7 : 2.5;
      shape.moveTo(-halfWidth, -2.6); shape.lineTo(halfWidth, -2.6); shape.lineTo(halfWidth, 2.6);
      if (right) shape.lineTo(0, 4.8);
      shape.lineTo(-halfWidth, 2.6); shape.closePath();
      for (const o of [...openings, ...deurOpeningen].filter(o => o.side === side)) {
        const hole = new Path(), x = right ? -o.x : o.x;
        hole.moveTo(x-o.width/2, o.y-o.height/2); hole.lineTo(x-o.width/2, o.y+o.height/2);
        hole.lineTo(x+o.width/2, o.y+o.height/2); hole.lineTo(x+o.width/2, o.y-o.height/2); hole.closePath(); shape.holes.push(hole);
      }
      const box = new Box3().setFromObject(mesh), size = box.getSize(new Vector3());
      const depth = right ? size.x : size.z;
      const geometry = new ExtrudeGeometry(shape, { depth, bevelEnabled: false, steps: 1 });
      geometry.translate(0, 0, -depth/2);
      const uv = geometry.getAttribute("uv");
      for (let i=0; i<uv.count; i++) uv.setXY(i, (uv.getX(i)+halfWidth)/(halfWidth*2), (uv.getY(i)+2.6)/(right ? 7.4 : 5.2));
      if (right) geometry.rotateY(Math.PI/2);
      geometry.userData.owned = true; mesh.geometry = geometry;
    }
  }
}

export function openDetachedWindows(scene: Group) {
  scene.updateMatrixWorld(true);
  for (const side of ["voor", "achter", "links", "rechts"] as const) {
    const sideways = side === "links" || side === "rechts";
    const windows = scene.children.filter(child => child.name.startsWith(`Raam_${side}_`));
    // Gat alleen zo groot als het kozijn (niet de uitstekende vensterbank of rollaag), plus de deuropeningen.
    const kozijnMaat = (object: Object3D, patroon: RegExp) => {
      const box = new Box3();
      object.traverse(d => { if ((d as Mesh).isMesh && patroon.test(d.name)) box.expandByObject(d); });
      return box.isEmpty() ? new Box3().setFromObject(object) : box;
    };
    const openingen = windows.map(w => kozijnMaat(w, /^(kozijn|glas)/));
    if (!sideways) for (const deur of ["Voordeur", "Achterdeur"].map(n => scene.getObjectByName(n)).filter((d): d is Object3D => !!d)) {
      const box = kozijnMaat(deur, /^(deurkader|deurblad)/);
      if ((box.getCenter(new Vector3()).z > 0) === (side === "voor")) { box.min.y = Math.max(box.min.y, -2.68); openingen.push(box); }
    }
    const names = side === "rechts" ? ["Zijgevel_garage_buiten", "Zijgevel_garage_isolatie", "Zijgevel_garage_binnen"] : ["Buitengevel", "Spouwisolatie", "Binnenmuur"].map(prefix => `${prefix}_${side}`);
    for (const name of names) {
      const mesh = scene.getObjectByName(name) as Mesh | undefined;
      if (!mesh?.isMesh) continue;
      const half = sideways ? 4.5 : 3.6, shape = new Shape();
      shape.moveTo(-half, -2.7); shape.lineTo(half, -2.7); shape.lineTo(half, 2.7);
      if (sideways) shape.lineTo(0, 5.5);
      shape.lineTo(-half, 2.7); shape.closePath();
      for (const box of openingen) {
        const centre = box.getCenter(new Vector3()), size = box.getSize(new Vector3());
        const x = sideways ? -centre.z : centre.x, y = centre.y, w = sideways ? size.z : size.x, h = size.y;
        const hole = new Path();
        hole.moveTo(x-w/2, y-h/2); hole.lineTo(x-w/2, y+h/2); hole.lineTo(x+w/2, y+h/2); hole.lineTo(x+w/2, y-h/2); hole.closePath(); shape.holes.push(hole);
      }
      const size = new Box3().setFromObject(mesh).getSize(new Vector3()), depth = sideways ? size.x : size.z;
      const geometry = new ExtrudeGeometry(shape, { depth, bevelEnabled:false, steps:1 }); geometry.translate(0,0,-depth/2);
      const uv = geometry.getAttribute("uv"); for(let i=0;i<uv.count;i++) uv.setXY(i,(uv.getX(i)+half)/(half*2),(uv.getY(i)+2.7)/(sideways?8.2:5.4));
      if (sideways) geometry.rotateY(Math.PI/2);
      geometry.userData.owned = true; mesh.geometry = geometry;
    }
  }
}
