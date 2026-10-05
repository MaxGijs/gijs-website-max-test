"use client";
/* eslint-disable react-hooks/immutability -- Three.js scene clones are intentionally animated outside React rendering. */

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Box3, Color, Mesh, MeshStandardMaterial, Vector3, type Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Link from "next/link";
import AddressScan from "@/components/AddressScan";
import { Accordion, type AccordionItem } from "@/components/ds/navigation/Accordion";
import styles from "./HouseModelPrototype.module.css";
import { prepareHouse, disposeHouse } from "@/lib/house-model";
import { maakRealistisch, grasTextuur, bestratingTextuur, contactschaduwTextuur, klinkerTextuur, uitloopTextuur } from "@/lib/house-realism";
import { HOUSE_MODELS, type HouseType } from "@/lib/woning-types";
import { MAATREGEL_TITELS, type MaatregelTitel } from "@/lib/content/maatregel-titels";
import { useWoningDraft } from "@/components/woning/WoningDraftProvider";
import { HouseDaglicht } from "@/components/woning/HouseDaglicht";
import { inLaag, gevelObject } from "@/lib/house-states";

// De volgorde van de hoofdstukken is ook de camera-route langs de woning:
// voorkant → raam (kozijn, dan glas) → omhoog naar het dak → zonnepanelen →
// omlaag langs de zijgevel → begane grond → warmtepomp → thuisbatterij →
// terug naar het totaalbeeld. Naam, titel en uitleg per maatregel komen uit
// lib/content/maatregel-titels.ts (dezelfde teksten als in de woningscan).
type Focus = "huis" | "kozijn" | "glas" | "dak" | "zon" | "spouw" | "vloer" | "pomp" | "batterij";
const steps: { focus: Focus; label: string; maatregel: MaatregelTitel | null; benefit: string }[] = [
  { focus: "huis", label: "Je huis", maatregel: null, benefit: "" },
  { focus: "kozijn", label: MAATREGEL_TITELS.kozijnen.naam, maatregel: MAATREGEL_TITELS.kozijnen, benefit: "Minder kou bij het raam." },
  { focus: "glas", label: MAATREGEL_TITELS.isolatieglas.naam, maatregel: MAATREGEL_TITELS.isolatieglas, benefit: "Warmer bij het raam." },
  { focus: "dak", label: MAATREGEL_TITELS.dakisolatie.naam, maatregel: MAATREGEL_TITELS.dakisolatie, benefit: "Minder warmte die via het dak verdwijnt." },
  { focus: "zon", label: MAATREGEL_TITELS.zonnepanelen.naam, maatregel: MAATREGEL_TITELS.zonnepanelen, benefit: "Je wekt zelf een deel van je stroom op." },
  { focus: "spouw", label: MAATREGEL_TITELS.spouwmuurisolatie.naam, maatregel: MAATREGEL_TITELS.spouwmuurisolatie, benefit: "Je woning koelt minder snel af." },
  { focus: "vloer", label: MAATREGEL_TITELS.vloerisolatie.naam, maatregel: MAATREGEL_TITELS.vloerisolatie, benefit: "Meer comfort voor je voeten." },
  { focus: "pomp", label: MAATREGEL_TITELS.warmtepomp.naam, maatregel: MAATREGEL_TITELS.warmtepomp, benefit: "Minder gas nodig om je woning te verwarmen." },
  { focus: "batterij", label: MAATREGEL_TITELS.thuisbatterij.naam, maatregel: MAATREGEL_TITELS.thuisbatterij, benefit: "Zelf opgewekte stroom bewaren." },
];
// Volgorde van de woningtypes in de keuze op de landingspagina.
const WONINGTYPE_VOLGORDE: HouseType[] = ["tussenwoning", "hoekwoning", "twee-onder-een-kap", "vrijstaand"];
// Index van de afsluitende sectie (#woning-opties): camera zoomt terug uit.
const EIND = steps.length;
const H = Object.fromEntries(steps.map((s, i) => [s.focus, i])) as Record<Focus, number>;

// "Wat past bij jouw woning?": per categorie een crawlbare link naar de
// maatregelpagina. Daar verdiept de bezoeker zich en kiest daarna tussen
// woningscan en gratis energiescan. Vloerverwarming staat bewust niet in
// deze lijst: daar is nog geen inhoudelijk besluit over.
const MAATREGEL_CATEGORIEEN: { id: string; label: string; items: MaatregelTitel[] }[] = [
  { id: "isolatie", label: "Isolatie", items: [MAATREGEL_TITELS.dakisolatie, MAATREGEL_TITELS.spouwmuurisolatie, MAATREGEL_TITELS.vloerisolatie, MAATREGEL_TITELS.isolatieglas, MAATREGEL_TITELS.kozijnen] },
  { id: "installaties", label: "Installaties", items: [MAATREGEL_TITELS.warmtepomp, MAATREGEL_TITELS.zonnepanelen, MAATREGEL_TITELS.thuisbatterij] },
];

const MAATREGEL_ACCORDION_ITEMS: AccordionItem[] = MAATREGEL_CATEGORIEEN.map(categorie => ({
  id: categorie.id,
  question: categorie.label,
  answer: (
    <ul className={styles.categoryList}>
      {categorie.items.map(item => <li key={item.slug}><Link href={`/maatregelen/${item.slug}`}>{item.naam}</Link></li>)}
    </ul>
  ),
}));

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };

// Hoe sterk een hoofdstuk actief is bij voortgang p: loopt op nadat de
// camera is aangekomen, blijft staan tijdens het lezen en zakt weg zodra de
// volgende sectie begint. Zo staat er steeds maar één onderdeel "open".
const actief = (p: number, hoofdstuk: number) => ease((p - hoofdstuk - 0.12) / 0.3) * (1 - ease((p - hoofdstuk - 0.97) / 0.12));

// Hoe ver het huis optilt bij vloerisolatie (lokale eenheden). De fundering
// blijft staan; de ruimte ertussen is de kruipruimte.
const VLOER_TIL = 1.6;
const FOV = 30; // smal beeldveld: rustige architectuurweergave, geen groothoek
type Stand = { pos: Vector3; look: Vector3 };
type Kant = "rechts" | "links" | "voor";
type Beweging = { object: Object3D; origin: Vector3; offset: Vector3; hoofdstuk: number };

// Camera-route per woningtype, afgeleid uit het model zelf (raam, dak,
// zonnepanelen, vrije zijgevel, warmtepomp, batterij verschillen per type).
// Drie zoomniveaus: L1 volledige woning, L2 bouwdeel, L3 maatregel.
function bouwRoute(scene: Object3D, schaal: number, positie: Vector3, bounds: Box3) {
  const wereld = (v: Vector3) => v.clone().multiplyScalar(schaal).add(positie);
  const doos = (o: Object3D) => { const b = new Box3().setFromObject(o); return { min: wereld(b.min), max: wereld(b.max), c: wereld(b.getCenter(new Vector3())) }; };
  const huis = { min: wereld(bounds.min), max: wereld(bounds.max) };
  const midden = huis.min.clone().add(huis.max).multiplyScalar(0.5);
  const maat = huis.max.clone().sub(huis.min);
  const straal = maat.length() / 2;
  const basis = (straal / Math.sin((FOV / 2) * (Math.PI / 180))) * 0.95;
  const L1 = basis * 1.22, L2 = basis * 0.5, L3 = basis * 0.32;
  const kind = (n: string) => scene.children.find(o => o.name === n) ?? null;

  // Vrije zijgevel: geen buurwoning of garage aan die kant.
  const obstakels = scene.children.filter(o => /^(Buurwoning|Garage)/.test(o.name)).map(doos);
  const vrij = (kant: "rechts" | "links") => {
    const gevel = kind(`Buitengevel_${kant}`);
    if (!gevel || gevel.userData.sharedWall) return false;
    const x = doos(gevel).c.x;
    return !obstakels.some(o => (kant === "rechts" ? o.c.x > x : o.c.x < x));
  };
  const kant: Kant = vrij("rechts") ? "rechts" : vrij("links") ? "links" : "voor";
  const s = kant === "links" ? -1 : 1;
  const stand = (look: Vector3, richting: [number, number, number], afstand: number): Stand => ({ look, pos: look.clone().add(new Vector3(...richting).normalize().multiplyScalar(afstand)) });

  // Duidelijk raam aan de voorkant: het grootste raam in de voorgevel.
  const voorRamen = scene.children.filter(o => /^Raam/.test(o.name)).map(o => ({ o, d: doos(o) })).filter(({ d }) => d.c.z > midden.z + maat.z * 0.3);
  voorRamen.sort((a, b) => (b.d.max.x - b.d.min.x) * (b.d.max.y - b.d.min.y) - (a.d.max.x - a.d.min.x) * (a.d.max.y - a.d.min.y));
  const raam = voorRamen[0]?.o ?? kind("Voordeur");
  const raamC = raam ? doos(raam).c : midden.clone();

  const pan = kind("Dakpannen") ? doos(kind("Dakpannen")!) : { min: huis.min, max: huis.max, c: midden };
  const dakLook = new Vector3(pan.c.x, pan.min.y + (pan.max.y - pan.min.y) * 0.5, pan.c.z + (pan.max.z - pan.c.z) * 0.3);
  const panelen = scene.children.filter(o => o.name.startsWith("Zonnepaneel") && !o.userData.garagePanel).map(doos).filter(d => d.c.y > midden.y && d.c.z > midden.z);
  const zonLook = panelen.length ? panelen.reduce((acc, d) => acc.add(d.c), new Vector3()).multiplyScalar(1 / panelen.length) : dakLook.clone();

  const gevel = kind(kant === "voor" ? "Buitengevel_voor" : `Buitengevel_${kant}`);
  const g = gevel ? doos(gevel) : { min: huis.min, max: huis.max, c: midden };
  const gevelY = huis.min.y + maat.y * 0.33;
  const spouw = kant === "voor"
    ? stand(new Vector3(g.min.x + (g.max.x - g.min.x) * 0.35, gevelY, g.max.z), [0.62 * s, 0.2, 0.76], L2)
    : stand(new Vector3(g.c.x, gevelY, g.c.z + (g.max.z - g.c.z) * 0.35), [0.7 * s, 0.22, 0.68], L2);

  const fundering = kind("Fundering") ? doos(kind("Fundering")!) : { min: huis.min, max: huis.min, c: huis.min };
  // Vloer: laag, bijna horizontaal onder het opgetilde huis door de
  // kruipruimte in kijken; de isolatie zit zichtbaar tegen de onderkant.
  const kruipruimte = VLOER_TIL * schaal * scene.scale.y;
  const vloer = stand(new Vector3(midden.x, fundering.max.y + kruipruimte * 0.4, huis.max.z - maat.z * 0.25), [0.4 * s, 0.015, 0.92], L2 * 1.1);

  // Installatie in close-up: camera staat aan de kant waar hij hangt, met
  // nog een stuk gevel in beeld.
  const closeUp = (naam: string, fallback: Stand) => {
    const o = kind(naam);
    if (!o) return fallback;
    const d = doos(o);
    const uit = new Vector3(d.c.x - midden.x, 0, d.c.z - midden.z).normalize().multiplyScalar(0.85);
    return stand(d.c, [uit.x, 0.32, uit.z + 0.25], L3 * 0.85);
  };

  const heroLook = midden.clone().add(new Vector3(0, maat.y * 0.06, 0));
  const hero = stand(heroLook, [0.55 * s, 0.4, 0.72], L1);
  const standen: Stand[] = [];
  standen[0] = hero;
  standen[H.kozijn] = stand(raamC, [0.3 * s, 0.1, 0.95], L3);
  standen[H.glas] = stand(raamC.clone(), [0.3 * s, 0.1, 0.95], L3 * 0.78);
  standen[H.dak] = stand(dakLook, [0.3 * s, 0.55, 0.8], L2);
  standen[H.zon] = stand(zonLook, [0.34 * s, 0.66, 0.68], L2 * 0.78);
  standen[H.spouw] = spouw;
  standen[H.vloer] = vloer;
  standen[H.pomp] = closeUp("Warmtepomp_DeWarmte", vloer);
  standen[H.batterij] = closeUp("Thuisbatterij", standen[H.pomp]);
  standen[EIND] = stand(heroLook.clone(), [0.52 * s, 0.5, 0.7], L1 * 1.03);
  // Voordeuren van de woning en de buurwoningen (voor de tuinpaden) en de garagedeur (voor de oprit).
  const deuren = [kind("Voordeur"), ...scene.getObjectsByProperty("name", "buur_Voordeur")].filter((d): d is Object3D => !!d).map(doos);
  const garageDeur = scene.getObjectByName("Garagedeur");
  const garagedeur = garageDeur ? doos(garageDeur) : null;
  return { standen, midden, kant, s, raam, huis, maat, fundering, deuren, garagedeur };
}

// Tussen twee standen bewegen via een boog rond de woning (hoek, straal en
// hoogte apart interpoleren) in plaats van een rechte lijn: zo gaat de
// camera altijd om de woning heen en nooit door een muur.
function mengStanden(a: Stand, b: Stand, t: number, midden: Vector3, pos: Vector3, look: Vector3) {
  const ha = Math.atan2(a.pos.x - midden.x, a.pos.z - midden.z), hb = Math.atan2(b.pos.x - midden.x, b.pos.z - midden.z);
  let d = hb - ha;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  const ra = Math.hypot(a.pos.x - midden.x, a.pos.z - midden.z), rb = Math.hypot(b.pos.x - midden.x, b.pos.z - midden.z);
  const hoek = ha + d * t, r = ra + (rb - ra) * t;
  pos.set(midden.x + Math.sin(hoek) * r, a.pos.y + (b.pos.y - a.pos.y) * t, midden.z + Math.cos(hoek) * r);
  look.lerpVectors(a.look, b.look, t);
}

// Welke onderdelen per hoofdstuk bewegen (lokale eenheden van het model).
// Overal hetzelfde principe als bij het dak: lagen schuiven uit elkaar, er
// wordt niets alleen "gehighlight".
// Dak: pannen tillen op, de isolatielaag wordt zichtbaar.
// Spouw: de buitenmuur (blijft herkenbaar metselwerk) schuift naar buiten en
// opzij, de spouwisolatie half zo ver, de binnenmuur blijft staan. Zo zie je
// buitenmuur | spouwisolatie | binnenmuur naast elkaar.
// Vloer: het hele huis tilt op van de fundering, met de isolatie tegen de
// onderkant van de vloer, zodat de kruipruimte eronder zichtbaar wordt.
function bewegingen(scene: Object3D, route: ReturnType<typeof bouwRoute>, schaal: number, positie: Vector3): Beweging[] {
  const lijst: Beweging[] = [];
  const voeg = (object: Object3D, offset: Vector3, hoofdstuk: number) => lijst.push({ object, origin: object.position.clone(), offset, hoofdstuk });
  const wereld = (v: Vector3) => v.clone().multiplyScalar(schaal).add(positie);
  const doos = (o: Object3D) => { const b = new Box3().setFromObject(o); return { min: wereld(b.min), max: wereld(b.max), c: wereld(b.getCenter(new Vector3())) }; };
  const normaal = route.kant === "rechts" ? new Vector3(1, 0, 0) : route.kant === "links" ? new Vector3(-1, 0, 0) : new Vector3(0, 0, 1);
  const gevel = scene.children.find(o => o.name === (route.kant === "voor" ? "Buitengevel_voor" : `Buitengevel_${route.kant}`));
  const gevelDoos = gevel ? doos(gevel) : null;
  const vlak = gevelDoos ? (route.kant === "rechts" ? gevelDoos.max.x : route.kant === "links" ? gevelDoos.min.x : gevelDoos.max.z) : 0;
  // Opzij schuiven naar de kant die van de camera af ligt, zodat het stuk
  // muur dichtbij de camera openligt: zijgevel naar achteren, voorgevel weg
  // van de camerazijde.
  const opzij = route.kant === "voor" ? new Vector3(route.s < 0 ? 1 : -1, 0, 0) : new Vector3(0, 0, -1);
  const buitenmuur = normaal.clone().multiplyScalar(1.8).add(opzij.clone().multiplyScalar(1.3));
  const isolatie = normaal.clone().multiplyScalar(0.9).add(opzij.clone().multiplyScalar(0.65));
  for (const object of scene.children) {
    const n = object.name;
    // Isolatie blijft, net als bij dak en spouw, iets achter bij de rest van het
    // huis: zo ontstaat een zichtbare laag tussen de fundering en de vloer.
    if (inLaag(n, "floor-insulation")) { voeg(object, new Vector3(0, VLOER_TIL * 0.45, 0), H.vloer); }
    else if (!object.userData.garagePanel && !inLaag(n, "heat-pump") && !/^(Fundering|Buurwoning|Garage)/.test(n)) voeg(object, new Vector3(0, VLOER_TIL, 0), H.vloer);
    if (object.userData.garagePanel || object.userData.sharedWall) continue;
    if (/^(Dakpannen|Tengellatten|Panlatten|Dakkapel|Schoorsteen|Dakgoot|Zonnepaneel)/.test(n)) { voeg(object, new Vector3(0, 2.2, 0), H.dak); continue; }
    if (n === "Dakisolatie") { voeg(object, new Vector3(0, 1.2, 0), H.dak); continue; }
    if (!gevelDoos) continue;
    if (gevel && object === gevel) { voeg(object, buitenmuur, H.spouw); continue; }
    if (n === gevelObject("cavity-insulation", route.kant)) { voeg(object, isolatie, H.spouw); continue; }
    // Ramen, deuren, dorpels en installaties die op deze gevel zitten gaan mee.
    if (/^(Buitengevel|Spouwisolatie|Binnenmuur|Bouwmuur|Buurwoning|Fundering|Vloer|Verdiepingsvloer|Zoldervloer|Plinten|Garage|Zijgevel|Dakconstructie)/.test(n)) continue;
    const d = doos(object);
    const as = route.kant === "voor" ? d.c.z : d.c.x;
    const afstand = (as - vlak) * (route.kant === "links" ? -1 : 1);
    if (afstand > -0.06 && afstand < 0.3) voeg(object, buitenmuur, H.spouw);
  }
  return lijst;
}

// Per hoofdstuk de materialen die subtiel oplichten (iets lichter, eigen
// kleur, geen groene gloed of outline).
function markeringen(scene: Object3D, route: ReturnType<typeof bouwRoute>) {
  const kaart = new Map<number, MeshStandardMaterial[]>();
  const voeg = (hoofdstuk: number, object: Object3D | null | undefined, filter: (m: MeshStandardMaterial) => boolean = () => true, eigenKleur = false) => {
    object?.traverse(part => {
      const mesh = part as Mesh;
      if (!mesh.isMesh) return;
      for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) {
        if (!m?.isMeshStandardMaterial || !filter(m)) continue;
        m.emissive.copy(m.color);
        if (!eigenKleur) m.emissive.lerp(new Color("#ffffff"), 0.45);
        m.userData.markering = eigenKleur ? 0.38 : m.map ? 0.08 : 0.22;
        m.emissiveIntensity = 0;
        kaart.set(hoofdstuk, [...(kaart.get(hoofdstuk) ?? []), m]);
      }
    });
  };
  const kind = (n: string) => scene.children.find(o => o.name === n);
  voeg(H.kozijn, route.raam, m => !m.transparent);
  voeg(H.glas, route.raam, m => m.transparent);
  voeg(H.dak, kind("Dakisolatie"), undefined, true);
  for (const o of scene.children) if (o.name.startsWith("Zonnepaneel")) voeg(H.zon, o);
  voeg(H.spouw, kind(route.kant === "voor" ? "Spouwisolatie_voor" : `Spouwisolatie_${route.kant}`), undefined, true);
  voeg(H.vloer, kind("Vloerisolatie"), undefined, true);
  voeg(H.pomp, kind("Warmtepomp_DeWarmte"));
  voeg(H.batterij, kind("Thuisbatterij"));
  return kaart;
}

// Eenvoudige omgeving: gazon dat zacht uitloopt, een strook bestrating voor
// de woning en een zachte contactschaduw onder de gevels.
// Rijwoningen (nl): een klinkerstoep langs de straat en een tuinpad dat bij de
// voordeur uitkomt, naar de referentiefoto's. `eenheid` = wereldmaat van 1 meter.
function Ondergrond({ route, breedte, nl, eenheid }: { route: ReturnType<typeof bouwRoute>; breedte: number; nl: boolean; eenheid: number }) {
  const e = eenheid;
  // Stoep op ruim 2 m voor de gevel; tuinpaden lopen van de stoep tot aan elke voordeur, de oprit tot de garagedeur.
  const stoepVoor = route.huis.max.z + 2.2 * e;
  const { texturen, paden } = useMemo(() => {
    const klinkers = klinkerTextuur();
    klinkers.repeat.set((breedte + 1.2) / (3.2 * eenheid), 0.5);
    const paden = [
      ...route.deuren.map(d => ({ x: d.c.x, breedte: 1.1 * eenheid, start: d.min.z })),
      ...(route.garagedeur ? [{ x: route.garagedeur.c.x, breedte: route.garagedeur.max.x - route.garagedeur.min.x + 0.4 * eenheid, start: route.garagedeur.min.z }] : []),
    ].map(p => {
      const lengte = Math.max(0.2 * eenheid, route.huis.max.z + 2.2 * eenheid - p.start);
      // Eigen herhaling per pad (zelfde afbeelding), zodat klinkers op pad en oprit even groot zijn.
      const textuur = klinkers.clone();
      textuur.repeat.set(p.breedte / (3.2 * eenheid), lengte / (3.2 * eenheid));
      return { ...p, lengte, textuur };
    });
    return {
      texturen: { gras: grasTextuur(nl), tegels: bestratingTextuur(), schaduw: contactschaduwTextuur(), klinkers, uitloop: uitloopTextuur() },
      paden,
    };
  }, [nl, breedte, eenheid, route]);
  useEffect(() => () => { Object.values(texturen).forEach(t => t.dispose()); paden.forEach(p => p.textuur.dispose()); }, [texturen, paden]);
  const f = route.fundering;
  // Maaiveld net onder de muurvoet (25 cm boven de fundering), zodat de fundering
  // onder de grond zit en de voordeur gelijkvloers met een klein opstapje staat.
  const y = nl ? f.max.y + 0.23 * e : f.min.y + (f.max.y - f.min.y) * 0.45;
  const straal = Math.hypot(breedte, route.maat.z) * 0.95;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[route.midden.x, y, route.midden.z]} receiveShadow renderOrder={0}>
        <circleGeometry args={[straal, 64]} />
        <meshStandardMaterial map={texturen.gras} transparent depthWrite={false} roughness={1} metalness={0} />
      </mesh>
      {nl ? (
        <>
          <mesh rotation-x={-Math.PI / 2} position={[route.midden.x, y + 0.004, stoepVoor + 0.8 * e]} receiveShadow renderOrder={1}>
            <planeGeometry args={[breedte + 1.2, 1.6 * e]} />
            <meshStandardMaterial map={texturen.klinkers} alphaMap={texturen.uitloop} transparent depthWrite={false} roughness={0.95} metalness={0} />
          </mesh>
          {paden.map(p => (
            <mesh key={`${p.x}-${p.start}`} rotation-x={-Math.PI / 2} position={[p.x, y + 0.006, p.start + p.lengte / 2]} receiveShadow renderOrder={1}>
              <planeGeometry args={[p.breedte, p.lengte]} />
              <meshStandardMaterial map={p.textuur} roughness={0.95} metalness={0} />
            </mesh>
          ))}
        </>
      ) : (
        <mesh rotation-x={-Math.PI / 2} position={[route.midden.x, y + 0.004, route.huis.max.z + 0.3]} receiveShadow renderOrder={1}>
          <planeGeometry args={[breedte + 1.2, 0.5]} />
          <meshStandardMaterial map={texturen.tegels} transparent depthWrite={false} roughness={0.9} metalness={0} />
        </mesh>
      )}
      <mesh rotation-x={-Math.PI / 2} position={[route.midden.x, y + 0.008, route.midden.z]} renderOrder={2}>
        <planeGeometry args={[route.maat.x * 1.45, route.maat.z * 1.45]} />
        <meshBasicMaterial map={texturen.schaduw} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

type ModelProps = {
  section: RefObject<HTMLElement | null>;
  onStep: (step: number) => void;
  modelUrl: string;
  houseType: HouseType;
  onLoaded: () => void;
  revealed: RefObject<number>;
  mobiel: boolean;
};

function House({ section, onStep, modelUrl, houseType, onLoaded, revealed, mobiel }: ModelProps) {
  const gltf = useLoader(GLTFLoader, modelUrl);
  const progress = useRef(0);
  const target = useRef(0);
  const initialized = useRef(false);
  const active = useRef(-1);
  const reduced = useRef(false);
  const { invalidate, camera } = useThree();
  const scratch = useRef({ pos: new Vector3(), look: new Vector3() });
  const opgebouwd = useMemo(() => {
    const { scene, scale, position, bounds } = prepareHouse(gltf.scene, houseType);
    const texturen = maakRealistisch(scene);
    const route = bouwRoute(scene, scale, position, bounds);
    const beweging = bewegingen(scene, route, scale, position);
    const markering = markeringen(scene, route);
    // Installaties worden pas zichtbaar bij hun eigen hoofdstuk, zodat de
    // woning eerst als gewone woning leest.
    const installaties = new Map<number, { objecten: Object3D[]; materialen: Set<MeshStandardMaterial> }>();
    for (const object of scene.children) {
      const hoofdstuk = object.name.startsWith("Zonnepaneel") ? H.zon : object.name.startsWith("Warmtepomp") ? H.pomp : object.name === "Thuisbatterij" ? H.batterij : -1;
      if (hoofdstuk < 0) continue;
      const groep = installaties.get(hoofdstuk) ?? { objecten: [], materialen: new Set<MeshStandardMaterial>() };
      groep.objecten.push(object);
      object.visible = false;
      object.traverse(kind => {
        const mesh = kind as Mesh;
        if (!mesh.isMesh) return;
        for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) { m.transparent = true; groep.materialen.add(m); }
      });
      installaties.set(hoofdstuk, groep);
    }
    // Breedte inclusief buurwoningen, voor gazon en bestrating.
    const alles = new Box3().setFromObject(scene);
    const breedte = (alles.max.x - alles.min.x) * scale;
    return { scene, scale, position, texturen, route, beweging, markering, installaties, breedte };
  }, [gltf, houseType]);
  const { scene, scale, position, route } = opgebouwd;
  useEffect(() => {
    onLoaded();
    return () => { disposeHouse(scene); opgebouwd.texturen.forEach(t => t.dispose()); };
  }, [scene, onLoaded, opgebouwd]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduced.current = media.matches;
      const element = section.current;
      if (!element) return;
      const top = parseFloat(getComputedStyle(element).getPropertyValue("--house-header")) || 0;
      const focus = top + (window.innerHeight - top) * (window.innerWidth < 768 ? 0.64 : 0.45);
      let next = 0;
      for (const panel of element.querySelectorAll<HTMLElement>("[data-house-progress]")) {
        const rect = panel.getBoundingClientRect();
        const index = Number(panel.dataset.houseProgress);
        if (rect.top <= focus) next = index + (index > 0 ? clamp((focus - rect.top) / Math.max(1, rect.height * 0.6)) * 0.95 : 0);
      }
      target.current = next;
      if (!initialized.current) { progress.current = next; initialized.current = true; }
      invalidate();
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    media.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
    };
  }, [section, invalidate]);

  useFrame((_, delta) => {
    progress.current += (target.current - progress.current) * (reduced.current ? 1 : 1 - Math.exp(-9 * delta));
    const p = progress.current;
    const sectie = Math.max(0, Math.min(EIND, Math.floor(p + 0.001)));
    const hoofdstuk = sectie >= EIND ? 0 : sectie;
    if (hoofdstuk !== active.current) { active.current = hoofdstuk; onStep(hoofdstuk); }

    // Camera: gebruiker bestuurt niets. Aan het begin van een nieuwe sectie
    // beweegt de camera rustig naar de volgende vaste stand en blijft daarna
    // stil staan zodat de tekst gelezen kan worden. Geen beweging in de hero.
    const van = route.standen[Math.max(0, sectie - 1)], naar = route.standen[sectie];
    const t = sectie === 0 ? 1 : ease((p - sectie) / 0.35);
    mengStanden(van, naar, t, route.midden, scratch.current.pos, scratch.current.look);
    // Mobiel: iets verder weg, zodat er in het kleinere beeld genoeg context blijft.
    if (mobiel) scratch.current.pos.sub(scratch.current.look).multiplyScalar(1.12).add(scratch.current.look);
    camera.position.copy(scratch.current.pos);
    camera.lookAt(scratch.current.look);

    // Een onderdeel kan in meerdere hoofdstukken bewegen: verschuivingen tellen op.
    for (const { object, origin } of opgebouwd.beweging) object.position.copy(origin);
    for (const { object, offset, hoofdstuk: h } of opgebouwd.beweging) object.position.addScaledVector(offset, actief(p, h));
    for (const [h, materialen] of opgebouwd.markering) {
      const sterkte = actief(p, h);
      for (const m of materialen) m.emissiveIntensity = sterkte * (m.userData.markering as number);
    }

    // Bereikte installaties blijven zichtbaar (ook in het eindbeeld).
    revealed.current = Math.max(revealed.current, p);
    for (const [h, { objecten, materialen }] of opgebouwd.installaties) {
      const zicht = ease((revealed.current - h) / 0.3);
      for (const m of materialen) m.opacity = zicht;
      for (const o of objecten) o.visible = zicht > 0.01;
    }

    if (Math.abs(target.current - progress.current) > 0.0001) invalidate();
  });
  return (
    <>
      <HouseDaglicht kant={route.kant} mobiel={mobiel} />
      <Ondergrond route={route} breedte={opgebouwd.breedte} nl={scene.userData.nlRij === true || scene.userData.nlVrij === true} eenheid={scale * scene.scale.x} />
      <group scale={scale} position={position}><primitive object={scene} /></group>
    </>
  );
}

class ModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <p role="alert" className={styles.fallback}>De 3D-woning kan niet worden geladen. Je kunt hieronder wel alle onderdelen lezen.</p>;
    return this.props.children;
  }
}

export default function HouseModelPrototype({ children }: { children?: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const revealed = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null);
  // Mobiel: lichtere schaduwkaart, lagere pixeldichtheid en iets ruimere
  // camerastanden (zie House). Geen vrije rotatie of zoom, ook niet op touch.
  const [mobiel, setMobiel] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobiel(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const [step, setStep] = useState(0);
  const { draft, setDraft } = useWoningDraft();
  const houseType = draft.houseType;
  const modelUrl = HOUSE_MODELS[houseType].url;
  const [loadedModel, setLoadedModel] = useState("");
  const onLoaded = useMemo(() => () => setLoadedModel(modelUrl), [modelUrl]);
  const [barVisible, setBarVisible] = useState(false);
  const previousOverflow = useRef("");
  const scanOpen = useRef(false);

  const openScan = () => {
    if (!dialog.current || dialog.current.open) return;
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal();
    scanOpen.current = true;
    document.body.style.overflow = "hidden";
  };
  const restoreScroll = () => { document.body.style.overflow = previousOverflow.current; scanOpen.current = false; };
  useEffect(() => () => { if (scanOpen.current) document.body.style.overflow = previousOverflow.current; }, []);
  useEffect(() => {
    const update = () => {
      const story = section.current;
      const hero = story?.querySelector("[data-house-progress='0']");
      const end = document.getElementById("na-de-woning");
      setBarVisible(Boolean(hero && end && hero.getBoundingClientRect().bottom < 120 && end.getBoundingClientRect().top > window.innerHeight));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  return (
    <>
      <section ref={section} id="woning-prototype" className={styles.story} aria-label="Ontdek je woning">
        <aside className={styles.visualColumn} aria-label="Je woning tijdens de reis">
          <div
            className={styles.visual}
            aria-label={step === 0 ? "3D-voorbeeldwoning van Gijs" : `3D-woning, met de nadruk op ${steps[step].label.toLowerCase()}`}
          >
            <div className={styles.halo} />
            <span className={styles.illustratiefBadge}>Illustratief, niet je echte woning</span>
            <ModelErrorBoundary key={modelUrl}>
              <Canvas camera={{ position: [4, 3, 5], fov: FOV, near: 0.05, far: 60 }} shadows="percentage" frameloop="demand" dpr={mobiel ? [1, 1.5] : [1, 1.75]} style={{ touchAction: "pan-y" }} fallback={<p aria-hidden="true" className={styles.fallback}>3D is niet beschikbaar. De uitleg en de scan kun je gewoon gebruiken.</p>}>
                <Suspense fallback={null}><House key={modelUrl} section={section} onStep={setStep} modelUrl={modelUrl} houseType={houseType} onLoaded={onLoaded} revealed={revealed} mobiel={mobiel} /></Suspense>
              </Canvas>
            {loadedModel !== modelUrl && <p role="status" className={styles.loading}>Je woning wordt geladen…</p>}
            </ModelErrorBoundary>
            {step > 0 && <span className={styles.label}>{steps[step].label}</span>}
          </div>
          <p className={styles.modelNote}><strong>Illustratieve woningweergave.</strong> Deze 3D-woning laat zien waar onderdelen ongeveer zitten; het is geen foto of tekening van een echt huis. Scroll om de woning van binnen te bekijken.</p>
          <a href="#woning-opties" className={styles.jump}>Bekijk de mogelijkheden ↓</a>
        </aside>
        <div className={styles.narrative}>
          <section className={styles.panel} data-house-progress="0">
            <p className={styles.eyebrow}>Groen in je straat</p>
            <h1 className={styles.title}>Verduurzaam je woning.</h1>
            <p className={styles.description}>Lagere energiekosten, meer wooncomfort of zo energieneutraal mogelijk wonen? Ontdek stap voor stap welke maatregelen daarbij kunnen helpen.</p>
            <fieldset className={styles.woningtypeKeuze}>
              <legend className={styles.woningtypeLegend}>Welk woningtype lijkt op jouw woning?</legend>
              <div className={styles.woningtypeKnoppen}>
                {WONINGTYPE_VOLGORDE.map(type => (
                  <button
                    key={type}
                    type="button"
                    className={styles.woningtypeKnop}
                    aria-pressed={houseType === type}
                    onClick={() => setDraft(current => ({ ...current, houseType: type }))}
                  >
                    <span className={styles.woningtypeVinkje} aria-hidden="true">{houseType === type ? "✓" : ""}</span>
                    {HOUSE_MODELS[type].label}
                  </button>
                ))}
              </div>
              <p className={styles.woningtypeHint}>Gekozen: <strong>{HOUSE_MODELS[houseType].label}</strong>. De woning verandert mee. Dit is een illustratieve woningweergave, geen exacte weergave van jouw woning.</p>
            </fieldset>
            <div className={styles.scanCard}>
              <h2 className={styles.scanCardTitle}>Start de digitale woningscan</h2>
              <p className={styles.scanCardIntro}>Vul je adres in en ontdek in een paar minuten wat er mogelijk is voor jouw woning.</p>
              <AddressScan />
            </div>
            <p className={styles.checkNote}>Een digitale woningscan als voorbereiding op advies van Gijs. Het gekozen woningtype neem je mee naar de scan; daar kun je het nog wijzigen.</p>
            <a className={styles.textLink} href="#woning-verhaal">Neem een kijkje in de woning ↓</a>
          </section>
          <section id="woning-verhaal" className={styles.panel} data-house-progress="0">
            <p className={styles.eyebrow}>Je hoeft geen expert te zijn</p>
            <h2 className={styles.title}>Een fijne woning begint bij begrijpen.</h2>
            <p className={styles.description}>Waar blijft de warmte? Via je dak, muren, vloer en ramen kan warmte ontsnappen. Isolatie helpt die binnen te houden.</p>
            <p className={styles.description}>Zelf stroom maken? Dat doen zonnepanelen met zonlicht. Een warmtepomp gebruikt stroom om warmte van buiten naar binnen te brengen.</p>
            <p className={styles.description}>Kijk mee in de woning. Zo ontdek je waar iedere oplossing zit en wat jij ervan merkt.</p>
            <button className={styles.inlineScan} onClick={openScan}>Liever meteen jouw woning bekijken? Start de woningscan →</button>
          </section>
          {steps.slice(1).map((item, index) => item.maatregel && (
            <section key={item.focus} id={`woning-onderdeel-${index + 1}`} className={styles.panel} data-house-progress={index + 1}>
              <p className={styles.eyebrow}>Onderdeel {index + 1} van {steps.length - 1}</p>
              <h2 className={styles.maatregelKop}>
                <span className={styles.maatregelNaam}>{item.maatregel.naam}</span><span className="sr-only">: </span>
                <span className={styles.title}>{item.maatregel.titel}</span>
              </h2>
              <p className={styles.description}>{item.maatregel.uitleg}</p>
              <p className={styles.benefit}>{item.benefit}</p>
              <Link className={styles.maatregelCta} href={`/maatregelen/${item.maatregel.slug}`}>{item.maatregel.cta} <span aria-hidden="true">→</span></Link>
            </section>
          ))}
          <section id="woning-opties" className={styles.options} data-house-progress={EIND}>
            <p className={styles.eyebrow}>Van ontdekken naar jouw mogelijkheden</p>
            <h2 className={styles.title}>Wat past bij jouw woning?</h2>
            <p className={styles.description}>Je hoeft niet alles tegelijk te doen. Klap een categorie open en kies een maatregel om er meer over te lezen.</p>
            <Accordion items={MAATREGEL_ACCORDION_ITEMS} className={styles.optionAccordion} />
            <div className={styles.startWoning}>
              {draft.postcode && draft.huisnummer ? (
                <>
                  <h3 className={styles.startHeading}>Ga verder met jouw woning</h3>
                  <p className={styles.startIntro}>Je vulde {draft.postcode} {draft.huisnummer} in als adres, als {HOUSE_MODELS[houseType].label.toLowerCase()}.</p>
                  <button type="button" className={styles.cta} onClick={openScan}>Ga verder met mijn woning →</button>
                </>
              ) : (
                <>
                  <h3 className={styles.startHeading}>Klaar om te beginnen?</h3>
                  <p className={styles.startIntro}>Vul hierboven je adres in, of start direct de digitale woningscan.</p>
                  <button type="button" className={styles.cta} onClick={openScan}>Start de woningscan →</button>
                </>
              )}
              <p className={styles.startNote}>Illustratieve woningweergave, geen exacte weergave van jouw woning.</p>
            </div>
          </section>
        </div>
      </section>
      <div id="na-de-woning" className={styles.support}>{children}</div>
      <div className={styles.scanBar} hidden={!barVisible}>
        <span>Wat kan er met jouw woning?</span>
        <button type="button" onClick={openScan}>Start de woningscan <span aria-hidden="true">→</span></button>
      </div>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="woning-scan-title" onClose={restoreScroll} onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
        <div className={styles.dialogBody}>
          <button className={styles.close} type="button" aria-label="Sluit scan" onClick={() => dialog.current?.close()}>×</button>
          <p className={styles.eyebrow}>Jouw woning als vertrekpunt</p>
          <h2 id="woning-scan-title">Wat kan er met jouw woning?</h2>
          <p>Vul je adres in en ga verder met de digitale woningscan. Je woningtype kies je in de scan zelf, bij &quot;Bouw jouw woning&quot;.</p>
          <AddressScan onNavigate={() => dialog.current?.close()} />
        </div>
      </dialog>
    </>
  );
}
