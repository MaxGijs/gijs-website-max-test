import { Box3, Group, MeshStandardMaterial, Vector3, type Object3D } from "three";
import { FOV, HOOFDSTUK_LAGEN, type Stand } from "@/lib/camera-cutaway";
import { M, blok } from "@/components/home/cutaway/maquette";
import { disposeHouse } from "@/lib/house-model";

/**
 * Regie van de 3D-woning in de woningscan, op één plek. Zelfde opbouw als de homepage (bouwRoute in
 * components/home/cutaway/WoningScene.tsx en anime-prototype/staten.ts): per staat een camerastand
 * die uit de echte objecten in de scene komt, en per maatregel een eigen beweging van de modellagen
 * (HOOFDSTUK_LAGEN, gedeeld met de homepage).
 */
export type CameraState =
  | "overview" | "kozijn" | "dak" | "zon" | "spouw" | "vloer" | "pomp" | "batterij" | "vloerverwarming"
  | "kruipruimte" | "spouwmuur" | "dakkapel" | "garage" | "aanbouw"
  | "cvketel" | "stadsverwarming" | "openhaard" | "luchtverwarming"
  | "radiatoren" | "convectorputten";

/** Maatregel (lib/measures.ts) → staat met de eigen beweging van die maatregel. */
export const MAATREGEL_STAAT: Record<string, CameraState> = {
  zonnepanelen: "zon", dakisolatie: "dak", gevelisolatie: "spouw", "glas-kozijnen": "kozijn",
  warmtepomp: "pomp", thuisbatterij: "batterij", vloerisolatie: "vloer", vloerverwarming: "vloerverwarming",
};
/** Verwarmingskeuze → camerastaat (warmtepompen: de buitenunit). */
export const VERWARMING_STAAT: Record<string, CameraState> = {
  "Cv-ketel": "cvketel", "Hybride warmtepomp": "pomp", "Volledig elektrische warmtepomp met boiler": "pomp",
  "Stads- of blokverwarming": "stadsverwarming", "Open haard of kachel": "openhaard", Luchtverwarming: "luchtverwarming",
};
/** Warmteafgifte → camerastaat: de radiatoren, de vloerverwarming of de convectorputten lichten op. */
export const AFGIFTE_STAAT: Record<string, CameraState> = {
  "Normale radiatoren (hoge temperatuur)": "radiatoren",
  "Vloerverwarming of lagetemperatuurradiatoren": "vloerverwarming",
  Convectorputten: "convectorputten",
};
export const STAAT_AFGIFTE = { convectorputten: "Convectorputten" } as Partial<Record<CameraState, string>>;
export const STAAT_VERWARMING = Object.fromEntries(Object.entries(VERWARMING_STAAT).filter(([, s]) => s !== "pomp").map(([v, s]) => [s, v])) as Partial<Record<CameraState, string>>;
export const STAAT_MAATREGEL = Object.fromEntries(Object.entries(MAATREGEL_STAAT).map(([m, s]) => [s, m])) as Partial<Record<CameraState, string>>;

/** Groep modellagen die bij een staat uit elkaar schuift; `v` (0-1) tweent Anime.js. */
export type LaagGroep = "dak" | "spouwmuur" | "vloer" | "raam";
export type Laag = { object: Object3D; as: "x" | "y" | "z"; offset: number; rang: number; groep: LaagGroep; v: number };

type Kant = "links" | "rechts" | "voor";
type Model = { scene: Group; scale: number; position: Vector3; bounds: Box3; spiegel: boolean };

const lokaleDoos = (scene: Object3D, o: Object3D) => { const b = new Box3().setFromObject(o); b.min.divide(scene.scale); b.max.divide(scene.scale); return b; };

/**
 * Kruipruimte die verschijnt bij "Kruipruimte: ja". Rijwoningen hebben door maakCutaway (homepage)
 * al een uitgegraven kruipruimte in het grondblok: die wordt hier opgevuld met grond, die bij "ja"
 * wegzakt. Vrijstaande woningen hebben geen grondblok: daar komt een eenvoudige kruipruimte
 * (funderingsbalken + zandbodem) onder de woning, open aan de doorsnedekant.
 */
export function bouwKruipruimte(scene: Group, metMaquette: boolean, kant: Kant) {
  scene.updateMatrixWorld(true);
  if (metMaquette) {
    const grond = new MeshStandardMaterial({ color: "#6f5139", roughness: 1 });
    // Een paar mm binnen de funderingsbalken, zandbodem en vloerisolatie van maakCutaway: geen
    // samenvallende vlakken (die flikkeren).
    const onder = M.kruipBodem + 0.06, boven = M.vloerOnder - 0.02;
    const vulling = blok(scene, [M.links + 0.09, onder, M.achter + 0.09], [M.open - 0.012, boven, M.voor - 0.09], grond);
    vulling.name = "Kruipruimte_vulling";
    vulling.userData.hoogte = boven - onder;
    return vulling;
  }
  // Vrijstaande modellen: de massieve fundering eruit en, net als bij de rijwoning, een echte
  // kruipruimte onder de vloer (funderingsbalken, zandbodem, open aan de doorsnedekant), opgevuld met
  // grond die wegzakt bij "Kruipruimte: ja" of als je naar de vloer kijkt.
  const fundering = scene.getObjectByName("Fundering");
  if (!fundering) return null;
  const f = lokaleDoos(scene, fundering);
  const isolatie = scene.getObjectByName("Vloerisolatie");
  const boven = isolatie ? lokaleDoos(scene, isolatie).min.y : f.max.y;
  disposeHouse(fundering);
  fundering.removeFromParent();
  const groep = new Group(); groep.name = "Kruipruimte_fundering";
  const beton = new MeshStandardMaterial({ color: "#74716b", roughness: 0.95 });
  const zand = new MeshStandardMaterial({ color: "#a89a80", roughness: 1 });
  const grond = new MeshStandardMaterial({ color: "#6f5139", roughness: 1 });
  const onder = -3.6, d = 0.22;
  blok(groep, [f.min.x + d, onder, f.min.z + d], [f.max.x - d, onder + 0.05, f.max.z - d], zand);
  if (kant !== "links") blok(groep, [f.min.x, onder, f.min.z], [f.min.x + d, boven, f.max.z], beton);
  if (kant !== "rechts") blok(groep, [f.max.x - d, onder, f.min.z], [f.max.x, boven, f.max.z], beton);
  if (kant !== "voor") blok(groep, [f.min.x, onder, f.max.z - d], [f.max.x, boven, f.max.z], beton);
  blok(groep, [f.min.x, onder, f.min.z], [f.max.x, boven, f.min.z + d], beton);
  scene.add(groep);
  const vOnder = onder + 0.06, vBoven = boven - 0.02;
  const vulling = blok(scene, [f.min.x + d + 0.01, vOnder, f.min.z + d + 0.01], [f.max.x - d - 0.01, vBoven, f.max.z - d - 0.01], grond);
  vulling.name = "Kruipruimte_vulling";
  vulling.userData.hoogte = vBoven - vOnder;
  return vulling;
}

export function bouwScanRoute({ scene, scale, position, bounds, spiegel }: Model, kant: Kant, ploeg: Object3D | null) {
  scene.updateMatrixWorld(true);
  ploeg?.updateWorldMatrix(true, true);
  // Wereld zonder spiegeling; gespiegelde hoekwoningen worden aan het eind in x omgeklapt.
  const wereld = (v: Vector3) => v.clone().multiplyScalar(scale).add(position);
  const doos = (o: Object3D) => { const b = new Box3().setFromObject(o); return new Box3(wereld(b.min), wereld(b.max)); };
  const kind = (n: string) => scene.children.find(o => o.name === n) ?? null;
  const huis = new Box3(wereld(bounds.min), wereld(bounds.max));
  const midden = huis.getCenter(new Vector3());
  const maat = huis.getSize(new Vector3());
  // Zelfde afstanden als de homepage: L2 = halve, L3 = ~derde basisafstand.
  const basisAfstand = (maat.length() / 2 / Math.sin((FOV / 2) * (Math.PI / 180))) * 0.95;
  const L2 = basisAfstand * 0.5, L3 = basisAfstand * 0.32;
  const stand = (look: Vector3, richting: Vector3, afstand: number): Stand => ({ look, pos: look.clone().add(richting.clone().normalize().multiplyScalar(afstand)) });

  // o: richting van de open zijde (daar zit de doorsnede), p: dwars daarop, zij: kant waarvandaan
  // de voorgevel schuin bekeken wordt. Zo kloppen de homepage-richtingen bij elke open zijde.
  const o = kant === "links" ? new Vector3(-1, 0, 0) : kant === "voor" ? new Vector3(0, 0, 1) : new Vector3(1, 0, 0);
  const p = kant === "voor" ? new Vector3(1, 0, 0) : new Vector3(0, 0, 1);
  const zij = new Vector3(kant === "links" ? -1 : 1, 0, 0);
  const r = (a: Vector3, fa: number, y: number, b: Vector3, fb: number) => a.clone().multiplyScalar(fa).add(b.clone().multiplyScalar(fb)).setY(y);
  const naarBuiten = (c: Vector3) => { const h = c.clone().sub(midden).setY(0); return h.lengthSq() < 1e-6 ? new Vector3(0, 0, 1) : h.normalize(); };
  const zijwaarts = (h: Vector3) => { const q = new Vector3(h.z, 0, -h.x); return Math.sign(q.x) === -zij.x ? q.negate() : q; };
  /** Punt op de rand van een doos aan de open zijde, iets naar voren (zoals de homepage-standen). */
  const rand = (b: Box3, naarVoren = 0.15) => {
    const c = b.getCenter(new Vector3()), s = b.getSize(new Vector3());
    if (kant === "rechts") c.x = b.max.x; else if (kant === "links") c.x = b.min.x; else c.z = b.max.z;
    return c.add(p.clone().multiplyScalar(naarVoren * (kant === "voor" ? s.x : s.z)));
  };
  const buiten = (c: Vector3, y: number, afstand: number) => { const h = naarBuiten(c); return stand(c, h.clone().multiplyScalar(0.8).add(zijwaarts(h).multiplyScalar(0.5)).setY(y), afstand); };

  const open = kant === "links" ? new Vector3(-0.88, 0.22, 0.42) : kant === "voor" ? new Vector3(0.38, 0.22, 0.9) : new Vector3(0.88, 0.22, 0.42);
  const overview = stand(midden.clone(), open, basisAfstand * 1.05);

  // Zonnepanelen: gemiddelde van de panelen op het voordakvlak (homepage: [0.34, 0.66, 0.68], L2 * 0.78).
  const panelen = scene.children.filter(c => c.name.startsWith("Zonnepaneel") && !c.userData.garagePanel && !c.userData.dormerPanel).map(c => doos(c).getCenter(new Vector3()));
  const voorvlak = panelen.filter(c => c.y > midden.y && c.z > midden.z);
  const gekozen = voorvlak.length ? voorvlak : panelen;
  const zonC = gekozen.length ? gekozen.reduce((s, c) => s.add(c), new Vector3()).multiplyScalar(1 / gekozen.length) : midden.clone();
  const zonH = naarBuiten(zonC);
  const zon = stand(zonC, zonH.clone().multiplyScalar(0.68).add(zijwaarts(zonH).multiplyScalar(0.34)).setY(0.66), L2 * 1.05);

  // Warmtepomp (homepage: stand(doos(pomp).c, [0.5, 0.34, -0.8], L3 * 0.95)): naar buiten door de unit heen.
  const pompObj = kind("Warmtepomp_DeWarmte");
  const pompC = pompObj ? doos(pompObj).getCenter(new Vector3()) : null;
  const pomp = pompC ? buiten(pompC, 0.34, L3 * 0.95) : overview;
  // Met aanbouw staat de pomp op het platte dak (aanbouwPositie, zie HouseViewer): wat hoger bekeken.
  const pompPlek = pompObj?.userData.aanbouwPositie as number[] | undefined;
  let pompAanbouw = pomp;
  if (pompObj && pompPlek) {
    const terug = pompObj.position.clone();
    pompObj.position.set(pompPlek[0], pompPlek[2] ?? terug.y, pompPlek[1]);
    pompObj.updateMatrixWorld(true);
    pompAanbouw = buiten(doos(pompObj).getCenter(new Vector3()), 0.6, L3 * 1.1);
    pompObj.position.copy(terug);
    pompObj.updateMatrixWorld(true);
  }

  // Thuisbatterij: binnen (rijwoning, trapkast via maakCutaway) door de doorsnede bekeken, zoals de
  // homepage ([0.92, 0.22, 0.32], L3 * 0.62); anders buiten aan de gevel zoals de warmtepomp.
  const batObj = kind("Thuisbatterij");
  const batC = batObj ? doos(batObj).getCenter(new Vector3()) : null;
  const binnen = batC ? Math.abs(batC.x - midden.x) < maat.x * 0.45 && Math.abs(batC.z - midden.z) < maat.z * 0.45 : false;
  // (Recht door de doorsnede: schuin van voren staat de plant in de woonkamer ervoor.)
  const batterij = batC ? (binnen ? stand(batC, r(o, 0.92, 0.22, p, 0), L3 * 0.62) : buiten(batC, 0.3, L3 * 0.8)) : overview;

  // Dak (homepage: rand van het dak aan de open kant, [0.95, 0.24, 0.24], L3 * 1.35).
  const dakObj = kind("Dakisolatie");
  const dakB = dakObj ? doos(dakObj) : null;
  const dak = dakB ? stand(rand(dakB, 0.25), r(o, 0.95, 0.24, p, 0.24), L3 * 1.35) : overview;

  // Dakkapel: de achterdakkapel (bij "1" altijd achter), van achter en boven bekeken.
  const kapelObj = kind("Dakkapel");
  const dakkapel = kapelObj ? stand(doos(kapelObj).getCenter(new Vector3()), new Vector3(zij.x * 0.35, 0.7, -0.6), L3 * 1.3) : overview;
  // Twee dakkapellen: uitgezoomd van opzij en hoog, zodat beide dakvlakken (en de voorste die erbij
  // komt) tegelijk in beeld zijn.
  const voorKapelObj = kind("Dakkapel_voor");
  const dakkapellen = kapelObj && voorKapelObj
    ? stand(doos(kapelObj).getCenter(new Vector3()).add(doos(voorKapelObj).getCenter(new Vector3())).multiplyScalar(0.5), new Vector3(zij.x * 0.95, 0.75, 0.25), L3 * 2.3)
    : dakkapel;

  // Spouwmuur (vraag): homepage-spouw, voorgevel van opzij ([0.88, 0.16, 0.45]); iets ruimer dan de
  // homepage (L3 * 0.6), zodat de opengeschoven lagen er helemaal op staan.
  const gevelObj = kind("Buitengevel_voor");
  const gevelB = gevelObj ? doos(gevelObj) : null;
  const gevelHoek = gevelB ? new Vector3(zij.x > 0 ? gevelB.max.x : gevelB.min.x, gevelB.getCenter(new Vector3()).y - maat.y * 0.03, gevelB.max.z + 0.35 * scale) : null;
  const spouwmuur = gevelHoek ? stand(gevelHoek, new Vector3(zij.x * 0.88, 0.16, 0.45), L3 * 0.9) : overview;

  // Spouwisolatie (maatregel): de monteur die de spouw volspuit, met de gevel ernaast in beeld.
  const werker = ploeg ? doos(ploeg).getCenter(new Vector3()) : null;
  const spouw = werker && gevelB
    ? stand(new Vector3((werker.x + gevelB.getCenter(new Vector3()).x) / 2, gevelB.getCenter(new Vector3()).y - maat.y * 0.12, (werker.z + gevelB.max.z) / 2), new Vector3(zij.x * 0.45, 0.22, 0.87), L3 * 2.1)
    : spouwmuur;

  // Vloer (homepage: onder de vloer aan de open kant, [0.93, 0.14, 0.34], L3 * 1.05).
  const vloerObj = kind("Vloerisolatie");
  const vloerB = vloerObj ? doos(vloerObj) : null;
  const vloer = vloerB ? stand(rand(vloerB), r(o, 0.93, 0.14, p, 0.34), L3 * 1.05) : overview;

  // Kruipruimte: de (op te vullen) ruimte onder de vloer, iets lager en ruimer dan de vloer.
  const kruipObj = kind("Kruipruimte_vulling") ?? kind("Kruipruimte");
  const kruipruimte = kruipObj ? stand(rand(doos(kruipObj)), r(o, 0.9, 0.2, p, 0.4), L3 * 1.25) : vloer;

  // Vloerverwarming: op de vloer van de begane grond, van boven door de doorsnede.
  const vvObj = kind("Vloerverwarming");
  const vvB = vvObj ? doos(vvObj) : null;
  const vloerverwarming = vvB ? stand(rand(vvB, -0.1).setY(vvB.max.y), r(o, 0.85, 0.45, p, 0.3), L3 * 1.1) : vloer;
  // Hoe ver de leidingen omhoog moeten om óp de afwerkvloer te liggen (lokale eenheden): in het
  // model zitten ze ~2 cm onder de vloer en zijn dus nooit te zien.
  const afwerkvloer = kind("Vloer");
  const vloerverwarmingOp = vvObj && afwerkvloer ? lokaleDoos(scene, afwerkvloer).max.y - lokaleDoos(scene, vvObj).min.y + 0.015 : 0;

  // Kozijnen: het grootste raam in de voorgevel, net als bouwRoute op de homepage ([0.3, 0.1, 0.95], L3).
  const voorRamen = scene.children.filter(c => /^Raam/.test(c.name)).map(c => ({ c, b: doos(c) })).filter(({ b }) => b.getCenter(new Vector3()).z > midden.z + maat.z * 0.3);
  voorRamen.sort((a, b) => { const sa = a.b.getSize(new Vector3()), sb = b.b.getSize(new Vector3()); return sb.x * sb.y - sa.x * sa.y; });
  const raam = voorRamen[0] ?? null;
  const raamC = raam ? raam.b.getCenter(new Vector3()) : null;
  const kozijn = raamC ? stand(raamC, new Vector3(zij.x * 0.3, 0.1, 0.95), L3) : overview;

  const garageObj = kind("Garage"), aanbouwObj = kind("Aanbouw");
  // Garage: schuin van voren aan de garagekant, met de woning ernaast in beeld.
  const garageC = garageObj ? doos(garageObj).getCenter(new Vector3()) : null;
  const garage = garageC ? stand(garageC.clone().lerp(midden, 0.3), new Vector3(Math.sign(garageC.x - midden.x) * 0.7, 0.42, 0.8), L3 * 2.3) : overview;
  // Aanbouw: net als de garage een flink stuk om de woning heen, schuin van achteren aan de open kant.
  const aanbouwC = aanbouwObj ? doos(aanbouwObj).getCenter(new Vector3()) : null;
  const aanbouw = aanbouwC ? stand(aanbouwC.clone().lerp(midden, 0.3), new Vector3(zij.x * 0.6, 0.42, -0.8), L3 * 2.3) : overview;

  // Verwarming (alleen in de maquette): binnen, door de doorsnede bekeken.
  // Schuin kijken vanaf de kant weg van de dichtstbijzijnde gevel, anders staat die gevel ervoor.
  const binnenStand = (naam: string, vast?: number) => {
    const obj = kind(naam);
    if (!obj) return overview;
    // Kijk naar het toestel zelf (userData.kern), niet naar het midden van leidingen of rookkanaal.
    const kern = obj.children.find(k => k.userData.kern) ?? obj;
    const c = doos(kern).getCenter(new Vector3());
    const schuin = vast ?? (c.clone().sub(midden).dot(p) > 0 ? -0.3 : 0.3);
    return stand(c, r(o, 0.92, 0.22, p, schuin), L3 * 0.75);
  };
  // Cv-ketel op zolder: recht door de kopgevel, zodat het dakvlak en de was-droogtoren er niet voor staan.
  // Stadsverwarming recht in de meterkast: schuin staan de staande lamp of de bank ervoor.
  const cvketel = binnenStand("Verwarming_cvketel", 0), stadsverwarming = binnenStand("Verwarming_stadsverwarming", 0);
  const openhaard = binnenStand("Verwarming_openhaard"), luchtverwarming = binnenStand("Verwarming_luchtverwarming");
  // Afgifte: inzoomen op de breedste radiator op de begane grond (in de woonkamer); convectorputten in de vloer.
  const radiatorObjecten: { o: Object3D; b: Box3 }[] = [];
  scene.traverse(o => { if (o.name === "Radiator") radiatorObjecten.push({ o, b: doos(o) }); });
  const laagste = Math.min(...radiatorObjecten.map(r => r.b.min.y));
  const woonkamer = radiatorObjecten.filter(r => r.b.min.y < laagste + 0.5).sort((p, q) => (q.b.max.x - q.b.min.x + q.b.max.z - q.b.min.z) - (p.b.max.x - p.b.min.x + p.b.max.z - p.b.min.z))[0];
  const radC = woonkamer?.b.getCenter(new Vector3());
  const radiatoren = radC ? stand(radC, r(o, 0.92, 0.22, p, radC.clone().sub(midden).dot(p) > 0 ? -0.3 : 0.3), L3 * 0.75) : overview;
  const convectorputten = binnenStand("Afgifte_convectorput");

  // Thuisbatterij op zolder (bij een open haard, zie batterijNaarZolder): even op die plek meten.
  const zolderPlek = batObj?.userData.zolderPositie as number[] | undefined;
  let batterijZolder = batterij;
  if (batObj && zolderPlek) {
    const terug = batObj.position.clone();
    batObj.position.set(zolderPlek[0], zolderPlek[1], zolderPlek[2]);
    batObj.updateMatrixWorld(true);
    const c = doos(batObj).getCenter(new Vector3());
    // Schuin van voren: zo staan bureaustoel, boilervat en dakvlak er niet voor.
    batterijZolder = stand(c, r(o, 0.92, 0.3, p, 0.3), L3 * 0.75);
    batObj.position.copy(terug);
    batObj.updateMatrixWorld(true);
  }

  const standen: Record<CameraState | "dakkapellen" | "pompAanbouw" | "batterijZolder", Stand> = { overview, kozijn, dak, zon, spouw, vloer, pomp, pompAanbouw, batterij, vloerverwarming, kruipruimte, spouwmuur, dakkapel, dakkapellen, garage, aanbouw, cvketel, stadsverwarming, openhaard, luchtverwarming, batterijZolder, radiatoren, convectorputten };
  if (spiegel) {
    for (const s of Object.values(standen)) { s.pos.x = -s.pos.x; s.look.x = -s.look.x; }
    midden.x = -midden.x;
  }

  // Rondom (vinkjes bij "Welke stappen heb je al gezet?"): niet inzoomen maar de hele woning op
  // overzichtsafstand houden en eromheen draaien naar de kant waar het onderdeel zit. De richting
  // komt van de dichtbij-stand; bij spouwisolatie die van het zijaanzicht, waar de muur openschuift.
  // De thuisbatterij staat binnen en is klein: daar zakt de camera wat en kijkt hij meer naar de batterij.
  // Binnen (thuisbatterij en verwarming): na het draaien inzoomen op het toestel zelf, laag door de
  // doorsnede ingekeken (hoger staat het dakvlak, een gevel of meubilair ervoor). dichtbij = afstand
  // in L3; zonder dichtbij blijft de hele woning in beeld.
  const RONDOM_EXTRA: Partial<Record<keyof typeof standen, { hoog: number; naar?: number; afstand?: number; dichtbij?: number }>> = {
    batterij: { hoog: 0.1, dichtbij: 0.85 },
    batterijZolder: { hoog: 0.16, dichtbij: 0.95 },
    stadsverwarming: { hoog: 0.1, dichtbij: 0.85 },
    openhaard: { hoog: 0.12, dichtbij: 0.95 },
    cvketel: { hoog: 0.1, dichtbij: 0.95 },
    luchtverwarming: { hoog: 0.08, dichtbij: 0.95 },
    convectorputten: { hoog: 0.3, dichtbij: 1.1 },
    radiatoren: { hoog: 0.12, dichtbij: 0.95 },
    // Vloer: inzoomen op de rand van de vloer in de doorsnede, waar de isolatie (geel) zit.
    vloer: { hoog: 0.12, dichtbij: 1.0 },
  };
  const rondom = {} as Record<CameraState | "dakkapellen" | "pompAanbouw" | "batterijZolder", Stand>;
  for (const [k, s] of Object.entries(standen) as [keyof typeof standen, Stand][]) {
    const bron = k === "spouw" ? standen.spouwmuur : s;
    const extra = RONDOM_EXTRA[k];
    const r = bron.pos.clone().sub(bron.look);
    const hoog = extra?.hoog ?? Math.max(0.22, Math.min(0.6, r.y / r.length()));
    const h = r.setY(0).lengthSq() < 1e-6 ? overview.pos.clone().sub(overview.look).setY(0) : r;
    h.normalize().multiplyScalar(Math.sqrt(1 - hoog * hoog)).setY(hoog);
    rondom[k] = extra?.dichtbij
      ? stand(bron.look.clone(), h, L3 * extra.dichtbij)
      : stand(midden.clone().lerp(bron.look, extra?.naar ?? 0.2), h, basisAfstand * 1.05 * (extra?.afstand ?? 1));
  }

  // Lagen: dezelfde tabel als de homepage, plus het raam bij kozijnen (homepage: RAAM_UIT 0.15).
  const lagen: Laag[] = [];
  const voeg = (object: Object3D, offset: [number, number, number], groep: LaagGroep) => {
    const i = offset[0] ? 0 : offset[1] ? 1 : 2;
    lagen.push({ object, as: (["x", "y", "z"] as const)[i], offset: offset[i], rang: 0, groep, v: 0 });
  };
  // Dak en spouw: dezelfde lagen als de homepage. De vloer doet in de scan hetzelfde als het dak: de
  // lagen zakken waaierend de (leeggemaakte) kruipruimte in, de isolatie het verst en de
  // vloerconstructie half; de vloer zelf blijft liggen.
  for (const l of HOOFDSTUK_LAGEN) {
    if (l.hoofdstuk === "vloer") continue;
    for (const c of scene.children) if (l.naam.test(c.name) && !c.userData.garagePanel) voeg(c, l.offset, l.hoofdstuk === "spouw" ? "spouwmuur" : l.hoofdstuk);
  }
  for (const [naam, afstand] of [["Vloerisolatie", -0.5], ["Vloerconstructie", -0.25]] as [string, number][]) {
    const laag = kind(naam);
    if (laag) voeg(laag, [0, afstand, 0], "vloer");
  }
  if (raam) voeg(raam.c, [0, 0, 0.15], "raam");
  const maxRang: Record<LaagGroep, number> = { dak: 0, spouwmuur: 0, vloer: 0, raam: 0 };
  for (const groep of Object.keys(maxRang) as LaagGroep[]) {
    const lijst = lagen.filter(l => l.groep === groep);
    const groottes = [...new Set(lijst.map(l => Math.abs(l.offset)))].sort((a, b) => b - a);
    for (const l of lijst) l.rang = groottes.indexOf(Math.abs(l.offset));
    maxRang[groep] = Math.max(0, groottes.length - 1);
  }

  return { standen, rondom, midden, lagen, maxRang, vloerverwarmingOp, batterijNaarZolder: !!zolderPlek };
}
