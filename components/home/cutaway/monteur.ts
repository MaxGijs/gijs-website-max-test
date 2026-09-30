import { BoxGeometry, CapsuleGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial, SphereGeometry, type BufferGeometry, type Material, type Object3D } from "three";

// PROTOTYPE (branch homepage-cutaway-test): een Gijs-monteur voor korte acties
// van een paar seconden (ladder op het dak, de kruipruimte in). Opgebouwd uit
// eenvoudige vormen met scharnierende armen en benen, in Gijs-werkkleding.
// Maten in meters, in de coördinaten van het woningmodel.

type Ledemaat = { boven: Group; onder: Group };
export type Monteur = { root: Group; houding: Group; romp: Group; armen: Ledemaat[]; benen: Ledemaat[]; materialen: Material[] };

export function maakMonteur(): Monteur {
  const materialen: Material[] = [];
  const m = (kleur: string, roughness = 0.8) => { const mat = new MeshStandardMaterial({ color: kleur, roughness, metalness: 0, transparent: true }); materialen.push(mat); return mat; };
  const jas = m("#1d4a3f"), broek = m("#2f3735"), huid = m("#d6a57e", 0.6), schoen = m("#1e2022", 0.5), pet = m("#133e35"), band = m("#dfe6e1", 0.4);
  const deel = (geo: BufferGeometry, mat: Material, ouder: Object3D, x: number, y: number, z: number) => {
    geo.userData.owned = true;
    const mesh = new Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.position.set(x, y, z);
    ouder.add(mesh);
    return mesh;
  };
  // root: plaats en looprichting; houding: staand of liggend; heup: draaipunt van romp en benen.
  const root = new Group(); root.name = "Monteur";
  const houding = new Group(); root.add(houding);
  const heup = new Group(); heup.position.y = 0.92; houding.add(heup);
  const romp = new Group(); heup.add(romp);
  deel(new CapsuleGeometry(0.155, 0.34, 4, 14), jas, romp, 0, 0.3, 0);
  deel(new CylinderGeometry(0.158, 0.158, 0.04, 20), band, romp, 0, 0.22, 0);
  deel(new SphereGeometry(0.1, 18, 14), huid, romp, 0, 0.75, 0.01);
  deel(new SphereGeometry(0.106, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), pet, romp, 0, 0.77, 0);
  deel(new BoxGeometry(0.13, 0.018, 0.1), pet, romp, 0, 0.775, 0.1);
  const armen: Ledemaat[] = [], benen: Ledemaat[] = [];
  for (const kant of [-1, 1]) {
    const schouder = new Group(); schouder.position.set(kant * 0.2, 0.55, 0); romp.add(schouder);
    deel(new CapsuleGeometry(0.05, 0.22, 4, 10), jas, schouder, 0, -0.15, 0);
    const elleboog = new Group(); elleboog.position.y = -0.3; schouder.add(elleboog);
    deel(new CapsuleGeometry(0.044, 0.2, 4, 10), jas, elleboog, 0, -0.13, 0);
    deel(new SphereGeometry(0.045, 10, 8), huid, elleboog, 0, -0.29, 0);
    armen.push({ boven: schouder, onder: elleboog });
    const been = new Group(); been.position.set(kant * 0.095, 0, 0); heup.add(been);
    deel(new CapsuleGeometry(0.068, 0.3, 4, 10), broek, been, 0, -0.22, 0);
    const knie = new Group(); knie.position.y = -0.45; been.add(knie);
    deel(new CapsuleGeometry(0.058, 0.3, 4, 10), broek, knie, 0, -0.2, 0);
    deel(new BoxGeometry(0.1, 0.07, 0.24), schoen, knie, 0, -0.44, 0.05);
    benen.push({ boven: been, onder: knie });
  }
  root.visible = false;
  return { root, houding, romp, armen, benen, materialen };
}

/** Aluminium ladder langs +y, lengte `lengte`; zet de kanteling met rotation.x. */
export function maakLadder(lengte: number) {
  const ladder = new Group(); ladder.name = "Ladder";
  const alu = new MeshStandardMaterial({ color: "#b9bdc0", roughness: 0.35, metalness: 0.6, transparent: true });
  const deel = (geo: BufferGeometry, x: number, y: number, z: number, draai = false) => {
    geo.userData.owned = true;
    const mesh = new Mesh(geo, alu);
    mesh.castShadow = true;
    mesh.position.set(x, y, z);
    if (draai) mesh.rotation.z = Math.PI / 2;
    ladder.add(mesh);
  };
  for (const x of [-0.22, 0.22]) deel(new BoxGeometry(0.05, lengte, 0.07), x, lengte / 2, 0);
  for (let y = 0.25; y < lengte - 0.1; y += 0.28) deel(new CylinderGeometry(0.018, 0.018, 0.44, 8), 0, y, 0, true);
  ladder.visible = false;
  return { ladder, materialen: [alu] as Material[] };
}

export function zetZichtbaarheid(materialen: Material[], zicht: number) {
  for (const m of materialen) m.opacity = zicht;
}

/** Klimmen: armen en benen om en om, lichaam iets naar de ladder toe. */
export function poseKlimmen(m: Monteur, fase: number) {
  m.houding.rotation.set(0, 0, 0);
  m.romp.rotation.x = 0.12;
  m.armen.forEach((a, i) => { const s = Math.sin(fase + i * Math.PI); a.boven.rotation.x = -2.35 + 0.35 * s; a.onder.rotation.x = -0.35 - 0.25 * s; });
  m.benen.forEach((b, i) => { const s = Math.sin(fase + i * Math.PI + Math.PI); b.boven.rotation.x = -0.7 + 0.45 * s; b.onder.rotation.x = 1.0 - 0.45 * s; });
}

/** Rustig staan (bovenaan de ladder, even om zich heen kijken). */
export function poseStaan(m: Monteur) {
  m.houding.rotation.set(0, 0, 0);
  m.romp.rotation.x = 0.05;
  m.armen.forEach(a => { a.boven.rotation.x = -1.9; a.onder.rotation.x = -0.4; });
  m.benen.forEach((b, i) => { b.boven.rotation.x = i ? -0.35 : 0; b.onder.rotation.x = i ? 0.5 : 0; });
}

/** Kruipen op de buik (commandokruip), met het hoofd iets omhoog. */
export function poseKruipen(m: Monteur, fase: number) {
  m.houding.rotation.set(Math.PI / 2 - 0.08, 0, 0);
  m.romp.rotation.x = 0;
  m.armen.forEach((a, i) => { const s = Math.sin(fase + i * Math.PI); a.boven.rotation.x = -2.7 + 0.5 * s; a.onder.rotation.x = -0.9 + 0.5 * s; });
  m.benen.forEach((b, i) => { const s = Math.sin(fase + i * Math.PI); b.boven.rotation.x = 0.25 * s; b.onder.rotation.x = 0.55 + 0.45 * s; });
}
