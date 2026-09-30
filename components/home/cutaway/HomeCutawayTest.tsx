"use client";
/* eslint-disable react-hooks/immutability -- Three.js-scene, camera en annotatie-elementen worden buiten React om per frame bijgewerkt. */

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Box3, Color, Mesh, MeshStandardMaterial, Raycaster, Vector3, type Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Link from "next/link";
import AddressScan from "@/components/AddressScan";
import { prepareHouse, disposeHouse } from "@/lib/house-model";
import { maakRealistisch } from "@/lib/house-realism";
import { HOUSE_MODELS } from "@/lib/woning-types";
import { MAATREGEL_TITELS, type MaatregelTitel } from "@/lib/content/maatregel-titels";
import { HouseDaglicht } from "@/components/woning/HouseDaglicht";
import { M, maakCutaway, zetKopgevel, type V3 } from "./maquette";
import { maakLadder, maakMonteur, poseKlimmen, poseKruipen, poseStaan, zetZichtbaarheid } from "./monteur";
import basis from "../HouseModelPrototype.module.css";
import styles from "./HomeCutawayTest.module.css";

// PROTOTYPE (branch homepage-cutaway-test): de bestaande Gijs-woning als
// architectonische doorsnede (poppenhuis), met de 8 hoofdstukken van de
// homepage. De rechter kopgevel schuift na het overzicht als geheel weg;
// grondblok, kruipruimte en indeling staan in ./maquette.ts. Per hoofdstuk is
// steeds één maatregel actief: de lagen schuiven uit elkaar zoals op de
// homepage, alleen het betreffende bouwdeel licht subtiel Gijs-groen op, en
// een dunne annotatielijn loopt vanaf dat bouwdeel naar een compact label.

type Sleutel = "kozijn" | "glas" | "dak" | "zon" | "spouw" | "vloer" | "pomp" | "batterij";
const MAATREGELEN: { sleutel: Sleutel; titel: MaatregelTitel; kort: string; benefit: string }[] = [
  { sleutel: "kozijn", titel: MAATREGEL_TITELS.kozijnen, kort: "Houd warmte binnen en kou buiten.", benefit: "Minder kou bij het raam." },
  { sleutel: "glas", titel: MAATREGEL_TITELS.isolatieglas, kort: "Warmer bij het raam.", benefit: "Warmer bij het raam." },
  { sleutel: "dak", titel: MAATREGEL_TITELS.dakisolatie, kort: "Houd warmte beter binnen.", benefit: "Minder warmte die via het dak verdwijnt." },
  { sleutel: "zon", titel: MAATREGEL_TITELS.zonnepanelen, kort: "Je wekt zelf een deel van je stroom op.", benefit: "Je wekt zelf een deel van je stroom op." },
  { sleutel: "spouw", titel: MAATREGEL_TITELS.spouwmuurisolatie, kort: "Isolatie tussen de binnen- en buitenmuur.", benefit: "Je woning koelt minder snel af." },
  { sleutel: "vloer", titel: MAATREGEL_TITELS.vloerisolatie, kort: "Minder kou vanuit de kruipruimte.", benefit: "Meer comfort voor je voeten." },
  { sleutel: "pomp", titel: MAATREGEL_TITELS.warmtepomp, kort: "Minder gas nodig om je woning te verwarmen.", benefit: "Minder gas nodig om je woning te verwarmen." },
  { sleutel: "batterij", titel: MAATREGEL_TITELS.thuisbatterij, kort: "Zelf opgewekte stroom bewaren.", benefit: "Zelf opgewekte stroom bewaren." },
];
// Stappen: 0 overzicht (dicht), 1 opengewerkt overzicht, 2-9 de maatregelen, 10 eindbeeld.
const EERSTE = 2;
const EIND = EERSTE + MAATREGELEN.length;
const STAP = Object.fromEntries(MAATREGELEN.map((m, i) => [m.sleutel, EERSTE + i])) as Record<Sleutel, number>;
const GIJS_GROEN = new Color("#0a8a5f");
// Hoe sterk de groene zweem per onderdeel is: op zwarte panelen en glas veel zwakker, anders kleuren ze groen.
const HIGHLIGHT: Partial<Record<Sleutel, number>> = { zon: 0.1, glas: 0.18, pomp: 0.14 };

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
// Hoe sterk een stap actief is: rustig in na aankomst van de camera, rustig uit bij de volgende stap.
const actief = (p: number, stap: number) => ease((p - stap - 0.12) / 0.3) * (1 - ease((p - stap - 0.92) / 0.14));

const FOV = 30;
type Stand = { pos: Vector3; look: Vector3 };
type Anker = { object: Object3D; lokaal: Vector3 };
type Beweging = { object: Object3D; origin: Vector3; offset: Vector3; stap: number };

function bouwRoute(scene: Object3D, schaal: number, positie: Vector3, bounds: Box3) {
  const wereld = (v: Vector3) => v.clone().multiplyScalar(schaal).add(positie);
  const lok = (p: V3) => wereld(new Vector3(...p).multiply(scene.scale));
  const doos = (o: Object3D) => { const b = new Box3().setFromObject(o); return { min: wereld(b.min), max: wereld(b.max), c: wereld(b.getCenter(new Vector3())) }; };
  const kind = (n: string) => scene.children.find(o => o.name === n) ?? null;
  const huis = { min: wereld(bounds.min), max: wereld(bounds.max) };
  const midden = huis.min.clone().add(huis.max).multiplyScalar(0.5);
  const maat = huis.max.clone().sub(huis.min);
  const basisAfstand = (maat.length() / 2 / Math.sin((FOV / 2) * (Math.PI / 180))) * 0.95;
  const L2 = basisAfstand * 0.5, L3 = basisAfstand * 0.32;
  const stand = (look: Vector3, richting: V3, afstand: number): Stand => ({ look, pos: look.clone().add(new Vector3(...richting).normalize().multiplyScalar(afstand)) });
  const eiland = lok([M.gevelLinks - 1.4, -4.55, M.gevelAchter - 1.6]).distanceTo(lok([M.open, 5.34, M.gevelVoor + 2.4])) / 2;
  const overzicht = (factor: number) => stand(lok([-0.2, -0.2, 0.1]), [0.9, 0.2, 0.36], (eiland / Math.sin((FOV / 2) * (Math.PI / 180))) * 0.74 * factor);

  // Duidelijk raam aan de voorkant: het grootste raam in de voorgevel (zoals op de homepage).
  const voorRamen = scene.children.filter(o => /^Raam/.test(o.name)).map(o => ({ o, d: doos(o) })).filter(({ d }) => d.c.z > midden.z + maat.z * 0.3);
  voorRamen.sort((a, b) => (b.d.max.x - b.d.min.x) * (b.d.max.y - b.d.min.y) - (a.d.max.x - a.d.min.x) * (a.d.max.y - a.d.min.y));
  const raam = voorRamen[0]?.o ?? null;
  const raamC = raam ? doos(raam).c : midden.clone();
  const panelen = scene.children.filter(o => o.name.startsWith("Zonnepaneel") && !o.userData.garagePanel);
  const zonDozen = panelen.map(doos).filter(d => d.c.y > midden.y && d.c.z > midden.z);
  const zonLook = zonDozen.length ? zonDozen.reduce((acc, d) => acc.add(d.c), new Vector3()).multiplyScalar(1 / zonDozen.length) : midden.clone();
  const pomp = kind("Warmtepomp_DeWarmte"), batterij = kind("Thuisbatterij");

  const standen: Stand[] = [];
  // Overzicht zoals de huidige homepage: de woning nog dicht, schuin van voren.
  standen[0] = stand(midden.clone().add(new Vector3(0, maat.y * 0.06, 0)), [0.55, 0.4, 0.72], basisAfstand * 1.22);
  standen[1] = overzicht(1);
  standen[STAP.kozijn] = stand(raamC, [0.3, 0.1, 0.95], L3);
  standen[STAP.glas] = stand(raamC.clone(), [0.3, 0.1, 0.95], L3 * 0.78);
  standen[STAP.dak] = stand(lok([M.open, 4.1, 1.8]), [0.95, 0.24, 0.24], L3 * 1.35);
  standen[STAP.zon] = stand(zonLook, [0.34, 0.66, 0.68], L2 * 0.78);
  standen[STAP.spouw] = stand(lok([M.open, -0.2, M.gevelVoor + 0.35]), [0.88, 0.16, 0.45], L3 * 0.6);
  standen[STAP.vloer] = stand(lok([M.open, -3.1, 1.3]), [0.95, 0.05, 0.3], L3 * 0.95);
  standen[STAP.pomp] = pomp ? stand(doos(pomp).c, [0.5, 0.34, -0.8], L3 * 0.95) : overzicht(1);
  standen[STAP.batterij] = batterij ? stand(doos(batterij).c, [0.92, 0.22, 0.32], L3 * 0.62) : overzicht(1);
  standen[EIND] = overzicht(1.03);

  // Lagen die per hoofdstuk uit elkaar schuiven (lokale eenheden van het model), zoals op de homepage.
  const bewegingen: Beweging[] = [];
  const schuif = (naam: RegExp, offset: V3, stap: number) => { for (const o of scene.children) if (naam.test(o.name)) bewegingen.push({ object: o, origin: o.position.clone(), offset: new Vector3(...offset), stap }); };
  schuif(/^(Dakpannen|Dakkapel|Schoorsteen|Zonnepaneel)/, [0, 0.95, 0], STAP.dak);
  schuif(/^Panlatten$/, [0, 0.7, 0], STAP.dak);
  schuif(/^Tengellatten$/, [0, 0.48, 0], STAP.dak);
  schuif(/^Dakisolatie$/, [0, 0.26, 0], STAP.dak);
  schuif(/^Buitengevel_voor$/, [0, 0, 0.85], STAP.spouw);
  schuif(/^Spouwisolatie_voor$/, [0, 0, 0.42], STAP.spouw);
  schuif(/^Vloerisolatie$/, [0, -0.22, 0], STAP.vloer);

  // Wat per hoofdstuk oplicht en waar de annotatielijn begint: altijd op het bouwdeel zelf.
  scene.updateMatrixWorld(true);
  const raycaster = new Raycaster();
  const raak = (object: Object3D | null, van: Vector3, richting: Vector3): Anker | null => {
    if (!object) return null;
    raycaster.set(van, richting.normalize());
    const hit = raycaster.intersectObject(object, true)[0];
    return hit ? { object, lokaal: object.worldToLocal(hit.point.clone()) } : null;
  };
  const vanModel = (p: V3) => new Vector3(...p).multiply(scene.scale);
  const centrum = (o: Object3D | null) => o ? new Box3().setFromObject(o).getCenter(new Vector3()) : new Vector3();
  const vanRichting = (o: Object3D | null, richting: V3) => { const r = new Vector3(...richting).normalize(); return raak(o, centrum(o).addScaledVector(r, 6), r.clone().negate()); };
  const raamDoos = raam ? new Box3().setFromObject(raam) : null;
  const ankers: Record<Sleutel, Anker | null> = {
    kozijn: (() => {
      // Zoek vanaf de rechterrand naar binnen het eerste niet-glazen deel: het kozijnprofiel zelf.
      if (!raam || !raamDoos) return null;
      const y = (raamDoos.min.y + raamDoos.max.y) / 2;
      for (let dx = 0.01; dx < 0.4; dx += 0.015) {
        raycaster.set(new Vector3(raamDoos.max.x - dx, y, raamDoos.max.z + 5), new Vector3(0, 0, -1));
        const hit = raycaster.intersectObject(raam, true).find(h => { const m = (h.object as Mesh).material; return !(Array.isArray(m) ? m[0] : m).transparent; });
        if (hit) return { object: raam, lokaal: raam.worldToLocal(hit.point.clone()) };
      }
      return null;
    })(),
    glas: raam ? vanRichting(raam, [0, 0, 1]) : null,
    dak: raak(kind("Dakisolatie"), vanModel([M.open + 0.08, 9, 1.7]), new Vector3(0, -1, 0)),
    zon: (() => { const p = panelen.find(o => centrum(o).z > 0) ?? panelen[0] ?? null; return vanRichting(p, [0, 1, 0.3]); })(),
    spouw: raak(kind("Spouwisolatie_voor"), vanModel([8, -0.3, 3.72]), new Vector3(-1, 0, 0)),
    vloer: raak(kind("Vloerisolatie"), vanModel([8, -2.8, 1.0]), new Vector3(-1, 0, 0)),
    pomp: vanRichting(pomp, [0.5, 0.3, -0.8]),
    batterij: vanRichting(batterij, [1, 0.1, 0.2]),
  };
  for (const [sleutel, a] of Object.entries(ankers)) if (!a) console.warn(`[cutaway] geen annotatiepunt gevonden voor ${sleutel}`);
  const oplichten: Record<Sleutel, { object: Object3D | null; filter?: (m: MeshStandardMaterial) => boolean }[]> = {
    kozijn: [{ object: raam, filter: m => !m.transparent }],
    glas: [{ object: raam, filter: m => m.transparent }],
    dak: [{ object: kind("Dakisolatie") }],
    zon: panelen.map(object => ({ object })),
    spouw: [{ object: kind("Spouwisolatie_voor") }],
    vloer: [{ object: kind("Vloerisolatie") }],
    pomp: [{ object: pomp }],
    batterij: [{ object: batterij }],
  };
  return { standen, midden, ankers, oplichten, bewegingen };
}

// Tussen twee standen via een boog rond de woning, zodat de camera nooit door een muur gaat.
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

type Annotatie = { lijn: SVGLineElement | null; punt: SVGCircleElement | null; label: HTMLDivElement | null };

function Woning({ sectie, onStap, onGeladen, mobiel, annotaties }: { sectie: RefObject<HTMLElement | null>; onStap: (stap: number) => void; onGeladen: () => void; mobiel: boolean; annotaties: RefObject<Record<string, Annotatie>> }) {
  const gltf = useLoader(GLTFLoader, HOUSE_MODELS.hoekwoning.url);
  const voortgang = useRef(0);
  const doel = useRef(0);
  const gestart = useRef(false);
  const actieveStap = useRef(-1);
  const bereikt = useRef(0);
  // Korte actie van de monteur bij dak- en vloerisolatie (t in seconden; start na een korte pauze, als de camera er is).
  const actie = useRef<{ soort: "dak" | "vloer"; t: number } | null>(null);
  const minder = useRef(false);
  const { invalidate, camera, size } = useThree();
  const tijdelijk = useRef({ pos: new Vector3(), look: new Vector3(), punt: new Vector3(), hulp: new Vector3() });

  const opgebouwd = useMemo(() => {
    const { scene, scale, position, bounds } = prepareHouse(gltf.scene, "hoekwoning");
    const realistisch = maakRealistisch(scene);
    const cutaway = maakCutaway(scene);
    const route = bouwRoute(scene, scale, position, bounds);
    // Per maatregel de materialen die oplichten, met een zweem Gijs-groen.
    const highlight = new Map<Sleutel, MeshStandardMaterial[]>();
    for (const { sleutel } of MAATREGELEN) {
      const lijst: MeshStandardMaterial[] = [];
      for (const { object, filter } of route.oplichten[sleutel]) {
        object?.traverse(part => {
          const mesh = part as Mesh;
          if (!mesh.isMesh) return;
          for (const mat of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) {
            if (!mat.isMeshStandardMaterial || (filter && !filter(mat))) continue;
            mat.emissive.copy(GIJS_GROEN);
            mat.emissiveIntensity = 0;
            lijst.push(mat);
          }
        });
      }
      highlight.set(sleutel, lijst);
    }
    // Installaties verschijnen pas bij hun eigen hoofdstuk en blijven daarna zichtbaar.
    const installaties: { stap: number; objecten: Object3D[]; materialen: Set<MeshStandardMaterial> }[] = [];
    for (const o of scene.children) {
      const stap = o.name.startsWith("Zonnepaneel") ? STAP.zon : o.name.startsWith("Warmtepomp") ? STAP.pomp : o.name === "Thuisbatterij" ? STAP.batterij : -1;
      if (stap < 0) continue;
      let groep = installaties.find(g => g.stap === stap);
      if (!groep) { groep = { stap, objecten: [], materialen: new Set() }; installaties.push(groep); }
      groep.objecten.push(o);
      o.visible = false;
      o.traverse(part => {
        const mesh = part as Mesh;
        if (!mesh.isMesh) return;
        for (const mat of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) { mat.transparent = true; groep.materialen.add(mat); }
      });
    }
    // Monteur en ladder voor de korte acties (dak op, kruipruimte in); alleen zichtbaar tijdens de actie.
    const monteur = maakMonteur();
    const ladderVoet = new Vector3(2.0, M.maaiveld, M.gevelVoor + 1.4), ladderTop = new Vector3(2.0, 2.63, 4.06);
    const { ladder, materialen: ladderMaterialen } = maakLadder(ladderVoet.distanceTo(ladderTop));
    ladder.position.copy(ladderVoet);
    ladder.rotation.x = -Math.atan2(ladderVoet.z - ladderTop.z, ladderTop.y - ladderVoet.y);
    scene.add(monteur.root, ladder);
    return { scene, scale, position, route, highlight, installaties, cutaway, monteur, ladder, ladderMaterialen, ladderVoet, ladderTop, texturen: [...realistisch, ...cutaway.texturen] };
  }, [gltf]);
  const { scene, scale, position, route } = opgebouwd;
  useEffect(() => {
    onGeladen();
    return () => { disposeHouse(scene); opgebouwd.texturen.forEach(t => t.dispose()); };
  }, [scene, opgebouwd, onGeladen]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      minder.current = media.matches;
      const element = sectie.current;
      if (!element) return;
      const kop = parseFloat(getComputedStyle(element).getPropertyValue("--house-header")) || 0;
      const focus = kop + (window.innerHeight - kop) * (window.innerWidth < 768 ? 0.64 : 0.45);
      let p = 0;
      for (const paneel of element.querySelectorAll<HTMLElement>("[data-stap]")) {
        const r = paneel.getBoundingClientRect();
        const i = Number(paneel.dataset.stap);
        if (r.top <= focus) p = i + (i > 0 ? clamp((focus - r.top) / Math.max(1, r.height * 0.6)) * 0.95 : 0);
      }
      // Minder beweging: geen overgangen, direct de toestand van de stap die in beeld is.
      doel.current = media.matches ? Math.floor(p) + 0.5 : p;
      if (!gestart.current) { voortgang.current = doel.current; gestart.current = true; }
      invalidate();
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    media.addEventListener("change", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); media.removeEventListener("change", update); };
  }, [sectie, invalidate]);

  // Korte actie: bij dakisolatie de ladder op en het dak op stappen, bij vloerisolatie door de kruipruimte kruipen.
  const OP_LADDER = new Vector3(0, 0, 0.3);
  const speelActie = (delta: number, dakLift: number) => {
    const { monteur: mt, ladder, ladderMaterialen, ladderVoet, ladderTop } = opgebouwd;
    const a = actie.current;
    const verberg = () => { mt.root.visible = false; ladder.visible = false; };
    if (!a) return verberg();
    a.t += Math.min(delta, 0.05);
    const t = a.t, duur = a.soort === "dak" ? 2.2 : 2.0;
    if (t < 0) return verberg();
    if (t > duur) { actie.current = null; return verberg(); }
    const zicht = clamp(t / 0.15) * (1 - clamp((t - (duur - 0.3)) / 0.3));
    mt.root.visible = true;
    zetZichtbaarheid(mt.materialen, zicht);
    mt.root.rotation.set(0, Math.PI, 0);
    const hulp = tijdelijk.current.hulp;
    if (a.soort === "dak") {
      ladder.visible = true;
      zetZichtbaarheid(ladderMaterialen, zicht);
      if (t < 1.3) {
        mt.root.position.lerpVectors(ladderVoet, ladderTop, 0.3 + (t / 1.3) * 0.62).add(OP_LADDER);
        poseKlimmen(mt, t * 9);
      } else {
        // Van de ladder de dakhelling op (bovenkant pannen, inclusief het optillen van de dakstap).
        const s = ease((t - 1.3) / 0.5);
        hulp.lerpVectors(ladderVoet, ladderTop, 0.92).add(OP_LADDER);
        const dakZ = 3.35, dakY = 2.85 + ((4.39 - dakZ) / 4.39) * 2.49 + 0.95 * dakLift - 0.04;
        mt.root.position.set(ladderTop.x, hulp.y + (dakY - hulp.y) * s, hulp.z + (dakZ - hulp.z) * s);
        if (s < 1) poseKlimmen(mt, t * 9); else poseStaan(mt);
      }
    } else {
      ladder.visible = false;
      mt.root.position.set(1.75, M.kruipBodem + 0.12, 3.3 - 1.3 * clamp(t / duur));
      poseKruipen(mt, t * 7);
    }
  };

  useFrame((_, delta) => {
    voortgang.current += (doel.current - voortgang.current) * (minder.current ? 1 : 1 - Math.exp(-8 * delta));
    const p = voortgang.current;
    const stap = Math.max(0, Math.min(EIND, Math.floor(p + 0.001)));
    if (stap !== actieveStap.current) {
      actieveStap.current = stap;
      onStap(stap);
      actie.current = !minder.current && (stap === STAP.dak || stap === STAP.vloer) ? { soort: stap === STAP.dak ? "dak" : "vloer", t: -0.45 } : null;
    }

    // Camera: vaste stand per stap, rustige overgang terwijl de volgende stap in beeld schuift.
    const t = stap === 0 ? 0 : ease((p - stap) / 0.35);
    const { pos, look, punt } = tijdelijk.current;
    if (stap === 0) { pos.copy(route.standen[0].pos); look.copy(route.standen[0].look); }
    else mengStanden(route.standen[stap - 1], route.standen[stap], t, route.midden, pos, look);
    if (mobiel) pos.sub(look).multiplyScalar(1.12).add(look);
    camera.position.copy(pos);
    camera.lookAt(look);
    camera.updateMatrixWorld();

    // De kopgevel schuift weg tijdens de overgang naar het opengewerkte overzicht en blijft daarna weg.
    zetKopgevel(opgebouwd.cutaway.kopgevel, opgebouwd.cutaway.kopMaterialen, stap === 0 ? 0 : stap === 1 ? t : 1);
    // Lagen schuiven uit elkaar bij hun hoofdstuk; verschuivingen tellen op.
    for (const { object, origin } of route.bewegingen) object.position.copy(origin);
    for (const { object, offset, stap: s } of route.bewegingen) object.position.addScaledVector(offset, actief(p, s));
    bereikt.current = Math.max(bereikt.current, p);
    for (const g of opgebouwd.installaties) {
      const zicht = ease((bereikt.current - g.stap) / 0.3);
      for (const m of g.materialen) m.opacity = zicht;
      for (const o of g.objecten) o.visible = zicht > 0.01;
    }
    scene.updateMatrixWorld(true);

    for (const { sleutel } of MAATREGELEN) {
      const sterkte = actief(p, STAP[sleutel]);
      for (const mat of opgebouwd.highlight.get(sleutel) ?? []) mat.emissiveIntensity = sterkte * (HIGHLIGHT[sleutel] ?? 0.38);

      // Annotatie: lijn vanaf het punt op het bouwdeel naar een compact label, alleen bij de actieve maatregel.
      const a = annotaties.current?.[sleutel];
      const anker = route.ankers[sleutel];
      if (!a?.label || !a.lijn || !a.punt) continue;
      if (!anker || sterkte < 0.01) { a.label.style.opacity = "0"; a.lijn.style.opacity = "0"; a.punt.style.opacity = "0"; continue; }
      anker.object.localToWorld(punt.copy(anker.lokaal)).project(camera);
      const x = (punt.x + 1) / 2 * size.width, y = (1 - punt.y) / 2 * size.height;
      const breed = a.label.offsetWidth, hoog = a.label.offsetHeight;
      const lx = Math.min(Math.max(16, x + (mobiel ? 36 : 90)), size.width - breed - 16);
      const ly = Math.min(Math.max(16, y - (mobiel ? 70 : 110)), size.height - hoog - 16);
      a.label.style.transform = `translate(${lx}px, ${ly}px)`;
      a.label.style.opacity = String(sterkte);
      a.lijn.setAttribute("x1", String(x)); a.lijn.setAttribute("y1", String(y));
      a.lijn.setAttribute("x2", String(lx)); a.lijn.setAttribute("y2", String(ly + hoog / 2));
      a.lijn.style.opacity = String(sterkte);
      a.punt.setAttribute("cx", String(x)); a.punt.setAttribute("cy", String(y));
      a.punt.style.opacity = String(sterkte);
    }

    speelActie(delta, actief(p, STAP.dak));
    if (Math.abs(doel.current - voortgang.current) > 0.0001 || actie.current) invalidate();
  });

  return (
    <>
      <HouseDaglicht kant="rechts" mobiel={mobiel} bereik={5} />
      {/* Licht vanaf de open kant, met schaduw: de kamers krijgen anders geen daglicht. */}
      <directionalLight position={[6, 3.6, 2.4]} intensity={1.35} color="#fff3e2" castShadow shadow-mapSize={mobiel ? [1024, 1024] : [2048, 2048]} shadow-bias={-0.0005} shadow-normalBias={0.02} shadow-radius={3}>
        <orthographicCamera attach="shadow-camera" args={[-3.2, 3.2, 3.2, -3.2, 0.5, 20]} />
      </directionalLight>
      <group scale={scale} position={position}><primitive object={scene} /></group>
    </>
  );
}

class ModelFout extends Component<{ children: ReactNode }, { mislukt: boolean }> {
  state = { mislukt: false };
  static getDerivedStateFromError() { return { mislukt: true }; }
  render() {
    if (this.state.mislukt) return <p role="alert" className={basis.fallback}>De 3D-woning kan niet worden geladen. Je kunt hieronder wel alle onderdelen lezen.</p>;
    return this.props.children;
  }
}

export default function HomeCutawayTest({ children }: { children?: ReactNode }) {
  const sectie = useRef<HTMLElement>(null);
  const dialoog = useRef<HTMLDialogElement>(null);
  const annotaties = useRef<Record<string, Annotatie>>({});
  const [stap, setStap] = useState(0);
  const [geladen, setGeladen] = useState(false);
  const [mobiel, setMobiel] = useState(false);
  const onGeladen = useMemo(() => () => setGeladen(true), []);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobiel(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  // Zwevende scanbalk, zoals op de homepage: zichtbaar na de hero, tot het einde van het woningverhaal.
  const [balk, setBalk] = useState(false);
  useEffect(() => {
    const update = () => {
      const hero = sectie.current?.querySelector("[data-stap='0']");
      const einde = document.getElementById("na-de-woning");
      setBalk(Boolean(hero && einde && hero.getBoundingClientRect().bottom < 120 && einde.getBoundingClientRect().top > window.innerHeight));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const vorigeOverflow = useRef("");
  const openScan = () => {
    if (!dialoog.current || dialoog.current.open) return;
    vorigeOverflow.current = document.body.style.overflow;
    dialoog.current.showModal();
    document.body.style.overflow = "hidden";
  };
  const actieve = stap >= EERSTE && stap < EIND ? MAATREGELEN[stap - EERSTE] : null;
  const annotatie = (sleutel: string) => annotaties.current[sleutel] ??= { lijn: null, punt: null, label: null };

  return (
    <>
      <section ref={sectie} className={basis.story} aria-label="Ontdek waar verduurzamingsmaatregelen in een woning zitten">
        <aside className={basis.visualColumn} aria-label="De woning tijdens het verhaal">
          <div className={basis.visual} role="img" aria-label={actieve ? `Doorsnede van de woning, met de nadruk op ${actieve.titel.naam.toLowerCase()}` : "Illustratieve woning van Gijs"}>
            <div className={basis.halo} />
            <ModelFout>
              <Canvas camera={{ position: [4, 3, 5], fov: FOV, near: 0.05, far: 60 }} shadows="soft" frameloop="demand" dpr={mobiel ? [1, 1.5] : [1, 1.75]} style={{ touchAction: "pan-y" }} fallback={<p className={basis.fallback}>3D is niet beschikbaar. De uitleg kun je gewoon lezen.</p>}>
                <Suspense fallback={null}><Woning sectie={sectie} onStap={setStap} onGeladen={onGeladen} mobiel={mobiel} annotaties={annotaties} /></Suspense>
              </Canvas>
            </ModelFout>
            {!geladen && <p role="status" className={basis.loading}>De woning wordt geladen…</p>}
            <svg className={styles.lijnen} aria-hidden="true">
              {MAATREGELEN.map(m => (
                <g key={m.sleutel}>
                  <line ref={el => { annotatie(m.sleutel).lijn = el; }} className={styles.lijn} />
                  <circle ref={el => { annotatie(m.sleutel).punt = el; }} r={4.5} className={styles.punt} />
                </g>
              ))}
            </svg>
            {MAATREGELEN.map(m => (
              <div key={m.sleutel} ref={el => { annotatie(m.sleutel).label = el; }} className={styles.label} aria-hidden="true">
                <strong>{m.titel.naam}</strong>
                <span>{m.kort}</span>
              </div>
            ))}
          </div>
          <p className={styles.bijschrift}>Illustratieve woningweergave · Ontdek waar verduurzamingsmaatregelen in een woning zitten.</p>
        </aside>
        <div className={basis.narrative}>
          {/* Hero zoals de huidige homepage, met direct de woningscan; zonder woningtypekeuze (die gebeurt in de scan). */}
          <section className={basis.panel} data-stap={0}>
            <p className={basis.eyebrow}>Groen in je straat</p>
            <h1 className={basis.title}>Verduurzaam je woning.</h1>
            <p className={basis.description}>Lagere energiekosten, meer wooncomfort of zo energieneutraal mogelijk wonen? Ontdek stap voor stap welke maatregelen daarbij kunnen helpen.</p>
            <div className={basis.scanCard}>
              <h2 className={basis.scanCardTitle}>Start de digitale woningscan</h2>
              <p className={basis.scanCardIntro}>Vul je adres in en ontdek in een paar minuten wat er mogelijk is voor jouw woning.</p>
              <AddressScan />
            </div>
            <p className={basis.checkNote}>Een digitale woningscan als voorbereiding op advies van Gijs. Je woningtype wordt in de scan automatisch opgehaald.</p>
            <a className={basis.textLink} href="#woning-verhaal">Neem een kijkje in de woning ↓</a>
          </section>
          <section id="woning-verhaal" className={basis.panel} data-stap={1}>
            <p className={basis.eyebrow}>Je hoeft geen expert te zijn</p>
            <h2 className={basis.title}>Een fijne woning begint bij begrijpen.</h2>
            <p className={basis.description}>Waar blijft de warmte? Via je dak, muren, vloer en ramen kan warmte ontsnappen. Isolatie helpt die binnen te houden.</p>
            <p className={basis.description}>Zelf stroom maken? Dat doen zonnepanelen met zonlicht. Een warmtepomp gebruikt stroom om warmte van buiten naar binnen te brengen.</p>
            <p className={basis.description}>Kijk mee in de woning. Zo ontdek je waar iedere oplossing zit en wat jij ervan merkt.</p>
            <button type="button" className={basis.inlineScan} onClick={openScan}>Liever meteen jouw woning bekijken? Start de woningscan →</button>
          </section>
          {MAATREGELEN.map((m, i) => (
            <section key={m.sleutel} className={basis.panel} data-stap={EERSTE + i}>
              <p className={basis.eyebrow}>Onderdeel {i + 1} van {MAATREGELEN.length}</p>
              <h2 className={basis.maatregelKop}>
                <span className={basis.maatregelNaam}>{m.titel.naam}</span><span className="sr-only">: </span>
                <span className={basis.title}>{m.titel.titel}</span>
              </h2>
              <p className={basis.description}>{m.titel.uitleg}</p>
              <p className={basis.benefit}>{m.benefit}</p>
              <Link className={basis.maatregelCta} href={`/maatregelen/${m.titel.slug}`}>{m.titel.cta} <span aria-hidden="true">→</span></Link>
            </section>
          ))}
          <section className={basis.options} data-stap={EIND}>
            <h2 className={basis.title}>Ontdek wat er mogelijk is voor jouw woning</h2>
            <p className={basis.description}>Vul je adres in. In de woningscan zie je in een paar minuten wat er voor jouw woning kan.</p>
            <button type="button" className={basis.cta} onClick={openScan}>Start de woningscan</button>
          </section>
        </div>
      </section>
      <div id="na-de-woning" className={basis.support}>{children}</div>
      <div className={basis.scanBar} hidden={!balk}>
        <span>Wat kan er met jouw woning?</span>
        <button type="button" onClick={openScan}>Start de woningscan <span aria-hidden="true">→</span></button>
      </div>
      <dialog ref={dialoog} className={basis.dialog} aria-labelledby="cutaway-scan-titel" onClose={() => { document.body.style.overflow = vorigeOverflow.current; }} onClick={e => { if (e.target === dialoog.current) dialoog.current?.close(); }}>
        <div className={basis.dialogBody}>
          <button className={basis.close} type="button" aria-label="Sluit scan" onClick={() => dialoog.current?.close()}>×</button>
          <p className={basis.eyebrow}>Jouw woning als vertrekpunt</p>
          <h2 id="cutaway-scan-titel">Wat kan er met jouw woning?</h2>
          <p>Vul je adres in en ga verder met de digitale woningscan. Het woningtype wordt daar automatisch opgehaald.</p>
          <AddressScan onNavigate={() => dialoog.current?.close()} />
        </div>
      </dialog>
    </>
  );
}
