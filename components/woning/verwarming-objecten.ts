import { Box3, CylinderGeometry, Group, Mesh, MeshStandardMaterial, TorusGeometry, type BufferGeometry, type Object3D } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { disposeHouse } from "@/lib/house-model";
import { M, blok, type V3 } from "@/components/home/cutaway/maquette";

/**
 * Verwarming, meterkast en thuisbatterij in het poppenhuis. Elk toestel is een eigen groep, standaard
 * verborgen; HouseViewer laat hem verschijnen als de bewoner die verwarming kiest (userData.verwarming =
 * de optie uit VERWARMING_OPTIES).
 *
 * Alles wordt getekend in "d-coördinaten": d = afstand vanaf de dichte zijmuur (buren of garage, waar de
 * trap tegenaan staat) richting de doorsnede. De groep zet dat om naar het model (position.x = xw,
 * scale.x = r), zodat dezelfde opzet werkt voor de rijwoning en (gespiegeld) de vrijstaande modellen.
 */
export type Indeling = {
  /** x van de binnenkant van de dichte zijmuur, en de richting naar de doorsnede (+1 of -1). */
  xw: number; r: 1 | -1;
  /** Binnenbreedte (d van muur tot doorsnede). */
  D: number;
  voor: number; achter: number; gevelVoor: number;
  bg: number; plafondBg: number; v1: number; plafondV1: number; zolder: number; vloerOnder: number;
  /** Plek van de kachel (d, z) en de luchtverwarming op de achtermuur (d van/tot, vrij van ramen en deur). */
  kachel: [number, number]; lucht: [number, number];
  /** Onderkant van de trap (z; hij stijgt naar voren), de meterkast (z van/tot) en de batterij (z vanaf) in de trapkast. */
  trapZ: number; meterkast: [number, number]; batterijZ: number;
};

/** Rijwoning (hoekwoning/tussenwoning): de maten van de homepage-maquette (M in maquette.ts). */
export const INDELING_RIJ: Indeling = {
  xw: M.links, r: 1, D: M.open - M.links,
  voor: M.voor, achter: M.achter, gevelVoor: M.gevelVoor,
  bg: M.bg, plafondBg: M.plafondBg, v1: M.v1, plafondV1: M.plafondV1, zolder: M.zolder, vloerOnder: M.vloerOnder,
  kachel: [2.05 - M.links, M.voor - 0.42], lucht: [0.15 - M.links, 1.05 - M.links],
  trapZ: -0.95, meterkast: [1.5, 2.05], batterijZ: 0.85,
};

/**
 * Vrijstaand en twee-onder-een-kap (gijs-vrijstaandewoning.glb, gemeten in het model): de trap staat
 * tegen de garagemuur (x = 3,48), de doorsnede zit aan de andere kant (de vrije zijgevel of de
 * gedeelde muur). Kachel tegen de garagemuur voorin (de voordeur zit aan de doorsnedekant), de
 * luchtverwarming tussen achterdeur en het grote achterraam.
 */
export const INDELING_VRIJ: Indeling = {
  xw: 3.48, r: -1, D: 6.96,
  voor: 4.38, achter: -4.38, gevelVoor: 4.64,
  bg: -2.67, plafondBg: -0.08, v1: 0.08, plafondV1: 2.54, zolder: 2.7, vloerOnder: -2.95,
  kachel: [0.38, 3.96], lucht: [1.95, 2.85],
  // Trap iets naar achteren, zodat hij boven in de hal uitkomt (zie bouwVrijInterieur).
  trapZ: -1.25, meterkast: [1.2, 1.75], batterijZ: 0.55,
};

export const VERWARMING_GROEP: Record<string, string> = {
  "Cv-ketel": "Verwarming_cvketel",
  "Stads- of blokverwarming": "Verwarming_stadsverwarming",
  "Open haard of kachel": "Verwarming_openhaard",
  Luchtverwarming: "Verwarming_luchtverwarming",
};

/** Van d-coördinaat naar de x van het model. */
export const naarX = (ind: Indeling, d: number) => ind.xw + ind.r * d;
const plaats = (g: Object3D, ind: Indeling) => { g.position.x = ind.xw; g.scale.x = ind.r; };

export function bouwVerwarming(scene: Object3D, ind: Indeling) {
  const m = (kleur: string, extra: Partial<MeshStandardMaterial> = {}) => Object.assign(new MeshStandardMaterial({ color: kleur, roughness: 0.6 }), extra);
  const wit = m("#f4f3ef", { roughness: 0.4 }), antraciet = m("#34383b", { roughness: 0.5 }), koper = m("#b87a4b", { roughness: 0.35, metalness: 0.6 });
  const rood = m("#c0473a"), blauw = m("#3d6fa8"), steen = m("#6d6a64", { roughness: 0.9 });
  const stucMat = m("#ece8e1", { roughness: 0.95 }), rvs = m("#b9bdbf", { roughness: 0.3, metalness: 0.7 });
  const grijs = m("#9ea3a6"), zwart = m("#1d1f21"), walnoot = m("#5b4331");
  const vuur = m("#ff8a2a", { emissiveIntensity: 1.2, roughness: 1 });
  vuur.emissive.set("#ff6a00");
  const groep = (optie: string) => { const g = new Group(); g.name = VERWARMING_GROEP[optie]; g.userData.verwarming = optie; g.visible = false; plaats(g, ind); scene.add(g); return g; };
  const x0 = 0, bg = ind.bg + 0.012, zolder = ind.zolder + 0.012;
  const buis = (g: Group, a: V3, b: V3, mat: MeshStandardMaterial) => blok(g, a, b, mat);

  // Cv-ketel: hangend aan de kopgevel op zolder, met leidingen eronder en de rookgasafvoer erboven.
  const cv = groep("Cv-ketel");
  // (Vrij van het boilervat en de was-droogtoren, die er vanuit de doorsnede anders voor staan.)
  blok(cv, [x0, zolder + 0.7, -0.3], [x0 + 0.34, zolder + 1.45, 0.15], wit, 0.02).userData.kern = true;
  blok(cv, [x0 + 0.34, zolder + 1.18, -0.15], [x0 + 0.346, zolder + 1.28, 0.0], antraciet);
  for (const z of [-0.23, -0.14, -0.01, 0.08]) buis(cv, [x0 + 0.14, zolder + 0.2, z - 0.012], [x0 + 0.164, zolder + 0.7, z + 0.012], koper);
  blok(cv, [x0 + 0.1, zolder + 1.45, -0.13], [x0 + 0.22, zolder + 1.95, -0.01], wit, 0.01);

  // Meterkast in de trapkast, aan de halkant onder het hoge deel van de trap (altijd, net als de rest
  // van het interieur), open naar de doorsnede: groepenkast en elektriciteitsmeter. Bij stads- of
  // blokverwarming hangt de kleine afleverset er onderin, met aanvoer (rood) en retour (blauw) die via
  // de kruipruimte van de straat komen. Ruim uit de buurt van de open haard (brandveiligheid).
  const mk = new Group(); mk.name = "Meterkast"; plaats(mk, ind); scene.add(mk);
  const [mz0, mz1] = ind.meterkast, mh = bg + 1.62;
  blok(mk, [x0, bg, mz0], [x0 + 0.5, bg + 0.02, mz1], wit);
  blok(mk, [x0, bg, mz0], [x0 + 0.5, mh, mz0 + 0.02], wit);
  blok(mk, [x0, bg, mz1 - 0.02], [x0 + 0.5, mh, mz1], wit);
  blok(mk, [x0, mh - 0.02, mz0], [x0 + 0.5, mh, mz1], wit);
  blok(mk, [x0, bg + 0.85, mz0 + 0.02], [x0 + 0.4, bg + 0.87, mz1 - 0.02], wit);
  blok(mk, [x0 + 0.01, bg + 1.05, mz0 + 0.07], [x0 + 0.13, bg + 1.52, mz1 - 0.07], wit, 0.01);
  blok(mk, [x0 + 0.13, bg + 1.22, mz0 + 0.1], [x0 + 0.135, bg + 1.36, mz1 - 0.1], antraciet);
  blok(mk, [x0 + 0.01, bg + 0.9, mz0 + 0.1], [x0 + 0.15, bg + 1.02, mz0 + 0.28], grijs, 0.01);
  // Deur (scharnier aan de voorkant): dicht is het gewoon een kast; HouseViewer zet hem open bij
  // stads- of blokverwarming (rotation.y van de groep "Meterkast_deur").
  const deur = new Group(); deur.name = "Meterkast_deur";
  deur.position.set(x0 + 0.5, 0, mz1);
  blok(deur, [0, bg + 0.01, -(mz1 - mz0) + 0.005], [0.025, mh - 0.01, -0.005], wit, 0.006);
  for (const y of [bg + 0.12, mh - 0.16]) blok(deur, [0.025, y, -(mz1 - mz0) + 0.1], [0.028, y + 0.05, -0.1], grijs);
  blok(deur, [0.025, bg + 0.95, -(mz1 - mz0) + 0.06], [0.045, bg + 1.08, -(mz1 - mz0) + 0.08], antraciet);
  mk.add(deur);

  const st = groep("Stads- of blokverwarming");
  blok(st, [x0 + 0.01, bg + 0.3, mz0 + 0.08], [x0 + 0.22, bg + 0.72, mz1 - 0.08], wit, 0.02).userData.kern = true;
  blok(st, [x0 + 0.22, bg + 0.55, mz0 + 0.18], [x0 + 0.225, bg + 0.62, mz0 + 0.3], antraciet);
  for (const [z, mat] of [[mz0 + 0.2, rood], [mz0 + 0.38, blauw]] as [number, MeshStandardMaterial][]) {
    buis(st, [x0 + 0.08, ind.vloerOnder - 0.15, z - 0.02], [x0 + 0.12, bg + 0.3, z + 0.02], mat);
    buis(st, [x0 + 0.08, ind.vloerOnder - 0.19, z - 0.02], [x0 + 0.12, ind.vloerOnder - 0.15, ind.gevelVoor + 0.4], mat);
  }

  // Open haard: een vrijstaande houtkachel met rookkanaal in de hoek van de woonkamer, op de plek
  // van de grote plant (die verdwijnt dan, zie HouseViewer). Ver van de meterkast. Met een kachel gaat
  // de thuisbatterij uit de trapkast naar zolder (zie batterijNaarZolder).
  const oh = groep("Open haard of kachel");
  const [kx, kz] = ind.kachel;
  blok(oh, [kx - 0.36, bg, kz - 0.42], [kx + 0.36, bg + 0.012, kz + 0.32], steen);
  for (const [dx, dz] of [[-0.2, -0.17], [0.2, -0.17], [-0.2, 0.17], [0.2, 0.17]]) blok(oh, [kx + dx - 0.025, bg, kz + dz - 0.025], [kx + dx + 0.025, bg + 0.12, kz + dz + 0.025], zwart);
  blok(oh, [kx - 0.25, bg + 0.12, kz - 0.21], [kx + 0.25, bg + 0.78, kz + 0.21], zwart, 0.03).userData.kern = true;
  blok(oh, [kx - 0.27, bg + 0.78, kz - 0.23], [kx + 0.27, bg + 0.81, kz + 0.23], antraciet, 0.01);
  blok(oh, [kx - 0.19, bg + 0.24, kz - 0.215], [kx + 0.19, bg + 0.64, kz - 0.205], antraciet);
  blok(oh, [kx - 0.15, bg + 0.27, kz - 0.222], [kx + 0.15, bg + 0.47, kz - 0.212], vuur);
  for (const dx of [-0.07, 0.07]) blok(oh, [kx + dx - 0.05, bg + 0.26, kz - 0.224], [kx + dx + 0.05, bg + 0.32, kz - 0.214], walnoot, 0.01);
  // Rookkanaal tot boven het dak: zwarte kachelpijp tot het plafond, daarna een gestucte koker door de
  // slaapkamer en de zoldervloer, en boven de pannen een rvs-pijp met kap.
  const pz = kz + 0.05;
  const pijp = (y0: number, y1: number, r: number, mat: MeshStandardMaterial) => {
    const p = new Mesh(new CylinderGeometry(r, r, y1 - y0, 20), mat);
    p.geometry.userData.owned = true;
    p.position.set(kx, (y0 + y1) / 2, pz);
    oh.add(p);
  };
  pijp(bg + 0.81, ind.plafondBg, 0.075, zwart);
  const pannen = scene.getObjectByName("Dakpannen");
  if (pannen) {
    scene.updateMatrixWorld(true);
    const d = new Box3().setFromObject(pannen); d.min.divide(scene.scale); d.max.divide(scene.scale);
    const dakY = d.max.y - ((d.max.y - d.min.y) / ((d.max.z - d.min.z) / 2)) * Math.abs(pz - (d.min.z + d.max.z) / 2);
    blok(oh, [kx - 0.16, ind.plafondBg, pz - 0.16], [kx + 0.16, dakY - 0.05, pz + 0.16], stucMat);
    pijp(dakY - 0.1, dakY + 0.9, 0.09, rvs);
    blok(oh, [kx - 0.16, dakY + 0.9, pz - 0.16], [kx + 0.16, dakY + 0.94, pz + 0.16], rvs);
    for (const [dx, dz] of [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]]) blok(oh, [kx + dx - 0.012, dakY + 0.84, pz + dz - 0.012], [kx + dx + 0.012, dakY + 0.9, pz + dz + 0.012], rvs);
  }

  // Convectorputten (warmteafgifte): smalle roosters in de vloer voor de ramen van de begane grond,
  // voor en achter (plek uit de ramen in het model). Verschijnen alleen als de bewoner ze aanvinkt.
  const cp = new Group(); cp.name = "Afgifte_convectorput"; cp.userData.afgifte = "Convectorputten"; cp.visible = false; plaats(cp, ind); scene.add(cp);
  scene.updateMatrixWorld(true);
  for (const raam of scene.children) {
    if (!/^Raam_(voor|achter)/.test(raam.name)) continue;
    const b = new Box3().setFromObject(raam); b.min.divide(scene.scale); b.max.divide(scene.scale);
    if (b.min.y > ind.plafondBg) continue;
    const da = (b.min.x - ind.xw) * ind.r, db = (b.max.x - ind.xw) * ind.r;
    const d0 = Math.max(Math.min(da, db) + 0.05, 1.0), d1 = Math.min(Math.max(da, db) - 0.05, ind.D - 0.15);
    if (d1 - d0 < 0.5) continue;
    const voorRaam = b.min.z > 0;
    const z0 = voorRaam ? ind.voor - 0.36 : ind.achter + 0.12, z1 = voorRaam ? ind.voor - 0.12 : ind.achter + 0.36;
    blok(cp, [d0, bg, z0], [d1, bg + 0.008, z1], antraciet).userData.kern = true;
    for (let d = d0 + 0.04; d < d1 - 0.03; d += 0.05) blok(cp, [d, bg + 0.008, z0 + 0.025], [d + 0.018, bg + 0.011, z1 - 0.025], grijs);
  }

  // Luchtverwarming: een binnenunit (airco/heater) hoog aan de achtermuur van de woonkamer, boven de
  // eettafel, met een rooster aan de onderkant.
  const lv = groep("Luchtverwarming");
  const [l0, l1] = ind.lucht;
  blok(lv, [l0, bg + 1.78, ind.achter], [l1, bg + 2.08, ind.achter + 0.22], wit, 0.04).userData.kern = true;
  blok(lv, [l0 + 0.05, bg + 1.79, ind.achter + 0.18], [l1 - 0.05, bg + 1.83, ind.achter + 0.225], antraciet);
}

/**
 * Met een open haard gaat de thuisbatterij van de trapkast naar zolder (tegen de kopgevel), achter de
 * cv-ketelplek: tussen de gordingen (z = 0 en -1,8, maakCutaway), hoog genoeg onder het dak en vanuit
 * de doorsnede vrij van bureau, stoel, boilervat en was-droogtoren.
 */
export function batterijNaarZolder(scene: Object3D, ind: Indeling) {
  const batterij = scene.getObjectByName("Thuisbatterij");
  if (!batterij) return;
  const b = lokaleDoos(scene, batterij);
  const dx = ind.r === 1 ? naarX(ind, 0.07) - b.min.x : naarX(ind, 0.07) - b.max.x;
  batterij.userData.zolderPositie = [batterij.position.x + dx, batterij.position.y + ind.zolder + 0.012 - b.min.y, batterij.position.z - 0.38 - b.max.z];
}

/**
 * Thuisbatterij binnen, in de trapkast tegen de dichte zijmuur (vanaf ind.batterijZ, past daar nog
 * onder de trap; de meterkast staat ernaast aan de halkant). Smalle kant naar de muur.
 */
export function zetBatterijInTrapkast(scene: Object3D, ind: Indeling) {
  const batterij = scene.getObjectByName("Thuisbatterij");
  if (!batterij) return;
  let b = lokaleDoos(scene, batterij);
  if (b.max.x - b.min.x > b.max.z - b.min.z) { batterij.rotation.y += ind.r * Math.PI / 2; b = lokaleDoos(scene, batterij); }
  batterij.position.x += ind.r === 1 ? naarX(ind, 0.07) - b.min.x : naarX(ind, 0.07) - b.max.x;
  batterij.position.z += ind.batterijZ - b.min.z;
  batterij.position.y += ind.bg + 0.012 - b.min.y;
  delete batterij.userData.aanbouwPositie;
  scene.updateMatrixWorld(true);
}

function lokaleDoos(scene: Object3D, o: Object3D) {
  scene.updateMatrixWorld(true);
  const b = new Box3().setFromObject(o); b.min.divide(scene.scale); b.max.divide(scene.scale);
  return b;
}

/**
 * Vloerverwarming als echte leidingen: witte buizen in lussen (zoals ze op de vloer liggen voordat
 * de dekvloer erover gaat) in plaats van de rode plaat uit het model. Zelfde plek en naam, zodat het
 * neerleggen van boven (HouseViewer) en de highlight blijven werken.
 */
export function vervangVloerverwarming(scene: Object3D, ind: Indeling) {
  const vv = scene.getObjectByName("Vloerverwarming");
  if (!vv) return;
  const b = lokaleDoos(scene, vv);
  const [xa, xb] = [naarX(ind, 0.05), naarX(ind, ind.D - 0.05)].sort((p, q) => p - q);
  b.min.x = Math.max(b.min.x, xa); b.max.x = Math.min(b.max.x, xb);
  const r = 0.016, steek = 0.16, bocht = steek / 2, y = b.min.y + r;
  const z0 = b.min.z + 0.12 + bocht, z1 = b.max.z - 0.12 - bocht;
  const delen: BufferGeometry[] = [];
  const runs = Math.floor((b.max.x - b.min.x - 0.2) / steek) + 1;
  const xStart = (b.min.x + b.max.x) / 2 - ((runs - 1) * steek) / 2;
  for (let i = 0; i < runs; i++) {
    const x = xStart + i * steek;
    const recht = new CylinderGeometry(r, r, z1 - z0, 6, 1, true);
    recht.rotateX(Math.PI / 2); recht.translate(x, y, (z0 + z1) / 2);
    delen.push(recht);
    if (i < runs - 1) {
      // Om en om een bocht aan de achter- en voorkant: één doorlopende slinger.
      const achter = i % 2 === 0;
      const boog = new TorusGeometry(bocht, r, 6, 10, Math.PI);
      boog.rotateX(achter ? Math.PI / 2 : -Math.PI / 2);
      boog.translate(x + bocht, y, achter ? z1 : z0);
      delen.push(boog);
    }
  }
  if (!delen.length) return;
  const geo = mergeGeometries(delen.map(g => g.toNonIndexed()));
  delen.forEach(g => g.dispose());
  if (!geo) return;
  // Nieuwe groep op dezelfde plek; het oude modelonderdeel gaat weg.
  const groep = new Group();
  groep.name = "Vloerverwarming";
  const buizen = new Mesh(geo, new MeshStandardMaterial({ color: "#f3f3ef", roughness: 0.35 }));
  buizen.name = "vloerverwarming_buizen";
  buizen.geometry.userData.owned = true;
  groep.add(buizen);
  disposeHouse(vv);
  vv.removeFromParent();
  scene.add(groep);
}
