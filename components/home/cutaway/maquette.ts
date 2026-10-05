import { Box3, BoxGeometry, CanvasTexture, CylinderGeometry, Group, Mesh, MeshStandardMaterial, Raycaster, RepeatWrapping, SphereGeometry, SRGBColorSpace, Vector3, type BufferGeometry, type Material, type Object3D, type Texture } from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { disposeHouse } from "@/lib/house-model";
import { bestratingTextuur, klinkerTextuur } from "@/lib/house-realism";

// Bouwstenen voor de poppenhuis-doorsnede (PROTOTYPE, branch homepage-cutaway-test):
// grondblok met kruipruimte, tuin en terras, en verdiepingen ingedeeld zoals in een
// Nederlandse rijwoning.
// Alle maten in meters, in de coördinaten van public/models/woning/gijs-hoekwoning.glb
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
/** Binnenmuur op de verdieping tussen slaapkamer (voor) en badkamer (achter). */
const WAND_V1 = 0.25;

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
    stuc: textuur((c, s) => { c.fillStyle = "#e7e2d9"; c.fillRect(0, 0, s, s); ruis(c, s, ["#ddd7cd", "#efebe4", "#d9d3c8"], 5200, 2); }, [3, 3]),
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
    stuc: m("#ffffff", { map: t.stuc, roughness: 0.95 }),
    plafond: m("#f7f4ee", { map: t.stuc, roughness: 0.95 }),
    stof: m("#b3aa9d", { roughness: 1 }),
    stofDonker: m("#8d857a", { roughness: 1 }),
    kussen: m("#e7e1d6", { roughness: 1 }),
    beddengoed: m("#f3f0ea", { roughness: 1 }),
    plaid: m("#c9b79c", { roughness: 1 }),
    walnoot: m("#5b4331", { roughness: 0.6 }),
    eiken: m("#b08a63", { roughness: 0.65 }),
    vuren: m("#c9a47a", { roughness: 0.8 }),
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
    glas: m("#dde8ea", { roughness: 0.05, transparent: true, opacity: 0.28 }),
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

type Strook = { x0: number; x1: number };
type Radiator = { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number };
type Gording = { x0: number; x1: number; z: number; y: number; breed: number; hoog: number };

/**
 * Textuurherhaling in de UV's van één blok zetten in plaats van in een eigen textuurkloon
 * (texture.repeat doet uv * repeat; offset is overal 0, dus het beeld is identiek). Zo kunnen
 * alle blokken met dezelfde textuur één materiaal delen en samengevoegd worden (voegSamen).
 */
function herhaalUv(geo: BufferGeometry, u: number, v: number) {
  const uv = geo.getAttribute("uv");
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * u, uv.getY(i) * v);
  uv.needsUpdate = true;
}

/** Bestrating met eigen herhaling, zodat klinkers en tegels overal even groot zijn. */
function bestrating(g: Group, materiaal: Material, a: V3, b: V3, tegelMaat: [number, number]) {
  const mesh = blok(g, a, b, materiaal);
  herhaalUv(mesh.geometry, Math.abs(b[0] - a[0]) / tegelMaat[0], Math.abs(b[2] - a[2]) / tegelMaat[1]);
}

/**
 * Voegt alle losse, statische maquette-meshes in `groep` met hetzelfde materiaal samen tot één mesh
 * (zelfde vertexposities, normalen en UV's, alleen in groepscoördinaten). Scheelt per frame honderden
 * draw calls, in de hoofdpass én in elke schaduwpass. Alleen voor onderdelen die niet los bewegen,
 * oplichten of verdwijnen: niets in Interieur of Maquette_grond wordt los geanimeerd. Doorzichtige
 * materialen (glas) blijven los, zodat three.js ze per stuk op diepte blijft sorteren.
 */
function voegSamen(groep: Group) {
  const perMateriaal = new Map<Material, Mesh[]>();
  for (const kind of groep.children) {
    const mesh = kind as Mesh;
    if (!mesh.isMesh || Array.isArray(mesh.material) || mesh.material.transparent || mesh.children.length) continue;
    const lijst = perMateriaal.get(mesh.material) ?? [];
    lijst.push(mesh);
    perMateriaal.set(mesh.material, lijst);
  }
  for (const [materiaal, meshes] of perMateriaal) {
    if (meshes.length < 2) continue;
    // RoundedBoxGeometry is niet-geïndexeerd, Box/Cylinder/Sphere wel: bij een mix alles niet-geïndexeerd
    // maken (dezelfde driehoeken, alleen zonder gedeelde vertices), anders weigert mergeGeometries.
    const gemengd = meshes.some(m => m.geometry.index === null);
    const delen = meshes.map(m => {
      m.updateMatrix();
      const geo = gemengd && m.geometry.index !== null ? m.geometry.toNonIndexed() : m.geometry.clone();
      return geo.applyMatrix4(m.matrix);
    });
    const samen = mergeGeometries(delen, false);
    for (const d of delen) d.dispose();
    if (!samen) continue; // onverenigbare geometrie: dan blijven de losse meshes gewoon staan
    for (const m of meshes) { m.geometry.dispose(); m.removeFromParent(); }
    groep.add(eigen(new Mesh(samen, materiaal)));
  }
}

// Grondblok (zoals een architectuurmaquette) onder de woning én de buurwoning, afgesneden op
// dezelfde lijn als de open kopgevel. Voortuin met tegelpad naar elke voordeur en een stoep,
// achter een terras: zoals bij een Nederlandse rijwoning.
function bouwGrond(g: Group, mat: Materialen, deuren: Strook[], texturen: Texture[]) {
  const xl = -8.0, zv = M.gevelVoor + 2.6, za = M.gevelAchter - 1.8, bodem = -4.55, grasOnder = M.maaiveld - 0.12;
  blok(g, [xl, bodem, za], [M.open, M.kruipBodem, zv], mat.aarde);
  for (const [a, b] of [[[xl, M.kruipBodem, M.gevelVoor], [M.open, grasOnder, zv]], [[xl, M.kruipBodem, za], [M.open, grasOnder, M.gevelAchter]], [[xl, M.kruipBodem, M.gevelAchter], [M.gevelLinks, grasOnder, M.gevelVoor]]] as [V3, V3][]) {
    blok(g, a, b, mat.aarde);
    blok(g, [a[0], grasOnder, a[2]], [b[0], M.maaiveld, b[2]], mat.gras);
  }
  const klinkers = klinkerTextuur(), tegels = bestratingTextuur();
  texturen.push(klinkers, tegels);
  // Eén gedeeld materiaal per bestratingsoort; de herhaling per strook zit in de UV's (herhaalUv).
  const klinkerMat = new MeshStandardMaterial({ map: klinkers, roughness: 0.95, metalness: 0 });
  const tegelMat = new MeshStandardMaterial({ map: tegels, roughness: 0.95, metalness: 0 });
  const onder = M.maaiveld - 0.02, boven = M.maaiveld + 0.015, stoep = zv - 1.2;
  bestrating(g, klinkerMat, [xl, onder, stoep], [M.open, boven, zv], [3.2, 3.2]);
  for (const d of deuren) bestrating(g, klinkerMat, [d.x0 - 0.1, onder, M.gevelVoor], [d.x1 + 0.1, boven, stoep], [3.2, 3.2]);
  bestrating(g, tegelMat, [M.gevelLinks, onder, M.gevelAchter - 1.4], [M.open, boven, M.gevelAchter], [12.8, 3.2]);

  // Funderingsbalken onder voor-, achter- en linkergevel; de kruipruimte ertussen, met een zandbodem.
  const eind = M.open - 0.002;
  blok(g, [M.gevelLinks, M.kruipBodem, M.voor - 0.08], [eind, M.vloerOnder, M.gevelVoor], mat.beton);
  blok(g, [M.gevelLinks, M.vloerOnder, M.voor + 0.12], [eind, M.maaiveld + 0.005, M.gevelVoor], mat.beton);
  blok(g, [M.gevelLinks, M.kruipBodem, M.gevelAchter], [eind, M.vloerOnder, M.achter + 0.08], mat.beton);
  blok(g, [M.gevelLinks, M.vloerOnder, M.gevelAchter], [eind, M.maaiveld + 0.005, M.achter - 0.12], mat.beton);
  blok(g, [M.gevelLinks, M.kruipBodem, M.achter + 0.08], [M.links + 0.08, M.vloerOnder, M.voor - 0.08], mat.beton);
  blok(g, [M.links + 0.08, M.kruipBodem, M.achter + 0.08], [eind, M.kruipBodem + 0.05, M.voor - 0.08], mat.zand);
}

/** Rechte trap tegen de woningscheidende muur: eiken treden, witte stootborden, trapbomen en leuning. */
function trap(g: Group, mat: Materialen, x0: number, x1: number, zOnder: number, yOnder: number, yBoven: number, treden: number) {
  const stijg = (yBoven - yOnder) / treden, aantrede = 0.235;
  for (let i = 0; i < treden - 1; i++) {
    const top = yOnder + (i + 1) * stijg, z = zOnder + i * aantrede;
    blok(g, [x0 + 0.04, top - stijg + 0.04, z - 0.012], [x1 - 0.05, top - 0.04, z + 0.006], mat.wit);
    blok(g, [x0 + 0.04, top - 0.04, z - 0.02], [x1 - 0.03, top, z + aantrede + 0.02], mat.eiken, 0.006);
  }
  const lengte = (treden - 1) * aantrede, hoogte = (treden - 1) * stijg;
  const hoek = Math.atan2(hoogte, lengte), l = Math.hypot(lengte, hoogte);
  const schuin = (x: number, dikte: number, hoog: number, dy: number, m: Material) => {
    const deel = blok(g, [-dikte / 2, -hoog / 2, -l / 2], [dikte / 2, hoog / 2, l / 2], m);
    deel.position.set(x, yOnder + hoogte / 2 + dy, zOnder + lengte / 2);
    deel.rotation.x = -hoek;
  };
  schuin(x1 - 0.025, 0.05, 0.28, -0.06, mat.wit);
  schuin(x0 + 0.02, 0.04, 0.28, -0.06, mat.wit);
  schuin(x1 - 0.02, 0.05, 0.05, 0.92, mat.eiken);
  for (let i = 1; i < treden - 1; i += 2) {
    const top = yOnder + (i + 1) * stijg, z = zOnder + i * aantrede + aantrede / 2;
    blok(g, [x1 - 0.04, top, z - 0.015], [x1 - 0.01, top + 0.9, z + 0.015], mat.wit);
  }
}

function radiator(g: Group, mat: Materialen, r: Radiator) {
  blok(g, [r.x0, r.y0, r.z0], [r.x1, r.y1, r.z1], mat.wit, 0.01);
  for (let x = r.x0 + 0.05; x < r.x1 - 0.03; x += 0.06) blok(g, [x, r.y0 + 0.02, r.z0 - 0.003], [x + 0.012, r.y1 - 0.02, r.z1 + 0.003], mat.stuc);
}

// Indeling zoals in een Nederlandse rijwoning. Binnenmuren lopen tot precies de open gevel.
// Begane grond: open trap tegen de woningscheidende muur, woonkamer voor, open keuken achter.
// Verdieping: overloopwand met deuren, slaapkamer voor, badkamer achter.
// Zolder: werkplek onder de dakkapel, wasmachine met droger en het boilervat van de warmtepomp.
function bouwInterieur(g: Group, mat: Materialen, radiatoren: Radiator[], vensterbanken: Radiator[], gordingen: Gording[], tegels: (a: V3, b: V3) => void) {
  const x0 = M.links, x1 = M.open - 0.003;
  const overloop = -1.45; // wand tussen overloop (met trapgat) en de kamers op de verdieping
  // Vloeren en plafonds.
  blok(g, [x0, M.bg, M.achter], [x1, M.bg + 0.012, M.voor], mat.hout);
  blok(g, [x0, M.v1, M.achter], [x1, M.v1 + 0.012, M.voor], mat.hout);
  blok(g, [overloop, M.v1 + 0.012, M.achter], [x1, M.v1 + 0.016, WAND_V1], mat.tegel);
  blok(g, [x0, M.zolder, M.achter + 0.2], [x1, M.zolder + 0.012, M.voor - 0.2], mat.hout);
  blok(g, [x0, M.plafondBg - 0.012, M.achter], [x1, M.plafondBg, M.voor], mat.plafond);
  blok(g, [x0, M.plafondV1 - 0.012, M.achter], [x1, M.plafondV1, M.voor], mat.plafond);
  for (const r of radiatoren) radiator(g, mat, r);
  for (const b of vensterbanken) blok(g, [b.x0, b.y0, b.z0], [b.x1, b.y1, b.z1], mat.wit, 0.005);
  // Kapconstructie: gordingen en nokbalk, van de linker kopgevel tot aan de doorsnede.
  for (const d of gordingen) blok(g, [d.x0, d.y - d.hoog, d.z - d.breed / 2], [d.x1, d.y, d.z + d.breed / 2], mat.vuren);
  // Plinten langs de wanden, per verdieping.
  for (const [vloer, van] of [[M.bg, x0], [M.v1, overloop + 0.1]] as [number, number][]) {
    blok(g, [van, vloer, M.voor - 0.012], [x1, vloer + 0.08, M.voor], mat.wit);
    blok(g, [van, vloer, M.achter], [x1, vloer + 0.08, M.achter + 0.012], mat.wit);
  }

  // Begane grond: trap, keuken, eettafel, zithoek.
  const y = M.bg + 0.012;
  trap(g, mat, x0, x0 + 0.88, -0.95, y, M.v1 + 0.012, 14);
  blok(g, [x0, y, M.achter + 0.05], [x0 + 0.62, y + 0.86, -1.36], mat.wit, 0.01);
  blok(g, [x0, y + 0.86, M.achter + 0.05], [x0 + 0.65, y + 0.9, -1.36], mat.antraciet);
  blok(g, [x0, y + 1.45, M.achter + 0.05], [x0 + 0.36, y + 2.15, -1.36], mat.wit, 0.01);
  blok(g, [x0, y, -1.34], [x0 + 0.66, y + 2.1, -1.0], mat.wit, 0.01);
  cilinder(g, [x0 + 0.3, y + 0.9, -2.3], 0.28, 0.012, 0.012, mat.messing);
  // Keuken: spoelbak, inductiekookplaat, oven, grepen en tegels tussen aanrecht en bovenkasten.
  blok(g, [x0 + 0.12, y + 0.884, -2.6], [x0 + 0.5, y + 0.904, -2.05], mat.antraciet, 0.01);
  blok(g, [x0 + 0.08, y + 0.9, -3.3], [x0 + 0.56, y + 0.906, -2.75], mat.zwart, 0.005);
  blok(g, [x0 + 0.62, y + 0.25, -3.28], [x0 + 0.626, y + 0.78, -2.77], mat.zwart);
  for (let zg = M.achter + 0.35; zg < -1.5; zg += 0.6) blok(g, [x0 + 0.62, y + 0.8, zg - 0.12], [x0 + 0.635, y + 0.815, zg + 0.12], mat.messing);
  tegels([x0, y + 0.9, M.achter + 0.05], [x0 + 0.008, y + 1.45, -1.36]);
  blok(g, [-0.35, y + 0.72, -2.75], [1.15, y + 0.76, -1.85], mat.eiken, 0.015);
  for (const [dx, dz] of [[-0.3, -2.7], [1.1, -2.7], [-0.3, -1.9], [1.1, -1.9]]) blok(g, [dx - 0.03, y, dz - 0.03], [dx + 0.03, y + 0.72, dz + 0.03], mat.walnoot);
  stoel(g, mat, [0.05, y, -3.05], 1); stoel(g, mat, [0.75, y, -3.05], 1);
  stoel(g, mat, [0.05, y, -1.55], -1); stoel(g, mat, [0.75, y, -1.55], -1);
  cilinder(g, [0.4, M.plafondBg - 0.62, -2.3], 0.6, 0.006, 0.006, mat.zwart);
  cilinder(g, [0.4, M.plafondBg - 0.8, -2.3], 0.2, 0.24, 0.1, mat.antraciet);
  plant(g, mat, [0.4, y + 0.76, -2.3], 0.35);
  // Zithoek: bank met de rug naar de keuken, kijkend naar de voorgevel.
  blok(g, [-0.95, y, 0.35], [2.05, y + 0.012, 2.6], mat.kleed);
  blok(g, [-0.85, y, -0.25], [1.35, y + 0.42, 0.6], mat.stof, 0.06);
  blok(g, [-0.85, y + 0.38, -0.25], [1.35, y + 0.86, -0.05], mat.stof, 0.07);
  blok(g, [-1.03, y, -0.25], [-0.85, y + 0.62, 0.6], mat.stof, 0.06);
  blok(g, [1.35, y, -0.25], [1.53, y + 0.62, 0.6], mat.stof, 0.06);
  for (const [a, b] of [[-0.8, -0.08], [-0.06, 0.64], [0.66, 1.3]]) blok(g, [a, y + 0.42, -0.06], [b, y + 0.52, 0.56], mat.kussen, 0.05);
  blok(g, [-0.1, y + 0.34, 1.15], [0.9, y + 0.38, 1.75], mat.walnoot, 0.02);
  blok(g, [-0.04, y, 1.21], [0.84, y + 0.34, 1.69], mat.walnoot, 0.02);
  // Fauteuil bij het raam (niet voor de trapkast, waar de thuisbatterij staat).
  blok(g, [0.25, y, 2.45], [0.95, y + 0.4, 3.1], mat.stofDonker, 0.07);
  blok(g, [0.25, y + 0.36, 2.92], [0.95, y + 0.8, 3.1], mat.stofDonker, 0.07);
  lamp(g, mat, [1.8, y, 0.05], 1.5);
  plant(g, mat, [2.05, y, M.voor - 0.45], 1.2);

  // Verdieping: overloopwand met twee deuropeningen, binnenmuur tussen slaapkamer en badkamer.
  const v = M.v1 + 0.012;
  const wandX = (za: number, zb: number) => blok(g, [overloop, v, za], [overloop + 0.1, M.plafondV1, zb], mat.stuc);
  wandX(M.achter, -0.85); wandX(0.05, 2.5); wandX(3.35, M.voor);
  for (const [za, zb] of [[-0.85, 0.05], [2.5, 3.35]]) blok(g, [overloop, v + 2.1, za], [overloop + 0.1, M.plafondV1, zb], mat.stuc);
  blok(g, [overloop + 0.1, v, WAND_V1 - 0.05], [x1, M.plafondV1, WAND_V1 + 0.05], mat.stuc);
  // Binnendeuren (dicht) met een wit kozijn en een deurkruk aan de kamerzijde.
  for (const [za, zb] of [[-0.85, 0.05], [2.5, 3.35]]) {
    blok(g, [overloop - 0.01, v, za], [overloop + 0.115, v + 2.14, za + 0.05], mat.wit);
    blok(g, [overloop - 0.01, v, zb - 0.05], [overloop + 0.115, v + 2.14, zb], mat.wit);
    blok(g, [overloop - 0.01, v + 2.09, za], [overloop + 0.115, v + 2.14, zb], mat.wit);
    blok(g, [overloop + 0.03, v + 0.01, za + 0.05], [overloop + 0.07, v + 2.09, zb - 0.05], mat.wit, 0.005);
    blok(g, [overloop + 0.07, v + 1.02, zb - 0.2], [overloop + 0.1, v + 1.04, zb - 0.08], mat.messing);
  }
  // Slaapkamer.
  const k = overloop + 0.1;
  blok(g, [0.85, v, 1.1], [2.25, v + 0.012, 2.9], mat.kleedGrijs);
  blok(g, [k, v, 0.8], [k + 0.08, v + 1.05, 2.5], mat.stofDonker, 0.03);
  blok(g, [k + 0.08, v, 0.85], [k + 2.1, v + 0.32, 2.45], mat.eiken, 0.03);
  blok(g, [k + 0.12, v + 0.32, 0.89], [k + 2.06, v + 0.55, 2.41], mat.beddengoed, 0.06);
  blok(g, [k + 0.75, v + 0.5, 0.87], [k + 2.08, v + 0.6, 2.43], mat.kussen, 0.05);
  blok(g, [k + 1.45, v + 0.52, 0.87], [k + 2.07, v + 0.64, 2.43], mat.plaid, 0.05);
  blok(g, [k + 0.18, v + 0.55, 1.0], [k + 0.6, v + 0.72, 1.6], mat.beddengoed, 0.07);
  blok(g, [k + 0.18, v + 0.55, 1.7], [k + 0.6, v + 0.72, 2.3], mat.beddengoed, 0.07);
  blok(g, [k + 0.02, v, WAND_V1 + 0.08], [k + 0.47, v + 0.5, 0.7], mat.walnoot, 0.02);
  lamp(g, mat, [k + 0.24, v + 0.5, 0.49], 0.32);
  blok(g, [1.15, v, WAND_V1 + 0.06], [2.4, v + 2.1, WAND_V1 + 0.66], mat.wit, 0.01);
  for (const x of [1.57, 1.99]) blok(g, [x - 0.004, v + 0.05, WAND_V1 + 0.665], [x + 0.004, v + 2.05, WAND_V1 + 0.67], mat.stofDonker);
  plant(g, mat, [2.1, v, M.voor - 0.4], 0.9);
  // Badkamer: tegelwand, bad, douche met glazen wand, toilet en wastafelmeubel.
  tegels([k, v, M.achter], [x1, v + 1.9, M.achter + 0.008]);
  blok(g, [k + 0.02, v, M.achter + 0.02], [k + 1.72, v + 0.56, M.achter + 0.78], mat.sanitair, 0.05);
  blok(g, [k + 0.1, v + 0.4, M.achter + 0.1], [k + 1.64, v + 0.5, M.achter + 0.7], mat.tegel, 0.03);
  blok(g, [1.5, v, M.achter + 0.02], [2.45, v + 0.05, -2.62], mat.sanitair, 0.01);
  blok(g, [1.5, v + 0.05, -2.64], [2.45, v + 2.0, -2.61], mat.glas);
  blok(g, [1.47, v + 0.05, M.achter + 0.02], [1.5, v + 2.0, -2.61], mat.glas);
  blok(g, [2.0, v + 1.6, M.achter + 0.03], [2.3, v + 1.63, M.achter + 0.3], mat.messing);
  blok(g, [k + 0.02, v, -2.2], [k + 0.64, v + 0.42, -1.82], mat.sanitair, 0.08);
  blok(g, [k, v + 0.42, -2.2], [k + 0.18, v + 0.8, -1.82], mat.sanitair, 0.04);
  blok(g, [0.3, v + 0.45, -0.33], [1.3, v + 0.85, WAND_V1 - 0.05], mat.walnoot, 0.02);
  blok(g, [0.28, v + 0.85, -0.35], [1.32, v + 0.89, WAND_V1 - 0.05], mat.sanitair, 0.01);
  blok(g, [0.4, v + 1.2, WAND_V1 - 0.07], [1.2, v + 1.95, WAND_V1 - 0.05], mat.spiegel);
  plant(g, mat, [2.1, v, -0.25], 0.6);

  // Zolder: werkplek onder de dakkapel, was- en droogtoren, boilervat van de warmtepomp.
  const z = M.zolder + 0.012;
  blok(g, [-1.4, z, 0.4], [1.4, z + 0.012, 2.3], mat.kleed);
  blok(g, [-0.75, z + 0.72, 1.2], [0.75, z + 0.76, 1.85], mat.eiken, 0.015);
  for (const [dx, dz] of [[-0.7, 1.25], [0.7, 1.25], [-0.7, 1.8], [0.7, 1.8]]) blok(g, [dx - 0.025, z, dz - 0.025], [dx + 0.025, z + 0.72, dz + 0.025], mat.walnoot);
  blok(g, [-0.3, z + 0.76, 1.35], [0.12, z + 0.775, 1.65], mat.antraciet, 0.005);
  lamp(g, mat, [0.52, z + 0.76, 1.6], 0.42);
  cilinder(g, [0.0, z, 0.75], 0.42, 0.04, 0.04, mat.antraciet);
  blok(g, [-0.24, z + 0.42, 0.52], [0.24, z + 0.5, 0.98], mat.zwart, 0.04);
  blok(g, [-0.24, z + 0.5, 0.52], [0.24, z + 1.05, 0.58], mat.zwart, 0.04);
  for (const [onder, boven] of [[0, 0.85], [0.86, 1.7]]) {
    blok(g, [1.55, z + onder, -1.3], [2.15, z + boven, -0.7], mat.wit, 0.02);
    const deur = cilinder(g, [0, 0, 0], 0.02, 0.19, 0.19, mat.antraciet);
    deur.rotation.z = Math.PI / 2;
    deur.position.set(2.16, z + (onder + boven) / 2, -1.0);
  }
  cilinder(g, [0.85, z, -1.0], 1.6, 0.28, 0.28, mat.wit);
  cilinder(g, [0.85, z + 1.6, -1.0], 0.04, 0.2, 0.05, mat.stuc);
  blok(g, [-1.6, z, -2.55], [0.2, z + 0.55, -2.2], mat.eiken, 0.01);
  plant(g, mat, [-1.4, z, 1.9], 0.9);
}

export function maakCutaway(scene: Object3D) {
  const weg = (o: Object3D) => { disposeHouse(o); o.removeFromParent(); };
  const texturen = maakTexturen();
  const mat = maakMaterialen(texturen);
  const extra: Texture[] = [];
  // De oude, massieve fundering verdwijnt (funderingsbalken en kruipruimte nemen het over).
  for (const o of [...scene.children]) if (/^Fundering/.test(o.name)) weg(o);
  scene.updateMatrixWorld(true);
  const lokaal = (o: Object3D) => { const b = new Box3().setFromObject(o); b.min.divide(scene.scale); b.max.divide(scene.scale); return b; };

  // Warmtepomp op de vrije strook van de achtergevel (tussen het grote raam en de achterdeur,
  // waar de thuisbatterij stond). De thuisbatterij gaat naar binnen, in de trapkast. Een
  // kwartslag zodat de lange zijde tegen de gevel staat (zoals een echte buitenunit).
  const pomp = scene.getObjectByName("Warmtepomp_DeWarmte");
  const batterij = scene.getObjectByName("Thuisbatterij");
  if (pomp && batterij) {
    const vrij = lokaal(batterij);
    pomp.rotation.y += Math.PI / 2;
    scene.updateMatrixWorld(true);
    const p = lokaal(pomp);
    pomp.position.x += (vrij.min.x + vrij.max.x) / 2 - (p.min.x + p.max.x) / 2;
    pomp.position.z += M.gevelAchter - 0.06 - p.max.z;
    batterij.rotation.y -= Math.PI / 2;
    scene.updateMatrixWorld(true);
    const b = lokaal(batterij);
    batterij.position.x += M.links + 0.07 - b.min.x;
    batterij.position.z += 1.15 - b.min.z;
    batterij.position.y += M.bg + 0.012 - b.min.y;
    scene.updateMatrixWorld(true);
  }

  // Radiatoren onder de ramen van begane grond en verdieping (op de plek van de echte ramen).
  const radiatoren: Radiator[] = [];
  const vensterbanken: Radiator[] = [];
  for (const o of scene.children) {
    if (!/^Raam_(voor|achter)/.test(o.name)) continue;
    const b = lokaal(o), voor = b.min.z > 0;
    const vloer = b.min.y < M.plafondBg ? M.bg : b.min.y < M.plafondV1 ? M.v1 : null;
    if (vloer === null) continue;
    const links = vloer === M.bg ? (voor ? M.links + 1.0 : M.links + 0.75) : -1.3;
    const r = { x0: Math.max(b.min.x + 0.1, links), x1: Math.min(b.max.x - 0.1, M.open - 0.08), y0: vloer + 0.16, y1: Math.min(vloer + 0.72, b.min.y - 0.08), z0: voor ? M.voor - 0.1 : M.achter + 0.03, z1: voor ? M.voor - 0.03 : M.achter + 0.1 };
    if (r.x1 - r.x0 > 0.4 && r.y1 - r.y0 > 0.25) radiatoren.push(r);
    // Vensterbank aan de binnenkant, alleen bij ramen met een borstwering.
    if (b.min.y > vloer + 0.3) vensterbanken.push({
      x0: Math.max(b.min.x - 0.03, M.links), x1: Math.min(b.max.x + 0.03, M.open - 0.005), y0: b.min.y - 0.03, y1: b.min.y,
      z0: voor ? M.voor - 0.2 : M.achter - 0.01, z1: voor ? M.voor + 0.01 : M.achter + 0.2,
    });
  }

  // Gordingen en nokbalk tegen de onderkant van de dakconstructie (gemeten met een straal omhoog),
  // onderbroken bij de dakkapel.
  const gordingen: Gording[] = [];
  const kap = scene.getObjectByName("Dakconstructie");
  const dakkapel = scene.getObjectByName("Dakkapel");
  const kapel = dakkapel ? lokaal(dakkapel) : null;
  if (kap) {
    const straal = new Raycaster();
    for (const [z, breed, hoog] of [[-1.8, 0.08, 0.2], [0, 0.1, 0.22], [1.8, 0.08, 0.2]]) {
      straal.set(new Vector3(-1.8, M.zolder + 0.2, z).multiply(scene.scale), new Vector3(0, 1, 0));
      const raak = straal.intersectObject(kap, true)[0];
      if (!raak) continue;
      const y = raak.point.y / scene.scale.y - 0.003;
      const stukken: [number, number][] = kapel && z > kapel.min.z && z < kapel.max.z ? [[M.links, kapel.min.x], [kapel.max.x, M.open - 0.003]] : [[M.links, M.open - 0.003]];
      for (const [x0, x1] of stukken) gordingen.push({ x0, x1, z, y, breed, hoog });
    }
  }
  // Wandtegels met een vaste tegelmaat (15 cm), ongeacht de grootte van het vlak. Eén gedeeld
  // materiaal (textuur zonder eigen herhaling); de herhaling per wand zit in de UV's (herhaalUv).
  const wandTegel = texturen.tegel.clone();
  wandTegel.repeat.set(1, 1);
  wandTegel.needsUpdate = true;
  extra.push(wandTegel);
  const wandTegelMat = new MeshStandardMaterial({ map: wandTegel, roughness: 0.35, metalness: 0 });
  const tegels = (grens: Group) => (a: V3, b: V3) => {
    const d = [Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2])];
    const dun = d.indexOf(Math.min(...d));
    const mesh = blok(grens, a, b, wandTegelMat);
    herhaalUv(mesh.geometry, (dun === 0 ? d[2] : d[0]) / 0.6, (dun === 1 ? d[2] : d[1]) / 0.6);
  };
  const deuren = [scene.getObjectByName("Voordeur"), ...scene.getObjectsByProperty("name", "buur_Voordeur")]
    .filter((d): d is Object3D => !!d).map(d => { const b = lokaal(d); return { x0: b.min.x, x1: b.max.x }; });

  // De complete rechter kopgevel (met zijramen, regenpijpen en het plintdeel) gaat in één groep,
  // zodat hij bij het scrollen in zijn geheel kan wegschuiven. Plus een funderingsbalk eronder,
  // die in de dichte stand de kruipruimte afsluit.
  const kopgevel = new Group(); kopgevel.name = "Kopgevel";
  scene.add(kopgevel);
  for (const o of [...scene.children]) {
    if (/^(Buitengevel_rechts|Spouwisolatie_rechts|Binnenmuur_rechts|Regenpijpen|Raam_rechts)/.test(o.name) || (/^Raam/.test(o.name) && o.position.x > 2)) kopgevel.attach(o);
  }
  const plintRechts: Mesh[] = [];
  scene.getObjectByName("Plinten")?.traverse(part => {
    const mesh = part as Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.computeBoundingBox();
    const b = mesh.geometry.boundingBox!;
    if (b.max.z - b.min.z > 3 && b.min.x > 2.2) plintRechts.push(mesh);
  });
  for (const mesh of plintRechts) kopgevel.attach(mesh);
  blok(kopgevel, [M.open, M.kruipBodem, M.gevelAchter], [-M.gevelLinks, M.maaiveld + 0.005, M.gevelVoor], mat.beton.clone());
  // Eigen, doorzichtig te maken materialen voor de kopgevel (andere onderdelen delen soms hetzelfde materiaal).
  const vervangen = new Set<Material>();
  const kopMaterialen: Material[] = [];
  kopgevel.traverse(part => {
    const mesh = part as Mesh;
    if (!mesh.isMesh) return;
    const lijst = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(m => {
      vervangen.add(m);
      const kopie = m.clone();
      kopie.userData.basisOpacity = kopie.opacity;
      kopie.transparent = true;
      kopMaterialen.push(kopie);
      return kopie;
    });
    mesh.material = Array.isArray(mesh.material) ? lijst : lijst[0];
  });
  const inGebruik = new Set<Material>();
  scene.traverse(part => { const mesh = part as Mesh; if (mesh.isMesh) for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) inGebruik.add(m); });
  for (const m of vervangen) if (!inGebruik.has(m)) m.dispose();

  // Zonnepanelen volledig zwart (full black), zoals Gijs ze plaatst.
  for (const o of scene.children) {
    if (!o.name.startsWith("Zonnepaneel")) continue;
    o.traverse(part => {
      const mesh = part as Mesh;
      if (mesh.isMesh) for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) if (m.isMeshStandardMaterial) { m.map = null; m.color.set("#15181c"); m.roughness = 0.32; m.metalness = 0.15; m.needsUpdate = true; }
    });
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
      for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) { if (!m.isMeshStandardMaterial) continue; m.map = texturen.stuc; m.color.set("#ffffff"); m.roughness = 0.95; m.needsUpdate = true; }
    });
  }
  const grond = new Group(); grond.name = "Maquette_grond";
  const interieur = new Group(); interieur.name = "Interieur";
  bouwGrond(grond, mat, deuren, extra);
  bouwInterieur(interieur, mat, radiatoren, vensterbanken, gordingen, tegels(interieur));
  // Statische maquette: per materiaal één mesh (de kopgevel en alle modelonderdelen blijven los).
  voegSamen(grond);
  voegSamen(interieur);
  scene.add(grond, interieur);
  return { texturen: [...(Object.values(texturen) as Texture[]), ...extra], kopgevel, kopMaterialen };
}

/** Kopgevel openen (0 = dicht, 1 = open): schuift naar buiten en vervaagt, daarna uit beeld. */
export function zetKopgevel(kopgevel: Object3D, materialen: Material[], open: number) {
  kopgevel.position.x = open * 2.2;
  kopgevel.visible = open < 0.995;
  for (const m of materialen) m.opacity = (m.userData.basisOpacity as number) * (1 - open);
}
