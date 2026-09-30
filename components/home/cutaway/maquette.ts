import { Box3, BoxGeometry, CanvasTexture, CylinderGeometry, Group, Mesh, MeshStandardMaterial, RepeatWrapping, SphereGeometry, SRGBColorSpace, type Material, type Object3D, type Texture } from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { disposeHouse } from "@/lib/house-model";

// Bouwstenen voor de poppenhuis-doorsnede (PROTOTYPE, branch homepage-cutaway-test):
// grondblok met kruipruimte en eenvoudig ingerichte verdiepingen.
// Alle maten in meters, in de coördinaten van public/models/gijs-hoekwoning.glb
// (gemeten uit het model zelf).

export const M = {
  open: 2.49, // lijn waar vloeren en voor-/achtergevel eindigen
  links: -2.38, // binnenkant linkermuur
  voor: 3.58, // binnenkant voorgevel
  achter: -3.58, // binnenkant achtergevel
  gevelVoor: 3.84, gevelAchter: -3.84, gevelLinks: -2.64,
  bg: -2.57, plafondBg: -0.08, // begane grond: bovenkant vloer, onderkant verdiepingsvloer
  v1: 0.08, plafondV1: 2.44, // verdieping
  zolder: 2.6,
  vloerOnder: -2.85, // onderkant vloerisolatie
  maaiveld: -2.61,
  kruipBodem: -3.5,
};
/** Waar de binnenmuren staan: tussen woonkamer en keuken, en tussen slaapkamer en badkamer. */
export const WAND_BG = -1.0, WAND_V1 = 0.25;

export type V3 = [number, number, number];

// Rustige, eenvoudige texturen (procedureel, geen downloads).
function textuur(teken: (c: CanvasRenderingContext2D, s: number) => void, herhaal: [number, number], s = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const c = canvas.getContext("2d")!;
  teken(c, s);
  const t = new CanvasTexture(canvas);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(...herhaal);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
const ruis = (c: CanvasRenderingContext2D, s: number, kleuren: string[], n: number, grootte: number) => {
  for (let i = 0; i < n; i++) { c.fillStyle = kleuren[i % kleuren.length]; c.globalAlpha = 0.18 + Math.random() * 0.25; c.fillRect(Math.random() * s, Math.random() * s, grootte, grootte); }
  c.globalAlpha = 1;
};
export function maakTexturen() {
  return {
    hout: textuur((c, s) => {
      const planken = 6;
      for (let i = 0; i < planken; i++) {
        const tint = ["#a9825d", "#b48d66", "#a07852", "#b8916a", "#a58059", "#ad8761"][i];
        c.fillStyle = tint; c.fillRect(0, (i * s) / planken, s, s / planken);
        c.strokeStyle = "rgba(60,40,20,.12)";
        for (let n = 0; n < 7; n++) { c.beginPath(); const y = (i * s) / planken + Math.random() * (s / planken); c.moveTo(0, y); c.bezierCurveTo(s * 0.3, y + 3, s * 0.6, y - 3, s, y + 1); c.stroke(); }
        c.fillStyle = "rgba(50,32,18,.35)"; c.fillRect(0, (i * s) / planken, s, 1.5);
        const naad = ((i * 97) % 5) / 5 * s; c.fillRect(naad, (i * s) / planken, 1.5, s / planken);
      }
    }, [3, 3]),
    tegel: textuur((c, s) => {
      c.fillStyle = "#d9d6d0"; c.fillRect(0, 0, s, s);
      c.strokeStyle = "#b9b5ae"; c.lineWidth = 2;
      for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo((i * s) / 4, 0); c.lineTo((i * s) / 4, s); c.moveTo(0, (i * s) / 4); c.lineTo(s, (i * s) / 4); c.stroke(); }
    }, [5, 8]),
    aarde: textuur((c, s) => { c.fillStyle = "#6f5139"; c.fillRect(0, 0, s, s); ruis(c, s, ["#5a3f2b", "#86664a", "#4b3422", "#9a7a5a"], 2600, 3); }, [2, 1]),
    gras: textuur((c, s) => { c.fillStyle = "#6e8f47"; c.fillRect(0, 0, s, s); ruis(c, s, ["#5d7d3a", "#7fa052", "#557434", "#8aa95e"], 3200, 2); }, [4, 4]),
    zand: textuur((c, s) => { c.fillStyle = "#a89a80"; c.fillRect(0, 0, s, s); ruis(c, s, ["#8f8168", "#bcae93", "#7d705a"], 3200, 3); }, [4, 4]),
  };
}

export type Materialen = ReturnType<typeof maakMaterialen>;
export function maakMaterialen(t: ReturnType<typeof maakTexturen>) {
  const m = (kleur: string, extra: Partial<MeshStandardMaterial> = {}) => Object.assign(new MeshStandardMaterial({ color: kleur, roughness: 0.85, metalness: 0 }), extra);
  return {
    hout: m("#ffffff", { map: t.hout, roughness: 0.7 }),
    tegel: m("#ffffff", { map: t.tegel, roughness: 0.4 }),
    aarde: m("#ffffff", { map: t.aarde, roughness: 1 }),
    gras: m("#ffffff", { map: t.gras, roughness: 1 }),
    zand: m("#ffffff", { map: t.zand, roughness: 1 }),
    beton: m("#74716b", { roughness: 0.95 }),
    stuc: m("#e4ded4", { roughness: 0.95 }),
    plafond: m("#efebe4", { roughness: 0.95 }),
    stof: m("#b3aa9d", { roughness: 1 }),
    stofDonker: m("#8d857a", { roughness: 1 }),
    kussen: m("#e7e1d6", { roughness: 1 }),
    beddengoed: m("#f3f0ea", { roughness: 1 }),
    plaid: m("#c9b79c", { roughness: 1 }),
    walnoot: m("#5b4331", { roughness: 0.6 }),
    eiken: m("#b08a63", { roughness: 0.65 }),
    wit: m("#f4f3ef", { roughness: 0.45 }),
    sanitair: m("#fbfbfa", { roughness: 0.2 }),
    antraciet: m("#34383b", { roughness: 0.5 }),
    zwart: m("#1d1f21", { roughness: 0.35 }),
    messing: m("#b89a62", { roughness: 0.35, metalness: 0.6 }),
    kap: m("#efe7d8", { roughness: 0.9 }),
    blad: m("#4f7a45", { roughness: 0.9 }),
    bladLicht: m("#6a9657", { roughness: 0.9 }),
    pot: m("#d8d2c8", { roughness: 0.8 }),
    kleed: m("#d9ccb6", { roughness: 1 }),
    kleedGrijs: m("#c3bfb6", { roughness: 1 }),
    spiegel: m("#cfd8dc", { roughness: 0.05, metalness: 0.9 }),
    boek1: m("#3f5d53"), boek2: m("#c6a15b"), boek3: m("#8e4d3b"), boek4: m("#d9d4c7"),
  };
}

function eigen(mesh: Mesh) { mesh.geometry.userData.owned = true; mesh.castShadow = true; mesh.receiveShadow = true; return mesh; }
/** Blok tussen twee hoekpunten; `r` > 0 maakt de randen zacht afgerond (meubels). */
export function blok(ouder: Object3D, a: V3, b: V3, mat: Material, r = 0) {
  const [w, h, d] = [Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2])];
  const geo = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.1, h / 2.1, d / 2.1)) : new BoxGeometry(w, h, d);
  const mesh = eigen(new Mesh(geo, mat));
  mesh.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
  ouder.add(mesh);
  return mesh;
}
function cilinder(ouder: Object3D, [x, y, z]: V3, hoogte: number, rOnder: number, rBoven: number, mat: Material) {
  const mesh = eigen(new Mesh(new CylinderGeometry(rBoven, rOnder, hoogte, 28), mat));
  mesh.position.set(x, y + hoogte / 2, z);
  ouder.add(mesh);
  return mesh;
}
function bol(ouder: Object3D, [x, y, z]: V3, r: number, mat: Material, schaal: V3 = [1, 1, 1]) {
  const mesh = eigen(new Mesh(new SphereGeometry(r, 20, 14), mat));
  mesh.position.set(x, y, z); mesh.scale.set(...schaal);
  ouder.add(mesh);
  return mesh;
}
function plant(g: Object3D, mat: Materialen, [x, y, z]: V3, h = 1) {
  cilinder(g, [x, y, z], 0.32 * h, 0.13 * h, 0.17 * h, mat.pot);
  bol(g, [x, y + 0.62 * h, z], 0.26 * h, mat.blad, [1, 1.35, 1]);
  bol(g, [x + 0.12 * h, y + 0.48 * h, z + 0.08 * h], 0.2 * h, mat.bladLicht);
  bol(g, [x - 0.1 * h, y + 0.8 * h, z - 0.06 * h], 0.17 * h, mat.bladLicht);
}
function lamp(g: Object3D, mat: Materialen, [x, y, z]: V3, hoogte: number) {
  cilinder(g, [x, y, z], 0.03, 0.16, 0.16, mat.antraciet);
  cilinder(g, [x, y, z], hoogte, 0.012, 0.012, mat.messing);
  cilinder(g, [x, y + hoogte - 0.05, z], 0.26, 0.2, 0.13, mat.kap);
}
function stoel(g: Object3D, mat: Materialen, [x, y, z]: V3, richting: 1 | -1) {
  blok(g, [x - 0.21, y + 0.44, z - 0.21], [x + 0.21, y + 0.49, z + 0.21], mat.eiken, 0.02);
  for (const [dx, dz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) blok(g, [x + dx - 0.02, y, z + dz - 0.02], [x + dx + 0.02, y + 0.44, z + dz + 0.02], mat.walnoot);
  blok(g, [x - 0.21, y + 0.49, z - 0.21 * richting - 0.02], [x + 0.21, y + 0.9, z - 0.21 * richting + 0.02], mat.eiken, 0.02);
}

// Grondblok (zoals een architectuurmaquette), afgesneden op dezelfde lijn als de woning.
export function bouwGrond(g: Group, mat: Materialen) {
  const xl = M.gevelLinks - 1.4, zv = M.gevelVoor + 2.4, za = M.gevelAchter - 1.6, bodem = -4.55, grasOnder = M.maaiveld - 0.12;
  blok(g, [xl, bodem, za], [M.open, M.kruipBodem, zv], mat.aarde);
  for (const [a, b] of [[[xl, M.kruipBodem, M.gevelVoor], [M.open, grasOnder, zv]], [[xl, M.kruipBodem, za], [M.open, grasOnder, M.gevelAchter]], [[xl, M.kruipBodem, M.gevelAchter], [M.gevelLinks, grasOnder, M.gevelVoor]]] as [V3, V3][]) {
    blok(g, a, b, mat.aarde);
    blok(g, [a[0], grasOnder, a[2]], [b[0], M.maaiveld, b[2]], mat.gras);
  }
  // Funderingsbalken onder voor-, achter- en linkergevel; de kruipruimte ertussen, met een zandbodem.
  const eind = M.open - 0.002;
  blok(g, [M.gevelLinks, M.kruipBodem, M.voor - 0.08], [eind, M.vloerOnder, M.gevelVoor], mat.beton);
  blok(g, [M.gevelLinks, M.vloerOnder, M.voor + 0.12], [eind, M.maaiveld + 0.005, M.gevelVoor], mat.beton);
  blok(g, [M.gevelLinks, M.kruipBodem, M.gevelAchter], [eind, M.vloerOnder, M.achter + 0.08], mat.beton);
  blok(g, [M.gevelLinks, M.vloerOnder, M.gevelAchter], [eind, M.maaiveld + 0.005, M.achter - 0.12], mat.beton);
  blok(g, [M.gevelLinks, M.kruipBodem, M.achter + 0.08], [M.links + 0.08, M.vloerOnder, M.voor - 0.08], mat.beton);
  blok(g, [M.links + 0.08, M.kruipBodem, M.achter + 0.08], [eind, M.kruipBodem + 0.05, M.voor - 0.08], mat.zand);
}

// Afwerking en indeling per verdieping. Binnenmuren lopen tot precies de open gevel.
export function bouwInterieur(g: Group, mat: Materialen) {
  const x0 = M.links, x1 = M.open - 0.003;
  // Vloeren (hout, badkamer tegels) en plafonds.
  blok(g, [x0, M.bg, M.achter], [x1, M.bg + 0.012, M.voor], mat.hout);
  blok(g, [x0, M.v1, WAND_V1], [x1, M.v1 + 0.012, M.voor], mat.hout);
  blok(g, [x0, M.v1, M.achter], [x1, M.v1 + 0.012, WAND_V1], mat.tegel);
  blok(g, [x0, M.zolder, M.achter + 0.2], [x1, M.zolder + 0.012, M.voor - 0.2], mat.hout);
  blok(g, [x0, M.plafondBg - 0.012, M.achter], [x1, M.plafondBg, M.voor], mat.plafond);
  blok(g, [x0, M.plafondV1 - 0.012, M.achter], [x1, M.plafondV1, M.voor], mat.plafond);

  // Binnenmuren met een deuropening bij de linkermuur.
  const wand = (z: number, onder: number, boven: number) => {
    blok(g, [x0, onder, z - 0.05], [x0 + 0.12, boven, z + 0.05], mat.stuc);
    blok(g, [x0 + 1.02, onder, z - 0.05], [x1, boven, z + 0.05], mat.stuc);
    blok(g, [x0 + 0.12, onder + 2.1, z - 0.05], [x0 + 1.02, boven, z + 0.05], mat.stuc);
  };
  wand(WAND_BG, M.bg, M.plafondBg);
  wand(WAND_V1, M.v1, M.plafondV1);

  // Begane grond, woonkamer (voor).
  const y = M.bg + 0.012;
  blok(g, [-1.35, y, 0.05], [1.35, y + 0.012, 2.25], mat.kleed);
  blok(g, [-1.2, y, -0.93], [1.1, y + 0.42, -0.08], mat.stof, 0.06);
  blok(g, [-1.2, y + 0.38, -0.93], [1.1, y + 0.86, -0.72], mat.stof, 0.07);
  blok(g, [-1.38, y, -0.93], [-1.2, y + 0.62, -0.08], mat.stof, 0.06);
  blok(g, [1.1, y, -0.93], [1.28, y + 0.62, -0.08], mat.stof, 0.06);
  for (const [a, b] of [[-1.15, -0.4], [-0.38, 0.35], [0.37, 1.07]]) blok(g, [a, y + 0.42, -0.74], [b, y + 0.52, -0.1], mat.kussen, 0.05);
  blok(g, [0.55, y + 0.52, -0.72], [0.95, y + 0.8, -0.6], mat.stofDonker, 0.05);
  // Salontafel, fauteuil, dressoir, boekenkast, lamp en plant.
  blok(g, [-0.5, y + 0.34, 0.55], [0.5, y + 0.38, 1.15], mat.walnoot, 0.02);
  blok(g, [-0.44, y, 0.61], [0.44, y + 0.34, 1.09], mat.walnoot, 0.02);
  blok(g, [0.95, y, 1.55], [1.75, y + 0.4, 2.35], mat.stofDonker, 0.07);
  blok(g, [0.95, y + 0.36, 2.15], [1.75, y + 0.8, 2.35], mat.stofDonker, 0.07);
  blok(g, [-0.9, y, M.voor - 0.42], [0.6, y + 0.52, M.voor - 0.02], mat.walnoot, 0.02);
  blok(g, [x0, y, 0.2], [x0 + 0.36, y + 1.9, 1.9], mat.eiken, 0.01);
  for (let plank = 0; plank < 4; plank++) {
    const py = y + 0.2 + plank * 0.44;
    blok(g, [x0 + 0.34, py, 0.24], [x0 + 0.37, py + 0.02, 1.86], mat.walnoot);
    let z = 0.3;
    for (let i = 0; i < 7 && z < 1.75; i++) { const breed = 0.06 + ((i * 7 + plank * 3) % 4) * 0.02; blok(g, [x0 + 0.05, py + 0.02, z], [x0 + 0.3, py + 0.28 + (i % 3) * 0.04, z + breed], [mat.boek1, mat.boek2, mat.boek3, mat.boek4][(i + plank) % 4]); z += breed + 0.015; }
  }
  lamp(g, mat, [-1.7, y, -0.5], 1.5);
  plant(g, mat, [2.0, y, M.voor - 0.4], 1.2);
  plant(g, mat, [0.3, y + 0.52, M.voor - 0.22], 0.45);

  // Begane grond, keuken (achter).
  blok(g, [x0, y, M.achter + 0.05], [x0 + 0.62, y + 0.86, WAND_BG - 0.25], mat.wit, 0.01);
  blok(g, [x0, y + 0.86, M.achter + 0.05], [x0 + 0.65, y + 0.9, WAND_BG - 0.25], mat.antraciet);
  blok(g, [x0, y + 1.45, M.achter + 0.05], [x0 + 0.36, y + 2.15, WAND_BG - 0.25], mat.wit, 0.01);
  cilinder(g, [x0 + 0.3, y + 0.9, -2.2], 0.28, 0.012, 0.012, mat.messing);
  blok(g, [-0.35, y + 0.72, -2.75], [1.15, y + 0.76, -1.85], mat.eiken, 0.015);
  for (const [dx, dz] of [[-0.3, -2.7], [1.1, -2.7], [-0.3, -1.9], [1.1, -1.9]]) blok(g, [dx - 0.03, y, dz - 0.03], [dx + 0.03, y + 0.72, dz + 0.03], mat.walnoot);
  stoel(g, mat, [0.05, y, -3.05], 1); stoel(g, mat, [0.75, y, -3.05], 1);
  stoel(g, mat, [0.05, y, -1.55], -1); stoel(g, mat, [0.75, y, -1.55], -1);
  cilinder(g, [0.4, M.plafondBg - 0.62, -2.3], 0.6, 0.006, 0.006, mat.zwart);
  cilinder(g, [0.4, M.plafondBg - 0.8, -2.3], 0.2, 0.24, 0.1, mat.antraciet);
  plant(g, mat, [0.4, y + 0.76, -2.3], 0.35);

  // Verdieping, slaapkamer (voor).
  const v = M.v1 + 0.012;
  blok(g, [0.4, v, 2.1], [2.2, v + 0.012, 3.3], mat.kleedGrijs);
  blok(g, [x0 + 0.02, v, 1.15], [x0 + 0.1, v + 1.05, 2.95], mat.stofDonker, 0.03);
  blok(g, [x0 + 0.1, v, 1.2], [-0.25, v + 0.32, 2.9], mat.eiken, 0.03);
  blok(g, [x0 + 0.14, v + 0.32, 1.24], [-0.3, v + 0.55, 2.86], mat.beddengoed, 0.06);
  blok(g, [-1.55, v + 0.5, 1.22], [-0.28, v + 0.6, 2.88], mat.kussen, 0.05);
  blok(g, [-0.85, v + 0.52, 1.22], [-0.3, v + 0.64, 2.88], mat.plaid, 0.05);
  blok(g, [x0 + 0.2, v + 0.55, 1.35], [x0 + 0.62, v + 0.72, 1.95], mat.beddengoed, 0.07);
  blok(g, [x0 + 0.2, v + 0.55, 2.1], [x0 + 0.62, v + 0.72, 2.7], mat.beddengoed, 0.07);
  for (const z of [0.72, 3.02]) {
    blok(g, [x0 + 0.02, v, z], [x0 + 0.47, v + 0.5, z + 0.42], mat.walnoot, 0.02);
    lamp(g, mat, [x0 + 0.24, v + 0.5, z + 0.21], 0.32);
  }
  blok(g, [0.35, v, WAND_V1 + 0.06], [2.1, v + 2.1, WAND_V1 + 0.66], mat.wit, 0.01);
  for (const x of [0.93, 1.52]) blok(g, [x - 0.004, v + 0.05, WAND_V1 + 0.665], [x + 0.004, v + 2.05, WAND_V1 + 0.67], mat.stofDonker);
  plant(g, mat, [2.05, v, M.voor - 0.35], 0.9);

  // Verdieping, badkamer (achter).
  blok(g, [x0 + 0.02, v, M.achter + 0.02], [-0.6, v + 0.56, M.achter + 0.8], mat.sanitair, 0.05);
  blok(g, [x0 + 0.1, v + 0.4, M.achter + 0.1], [-0.68, v + 0.5, M.achter + 0.72], mat.tegel, 0.03);
  blok(g, [x0, v + 0.45, -1.7], [x0 + 0.5, v + 0.85, -0.7], mat.walnoot, 0.02);
  blok(g, [x0, v + 0.85, -1.72], [x0 + 0.52, v + 0.89, -0.68], mat.sanitair, 0.01);
  blok(g, [x0 + 0.003, v + 1.2, -1.6], [x0 + 0.02, v + 2.0, -0.8], mat.spiegel);
  blok(g, [x0, v, -0.45], [x0 + 0.62, v + 0.42, -0.08], mat.sanitair, 0.08);
  blok(g, [x0, v + 0.42, -0.45], [x0 + 0.18, v + 0.8, -0.08], mat.sanitair, 0.04);
  plant(g, mat, [1.9, v, M.achter + 0.4], 0.6);

  // Zolder: werkplek onder de dakkapel.
  const z = M.zolder + 0.012;
  blok(g, [-1.4, z, 0.4], [1.4, z + 0.012, 2.3], mat.kleed);
  blok(g, [-0.75, z + 0.72, 1.2], [0.75, z + 0.76, 1.85], mat.eiken, 0.015);
  for (const [dx, dz] of [[-0.7, 1.25], [0.7, 1.25], [-0.7, 1.8], [0.7, 1.8]]) blok(g, [dx - 0.025, z, dz - 0.025], [dx + 0.025, z + 0.72, dz + 0.025], mat.walnoot);
  blok(g, [-0.3, z + 0.76, 1.35], [0.12, z + 0.775, 1.65], mat.antraciet, 0.005);
  lamp(g, mat, [0.52, z + 0.76, 1.6], 0.42);
  cilinder(g, [0.0, z, 0.75], 0.42, 0.04, 0.04, mat.antraciet);
  blok(g, [-0.24, z + 0.42, 0.52], [0.24, z + 0.5, 0.98], mat.zwart, 0.04);
  blok(g, [-0.24, z + 0.5, 0.52], [0.24, z + 1.05, 0.58], mat.zwart, 0.04);
  blok(g, [-1.6, z, -2.55], [1.6, z + 0.55, -2.2], mat.eiken, 0.01);
  plant(g, mat, [-1.4, z, 1.9], 0.9);
  plant(g, mat, [1.2, z + 0.55, -2.38], 0.4);
}

export function maakCutaway(scene: Object3D) {
  const weg = (o: Object3D) => { disposeHouse(o); o.removeFromParent(); };
  // De complete rechter kopgevel (met zijramen en regenpijpen), de buurwoning en de oude, massieve fundering.
  for (const o of [...scene.children]) {
    if (/^(Buitengevel_rechts|Spouwisolatie_rechts|Binnenmuur_rechts|Regenpijpen|Buurwoning|Fundering)/.test(o.name)) { weg(o); continue; }
    if (/^Raam/.test(o.name) && o.position.x > 2) weg(o);
  }
  // Losse zijramen die als kind van een groep bestaan, en het plintdeel langs de weggehaalde gevel.
  for (const naam of ["Raam_rechts_01", "Raam_rechts_02", "Raam_rechts_03", "Raam_rechts_zolder"]) { const o = scene.getObjectByName(naam); if (o) weg(o); }
  scene.getObjectByName("Plinten")?.traverse(part => {
    const mesh = part as Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.computeBoundingBox();
    const b = mesh.geometry.boundingBox!;
    if (b.max.z - b.min.z > 3 && b.min.x > 2.2) mesh.visible = false;
  });
  // Warmtepomp tegen de achtergevel (rechts van de achterdeur, bij de open kant), zodat hij niet voor de open kant staat.
  const pomp = scene.getObjectByName("Warmtepomp_DeWarmte");
  if (pomp) {
    scene.updateMatrixWorld(true);
    const b = new Box3().setFromObject(pomp);
    pomp.position.z += M.gevelAchter - 0.1 - b.max.z / scene.scale.z;
    pomp.position.x += 2.28 - (b.min.x + b.max.x) / 2 / scene.scale.x;
  }
  // Alle isolatie (dak, spouw, vloer) in één herkenbare gele isolatiekleur.
  for (const o of scene.children) {
    if (!/^(Dakisolatie|Spouwisolatie_|Vloerisolatie)/.test(o.name)) continue;
    o.traverse(part => {
      const mesh = part as Mesh;
      if (mesh.isMesh) for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) if (m.isMeshStandardMaterial) { m.map = null; m.color.set("#e2c46f"); m.needsUpdate = true; }
    });
  }
  // Binnenkant van de buitenmuren als gestucte wanden.
  for (const naam of ["Binnenmuur_voor", "Binnenmuur_achter", "Bouwmuur_links"]) {
    scene.getObjectByName(naam)?.traverse(part => {
      const mesh = part as Mesh;
      if (!mesh.isMesh) return;
      for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) { if (!m.isMeshStandardMaterial) continue; m.map = null; m.color.set("#e4ded4"); m.roughness = 0.95; m.needsUpdate = true; }
    });
  }
  const texturen = maakTexturen();
  const mat = maakMaterialen(texturen);
  const grond = new Group(); grond.name = "Maquette_grond";
  const interieur = new Group(); interieur.name = "Interieur";
  bouwGrond(grond, mat);
  bouwInterieur(interieur, mat);
  scene.add(grond, interieur);
  return Object.values(texturen) as Texture[];
}
