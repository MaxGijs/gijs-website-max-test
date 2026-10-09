import { Box3, Group, MeshStandardMaterial, type Mesh, type Object3D, type Texture } from "three";
import { blok, cilinder, lamp, maakMaterialen, maakTexturen, plant, radiator, stoel, trap, voegSamen } from "@/components/home/cutaway/maquette";
import type { Indeling } from "./verwarming-objecten";

/**
 * Interieur voor de vrijstaande modellen (vrijstaand en twee-onder-een-kap) in dezelfde stijl als de
 * homepage-maquette van de rijwoning: trap met trapkast tegen de dichte zijmuur, keuken, eettafel en
 * zithoek beneden, slaapkamer en badkamer boven, werkplek en was-droogtoren op zolder.
 *
 * Getekend in d-coördinaten (zie Indeling): d = afstand vanaf de dichte zijmuur richting doorsnede. De
 * groep zet dat om naar het model. De vloeren zelf zitten al in het model; hier komen er houten
 * vloerdelen en gestucte plafonds en wanden overheen.
 */
/**
 * Grondblok met gras rond de vrijstaande woning (zoals de maquette van de rijwoning): gras op aarde,
 * een tegelpad naar de voordeur en een oprit voor de garage. Aan de doorsnedekant houdt de grond op bij
 * de gevel (daar zie je vloer en kruipruimte). Onder de woning, aanbouw en garage zit geen grond; de
 * garageplek krijgt een eigen stuk gras dat HouseViewer toont als er geen garage is.
 * Maten uit gijs-vrijstaandewoning.glb (scènecoördinaten, vóór het spiegelen).
 */
function bouwGrond(scene: Object3D, mat: ReturnType<typeof maakMaterialen>) {
  const grond = new Group(); grond.name = "Maquette_grond";
  const top = -2.74, bodem = -3.6, gras = 0.03;
  const huis = { x0: -3.77, x1: 3.77, z0: -4.64, z1: 4.64 }, garage = { x0: 3.77, x1: 7.72, z0: -3.04, z1: 4.12 };
  const xMax = 9.6, zMin = -9.4, zMax = 7.2;
  const vak = (g: Object3D, x0: number, x1: number, z0: number, z1: number) => {
    blok(g, [x0, bodem, z0], [x1, top - gras, z1], mat.aarde);
    blok(g, [x0, top - gras, z0], [x1, top, z1], mat.gras);
  };
  vak(grond, huis.x0, xMax, huis.z1, zMax);                  // voortuin (ook voor de garage)
  vak(grond, huis.x0, xMax, zMin, huis.z0);                  // achtertuin (de aanbouw staat erop)
  vak(grond, garage.x1, xMax, huis.z0, huis.z1);             // naast de garage
  vak(grond, huis.x1, garage.x1, huis.z0, garage.z0);        // achter de garage
  vak(grond, huis.x1, garage.x1, garage.z1, huis.z1);        // tussen garage en voorgevel
  // Tegelpad naar de voordeur en oprit voor de garage.
  blok(grond, [-3.38, top, huis.z1], [-1.82, top + 0.012, zMax], mat.tegel);
  blok(grond, [garage.x0 + 0.15, top, garage.z1], [garage.x1 - 0.15, top + 0.012, zMax], mat.tegel);
  voegSamen(grond);
  scene.add(grond);
  // De garageplek: gras als er geen garage staat.
  const plek = new Group(); plek.name = "Grond_garageplek";
  vak(plek, garage.x0, garage.x1, garage.z0, garage.z1);
  scene.add(plek);
}

export function bouwVrijInterieur(scene: Object3D, ind: Indeling) {
  const texturen = maakTexturen();
  const mat = maakMaterialen(texturen);
  const g = new Group();
  g.name = "Interieur";
  g.position.x = ind.xw;
  g.scale.x = ind.r;
  const D = ind.D, voor = ind.voor, achter = ind.achter;
  const y = ind.bg + 0.012, v = ind.v1 + 0.012, z = ind.zolder + 0.012;

  // Vloeren (hout) en plafonds (stuc) over de vloeren van het model heen.
  blok(g, [0, ind.bg, achter], [D, y, voor], mat.hout);
  blok(g, [0, ind.v1, achter], [D, v, voor], mat.hout);
  blok(g, [0, ind.zolder, achter + 0.15], [D, z, voor - 0.15], mat.hout);
  blok(g, [0, ind.plafondBg - 0.012, achter], [D, ind.plafondBg, voor], mat.plafond);
  blok(g, [0, ind.plafondV1 - 0.012, achter], [D, ind.plafondV1, voor], mat.plafond);
  for (const [vloer, van] of [[ind.bg, 0], [ind.v1, 0]] as [number, number][]) {
    blok(g, [van, vloer, voor - 0.012], [D, vloer + 0.08, voor], mat.wit);
    blok(g, [van, vloer, achter], [D, vloer + 0.08, achter + 0.012], mat.wit);
  }

  // Begane grond: trap tegen de dichte muur (stijgt naar voren), keuken erachter langs dezelfde muur.
  trap(g, mat, 0, 0.9, ind.trapZ, y, v, 14);
  const keukenEind = ind.trapZ - 0.4;
  blok(g, [0, y, achter + 0.05], [0.62, y + 0.86, keukenEind - 0.02], mat.wit, 0.01);
  blok(g, [0, y + 0.86, achter + 0.05], [0.65, y + 0.9, keukenEind - 0.02], mat.antraciet);
  blok(g, [0, y + 1.45, achter + 0.05], [0.36, y + 2.15, keukenEind - 0.02], mat.wit, 0.01);
  blok(g, [0, y, keukenEind], [0.66, y + 2.1, ind.trapZ - 0.05], mat.wit, 0.01);
  blok(g, [0.12, y + 0.884, -3.4], [0.5, y + 0.904, -2.85], mat.antraciet, 0.01);
  cilinder(g, [0.3, y + 0.9, -3.1], 0.28, 0.012, 0.012, mat.messing);
  blok(g, [0.08, y + 0.9, -2.3], [0.56, y + 0.906, -1.75], mat.zwart, 0.005);
  blok(g, [0.62, y + 0.25, -2.28], [0.626, y + 0.78, -1.77], mat.zwart);
  for (let zg = achter + 0.35; zg < keukenEind - 0.2; zg += 0.6) blok(g, [0.62, y + 0.8, zg - 0.12], [0.635, y + 0.815, zg + 0.12], mat.messing);
  // Eettafel met vier stoelen en een hanglamp.
  blok(g, [2.6, y + 0.72, -3.3], [4.1, y + 0.76, -2.4], mat.eiken, 0.015);
  for (const [dx, dz] of [[2.65, -3.25], [4.05, -3.25], [2.65, -2.45], [4.05, -2.45]]) blok(g, [dx - 0.03, y, dz - 0.03], [dx + 0.03, y + 0.72, dz + 0.03], mat.walnoot);
  stoel(g, mat, [3.0, y, -3.6], 1); stoel(g, mat, [3.7, y, -3.6], 1);
  stoel(g, mat, [3.0, y, -2.1], -1); stoel(g, mat, [3.7, y, -2.1], -1);
  cilinder(g, [3.35, ind.plafondBg - 0.62, -2.85], 0.6, 0.006, 0.006, mat.zwart);
  cilinder(g, [3.35, ind.plafondBg - 0.8, -2.85], 0.2, 0.24, 0.1, mat.antraciet);
  plant(g, mat, [3.35, y + 0.76, -2.85], 0.35);
  // Zithoek: bank met de rug naar de eettafel, kijkend naar de voorgevel.
  blok(g, [1.6, y, 0.9], [5.2, y + 0.012, 3.3], mat.kleed);
  blok(g, [2.2, y, 0.3], [4.4, y + 0.42, 1.15], mat.stof, 0.06);
  blok(g, [2.2, y + 0.38, 0.3], [4.4, y + 0.86, 0.5], mat.stof, 0.07);
  blok(g, [2.02, y, 0.3], [2.2, y + 0.62, 1.15], mat.stof, 0.06);
  blok(g, [4.4, y, 0.3], [4.58, y + 0.62, 1.15], mat.stof, 0.06);
  for (const [a, b] of [[2.25, 2.95], [2.99, 3.65], [3.69, 4.35]]) blok(g, [a, y + 0.42, 0.49], [b, y + 0.52, 1.11], mat.kussen, 0.05);
  blok(g, [2.8, y + 0.34, 1.75], [3.8, y + 0.38, 2.35], mat.walnoot, 0.02);
  blok(g, [2.86, y, 1.81], [3.74, y + 0.34, 2.29], mat.walnoot, 0.02);
  blok(g, [4.6, y, 2.6], [5.3, y + 0.4, 3.25], mat.stofDonker, 0.07);
  blok(g, [4.6, y + 0.36, 2.6], [5.3, y + 0.8, 2.78], mat.stofDonker, 0.07);
  lamp(g, mat, [4.9, y, 0.5], 1.5);
  // Op de kachelplek staat zonder kachel een grote plant (HouseViewer verbergt hem bij een open haard).
  for (const deel of plant(g, mat, [ind.kachel[0], y, ind.kachel[1]], 1.2)) { deel.name = "Plant_kachelplek"; deel.userData.los = true; }

  // Verdieping: een hal over de hele diepte (de trap komt er tegen de dichte muur in uit), open naar
  // de doorsnede. Voor de hal de grote slaapkamer, erachter de badkamer en een tweede slaapkamer.
  const halA = 0.65, halV = 2.0, dikte = 0.1;
  const wandZ = (z0: number, d0: number, d1: number) => blok(g, [d0, v, z0], [d1, ind.plafondV1, z0 + dikte], mat.stuc);
  const deur = (z0: number, d0: number, d1: number, kamerKant: 1 | -1) => {
    blok(g, [d0, v + 2.1, z0], [d1, ind.plafondV1, z0 + dikte], mat.stuc);
    blok(g, [d0, v, z0 - 0.01], [d0 + 0.05, v + 2.14, z0 + dikte + 0.01], mat.wit);
    blok(g, [d1 - 0.05, v, z0 - 0.01], [d1, v + 2.14, z0 + dikte + 0.01], mat.wit);
    blok(g, [d0, v + 2.09, z0 - 0.01], [d1, v + 2.14, z0 + dikte + 0.01], mat.wit);
    blok(g, [d0 + 0.05, v + 0.01, z0 + 0.03], [d1 - 0.05, v + 2.09, z0 + 0.07], mat.wit, 0.005);
    const kz = kamerKant === 1 ? z0 + dikte + 0.005 : z0 - 0.025;
    blok(g, [d1 - 0.2, v + 1.02, kz], [d1 - 0.08, v + 1.04, kz + 0.02], mat.messing);
  };
  // Wand hal/voorkamer met een deur, wand hal/achterkant met deuren naar badkamer en tweede slaapkamer.
  wandZ(halV, 0, 1.1); deur(halV, 1.1, 2.0, 1); wandZ(halV, 2.0, D);
  wandZ(halA - dikte, 0, 1.1); deur(halA - dikte, 1.1, 2.0, -1); wandZ(halA - dikte, 2.0, 4.3); deur(halA - dikte, 4.3, 5.2, -1); wandZ(halA - dikte, 5.2, D);
  blok(g, [3.4, v, achter], [3.4 + dikte, ind.plafondV1, halA - dikte], mat.stuc);
  // Hal: loper en een plant bij de doorsnede.
  blok(g, [1.0, v, halA + 0.2], [D - 0.3, v + 0.012, halV - 0.2], mat.kleedGrijs);
  plant(g, mat, [D - 0.4, v, halA + 0.35], 0.6);
  // Grote slaapkamer (voor): bed met het hoofdeinde tegen de halwand, nachtkastjes, kast en kleed.
  const sv = halV + dikte;
  blok(g, [2.2, v, sv + 0.3], [4.6, v + 0.012, voor - 0.2], mat.kleed);
  blok(g, [2.6, v, sv], [4.2, v + 1.05, sv + 0.08], mat.stofDonker, 0.03);
  blok(g, [2.65, v, sv + 0.08], [4.15, v + 0.32, sv + 2.05], mat.eiken, 0.03);
  blok(g, [2.69, v + 0.32, sv + 0.12], [4.11, v + 0.55, sv + 2.01], mat.beddengoed, 0.06);
  blok(g, [2.67, v + 0.5, sv + 0.75], [4.13, v + 0.6, sv + 2.03], mat.kussen, 0.05);
  blok(g, [2.67, v + 0.52, sv + 1.45], [4.13, v + 0.64, sv + 2.02], mat.plaid, 0.05);
  blok(g, [2.8, v + 0.55, sv + 0.18], [3.35, v + 0.72, sv + 0.6], mat.beddengoed, 0.07);
  blok(g, [3.45, v + 0.55, sv + 0.18], [4.0, v + 0.72, sv + 0.6], mat.beddengoed, 0.07);
  for (const d of [2.05, 4.3]) { blok(g, [d, v, sv + 0.02], [d + 0.45, v + 0.5, sv + 0.42], mat.walnoot, 0.02); }
  lamp(g, mat, [2.28, v + 0.5, sv + 0.22], 0.32);
  blok(g, [5.1, v, sv + 0.02], [6.5, v + 2.1, sv + 0.62], mat.wit, 0.01);
  for (const x of [5.57, 6.03]) blok(g, [x - 0.004, v + 0.05, sv + 0.625], [x + 0.004, v + 2.05, sv + 0.63], mat.stofDonker);
  plant(g, mat, [D - 0.45, v, voor - 0.45], 0.9);
  // Badkamer (achter, aan de trapkant): bad tegen de achtergevel, douche, toilet en wastafelmeubel.
  const ba = halA - dikte;
  blok(g, [0.05, v, achter + 0.02], [1.75, v + 0.56, achter + 0.78], mat.sanitair, 0.05);
  blok(g, [0.13, v + 0.4, achter + 0.1], [1.67, v + 0.5, achter + 0.7], mat.tegel, 0.03);
  blok(g, [2.35, v, achter + 0.02], [3.35, v + 0.05, achter + 1.0], mat.sanitair, 0.01);
  blok(g, [2.35, v + 0.05, achter + 0.98], [3.35, v + 2.0, achter + 1.01], mat.glas);
  blok(g, [2.32, v + 0.05, achter + 0.02], [2.35, v + 2.0, achter + 1.01], mat.glas);
  blok(g, [0.02, v, -2.3], [0.64, v + 0.42, -1.92], mat.sanitair, 0.08);
  blok(g, [0, v + 0.42, -2.3], [0.18, v + 0.8, -1.92], mat.sanitair, 0.04);
  blok(g, [2.3, v + 0.45, ba - 0.5], [3.3, v + 0.85, ba], mat.walnoot, 0.02);
  blok(g, [2.28, v + 0.85, ba - 0.52], [3.32, v + 0.89, ba], mat.sanitair, 0.01);
  blok(g, [2.4, v + 1.2, ba - 0.02], [3.2, v + 1.95, ba], mat.spiegel);
  // Tweede slaapkamer (achter, aan de doorsnedekant): bed tegen de badkamerwand, bureau bij het raam.
  const k2 = 3.4 + dikte;
  blok(g, [4.0, v, -3.5], [6.2, v + 0.012, -0.8], mat.kleedGrijs);
  blok(g, [k2, v, -2.7], [k2 + 0.08, v + 1.0, -1.3], mat.stofDonker, 0.03);
  blok(g, [k2 + 0.08, v, -2.65], [k2 + 2.08, v + 0.32, -1.35], mat.eiken, 0.03);
  blok(g, [k2 + 0.12, v + 0.32, -2.61], [k2 + 2.04, v + 0.55, -1.39], mat.beddengoed, 0.06);
  blok(g, [k2 + 0.8, v + 0.5, -2.63], [k2 + 2.06, v + 0.6, -1.37], mat.plaid, 0.05);
  blok(g, [k2 + 0.18, v + 0.55, -2.4], [k2 + 0.6, v + 0.7, -1.6], mat.beddengoed, 0.07);
  blok(g, [5.2, v + 0.72, achter + 0.05], [6.5, v + 0.76, achter + 0.65], mat.eiken, 0.015);
  for (const [dx, dz] of [[5.25, achter + 0.1], [6.45, achter + 0.1], [5.25, achter + 0.6], [6.45, achter + 0.6]]) blok(g, [dx - 0.025, v, dz - 0.025], [dx + 0.025, v + 0.72, dz + 0.025], mat.walnoot);
  stoel(g, mat, [5.85, v, achter + 0.95], -1);

  // Zolder (alleen het middendeel, onder de nok is het hoog genoeg): werkplek, was-droogtoren, boilervat.
  blok(g, [2.6, z, 0.2], [5.0, z + 0.012, 1.8], mat.kleed);
  blok(g, [3.0, z + 0.72, 0.75], [4.5, z + 0.76, 1.35], mat.eiken, 0.015);
  for (const [dx, dz] of [[3.05, 0.8], [4.45, 0.8], [3.05, 1.3], [4.45, 1.3]]) blok(g, [dx - 0.025, z, dz - 0.025], [dx + 0.025, z + 0.72, dz + 0.025], mat.walnoot);
  blok(g, [3.45, z + 0.76, 0.9], [3.87, z + 0.775, 1.2], mat.antraciet, 0.005);
  lamp(g, mat, [4.25, z + 0.76, 1.15], 0.42);
  stoel(g, mat, [3.75, z, 0.35], -1);
  for (const [onder, boven] of [[0, 0.85], [0.86, 1.7]]) {
    blok(g, [D - 0.95, z + onder, -1.3], [D - 0.35, z + boven, -0.7], mat.wit, 0.02);
    const deur = cilinder(g, [0, 0, 0], 0.02, 0.19, 0.19, mat.antraciet);
    deur.rotation.z = Math.PI / 2;
    deur.position.set(D - 0.96, z + (onder + boven) / 2, -1.0);
  }
  cilinder(g, [4.4, z, -1.0], 1.6, 0.28, 0.28, mat.wit);
  cilinder(g, [4.4, z + 1.6, -1.0], 0.04, 0.2, 0.05, mat.stuc);
  plant(g, mat, [5.3, z, 1.5], 0.9);
  // Het zolderraam in de kopgevel aan de garagekant zit precies achter de cv-ketelplek: aan de
  // binnenkant dichtgestuct (buiten blijft het raam gewoon zichtbaar).
  blok(g, [0, z + 0.55, -0.62], [0.03, z + 1.9, 0.62], mat.stuc);

  // Radiatoren onder de ramen van begane grond en verdieping (op de plek van de echte ramen).
  scene.updateMatrixWorld(true);
  for (const raam of scene.children) {
    if (!/^Raam_(voor|achter)/.test(raam.name)) continue;
    const b = new Box3().setFromObject(raam); b.min.divide(scene.scale); b.max.divide(scene.scale);
    const vloer = b.min.y < ind.plafondBg ? y : b.min.y < ind.plafondV1 ? v : null;
    if (vloer === null) continue;
    const da = (b.min.x - ind.xw) * ind.r, db = (b.max.x - ind.xw) * ind.r;
    const d0 = Math.max(Math.min(da, db) + 0.1, vloer === y ? 1.0 : 1.2), d1 = Math.min(Math.max(da, db) - 0.1, D - 0.08);
    const y1 = Math.min(vloer + 0.72, b.min.y - 0.08), isVoor = b.min.z > 0;
    if (d1 - d0 < 0.4 || y1 - (vloer + 0.16) < 0.25) continue;
    const z0 = isVoor ? voor - 0.1 : achter + 0.03, z1 = isVoor ? voor - 0.03 : achter + 0.1;
    radiator(g, mat, { x0: d0, x1: d1, y0: vloer + 0.16, y1, z0, z1 });
  }

  voegSamen(g);
  scene.add(g);
  bouwGrond(scene, mat);

  // Binnenkant van de buitenmuren als gestucte wanden (zoals maakCutaway bij de rijwoning).
  for (const naam of ["Binnenmuur_voor", "Binnenmuur_achter", "Binnenmuur_links", "Zijgevel_garage_binnen"]) {
    scene.getObjectByName(naam)?.traverse(part => {
      const mesh = part as Mesh;
      if (!mesh.isMesh) return;
      for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) { if (!m.isMeshStandardMaterial) continue; m.map = texturen.stuc; m.color.set("#ffffff"); m.roughness = 0.95; m.needsUpdate = true; }
    });
  }
  return Object.values(texturen) as Texture[];
}
