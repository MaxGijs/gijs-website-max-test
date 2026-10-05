import { createTimeline, type Timeline } from "animejs";
// Three.js-adapter van Anime.js: maakt x/y/z, rotateX/Y/Z, scaleX/Y/Z en opacity direct animeerbaar op Object3D's.
import "animejs/adapters/three";
import { type Mesh, type MeshStandardMaterial, type Light, type Material, type Object3D, type Vector3 } from "three";
import { GIJS_GROEN, HIGHLIGHT, type Anker, type Stand, type bouwRoute } from "../WoningScene";
import { EIND, STAP } from "../stappen";
import { FOCUS, STATEN, type FocusSleutel, type Staat } from "./staten";

// PROTOTYPE (branch animejs-poppenhuis-prototype). Zie ./staten.ts voor welke objecten per staat bewegen.

type Route = ReturnType<typeof bouwRoute>;
type As = "x" | "y" | "z";
type Laag = { object: Object3D; as: As; origin: number; offset: number; rang: number };
/** Installatie die bij haar hoofdstuk verschijnt: vervagen, en optioneel een kleine schaalbeweging of "neerleggen". */
type Installatie = { objecten: Object3D[]; materialen: MeshStandardMaterial[]; schaal: Map<Object3D, Vector3>; y: Map<Object3D, number>; krimp: number; zak: number };

/** Hoe ver de kopgevel naar buiten schuift (lokale modeleenheden, gelijk aan zetKopgevel in maquette.ts). */
const KOP_AFSTAND = 2.2;
/** Hoeveel de rest van de woning dimt als er een bouwdeel in focus is. */
const DIM = 0.12;
/** Hoe ver het raam bij "Kozijnen" uit de gevel komt (lokale modeleenheden). */
const RAAM_UIT = 0.15;

const materialenVan = (mesh: Mesh) => (Array.isArray(mesh.material) ? mesh.material : [mesh.material]);

/**
 * Zorgt dat de materialen van `object` (die door `filter` komen) alleen door dit object gebruikt worden.
 * prepareHouse kloont al per mesh, maar dit voorkomt dat een later gedeeld materiaal (bv. uit maquette.ts)
 * per ongeluk ook elders mee gaat oplichten of vervagen.
 */
function eigenMaterialen(scene: Object3D, object: Object3D, filter?: (m: MeshStandardMaterial) => boolean) {
  const totaal = new Map<Material, number>();
  scene.traverse(o => { if ((o as Mesh).isMesh) for (const m of materialenVan(o as Mesh)) totaal.set(m, (totaal.get(m) ?? 0) + 1); });
  const binnen = new Map<Material, number>();
  object.traverse(o => { if ((o as Mesh).isMesh) for (const m of materialenVan(o as Mesh)) binnen.set(m, (binnen.get(m) ?? 0) + 1); });
  const lijst: MeshStandardMaterial[] = [];
  object.traverse(o => {
    const mesh = o as Mesh;
    if (!mesh.isMesh) return;
    const nieuw = materialenVan(mesh).map(m => {
      const std = m as MeshStandardMaterial;
      if (!std.isMeshStandardMaterial || (filter && !filter(std))) return m;
      const eigen = (totaal.get(m) ?? 0) > (binnen.get(m) ?? 0) ? std.clone() : std;
      lijst.push(eigen);
      return eigen;
    });
    mesh.material = Array.isArray(mesh.material) ? nieuw : nieuw[0];
  });
  return [...new Set(lijst)];
}

export type Doelen = ReturnType<typeof maakDoelen>;

/** Verzamelt eenmalig de bestaande objecten en materialen die het prototype animeert (geen nieuwe meshes). */
export function maakDoelen(scene: Object3D, route: Route, kopgevel: Object3D, kopMaterialen: Material[]) {
  const lagen = (stap: number): Laag[] => {
    const lijst = route.bewegingen
      .filter(b => b.stap === stap && !b.object.name.startsWith("Zonnepaneel"))
      .map(b => {
        const as: As = Math.abs(b.offset.x) > 0 ? "x" : Math.abs(b.offset.y) > 0 ? "y" : "z";
        return { object: b.object, as, origin: b.origin[as], offset: b.offset[as], rang: 0 };
      });
    // Rang: buitenste laag (grootste verschuiving) eerst, isolatie als laatste.
    const groottes = [...new Set(lijst.map(l => Math.abs(l.offset)))].sort((a, b) => b - a);
    for (const l of lijst) l.rang = groottes.indexOf(Math.abs(l.offset));
    return lijst;
  };

  // Oplichten: dezelfde onderdelen als op de huidige homepage (route.oplichten), met eigen materialen.
  const highlight = {} as Record<FocusSleutel, MeshStandardMaterial[]>;
  for (const sleutel of FOCUS) {
    highlight[sleutel] = route.oplichten[sleutel].flatMap(({ object, filter }) => object ? eigenMaterialen(scene, object, filter) : []);
    for (const m of highlight[sleutel]) { m.emissive.copy(GIJS_GROEN); m.emissiveIntensity = 0; }
  }

  // Installaties: verborgen tot hun eigen hoofdstuk (zelfde objecten als op de huidige homepage).
  const installatie = (objecten: Object3D[], krimp: number, zak: number): Installatie => {
    const materialen = [...new Set(objecten.flatMap(o => eigenMaterialen(scene, o)))];
    for (const m of materialen) { m.transparent = true; m.opacity = 0; }
    const y = new Map(objecten.map(o => [o, o.position.y]));
    for (const o of objecten) { o.visible = false; o.position.y += zak; }
    return { objecten, materialen, schaal: new Map(objecten.map(o => [o, o.scale.clone()])), y, krimp, zak };
  };
  const installaties = {
    // Zonnepanelen worden "gelegd": vervagen in en zakken een paar centimeter op hun plek.
    zon: installatie(scene.children.filter(o => o.name.startsWith("Zonnepaneel") && !o.userData.garagePanel), 0, 0.12),
    pomp: installatie(scene.children.filter(o => o.name.startsWith("Warmtepomp")), 0.94, 0),
    batterij: installatie(scene.children.filter(o => o.name === "Thuisbatterij"), 0.94, 0),
  };
  // Garagepanelen (alleen bij andere woningtypes) blijven buiten beeld.
  for (const o of scene.children) if (o.userData.garagePanel) o.visible = false;

  // Kozijnen: het raam waar de camera op richt (bouwRoute kiest het grootste raam in de voorgevel).
  const raam = route.oplichten.kozijn[0]?.object ?? null;
  const raamZ = raam?.position.z ?? 0;

  for (const m of kopMaterialen) m.userData.basisOpacity ??= m.opacity;
  // Bewaking: staat i moet bij camerastand i horen (zelfde indexen als STAP/EIND in stappen.ts).
  STATEN.forEach((st, i) => { if (st.focus && STAP[st.focus] !== i) console.warn(`[anime-prototype] staat ${st.id} staat niet op index ${STAP[st.focus]}`); });
  if (STATEN.length - 1 !== EIND) console.warn("[anime-prototype] overzicht hoort op index EIND");

  return {
    kopgevel, kopMaterialen,
    dak: lagen(STAP.dak), spouw: lagen(STAP.spouw), vloer: lagen(STAP.vloer),
    installaties, raam, raamZ,
    highlight, ankers: route.ankers as Record<FocusSleutel, Anker | null>,
    // De staatindexen vallen samen met STAP/EIND uit stappen.ts: de bestaande camerastanden direct hergebruiken.
    standen: route.standen as Stand[], midden: route.midden,
    /** Proxy-objecten: Anime.js tweent deze getallen, de scène past ze per frame toe. */
    camera: { t: 1 },
    labels: Object.fromEntries(FOCUS.map(s => [s, { zicht: 0 }])) as Record<FocusSleutel, { zicht: number }>,
    lichten: [] as { licht: Light; basis: number }[],
  };
}

/**
 * Bouwt één Anime.js-timeline van de huidige toestand naar `naar`. De timeline speelt nooit zelf af
 * (autoplay: false) en zit dus niet in de Anime.js-engine-loop: de scène zet hem vanuit R3F's useFrame
 * met tl.seek(tijd). Zo is er maar één render-/animatielus voor de 3D-woning.
 * Begint altijd vanaf de huidige waarden, zodat onderbreken (snel scrollen, dev-knoppen) vloeiend omleidt.
 */
export function bouwOvergang(d: Doelen, naar: Staat, schaal: number): Timeline {
  const tl = createTimeline({ autoplay: false, composition: false, defaults: { composition: "none", ease: "inOutCubic" } });

  // Camera: één proxywaarde 0 → 1; de boog rond de woning (mengStanden) rekent de scène zelf uit.
  d.camera.t = 0;
  tl.add(d.camera, { t: 1, duration: 1150, ease: "inOutSine" }, 0);

  // 1. Kopgevel: rustig naar buiten schuiven (Three.js-adapter: `x`), pas halverwege vervagen.
  const kopX = naar.kop * KOP_AFSTAND * schaal;
  const opent = kopX > d.kopgevel.position.x;
  tl.add(d.kopgevel, { x: kopX, duration: 1000, ease: "inOutQuad" }, 0);
  if (d.kopMaterialen.length) tl.add(d.kopMaterialen, {
    opacity: (m: unknown) => ((m as Material).userData.basisOpacity as number) * (1 - naar.kop),
    duration: opent ? 550 : 450,
    delay: opent ? 450 : 0,
    ease: "linear",
  }, 0);

  // 2-4. Lagen van dak, spouwmuur en vloer: elke laag naar origin + offset * waarde, buitenste laag eerst.
  const lagen = (lijst: Laag[], waarde: number) => {
    if (!lijst.length) return;
    const maxRang = Math.max(...lijst.map(l => l.rang));
    for (const l of lijst) {
      const doel = l.origin + l.offset * waarde * schaal;
      const uit = Math.abs(doel - l.origin) > Math.abs(l.object.position[l.as] - l.origin);
      tl.add(l.object, {
        [l.as]: doel,
        duration: 850,
        // Uit elkaar: buitenste laag eerst. Terug: binnenste laag eerst, dan de rest er rustig op.
        delay: 250 + (uit ? l.rang : maxRang - l.rang) * 90,
        ease: "inOutCubic",
      }, 0);
    }
  };
  lagen(d.dak, naar.dak);
  lagen(d.spouw, naar.spouw);
  lagen(d.vloer, naar.vloer);

  // Kozijnen: het raam komt een stukje uit de gevel naar voren (Three.js-adapter: `z`), en weer terug.
  if (d.raam) tl.add(d.raam, { z: d.raamZ + RAAM_UIT * naar.raam * schaal, duration: 700, delay: 400, ease: "inOutCubic" }, 0);

  // Installaties: vervagen, kleine schaalbeweging (scaleX/Y/Z) of neerleggen (y).
  // Zolang het dak nog open staat wachten de zonnepanelen, zodat ze niet onder de opgetilde pannen verschijnen.
  const dakOpen = d.dak.some(l => Math.abs(l.object.position[l.as] - l.origin) > 0.01);
  const installatie = (inst: Installatie, aan: number, wacht: number) => {
    if (!inst.objecten.length) return;
    const delay = aan ? wacht : 0;
    tl.add(inst.materialen, { opacity: aan, duration: aan ? 600 : 300, delay, ease: "outQuad" }, 0);
    for (const o of inst.objecten) {
      const params: Record<string, number | string> = { duration: aan ? 700 : 300, delay, ease: "outCubic" };
      if (inst.krimp) { const s = inst.schaal.get(o)!, f = aan ? 1 : inst.krimp; params.scaleX = s.x * f; params.scaleY = s.y * f; params.scaleZ = s.z * f; }
      if (inst.zak) params.y = inst.y.get(o)! + (aan ? 0 : inst.zak);
      if (inst.krimp || inst.zak) tl.add(o, params, 0);
    }
  };
  installatie(d.installaties.zon, naar.zon, dakOpen ? 1300 : 500);
  installatie(d.installaties.pomp, naar.pomp, 500);
  installatie(d.installaties.batterij, naar.batterij, 500);

  // Groene zweem op het bouwdeel in focus (emissiveIntensity op de eigen materialen).
  for (const sleutel of FOCUS) {
    const lijst = d.highlight[sleutel];
    if (!lijst.length) continue;
    const aan = naar.focus === sleutel;
    tl.add(lijst, { emissiveIntensity: aan ? HIGHLIGHT[sleutel] ?? 0.38 : 0, duration: aan ? 600 : 350, delay: aan ? 750 : 0, ease: "inOutSine" }, 0);
  }

  // Rest van de woning iets dimmen: alleen de lichtsterkte, geen extra materialen of transparantie.
  if (d.lichten.length) tl.add(d.lichten.map(l => l.licht), {
    intensity: (l: unknown) => (d.lichten.find(x => x.licht === l)?.basis ?? 1) * (1 - DIM * naar.dim),
    duration: 900,
    ease: "inOutSine",
  }, 0);

  // Annotaties: oude meteen weg, nieuwe pas als de camera bijna staat.
  for (const sleutel of FOCUS) {
    const aan = naar.focus === sleutel;
    tl.add(d.labels[sleutel], { zicht: aan ? 1 : 0, duration: aan ? 350 : 200, delay: aan ? 950 : 0, ease: "linear" }, 0);
  }
  return tl;
}
