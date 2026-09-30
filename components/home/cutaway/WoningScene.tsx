"use client";
/* eslint-disable react-hooks/immutability -- Three.js-scene, camera en annotatie-elementen worden buiten React om per frame bijgewerkt. */

import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Box3, Color, Mesh, MeshStandardMaterial, Raycaster, Vector3, type Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { prepareHouse, disposeHouse } from "@/lib/house-model";
import { maakRealistisch } from "@/lib/house-realism";
import { HOUSE_MODELS } from "@/lib/woning-types";
import { HouseDaglicht } from "@/components/woning/HouseDaglicht";
import { M, maakCutaway, zetKopgevel, type V3 } from "./maquette";
import { EIND, MAATREGELEN, STAP, type Annotatie, type Sleutel } from "./stappen";
import basis from "../HouseModelPrototype.module.css";

// De 3D-poppenhuiswoning van de homepage-test, apart geladen (next/dynamic)
// zodat de hero en de adresinvoer niet op de Three.js-code hoeven te wachten.

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
  standen[STAP.vloer] = stand(lok([M.open, -2.95, 1.1]), [0.93, 0.14, 0.34], L3 * 1.05);
  standen[STAP.pomp] = pomp ? stand(doos(pomp).c, [0.5, 0.34, -0.8], L3 * 0.95) : overzicht(1);
  standen[STAP.batterij] = batterij ? stand(doos(batterij).c, [0.92, 0.22, 0.32], L3 * 0.62) : overzicht(1);
  standen[EIND] = overzicht(1.03);

  // Lagen die per hoofdstuk uit elkaar schuiven (lokale eenheden van het model), zoals op de homepage.
  const bewegingen: Beweging[] = [];
  const schuif = (naam: RegExp, offset: V3, stap: number) => { for (const o of scene.children) if (naam.test(o.name)) bewegingen.push({ object: o, origin: o.position.clone(), offset: new Vector3(...offset), stap }); };
  schuif(/^(Dakpannen|Dakkapel|Schoorsteen|Dakgoot|Zonnepaneel)/, [0, 0.95, 0], STAP.dak);
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


function Woning({ sectie, onStap, onGeladen, mobiel, annotaties }: { sectie: RefObject<HTMLElement | null>; onStap: (stap: number) => void; onGeladen: () => void; mobiel: boolean; annotaties: RefObject<Record<string, Annotatie>> }) {
  const gltf = useLoader(GLTFLoader, HOUSE_MODELS.hoekwoning.url);
  const voortgang = useRef(0);
  const doel = useRef(0);
  const gestart = useRef(false);
  const actieveStap = useRef(-1);
  const bereikt = useRef(0);
  const minder = useRef(false);
  const { invalidate, camera, size } = useThree();
  const tijdelijk = useRef({ pos: new Vector3(), look: new Vector3(), punt: new Vector3() });

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
    return { scene, scale, position, route, highlight, installaties, cutaway, texturen: [...realistisch, ...cutaway.texturen] };
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

  useFrame((_, delta) => {
    voortgang.current += (doel.current - voortgang.current) * (minder.current ? 1 : 1 - Math.exp(-8 * delta));
    const p = voortgang.current;
    const stap = Math.max(0, Math.min(EIND, Math.floor(p + 0.001)));
    if (stap !== actieveStap.current) { actieveStap.current = stap; onStap(stap); }

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

    if (Math.abs(doel.current - voortgang.current) > 0.0001) invalidate();
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

export default function WoningScene({ sectie, onStap, onGeladen, mobiel, annotaties }: { sectie: RefObject<HTMLElement | null>; onStap: (stap: number) => void; onGeladen: () => void; mobiel: boolean; annotaties: RefObject<Record<string, Annotatie>> }) {
  return (
    <ModelFout>
      <Canvas camera={{ position: [4, 3, 5], fov: FOV, near: 0.05, far: 60 }} shadows="soft" frameloop="demand" dpr={mobiel ? [1, 1.5] : [1, 1.75]} style={{ touchAction: "pan-y" }} fallback={<p className={basis.fallback}>3D is niet beschikbaar. De uitleg kun je gewoon lezen.</p>}>
        <Suspense fallback={null}><Woning sectie={sectie} onStap={onStap} onGeladen={onGeladen} mobiel={mobiel} annotaties={annotaties} /></Suspense>
      </Canvas>
    </ModelFout>
  );
}
