"use client";
/* eslint-disable react-hooks/immutability -- Three.js owns these cloned scenes and the imperative camera controls. */

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Box3, Color, Mesh, MeshStandardMaterial, Plane, Vector3, type Object3D, type Texture } from "three";
import { createTimeline, type Timeline } from "animejs";
import { prepareHouse, disposeHouse } from "@/lib/house-model";
import { HOUSE_MODELS, baseHouseType } from "@/lib/woning-types";
import { getOpenSide } from "@/lib/house-variants";
import { useWoningDraft } from "./WoningDraftProvider";
import { makeInsulationCrew } from "@/lib/insulation-crew";
import { maakRealistisch } from "@/lib/house-realism";
import { inLaag } from "@/lib/house-states";
import type { Antwoord } from "@/lib/scan-session";
import { maakCutaway, zetKopgevel } from "@/components/home/cutaway/maquette";
import { HouseDaglicht } from "./HouseDaglicht";
import { mengStanden, type Stand } from "@/lib/camera-cutaway";
import { AFGIFTE_STAAT, bouwKruipruimte, bouwScanRoute, MAATREGEL_STAAT, STAAT_AFGIFTE, STAAT_MAATREGEL, STAAT_VERWARMING, VERWARMING_STAAT, type CameraState, type Laag, type LaagGroep } from "./scan-camera";
import { INDELING_RIJ, INDELING_VRIJ, batterijNaarZolder, bouwVerwarming, vervangVloerverwarming, zetBatterijInTrapkast } from "./verwarming-objecten";
import { bouwVrijInterieur } from "./vrij-interieur";
import styles from "./HouseViewer.module.css";

/** Zelfde cameraovergang als de homepage (anime-prototype/regie.ts, bouwOvergang). */
const CAMERA_DUUR = 1150;
/** Tempo van de monteur (spouwisolatie): de hele ploeg-tijdlijn (0..3,4) loopt zoveel keer sneller. */
const CREW_TEMPO = 1.8;
/** Moment (ms) waarop de spouw vol is (ploegtijd 3) en de buitenmuur kan openschuiven. */
const SPOUW_VOL_MS = 3000 / CREW_TEMPO;
/** Als er al een beweging liep (snel achter elkaar klikken): korter, zonder opnieuw op te starten. */
const CAMERA_SNEL = 650;
/**
 * Bovengrens voor de frame-delta in de eigen easings (maatregelen verschijnen, doorsnede): met
 * frameloop="demand" is de eerste delta na een rustpauze de hele pauze (gemeten: 7-26 s), waardoor
 * alles in één frame naar de eindstand sprong. Camera en lagen gebruiken helemaal geen delta.
 */
const MAX_DT = 1 / 30;
/** Onderdelen die oplichten als je ze rondom bekijkt (vinkjes "Welke stappen heb je al gezet?"). */
const LICHT: Record<string, RegExp> = {
  zonnepanelen: /^Zonnepaneel/, dakisolatie: /^Dakisolatie$/, gevelisolatie: /^(Spouwisolatie|Zijgevel_garage_isolatie)/,
  "glas-kozijnen": /^(Raam|Kozijn)/, warmtepomp: /^Warmtepomp/, thuisbatterij: /^Thuisbatterij/,
  vloerisolatie: /^Vloerisolatie$/, vloerverwarming: /^Vloerverwarming$/,
  cvketel: /^Verwarming_cvketel$/, stadsverwarming: /^Verwarming_stadsverwarming$/, openhaard: /^Verwarming_openhaard$/,
  luchtverwarming: /^Verwarming_luchtverwarming$/, convectorputten: /^Afgifte_convectorput$/, garage: /^(Garage|Zijgevel_garage)/, aanbouw: /^Aanbouw$/, dakkapel: /^Dakkapel/,
};
const LICHT_KLEUR = new Color("#3fd18f");
const GEEN: string[] = [];
/** Twee rustige pulsen bij het oplichten, daarna een vaste zachte gloed. */
const LICHT_PULS = 2400;
const MAATREGELEN = ["zonnepanelen", "warmtepomp", "dakisolatie", "gevelisolatie", "vloerisolatie", "glas-kozijnen", "vloerverwarming", "thuisbatterij"];

/**
 * Welk deel van de woning net beantwoord of aangeklikt is: de camera beweegt er vloeiend naartoe en
 * het bijbehorende onderdeel doet zijn eigen beweging. null = overzicht. Zie scan-camera.ts.
 */
export type HouseFocus = Exclude<CameraState, "overview"> | null;
export { AFGIFTE_STAAT, MAATREGEL_STAAT, VERWARMING_STAAT };

type Props = {
  selectedMeasureIds: string[];
  className?: string;
  replayCrew?: number;
  /** 0 = geen dakkapel, 1 of 2 = zoveel dakkapellen tonen. */
  dakkapelAantal?: number;
  /** Standaard true; heeft alleen zichtbaar effect bij een vrijstaand-achtig woningtype (de garage-groep). */
  garageAanwezig?: boolean;
  /** Standaard false: de illustratieve aanbouw tegen de achtergevel, alleen in de scan. */
  aanbouwAanwezig?: boolean;
  /** Alleen bij een hoekwoning: aan welke kant de buurwoning staat. */
  hoekZijde?: "Links" | "Rechts";
  /** Doorsnede: de vrije zijde (zie getOpenSide) open tonen. Standaard true. */
  cutawayOpen?: boolean;
  /** Welke vraag/maatregel nu actief is; stuurt camera en beweging (zie HouseFocus). */
  focus?: HouseFocus;
  /** Antwoord op "Kruipruimte": bij "ja" verschijnt de kruipruimte onder de vloer. */
  kruipruimte?: Antwoord | null;
  /** Antwoord op "Spouwmuren": bij "ja" schuift de buitenmuur open en zie je de spouw. */
  spouwmuur?: Antwoord | null;
  /** Aangeroepen door de knop "Hele woning" (terug naar het overzicht). */
  onFocusChange?: (focus: HouseFocus) => void;
  /**
   * Compacte weergave (mobiele sticky mini-woning tijdens de scanvragen): kleiner canvas, geen
   * bediening en dpr vast op 1 — dezelfde scene, lichter getekend.
   */
  compact?: boolean;
  onBekijkWoning?: () => void;
  /** Vult de hele (sticky) kolom zoals de homepage-woning, zonder kaart eromheen. */
  vol?: boolean;
  /**
   * Rondom: de hele woning blijft in beeld; de camera draait eromheen naar het onderdeel van `focus`
   * en dat onderdeel licht op, in plaats van in te zoomen.
   */
  rondom?: boolean;
  /** Gekozen verwarming (VERWARMING_OPTIES): het toestel verschijnt in het poppenhuis. */
  verwarming?: string[];
  /** Gekozen warmteafgifte (AFGIFTE_OPTIES): convectorputten verschijnen, radiatoren lichten op. */
  afgifte?: string[];
};

type ModelProps = Props & { onLoaded: () => void };

function Model({ selectedMeasureIds, onLoaded, replayCrew = 0, dakkapelAantal = 1, garageAanwezig = true, aanbouwAanwezig = false, hoekZijde, cutawayOpen = true, focus = null, kruipruimte = null, spouwmuur = null, rondom = false, verwarming = GEEN, afgifte = GEEN }: ModelProps) {
  const { draft } = useWoningDraft();
  const type = draft.houseType;
  const gltf = useLoader(GLTFLoader, HOUSE_MODELS[type].url);
  // Altijd een zijaanzicht, met de doorsnede rechts in beeld (gespiegeld getekend waar nodig):
  // - hoekwoning/tussenwoning: de rechterkopgevel open, zoals de homepage-maquette (interieur en kopgevel
  //   zijn voor die kant gemaakt); hoekwoning met de buren rechts = dezelfde woning gespiegeld;
  // - vrijstaand en twee-onder-een-kap: open aan de kant zonder garage (de vrije zijgevel of de gedeelde
  //   muur); gespiegeld staat de garage links en de doorsnede rechts.
  const vrijModel = baseHouseType(type) !== "hoekwoning";
  const spiegel = (type === "hoekwoning" && hoekZijde === "Rechts") || vrijModel;
  const lokaleZijde = type === "hoekwoning" && spiegel ? "Links" : hoekZijde;
  // Op het grondblok van de homepage-maquette staat de bus dichter bij de gevel (anders half in de lucht).
  const crew = useMemo(() => makeInsulationCrew(type, baseHouseType(type) === "hoekwoning" ? 1.95 : 2.7), [type]);
  const model = useMemo(() => {
    const huis = prepareHouse(gltf.scene, type, true, lokaleZijde);
    const texturen = maakRealistisch(huis.scene);
    const kant = vrijModel ? "links" : type === "tussenwoning" ? "rechts" : getOpenSide(type, lokaleZijde);
    // Rijwoningen gebruiken hetzelfde model als de homepage: dezelfde maquette met interieur,
    // tuin, kruipruimte en wegschuivende kopgevel (maakCutaway). De vrijstaande modellen krijgen een
    // eigen interieur in dezelfde stijl (bouwVrijInterieur).
    const maquette = !vrijModel;
    const indeling = maquette ? INDELING_RIJ : INDELING_VRIJ;
    let cutaway: ReturnType<typeof maakCutaway> | null = null;
    const extraTexturen: Texture[] = [];
    if (maquette) cutaway = maakCutaway(huis.scene);
    else extraTexturen.push(...bouwVrijInterieur(huis.scene, indeling));
    bouwVerwarming(huis.scene, indeling);
    // Thuisbatterij binnen in de trapkast (bij een aanbouw hoeft hij dus niet te verhuizen), met de
    // meterkast ernaast aan de halkant; met een open haard op zolder.
    zetBatterijInTrapkast(huis.scene, indeling);
    batterijNaarZolder(huis.scene, indeling);
    bouwKruipruimte(huis.scene, maquette, kant);
    vervangVloerverwarming(huis.scene, indeling);
    // Dakvlak voor de dakkapellen: alles van de dakkapel onder het dakvlak wordt weggeknipt, zodat hij
    // niet door de zolder steekt. Iets onder de pannen, zodat er geen kier is.
    let dakVlak: { ridge: number; helling: number; cz: number; pannen: Object3D; y0: number } | null = null;
    const pannen = huis.scene.getObjectByName("Dakpannen");
    if (pannen) {
      huis.scene.updateMatrixWorld(true);
      const d = new Box3().setFromObject(pannen); d.min.divide(huis.scene.scale); d.max.divide(huis.scene.scale);
      dakVlak = { ridge: d.max.y - 0.08, helling: (d.max.y - d.min.y) / ((d.max.z - d.min.z) / 2), cz: (d.min.z + d.max.z) / 2, pannen, y0: pannen.position.y };
      for (const sch of huis.scene.children.filter(o => o.name.startsWith("Schoorsteen"))) {
        const b = new Box3().setFromObject(sch); b.min.divide(huis.scene.scale); b.max.divide(huis.scene.scale);
        sch.userData.dakvlakIndex = (b.min.z + b.max.z) / 2 >= dakVlak.cz ? 0 : 1;
      }
    }
    // Aanbouw: de warmtepomp op het platte dak (doel uit addAanbouw), gerekend vanaf waar hij nu staat.
    const pomp = huis.scene.getObjectByName("Warmtepomp_DeWarmte");
    const dakDoel = pomp?.userData.aanbouwDak as { vrij: [number, number][]; y: number; gevelZ: number; midX: number } | undefined;
    if (pomp && dakDoel) {
      // Altijd tegen de achtergevel van de woning (niet midden op het dak), en niet voor een raam:
      // eerst met de lange kant tegen de gevel, past dat niet dan een kwartslag gedraaid (smaller), en
      // anders op het breedste vrije stuk.
      const doos = () => { huis.scene.updateMatrixWorld(true); const b = new Box3().setFromObject(pomp); b.min.divide(huis.scene.scale); b.max.divide(huis.scene.scale); return b; };
      const breedste = (min: number) => dakDoel.vrij.filter(([v, t]) => t - v >= min).sort((p, q) => (q[1] - q[0]) - (p[1] - p[0]))[0];
      const basis = doos();
      let draai = 0, plek = breedste(basis.max.x - basis.min.x + 0.1);
      if (!plek && breedste(basis.max.z - basis.min.z + 0.1)) { draai = Math.PI / 2; plek = breedste(basis.max.z - basis.min.z + 0.1); }
      plek ??= breedste(0);
      pomp.rotation.y += draai;
      const b = doos();
      pomp.rotation.y -= draai;
      const c = b.getCenter(new Vector3());
      const x = plek ? (plek[0] + plek[1]) / 2 : dakDoel.midX, z = dakDoel.gevelZ - (b.max.z - b.min.z) / 2 - 0.06;
      pomp.userData.aanbouwPositie = [pomp.position.x + x - c.x, pomp.position.z + z - c.z, pomp.position.y + dakDoel.y - b.min.y];
      pomp.userData.aanbouwDraai = draai;
      pomp.userData.basisDraai = pomp.rotation.y;
    }
    // Eigen materialen voor onderdelen die kunnen oplichten, zodat de gloed niet meelekt naar andere
    // onderdelen met hetzelfde (gedeelde) materiaal.
    for (const root of huis.scene.children) {
      if (!Object.values(LICHT).some(re => re.test(root.name))) continue;
      root.traverse(part => { const mesh = part as Mesh; if (mesh.isMesh) mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone(); });
    }
    // De planten in de hoek van woonkamer en slaapkamer (maquette) maken plaats voor de kachel en zijn
    // rookkanaal bij een open haard.
    const plantVoor: Object3D[] = [];
    huis.scene.traverse(o => { if (o.name === "Plant_kachelplek") plantVoor.push(o); });
    // Radiatoren (in het interieur, groep "Radiator"): eigen materialen, zodat ze los kunnen oplichten.
    const radiatoren: { mat: MeshStandardMaterial; emissive: Color; intensiteit: number }[] = [];
    huis.scene.traverse(o => {
      if (o.name !== "Radiator") return;
      o.traverse(part => {
        const mesh = part as Mesh;
        if (!mesh.isMesh) return;
        const mat = (mesh.material as MeshStandardMaterial).clone();
        mesh.material = mat;
        radiatoren.push({ mat, emissive: mat.emissive.clone(), intensiteit: mat.emissiveIntensity });
      });
    });
    const meterkastDeur = huis.scene.getObjectByName("Meterkast_deur") ?? null;
    return { ...huis, spiegel, kant, cutaway, dakVlak, plantVoor, meterkastDeur, radiatoren, texturen: [...texturen, ...extraTexturen, ...(cutaway?.texturen ?? [])] };
  }, [gltf, type, lokaleZijde, spiegel, vrijModel]);
  const route = useMemo(() => bouwScanRoute(model, model.kant, crew.worker), [model, crew]);
  const lagenPerObject = useMemo(() => {
    const m = new Map<Object3D, Laag[]>();
    for (const l of route.lagen) m.set(l.object, [...(m.get(l.object) ?? []), l]);
    return m;
  }, [route]);

  // Camera en lagen precies zoals de homepage (anime-prototype): Anime.js-timelines (autoplay: false)
  // op proxywaarden, in useFrame gezet met wandkloktijd (performance.now), nooit met R3F's delta.
  const cam = useRef({ t: 1 });
  const overgang = useRef({
    tl: null as Timeline | null,
    start: 0,
    van: null as Stand | null,
    naar: null as Stand | null,
    route: null as typeof route | null,
    vervolg: null as { naar: Stand; op: number } | null,
    weergave: new Vector3(),
    huidig: { pos: new Vector3(), look: new Vector3() } as Stand,
    lagenTl: null as Timeline | null,
    lagenStart: 0,
    lagenRoute: null as typeof route | null,
    vvTl: null as Timeline | null,
    vvStart: 0,
    vvRoute: null as typeof route | null,
  });
  const vv = useRef({ y: 0 });
  const crewTime = useRef(3.4);
  const crewToestand = useRef({ aan: false, replay: replayCrew, focus: null as HouseFocus });
  const fillPlane = useMemo(() => new Plane(new Vector3(0, -1, 0), 0), []);
  /** Dakvlak voor (0) en achter (1): de dakkapel wordt daaronder weggeknipt (wereldcoördinaten, per frame). */
  const dakkapelVlakken = useMemo(() => [new Plane(), new Plane()] as const, []);
  const parts = useMemo(() => model.scene.children.map(root => ({
    root, origin: root.position.clone(), scale: root.scale.clone(),
    materials: (() => { const result: { mat: MeshStandardMaterial; color: Color; emissive: Color; emissiveIntensity: number; name: string; opacity: number; transparent: boolean }[] = []; root.traverse(part => {
      if (!(part as Mesh).isMesh) return;
      const mesh = part as Mesh;
      for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) if ((mat as MeshStandardMaterial).isMeshStandardMaterial) result.push({ mat: mat as MeshStandardMaterial, color: (mat as MeshStandardMaterial).color.clone(), emissive: (mat as MeshStandardMaterial).emissive.clone(), emissiveIntensity: (mat as MeshStandardMaterial).emissiveIntensity, name: part.name, opacity: mat.opacity, transparent: mat.transparent });
    }); return result; })()
  })), [model]);
  const amounts = useRef<Record<string, number>>({});
  const initialized = useRef(false);
  const reduced = useRef(false);
  const glasKleur = useMemo(() => new Color("#6eb5cd"), []);
  const { camera, invalidate } = useThree();

  // Wat er nu in de woning staat: gekozen/aanwezige maatregelen, plus de maatregel die je net bekijkt
  // (via een vraag of een vinkje) — die verschijnt dan alvast, zoals bij de homepage-hoofdstukken.
  const voorbeeld = focus ? STAAT_MAATREGEL[focus] : undefined;
  const aanwezig = (id: string) => selectedMeasureIds.includes(id) || voorbeeld === id;
  const spouwAan = aanwezig("gevelisolatie");
  // Spouwisolatie: eerst spuit de monteur de spouw vol, daarna schuift de buitenmuur naar voren en zie
  // je de gevulde laag tussen de muren (homepage-spouw). Vraag "Spouwmuren: ja": meteen de lege spouw.
  const actieveGroep: LaagGroep | null = focus === "dak" ? "dak" : focus === "vloer" ? "vloer" : focus === "kozijn" ? "raam"
    : focus === "spouw" || (focus === "spouwmuur" && spouwmuur === "ja") ? "spouwmuur" : null;
  const verwarmingVoorbeeld = focus ? STAAT_VERWARMING[focus] : undefined;
  // Open haard: een kachel in de woonkamer (de plant gaat weg) en de thuisbatterij op zolder (zie
  // batterijNaarZolder en bouwVerwarming).
  const kachelAan = verwarming.includes("Open haard of kachel") || verwarmingVoorbeeld === "Open haard of kachel";
  const batterijOpZolder = route.batterijNaarZolder && kachelAan;

  // Naar een camerastaat (zelfde opzet als naarRef in de homepage-AnimeWoningScene). Twee dakkapellen:
  // uitzoomen naar beide dakvlakken. Spouwisolatie: eerst de monteur van voren, als de spouw vol is
  // (~3 s) door naar het zijaanzicht van de homepage-spouw, waar de buitenmuur openschuift.
  const camKey = focus === "dakkapel" && dakkapelAantal >= 2 ? "dakkapellen" : focus === "pomp" && aanbouwAanwezig ? "pompAanbouw"
    : focus === "batterij" && batterijOpZolder ? "batterijZolder" : focus ?? "overview";
  const camRondom = rondom && focus !== null;
  const lichtRe = camRondom && focus ? LICHT[voorbeeld ?? focus] : undefined;
  const lichtStart = useRef(0);
  useEffect(() => { lichtStart.current = performance.now(); invalidate(); }, [lichtRe, invalidate]);
  useEffect(() => {
    const o = overgang.current;
    const naar = (camRondom ? route.rondom : route.standen)[camKey];
    // Snel achter elkaar klikken: de lopende beweging gaat vloeiend over in een kortere nieuwe.
    const snel = o.tl !== null;
    o.tl?.cancel();
    o.tl = null;
    o.vervolg = camKey === "spouw" && !camRondom ? { naar: route.standen.spouwmuur, op: performance.now() + SPOUW_VOL_MS } : null;
    if (o.route !== route || reduced.current) {
      o.route = route;
      if (o.vervolg && reduced.current) { o.van = o.naar = o.vervolg.naar; o.vervolg = null; o.huidig.pos.copy(o.naar.pos); o.huidig.look.copy(o.naar.look); cam.current.t = 1; invalidate(); return; }
      o.van = o.naar = naar;
      o.huidig.pos.copy(naar.pos);
      o.huidig.look.copy(naar.look);
      o.weergave.copy(naar.pos);
      cam.current.t = 1;
    } else {
      // Start vanaf wat er nu in beeld is (incl. het terugtrekken halverwege), anders springt de camera.
      o.van = { pos: o.weergave.clone(), look: o.huidig.look.clone() };
      o.naar = naar;
      cam.current.t = 0;
      o.tl = createTimeline({ autoplay: false, composition: false, defaults: { composition: "none" } })
        .add(cam.current, { t: 1, duration: snel ? CAMERA_SNEL : CAMERA_DUUR, ease: snel ? "outSine" : "inOutSine" }, 0);
      o.start = performance.now();
    }
    invalidate();
  }, [camKey, camRondom, route, invalidate]);

  // Eigen beweging per maatregel: dezelfde gelaagde timing als bouwOvergang op de homepage
  // (uit elkaar: buitenste laag eerst; terug: binnenste laag eerst).
  useEffect(() => {
    const o = overgang.current;
    const snel = o.lagenTl !== null;
    o.lagenTl?.cancel();
    o.lagenTl = null;
    if (o.lagenRoute !== route || reduced.current) {
      o.lagenRoute = route;
      for (const l of route.lagen) l.v = l.groep === actieveGroep ? 1 : 0;
    } else {
      const tl = createTimeline({ autoplay: false, composition: false, defaults: { composition: "none", ease: "inOutCubic" } });
      // Bij spouwisolatie pas openschuiven als de spouw vol is (de monteur is na ~3 s klaar).
      const wacht = focus === "spouw" ? SPOUW_VOL_MS : 0;
      for (const l of route.lagen) {
        const doel = l.groep === actieveGroep ? 1 : 0;
        if (doel === l.v) continue;
        const uit = doel > l.v;
        const stap = (uit ? l.rang : route.maxRang[l.groep] - l.rang) * (snel ? 45 : 90);
        tl.add(l, { v: doel, duration: snel ? 450 : 850, delay: (uit ? wacht : 0) + (snel ? 0 : 250) + stap }, 0);
      }
      o.lagenTl = tl;
      o.lagenStart = performance.now();
    }
    invalidate();
  }, [actieveGroep, focus, route, invalidate]);

  // Vloerverwarming: de leidingen komen van boven en worden óp de begane-grondvloer gelegd; bij een
  // ander onderdeel zakken ze terug in de vloer (daar zitten ze in het echt, onder de afwerkvloer).
  useEffect(() => {
    const o = overgang.current;
    o.vvTl?.cancel();
    o.vvTl = null;
    const doel = focus === "vloerverwarming" ? route.vloerverwarmingOp : 0;
    if (o.vvRoute !== route || reduced.current) {
      o.vvRoute = route;
      vv.current.y = doel;
    } else if (doel !== vv.current.y) {
      if (doel > 0) vv.current.y = doel + 1.1;
      o.vvTl = createTimeline({ autoplay: false, composition: false, defaults: { composition: "none" } })
        .add(vv.current, { y: doel, duration: doel > 0 ? 1300 : 600, delay: doel > 0 ? 400 : 0, ease: doel > 0 ? "outCubic" : "inOutCubic" }, 0);
      o.vvStart = performance.now();
    }
    invalidate();
  }, [focus, route, invalidate]);
  useEffect(() => { const o = overgang.current; return () => { o.tl?.cancel(); o.lagenTl?.cancel(); o.vvTl?.cancel(); }; }, []);

  useEffect(() => { onLoaded(); return () => { disposeHouse(model.scene); model.texturen.forEach(t => t.dispose()); }; }, [model, onLoaded]);
  useEffect(() => () => disposeHouse(crew.crew), [crew]);
  // De monteur spuit de spouw vol zodra spouwisolatie verschijnt, bij elke keer dat je naar de spouw
  // gaat, en bij "Bekijk de monteur".
  useEffect(() => {
    const c = crewToestand.current;
    if ((spouwAan && !c.aan) || replayCrew !== c.replay || (focus === "spouw" && c.focus !== "spouw")) crewTime.current = 0;
    if (!spouwAan) crewTime.current = 3.4;
    c.aan = spouwAan; c.replay = replayCrew; c.focus = focus;
    invalidate();
  }, [spouwAan, replayCrew, focus, invalidate]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reduced.current = media.matches; invalidate(); };
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [invalidate]);
  useEffect(() => { invalidate(); }, [selectedMeasureIds, dakkapelAantal, garageAanwezig, aanbouwAanwezig, cutawayOpen, kruipruimte, spouwmuur, verwarming, invalidate]);

  useFrame((_, rawDelta) => {
    let moving = false;
    const delta = Math.min(rawDelta, MAX_DT);
    const o = overgang.current;
    const nu = performance.now();
    // 1. Timelines vooruitzetten met wandkloktijd (zoals de homepage).
    if (o.tl) { const v = nu - o.start; o.tl.seek(Math.min(v, o.tl.duration)); if (v >= o.tl.duration) o.tl = null; else moving = true; }
    // Tweede camerabeweging (spouw): pas starten als de eerste klaar is én het moment daar is.
    if (o.vervolg) {
      moving = true;
      if (!o.tl && nu >= o.vervolg.op) {
        o.van = { pos: o.weergave.clone(), look: o.huidig.look.clone() };
        o.naar = o.vervolg.naar;
        o.vervolg = null;
        cam.current.t = 0;
        o.tl = createTimeline({ autoplay: false, composition: false, defaults: { composition: "none" } }).add(cam.current, { t: 1, duration: CAMERA_DUUR, ease: "inOutSine" }, 0);
        o.start = nu;
      }
    }
    if (o.lagenTl) { const v = nu - o.lagenStart; o.lagenTl.seek(Math.min(v, o.lagenTl.duration)); if (v >= o.lagenTl.duration) o.lagenTl = null; else moving = true; }
    if (o.vvTl) { const v = nu - o.vvStart; o.vvTl.seek(Math.min(v, o.vvTl.duration)); if (v >= o.vvTl.duration) o.vvTl = null; else moving = true; }

    // 2. Camera: boog rond de woning (mengStanden), halverwege iets terug voor overzicht.
    if (o.van && o.naar) mengStanden(o.van, o.naar, cam.current.t, route.midden, o.huidig.pos, o.huidig.look);
    camera.position.copy(o.huidig.pos);
    if (cam.current.t > 0 && cam.current.t < 1) camera.position.sub(o.huidig.look).multiplyScalar(1 + 0.22 * Math.sin(Math.PI * cam.current.t)).add(o.huidig.look);
    camera.lookAt(o.huidig.look);
    camera.updateMatrixWorld();
    o.weergave.copy(camera.position);

    // 3. Woningstate: onderdelen rustig in- en uitfaden (begrensde delta, zie MAX_DT).
    crewTime.current = reduced.current ? 3.4 : Math.min(3.4, crewTime.current + delta * CREW_TEMPO);
    const t = crewTime.current;
    const filling = spouwAan && t < 3;
    const fill = spouwAan ? Math.max(0, Math.min(1, (t - 1) / 2)) : 0;
    fillPlane.constant = model.position.y + model.scale * (-2.75 + fill * 8.5);
    const naar = (sleutel: string, doel: number, snelheid: number) => {
      const huidig = amounts.current[sleutel] ?? doel;
      const v = !initialized.current || reduced.current ? doel : huidig + (doel - huidig) * (1 - Math.exp(-snelheid * delta));
      amounts.current[sleutel] = Math.abs(v - doel) < .001 ? doel : v;
      if (amounts.current[sleutel] !== doel) moving = true;
    };
    for (const id of MAATREGELEN) naar(id, aanwezig(id) && (id !== "gevelisolatie" || !filling) ? 1 : 0, 8);
    naar("doorsnede", cutawayOpen ? 1 : 0, 7);
    // De grond in de kruipruimte zakt weg bij "Kruipruimte: ja" en als je naar de vloer kijkt (daar zakken
    // de vloerlagen in).
    naar("kruip", kruipruimte === "ja" || actieveGroep === "vloer" ? 1 : 0, 5);
    naar("kapelAchter", dakkapelAantal >= 1 ? 1 : 0, 5);
    naar("kapelVoor", dakkapelAantal >= 2 ? 1 : 0, 5);
    const sinds = nu - lichtStart.current;
    const puls = reduced.current || sinds > LICHT_PULS ? 0 : 0.5 - 0.5 * Math.cos((sinds / LICHT_PULS) * 4 * Math.PI);
    if (lichtRe && puls > 0) moving = true;
    initialized.current = true;
    const a = amounts.current;
    const garageInDoorsnede = cutawayOpen && model.kant === "rechts" && focus !== "garage";

    for (const { root, origin, scale, materials } of parts) {
      const name = root.name;
      naar(`licht:${name}`, lichtRe?.test(name) ? 1 : 0, 6);
      const licht = (a[`licht:${name}`] ?? 0) * (0.4 + 0.3 * puls);
      root.position.copy(origin); root.scale.copy(scale); root.visible = true;
      let fade = 1;
      // Dakkapel: bij "1" alleen de achterdakkapel, bij "2" ook de voorzijde (lib/house-model.ts). Een
      // dakkapel die erbij komt zakt vanaf boven op zijn plek (met de panelen die erop liggen).
      // Convectorputten (warmteafgifte): verschijnen als ze aangevinkt (of net bekeken) worden.
      const afgifteDeel = root.userData.afgifte as string | undefined;
      if (afgifteDeel) {
        naar(`afgifte:${afgifteDeel}`, afgifte.includes(afgifteDeel) || (focus ? STAAT_AFGIFTE[focus] : undefined) === afgifteDeel ? 1 : 0, 8);
        const av = a[`afgifte:${afgifteDeel}`];
        root.visible = av > .001;
        fade = av;
      }
      const toestel = root.userData.verwarming as string | undefined;
      if (toestel) {
        naar(`verwarming:${toestel}`, verwarming.includes(toestel) || verwarmingVoorbeeld === toestel ? 1 : 0, 8);
        const av = a[`verwarming:${toestel}`];
        root.visible = av > .001;
        root.scale.multiplyScalar(0.94 + 0.06 * av);
        fade = av;
      }
      const dormerNaam = root.userData.dormerNaam as string | undefined;
      const kapelNaam = name === "Dakkapel" || name === "Dakkapel_voor" ? name : dormerNaam;
      const kapelA = kapelNaam === "Dakkapel" ? a.kapelAchter : kapelNaam === "Dakkapel_voor" ? a.kapelVoor : 1;
      if (kapelNaam) root.position.y += (1 - kapelA) * 0.9;
      if (name === "Dakkapel" || name === "Dakkapel_voor") { root.visible = kapelA > .001; fade = kapelA; }
      const dormerZichtbaar = !dormerNaam || kapelA > .001;
      // Panelen op het dakvlak: met een dakkapel op dat vlak verdwijnen de middelste en schuiven de
      // buitenste opzij; zonder dakkapel is er juist ruimte voor meer panelen.
      const vlak = root.userData.dakvlak as "voor" | "achter" | undefined;
      const vlakKapel = vlak === "voor" ? a.kapelVoor : vlak === "achter" ? a.kapelAchter : 0;
      if (vlak && root.userData.kapelX !== undefined) root.position.x = root.userData.vrijX + (root.userData.kapelX - root.userData.vrijX) * vlakKapel;
      const vrijVanKapel = !(vlak && root.userData.onderKapel && vlakKapel > .5);
      if (name === "Garage" && (!garageAanwezig || garageInDoorsnede)) root.visible = false;
      if (name === "Grond_garageplek") root.visible = !garageAanwezig;
      if ((name === "Zijgevel_garage_buiten" || name === "Raam_rechts_zolder") && garageInDoorsnede) root.visible = false;
      if (name === "Aanbouw" || name === "Fundering_aanbouw") root.visible = aanbouwAanwezig;
      if (aanbouwAanwezig && root.userData.onderAanbouw) root.visible = false;
      if (batterijOpZolder && root.userData.zolderPositie) { const plek = root.userData.zolderPositie as number[]; root.position.set(plek[0], plek[1], plek[2]); }
      if (root.userData.basisDraai !== undefined) root.rotation.y = root.userData.basisDraai + (aanbouwAanwezig ? root.userData.aanbouwDraai as number : 0);
      if (aanbouwAanwezig && root.userData.aanbouwPositie) { const plek = root.userData.aanbouwPositie as number[]; root.position.x = plek[0]; root.position.z = plek[1]; if (plek[2] !== undefined) root.position.y = plek[2]; }
      // Eigen beweging van de maatregel in beeld (homepage-lagen, getweend door Anime.js).
      const lagen = lagenPerObject.get(root);
      if (lagen) for (const l of lagen) root.position[l.as] += l.offset * l.v;
      // Installaties verschijnen zoals op de homepage: vervagen in; panelen worden "gelegd", de
      // warmtepomp en batterij maken een kleine schaalbeweging.
      const installation = inLaag(name, "solar-panels") ? "zonnepanelen" : inLaag(name, "heat-pump") ? "warmtepomp" : inLaag(name, "battery") ? "thuisbatterij" : null;
      if (installation) {
        const ai = a[installation];
        root.visible = ai > .001 && !(root.userData.garagePanel && (!garageAanwezig || garageInDoorsnede)) && dormerZichtbaar && vrijVanKapel;
        if (installation === "zonnepanelen") root.position.y += (1 - ai) * 0.12; else root.scale.multiplyScalar(0.94 + 0.06 * ai);
        fade = ai * (dormerNaam ? kapelA : 1) * (vlak && root.userData.onderKapel ? 1 - vlakKapel : 1);
      }
      if (name === "Dakisolatie") { root.visible = a.dakisolatie > .001; fade = a.dakisolatie; }
      if (name === "Vloerisolatie") { root.visible = a.vloerisolatie > .001; fade = a.vloerisolatie; }
      if (name === "Vloerverwarming") { root.visible = a.vloerverwarming > .001; fade = a.vloerverwarming; root.position.y += vv.current.y; }
      const cavity = /^(Spouwisolatie|Zijgevel_garage_isolatie)/.test(name);
      // Dakkapellen en schoorstenen: alles onder het dakvlak weggeknipt (anders steken ze door de zolder).
      const vlakIndex = name === "Dakkapel" ? 1 : name === "Dakkapel_voor" ? 0 : root.userData.dakvlakIndex as number | undefined;
      const kapelVlak = model.dakVlak && vlakIndex !== undefined ? dakkapelVlakken[vlakIndex] : null;
      if (cavity) root.visible = spouwAan && (fill > 0 || a.gevelisolatie > .001);
      // Kruipruimte: de grond zakt weg (rijwoning) of de kruipruimte verschijnt onder de vloer (vrijstaand).
      // Grond zakt naar de bodem (blijft dekkend: geen doorzichtige lagen die door elkaar flikkeren).
      if (name === "Kruipruimte_vulling") {
        root.visible = a.kruip < .995;
        root.scale.y = Math.max(.001, 1 - a.kruip);
        root.position.y -= (root.userData.hoogte as number) * a.kruip / 2;
      }
      if (name === "Kruipruimte") { root.visible = a.kruip > .001; fade = a.kruip; }
      const outer = !root.userData.sharedWall && (name.startsWith("Buitengevel") || name === "Zijgevel_garage_buiten");
      const window = /^(Raam|Kozijn|Voordeur|Achterdeur)/.test(name);
      // Doorsnede van de vrije zijde (vrijstaand en tussenwoning; bij de rijwoning doet de kopgevel
      // van de homepage dit, zie hieronder): de hele wandopbouw schuift open en vervaagt.
      const doorsnedeDeel = name === `Buitengevel_${model.kant}` || name === `Binnenmuur_${model.kant}` || name === `Spouwisolatie_${model.kant}` || name.startsWith(`Daklat_${model.kant}`)
        || (window && (name.includes(model.kant) || (model.kant === "voor" && name === "Voordeur")));
      if (doorsnedeDeel) {
        if (model.kant === "links") root.position.x -= a.doorsnede * 1.4;
        else if (model.kant === "rechts") root.position.x += a.doorsnede * 1.4;
        else root.position.z += a.doorsnede * 1.4;
        if (a.doorsnede > .995) root.visible = false;
        fade *= 1 - a.doorsnede;
      }
      for (const child of root.children) {
        if (child.name === "Kunststof_profiel") child.visible = a["glas-kozijnen"] > .5;
        if (child.name.startsWith("kozijn")) child.visible = a["glas-kozijnen"] <= .5;
      }
      for (const { mat, color, emissive, emissiveIntensity, name: partName, opacity: basis, transparent } of materials) {
        mat.color.copy(color);
        mat.emissive.copy(emissive);
        mat.emissiveIntensity = emissiveIntensity;
        if (licht > .001) { mat.emissive.lerp(LICHT_KLEUR, licht); mat.emissiveIntensity = Math.max(emissiveIntensity, 1); }
        if (window && /glas/i.test(partName)) mat.color.lerp(glasKleur, a["glas-kozijnen"]);
        mat.clippingPlanes = cavity && filling ? [fillPlane] : kapelVlak ? [kapelVlak] : null;
        // Spouwisolatie: tijdens het volspuiten zijn de buitenmuren grotendeels doorzichtig, zodat je de
        // spouw ziet vollopen; daarna schuift de buitenmuur open (zie actieveGroep).
        const opacity = (outer && filling && t >= 1 ? 0.2 : basis) * fade;
        mat.transparent = transparent || opacity < 1;
        mat.opacity = opacity;
        mat.depthWrite = opacity > .5;
      }
    }
    for (const deel of model.plantVoor) deel.visible = !kachelAan;
    // Radiatoren lichten op bij de afgiftekeuze "Normale radiatoren".
    naar("licht:radiatoren", camRondom && focus === "radiatoren" ? 1 : 0, 6);
    const radLicht = a["licht:radiatoren"] * (0.4 + 0.3 * puls);
    for (const r of model.radiatoren) {
      r.mat.emissive.copy(r.emissive);
      r.mat.emissiveIntensity = r.intensiteit;
      if (radLicht > .001) { r.mat.emissive.lerp(LICHT_KLEUR, radLicht); r.mat.emissiveIntensity = Math.max(r.intensiteit, 1); }
    }
    if (camRondom && focus === "radiatoren" && puls > 0) moving = true;
    // Meterkast: dicht, behalve bij stads- of blokverwarming (dan zie je de afleverset erin).
    naar("meterkastDeur", verwarming.includes("Stads- of blokverwarming") || verwarmingVoorbeeld === "Stads- of blokverwarming" ? 1 : 0, 5);
    if (model.meterkastDeur) model.meterkastDeur.rotation.y = -1.75 * a.meterkastDeur;
    // Dakvlakken voor het wegknippen van de dakkapel: beweegt mee met de pannen (lagen bij het dak).
    if (model.dakVlak) {
      const { ridge, helling, cz, pannen, y0 } = model.dakVlak;
      const top = new Vector3(0, ridge + pannen.position.y - y0, cz);
      model.scene.updateWorldMatrix(true, false);
      dakkapelVlakken[0].setFromNormalAndCoplanarPoint(new Vector3(0, 1, helling).normalize(), top).applyMatrix4(model.scene.matrixWorld);
      dakkapelVlakken[1].setFromNormalAndCoplanarPoint(new Vector3(0, 1, -helling).normalize(), top).applyMatrix4(model.scene.matrixWorld);
    }
    // Rijwoning: de kopgevel van de homepage (schuift weg en vervaagt), alleen als die de vrije zijde is.
    if (model.cutaway) {
      zetKopgevel(model.cutaway.kopgevel, model.cutaway.kopMaterialen, model.kant === "rechts" ? a.doorsnede : 0);
      for (const m of model.cutaway.kopMaterialen) m.depthWrite = m.opacity > .5;
    }

    // 4. De monteur (spouwisolatie).
    crew.crew.visible = spouwAan && t < 3.4 && !reduced.current;
    crew.truck.position.x = crew.truckX + (t < 1 ? (1 - t) * -2.4 : t > 3 ? (t - 3) / .4 * 2.4 : 0);
    crew.worker.visible = t >= .4 && t < 3;
    crew.worker.position.z = crew.workerZ + Math.max(0, 1 - (t - .4) / .6) * 1.1;
    crew.pipe.visible = t >= 1 && t < 3; crew.particles.visible = crew.pipe.visible;
    crew.truck.traverse(part => { if ((part as Mesh).isMesh) { const mesh = part as Mesh; for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) { material.transparent = t > 3; material.opacity = t > 3 ? Math.max(0, 1 - (t - 3) / .4) : 1; } } });
    crew.particles.children.forEach((particle, i) => { particle.position.z = .08 + ((t * 3 + i * .17) % 1) * .2; });
    if (spouwAan && t < 3.4 && !reduced.current) moving = true;

    if (moving) invalidate();
  });
  const s = model.scale;
  return (
    <group scale={[model.spiegel ? -s : s, s, s]} position={[model.spiegel ? -model.position.x : model.position.x, model.position.y, model.position.z]}>
      <primitive object={model.scene} />
      <primitive object={crew.crew} />
    </group>
  );
}

class ViewerBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className={styles.unavailable}><p>De 3D-woning is nu niet beschikbaar.</p><p>Je kunt de scan en de maatregelen hieronder gewoon gebruiken.</p></div> : this.props.children; }
}

const FOCUS_LABEL: Record<Exclude<HouseFocus, null>, string> = {
  kozijn: "de kozijnen en het glas", dak: "het dak en de dakisolatie", zon: "de zonnepanelen", spouw: "de spouwmuurisolatie",
  vloer: "de vloerisolatie", pomp: "de warmtepomp", batterij: "de thuisbatterij", vloerverwarming: "de vloerverwarming",
  kruipruimte: "de kruipruimte", spouwmuur: "de spouwmuur", dakkapel: "de dakkapel", garage: "de garage", aanbouw: "de aanbouw",
  cvketel: "de cv-ketel", stadsverwarming: "de aansluiting op stads- of blokverwarming", openhaard: "de open haard of kachel", luchtverwarming: "de luchtverwarming", radiatoren: "de radiatoren", convectorputten: "de convectorputten",
};

export function HouseViewer({ compact = false, vol = false, onBekijkWoning, ...props }: Props) {
  const { draft } = useWoningDraft();
  const [loaded, setLoaded] = useState("");
  const [touch, setTouch] = useState(false);
  const [cutawayOpen, setCutawayOpen] = useState(true);
  const [replayCrew, setReplayCrew] = useState(0);
  const [compareOriginal, setCompareOriginal] = useState(false);
  const onLoaded = useMemo(() => () => setLoaded(draft.houseType), [draft.houseType]);
  // In beeld zit de doorsnede altijd aan de rechterkant (zie Model), behalve bij een hoekwoning met de
  // buren rechts: die is gespiegeld en open aan de linkerkant.
  const openSide = draft.houseType === "hoekwoning" ? getOpenSide(draft.houseType, props.hoekZijde) : "rechts";
  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const update = () => setTouch(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const zijdeLabel = openSide === "links" ? "linkerzijgevel" : openSide === "rechts" ? "rechterzijgevel" : "voorgevel";
  return <div className={`${styles.viewer} ${compact ? styles.compact : ""} ${vol ? styles.vol : ""} ${props.className ?? ""}`}>
    <h2 className="sr-only">Illustratieve woningweergave</h2>
    <p className="sr-only" role="status">{HOUSE_MODELS[draft.houseType].label}, schuine doorsnede{cutawayOpen ? `, ${zijdeLabel} geopend` : ", gesloten"}.{!compact && props.focus ? ` Weergave gericht op ${FOCUS_LABEL[props.focus]}.` : ""}</p>
    <ViewerBoundary>
      <div className={`${styles.scene} ${compact ? styles.sceneCompact : ""}`} role="group" aria-label={`3D-doorsnede van je ${HOUSE_MODELS[draft.houseType].label.toLowerCase()}`}>
        {!compact && <span className={styles.illustratiefBadge}>Illustratief, niet je echte woning</span>}
        <Canvas onCreated={({ gl }) => { gl.localClippingEnabled = true; }} camera={{ position: [4.1, 2.8, 5.2], fov: 30, near: 0.05, far: 80 }} shadows="percentage" frameloop="demand" dpr={compact ? [1, 1] : touch ? [1, 1.5] : [1, 1.75]} style={{ touchAction: "pan-y" }} fallback={<p aria-hidden="true">3D niet beschikbaar. Je kunt de scan gewoon gebruiken.</p>}>
          <HouseDaglicht kant={openSide} mobiel={touch} bereik={4} />
          <Suspense fallback={null}><Model {...props} cutawayOpen={compact ? false : cutawayOpen} focus={compact ? null : props.focus} selectedMeasureIds={compareOriginal ? props.selectedMeasureIds.filter(id => id !== "glas-kozijnen") : props.selectedMeasureIds} replayCrew={replayCrew} onLoaded={onLoaded} /></Suspense>
        </Canvas>
        {loaded !== draft.houseType && <p className={styles.loading} role="status">Je woning wordt geladen…</p>}
        {!compact && props.selectedMeasureIds.includes("gevelisolatie") && <button type="button" className={styles.crewButton} onClick={() => setReplayCrew(i => i + 1)}>Bekijk de monteur · 2 sec.</button>}
        {compact && <button type="button" className={styles.bekijkKnop} onClick={onBekijkWoning}>Bekijk woning</button>}
      </div>
      {!compact && <div className={styles.controls} aria-label="Woning bekijken">
        <button type="button" aria-pressed={cutawayOpen} onClick={() => setCutawayOpen(open => !open)}>{cutawayOpen ? "Doorsnede sluiten" : "Doorsnede tonen"}</button>
        {props.focus && props.onFocusChange && <button type="button" onClick={() => props.onFocusChange?.(null)}>Hele woning</button>}
      </div>}
    </ViewerBoundary>
    {!compact && <p className={styles.caption}><strong>{HOUSE_MODELS[draft.houseType].label}</strong> · Dit is een illustratieve weergave: ze laat zien waar onderdelen ongeveer zitten, maar is geen exacte kopie van jouw eigen woning.{(draft.houseType === "tussenwoning" || draft.houseType === "twee-onder-een-kap" || (draft.houseType === "hoekwoning" && props.hoekZijde)) && " De grijze muur is de gedeelde muur met de buren."}</p>}
    {!compact && props.selectedMeasureIds.includes("glas-kozijnen") && <details className={styles.profileDetail} onToggle={e => { if (!e.currentTarget.open) setCompareOriginal(false); }}><summary>Bekijk vóór en na →</summary><p>Zo ziet je woning eruit met nieuwe ramen en kozijnen. Wissel hieronder: de kijkhoek blijft hetzelfde.</p><div className={styles.controls}><button aria-pressed={compareOriginal} onClick={() => setCompareOriginal(true)}>Bestaand</button><button aria-pressed={!compareOriginal} onClick={() => setCompareOriginal(false)}>Nieuw</button></div><div className={styles.profileComparison}><div><span className={styles.oldProfile}>Glas</span><strong>Bestaand</strong><p>Een eenvoudig bestaand profiel.</p></div><div><span className={styles.newProfile}>Glas</span><strong>Nieuw · kunststof kozijn</strong><p>Witte profielen met meer diepte en zichtbare glasrubbers.</p></div></div><p>Schematisch detail; kleur en uitvoering bespreek je met Gijs.</p></details>}
  </div>;
}
