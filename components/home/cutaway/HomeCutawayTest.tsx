"use client";
/* eslint-disable react-hooks/immutability -- Three.js-materialen, clipvlakken en camera worden buiten React om per frame bijgewerkt. */

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Box3, DoubleSide, Mesh, MeshStandardMaterial, Plane, Vector3, type Material, type Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Link from "next/link";
import AddressScan from "@/components/AddressScan";
import { prepareHouse, disposeHouse } from "@/lib/house-model";
import { maakRealistisch, grasTextuur, contactschaduwTextuur } from "@/lib/house-realism";
import { HOUSE_MODELS, type HouseType } from "@/lib/woning-types";
import { useWoningDraft } from "@/components/woning/WoningDraftProvider";
import { HouseDaglicht } from "@/components/woning/HouseDaglicht";
import styles from "./HomeCutawayTest.module.css";

// PROTOTYPE (branch homepage-cutaway-test): een doorsnede van dezelfde
// Gijs-woning als in de woningscan, gestuurd door scrollen. Het model zelf
// wordt niet aangepast: elke laag krijgt een eigen "hoekuitsnede" via
// clipvlakken, iets verspringend per laag, zodat de opbouw trapsgewijs
// zichtbaar wordt (pannen, latten, isolatie; buitenmuur, spouwisolatie,
// binnenmuur; vloerlagen). De uitsnede zit altijd aan de voor-/zijkant die
// naar de camera kijkt. Niet-afgedekte snijvlakken en de kruipruimte via
// optillen zijn bewuste prototype-keuzes (zie rapportage).

type Snede = "dak" | "muur" | "vloer";
const LAGEN: { patroon: RegExp; snede: Snede; diepte: number }[] = [
  { patroon: /^(Dakpannen|Dakgoot|Schoorsteen|Dakkapel|Zonnepaneel)/, snede: "dak", diepte: 0 },
  { patroon: /^Panlatten/, snede: "dak", diepte: 1 },
  { patroon: /^Tengellatten/, snede: "dak", diepte: 2 },
  { patroon: /^Dakisolatie/, snede: "dak", diepte: 3 },
  { patroon: /^Dakconstructie/, snede: "dak", diepte: 4 },
  { patroon: /^(Buitengevel_|Zijgevel_garage_buiten|Gevelbekleding|Raam|Voordeur|Achterdeur|Raamdorpels|Deurdorpel|Plinten|Regenpijpen|Luifel|Kunststof_profiel)/, snede: "muur", diepte: 0 },
  { patroon: /^(Spouwisolatie_|Zijgevel_garage_isolatie)/, snede: "muur", diepte: 1 },
  { patroon: /^(Binnenmuur_|Bouwmuur_|Zijgevel_garage_binnen)/, snede: "muur", diepte: 2 },
  { patroon: /^(Verdiepingsvloer|Zoldervloer)/, snede: "muur", diepte: 3 },
  { patroon: /^Vloer$/, snede: "vloer", diepte: 0 },
  { patroon: /^Vloerverwarming$/, snede: "vloer", diepte: 1 },
  { patroon: /^Vloerconstructie$/, snede: "vloer", diepte: 2 },
  { patroon: /^Vloerisolatie$/, snede: "vloer", diepte: 3 },
];
const INSTALLATIE = /^(Zonnepaneel|Warmtepomp|Thuisbatterij)/;
// Binnenvlakken krijgen daglicht alleen via de uitsnede en zouden bijna zwart worden:
// tijdens de doorsnede lichten ze zacht op (eigen textuur, geen gloed van buiten).
const BINNEN = /^(Binnenmuur_|Bouwmuur_|Zijgevel_garage_binnen|Verdiepingsvloer|Zoldervloer|Vloer$|Dakconstructie|Warmtepomp_binnenunit)/;

type Stap = { eyebrow: string; titel: string; tekst: string[]; legenda?: string; link?: { href: string; label: string } };
const STAPPEN: Stap[] = [
  { eyebrow: "Groen in je straat", titel: "Ontdek wat er mogelijk is voor jouw woning.", tekst: ["Scroll mee door een woning en zie waar warmte verdwijnt en waar je energie kunt besparen of opwekken."] },
  {
    eyebrow: "Het dak", titel: "Onder de dakpannen.", legenda: "Dakpannen, latten, isolatie en dakconstructie",
    tekst: ["Onder de pannen liggen de latten, daaronder de isolatie en de houten dakconstructie.", "Warme lucht stijgt op. Met goede dakisolatie blijft die warmte in huis."],
    link: { href: "/maatregelen/dakisolatie", label: "Meer over dakisolatie" },
  },
  {
    eyebrow: "De muur", titel: "Buitenmuur, spouw en binnenmuur.", legenda: "Buitenmuur, spouwisolatie en binnenmuur",
    tekst: ["Veel woningen hebben een spouwmuur: een buitenmuur en een binnenmuur met een ruimte ertussen, de spouw.", "Die spouw kan worden gevuld met isolatie. Dan koelt je woning minder snel af."],
    link: { href: "/maatregelen/spouwmuurisolatie", label: "Meer over spouwmuurisolatie" },
  },
  {
    eyebrow: "De vloer", titel: "Onder de vloer: de kruipruimte.", legenda: "Vloerlagen, vloerisolatie en kruipruimte",
    tekst: ["Onder de begane grond zit bij veel woningen een kruipruimte.", "Isolatie tegen de onderkant van de vloer houdt de kou uit de kruipruimte tegen. Dat merk je aan je voeten."],
    link: { href: "/maatregelen/vloerisolatie", label: "Meer over vloerisolatie" },
  },
  {
    eyebrow: "Installaties", titel: "Zelf warmte en stroom regelen.", legenda: "Zonnepanelen, warmtepomp en thuisbatterij",
    tekst: ["Zonnepanelen op het dak maken stroom van zonlicht.", "Een warmtepomp gebruikt stroom om warmte van buiten naar binnen te brengen. Met een thuisbatterij bewaar je zelf opgewekte stroom voor later."],
    link: { href: "/maatregelen", label: "Bekijk alle maatregelen" },
  },
  { eyebrow: "Jouw woning", titel: "Ontdek jouw woning.", tekst: ["Elke woning is anders. In de digitale woningscan vul je je adres in en zie je in een paar minuten wat er voor jouw woning mogelijk is."] },
];
const LAATSTE = STAPPEN.length - 1;

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
const ramp = (p: number, van: number, tot: number) => ease((p - van) / (tot - van));
const FOV = 30;
/** Hoe ver de woning optilt om de kruipruimte te tonen (lokale eenheden van het model). */
const TIL = 0.8;

type Stand = { pos: Vector3; look: Vector3 };
type Groep = { snede: Snede; diepte: number; u: Plane; z: Plane };

function bouwDoorsnede(scene: Object3D, schaal: number, positie: Vector3, bounds: Box3) {
  const wereld = (v: Vector3) => v.clone().multiplyScalar(schaal).add(positie);
  const doos = (o: Object3D) => { const b = new Box3().setFromObject(o); return { min: wereld(b.min), max: wereld(b.max), c: wereld(b.getCenter(new Vector3())) }; };
  const huis = { min: wereld(bounds.min), max: wereld(bounds.max) };
  const midden = huis.min.clone().add(huis.max).multiplyScalar(0.5);
  const maat = huis.max.clone().sub(huis.min);
  const meter = schaal * scene.scale.x;

  // Camerazijde: de kant zonder buurwoning of garage (zelfde principe als de huidige homepage).
  const obstakels = scene.children.filter(o => /^(Buurwoning|Garage)/.test(o.name)).map(o => ({ o, d: doos(o) }));
  const vrij = (kant: 1 | -1) => !obstakels.some(({ d }) => (d.c.x - midden.x) * kant > maat.x * 0.3);
  const s: 1 | -1 = vrij(1) ? 1 : vrij(-1) ? -1 : 1;
  // Tussenwoning: aan beide kanten buren. De buurwoning aan de camerazijde gaat tijdens de doorsnede even uit beeld.
  const buurCamerazijde = obstakels.filter(({ d }) => (d.c.x - midden.x) * s > maat.x * 0.3).map(({ o }) => o);

  // Coördinaat u = s·x, zodat "naar de camera" altijd positief is.
  const uMax = s > 0 ? huis.max.x : -huis.min.x;
  const uMid = s * midden.x;
  const dicht = { u: uMax + meter, z: huis.max.z + meter };
  const klein = { u: uMax - maat.x * 0.4, z: huis.max.z - maat.z * 0.42 };
  const groot = { u: uMid - maat.x * 0.06, z: midden.z - maat.z * 0.06 };
  const stap = 0.3 * meter;

  // Clipvlakken per laag: een fragment verdwijnt alleen als het aan de camerakant van beide vlakken ligt
  // (clipIntersection), zodat precies de hoek richting camera wordt weggesneden.
  const groepen = new Map<string, Groep>();
  const groepVoor = (snede: Snede, diepte: number) => {
    const sleutel = `${snede}-${diepte}`;
    let g = groepen.get(sleutel);
    if (!g) { g = { snede, diepte, u: new Plane(new Vector3(-s, 0, 0), dicht.u), z: new Plane(new Vector3(0, 0, -1), dicht.z) }; groepen.set(sleutel, g); }
    return g;
  };
  const eigenaar = new Map<Material, string>();
  const geknipt = new Set<Material>();
  for (const object of scene.children) {
    const laag = LAGEN.find(l => l.patroon.test(object.name));
    if (!laag || object.userData.garagePanel || /^Buurwoning/.test(object.name)) continue;
    const g = groepVoor(laag.snede, laag.diepte);
    const sleutel = `${laag.snede}-${laag.diepte}`;
    object.traverse(part => {
      const mesh = part as Mesh;
      if (!mesh.isMesh) return;
      const lijst = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(m => {
        const huidig = eigenaar.get(m);
        const materiaal = huidig && huidig !== sleutel ? m.clone() : m;
        eigenaar.set(materiaal, sleutel);
        materiaal.clippingPlanes = [g.u, g.z];
        materiaal.clipIntersection = true;
        materiaal.clipShadows = true;
        // Binnenkant van een doorgesneden laag zichtbaar houden (prototype: geen afgedekte snijvlakken).
        materiaal.userData.origineleZijde ??= materiaal.side;
        materiaal.side = DoubleSide;
        geknipt.add(materiaal);
        return materiaal;
      });
      mesh.material = Array.isArray(mesh.material) ? lijst : lijst[0];
    });
  }
  // Delen materialen met onderdelen buiten de doorsnede (bv. de fundering)? Dan krijgen die een eigen, ongeknipte kopie.
  for (const object of scene.children) {
    if (LAGEN.some(l => l.patroon.test(object.name))) continue;
    object.traverse(part => {
      const mesh = part as Mesh;
      if (!mesh.isMesh) return;
      const lijst = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(m => {
        if (!geknipt.has(m)) return m;
        const kopie = m.clone();
        kopie.clippingPlanes = null;
        kopie.side = m.userData.origineleZijde;
        return kopie;
      });
      mesh.material = Array.isArray(mesh.material) ? lijst : lijst[0];
    });
  }

  const binnen = new Set<MeshStandardMaterial>();
  for (const object of scene.children) {
    if (!BINNEN.test(object.name)) continue;
    object.traverse(part => {
      const mesh = part as Mesh;
      if (!mesh.isMesh) return;
      for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) {
        if (!m.isMeshStandardMaterial) continue;
        m.emissive.set("#ffffff");
        m.emissiveMap = m.map;
        m.emissiveIntensity = 0;
        binnen.add(m);
      }
    });
  }

  // Installaties pas zichtbaar bij de installatiestap, zodat de woning eerst als gewone woning leest.
  const installaties: { objecten: Object3D[]; materialen: Set<MeshStandardMaterial> } = { objecten: [], materialen: new Set() };
  for (const object of scene.children) {
    if (!INSTALLATIE.test(object.name) || object.userData.garagePanel) continue;
    installaties.objecten.push(object);
    object.visible = false;
    object.traverse(part => {
      const mesh = part as Mesh;
      if (!mesh.isMesh) return;
      for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as MeshStandardMaterial[]) { m.transparent = true; installaties.materialen.add(m); }
    });
  }

  // Kruipruimte: de woning tilt op van de fundering; de vloerisolatie blijft iets achter, zodat je de laag ziet.
  const tillen = scene.children
    .filter(o => !o.userData.garagePanel && !/^(Fundering|Buurwoning|Garage|Warmtepomp_DeWarmte|Thuisbatterij)/.test(o.name))
    .map(o => ({ object: o, origin: o.position.clone(), hoogte: o.name === "Vloerisolatie" ? TIL * 0.45 : TIL }));

  // Camerastanden per stap: rustig, steeds vanaf dezelfde kant, alleen dichterbij waar dat helpt.
  const straal = maat.length() / 2;
  const L = (straal / Math.sin((FOV / 2) * (Math.PI / 180))) * 0.95 * 1.2;
  const stand = (look: [number, number, number], richting: [number, number, number], afstand: number): Stand => {
    const l = midden.clone().add(new Vector3(look[0] * s * maat.x, look[1] * maat.y, look[2] * maat.z));
    return { look: l, pos: l.clone().add(new Vector3(richting[0] * s, richting[1], richting[2]).normalize().multiplyScalar(afstand)) };
  };
  const standen: Stand[] = [
    stand([0, 0.06, 0], [0.55, 0.4, 0.72], L),
    stand([0.1, 0.26, 0.08], [0.5, 0.55, 0.7], L * 0.8),
    stand([0.16, 0.02, 0.14], [0.62, 0.26, 0.74], L * 0.76),
    stand([0.1, -0.08, 0.1], [0.6, 0.22, 0.78], L * 0.95),
    stand([0.06, 0.04, 0.06], [0.55, 0.36, 0.76], L * 0.92),
    stand([0, 0.06, 0], [0.52, 0.45, 0.72], L * 1.02),
  ];

  const fundering = scene.children.find(o => o.name === "Fundering");
  const f = fundering ? doos(fundering) : { min: huis.min, max: huis.min, c: huis.min };
  const alles = new Box3().setFromObject(scene);
  const breedte = (alles.max.x - alles.min.x) * schaal;
  const nl = scene.userData.nlRij === true || scene.userData.nlVrij === true;
  const grondY = nl ? f.max.y + 0.23 * meter : f.min.y + (f.max.y - f.min.y) * 0.45;
  return { s, groepen: [...groepen.values()], dicht, klein, groot, stap, installaties, binnen, tillen, standen, buurCamerazijde, midden, maat, breedte, grondY, nl };
}

function Ondergrond({ d }: { d: ReturnType<typeof bouwDoorsnede> }) {
  const texturen = useMemo(() => ({ gras: grasTextuur(d.nl), schaduw: contactschaduwTextuur() }), [d.nl]);
  useEffect(() => () => { texturen.gras.dispose(); texturen.schaduw.dispose(); }, [texturen]);
  const straal = Math.hypot(d.breedte, d.maat.z) * 0.95;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[d.midden.x, d.grondY, d.midden.z]} receiveShadow renderOrder={0}>
        <circleGeometry args={[straal, 64]} />
        <meshStandardMaterial map={texturen.gras} transparent depthWrite={false} roughness={1} metalness={0} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[d.midden.x, d.grondY + 0.008, d.midden.z]} renderOrder={2}>
        <planeGeometry args={[d.maat.x * 1.45, d.maat.z * 1.45]} />
        <meshBasicMaterial map={texturen.schaduw} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

function Woning({ sectie, houseType, mobiel, onStap, onGeladen }: { sectie: RefObject<HTMLElement | null>; houseType: HouseType; mobiel: boolean; onStap: (stap: number) => void; onGeladen: () => void }) {
  const gltf = useLoader(GLTFLoader, HOUSE_MODELS[houseType].url);
  const { invalidate, camera, gl } = useThree();
  const voortgang = useRef(0);
  const doel = useRef(0);
  const gestart = useRef(false);
  const minderBeweging = useRef(false);
  const actief = useRef(-1);
  const tijdelijk = useRef({ pos: new Vector3(), look: new Vector3() });

  const opgebouwd = useMemo(() => {
    const { scene, scale, position, bounds } = prepareHouse(gltf.scene, houseType);
    const texturen = maakRealistisch(scene);
    return { scene, scale, position, texturen, d: bouwDoorsnede(scene, scale, position, bounds) };
  }, [gltf, houseType]);
  const { scene, scale, position, d } = opgebouwd;

  useEffect(() => { gl.localClippingEnabled = true; invalidate(); }, [gl, invalidate]);
  useEffect(() => {
    onGeladen();
    return () => { disposeHouse(scene); opgebouwd.texturen.forEach(t => t.dispose()); };
  }, [scene, onGeladen, opgebouwd]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      minderBeweging.current = media.matches;
      const element = sectie.current;
      if (!element) return;
      const kop = parseFloat(getComputedStyle(element).getPropertyValue("--kop")) || 0;
      const focus = window.innerWidth < 768 ? window.innerHeight * 0.72 : kop + (window.innerHeight - kop) * 0.5;
      const panelen = [...element.querySelectorAll<HTMLElement>("[data-cutaway-stap]")];
      let p = 0;
      panelen.forEach((paneel, i) => {
        const r = paneel.getBoundingClientRect();
        if (r.top > focus) return;
        const volgende = panelen[i + 1]?.getBoundingClientRect().top ?? r.bottom;
        p = i + clamp((focus - r.top) / Math.max(1, volgende - r.top));
      });
      p = Math.min(p, LAATSTE);
      // Minder beweging: geen overgangen, direct de toestand van de stap die in beeld is.
      doel.current = media.matches ? Math.min(LAATSTE, Math.floor(p + 0.1)) + 0.2 : p;
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
    voortgang.current += (doel.current - voortgang.current) * (minderBeweging.current ? 1 : 1 - Math.exp(-6 * delta));
    const p = voortgang.current;
    const stap = Math.max(0, Math.min(LAATSTE, Math.floor(p + 0.1)));
    if (stap !== actief.current) { actief.current = stap; onStap(stap); }

    // Toestanden: elke stap opent een deel, stap 5 zet alles weer dicht (installaties blijven zichtbaar).
    const sluit = ramp(p, 4.45, 5);
    const open: Record<Snede, number> = { dak: ramp(p, 0.55, 1.1) * (1 - sluit), muur: ramp(p, 1.55, 2.1) * (1 - sluit), vloer: ramp(p, 2.55, 3.1) * (1 - sluit) };
    const binnen = ramp(p, 3.55, 4.1) * (1 - sluit);
    const til = ramp(p, 2.55, 3.1) * (1 - ramp(p, 3.5, 4.05));
    const zicht = ramp(p, 3.55, 4.1);

    const hoekU = d.klein.u + (d.groot.u - d.klein.u) * binnen;
    const hoekZ = d.klein.z + (d.groot.z - d.klein.z) * binnen;
    for (const g of d.groepen) {
      const f = open[g.snede];
      g.u.constant = d.dicht.u + (hoekU - d.dicht.u) * f + g.diepte * d.stap;
      g.z.constant = d.dicht.z + (hoekZ - d.dicht.z) * f + g.diepte * d.stap;
    }
    for (const { object, origin, hoogte } of d.tillen) { object.position.copy(origin); object.position.y += hoogte * til; }
    for (const m of d.installaties.materialen) m.opacity = zicht;
    for (const o of d.installaties.objecten) o.visible = zicht > 0.01;
    const doorsnedeOpen = Math.max(open.dak, open.muur, open.vloer);
    const binnenLicht = 0.32 * Math.max(open.muur, open.vloer);
    for (const m of d.binnen) m.emissiveIntensity = binnenLicht;
    for (const o of d.buurCamerazijde) o.visible = doorsnedeOpen < 0.02;

    // Camera: vaste standen per stap, overgang terwijl de volgende stap in beeld schuift.
    const { pos, look } = tijdelijk.current;
    pos.copy(d.standen[0].pos); look.copy(d.standen[0].look);
    for (let i = 0; i < LAATSTE; i++) {
      const t = ramp(p, i + 0.55, i + 1.1);
      pos.lerp(d.standen[i + 1].pos, t); look.lerp(d.standen[i + 1].look, t);
    }
    if (mobiel) pos.sub(look).multiplyScalar(1.15).add(look);
    camera.position.copy(pos);
    camera.lookAt(look);

    if (Math.abs(doel.current - voortgang.current) > 0.0005) invalidate();
  });

  return (
    <>
      <HouseDaglicht kant={d.s < 0 ? "links" : "rechts"} mobiel={mobiel} />
      <Ondergrond d={d} />
      <group scale={scale} position={position}><primitive object={scene} /></group>
    </>
  );
}

class ModelFout extends Component<{ children: ReactNode }, { mislukt: boolean }> {
  state = { mislukt: false };
  static getDerivedStateFromError() { return { mislukt: true }; }
  render() {
    if (this.state.mislukt) return <p role="alert" className={styles.melding}>De 3D-woning kan niet worden geladen. De uitleg hiernaast kun je gewoon lezen.</p>;
    return this.props.children;
  }
}

export default function HomeCutawayTest({ children }: { children?: ReactNode }) {
  const sectie = useRef<HTMLElement>(null);
  const [stap, setStap] = useState(0);
  const [mobiel, setMobiel] = useState(false);
  const [geladen, setGeladen] = useState("");
  const { draft } = useWoningDraft();
  const houseType = draft.houseType;
  const onGeladen = useMemo(() => () => setGeladen(houseType), [houseType]);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobiel(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const legenda = STAPPEN[stap].legenda;

  return (
    <>
      <section ref={sectie} className={styles.verhaal} aria-label="Kijk in een woning">
        <div className={styles.beeldKolom}>
          <div className={styles.beeld} role="img" aria-label={legenda ? `Doorsnede van de woning: ${legenda.toLowerCase()}` : "3D-voorbeeldwoning van Gijs"}>
            <div className={styles.halo} />
            <span className={styles.badge}>Illustratief, niet je echte woning</span>
            <ModelFout key={houseType}>
              <Canvas camera={{ position: [4, 3, 5], fov: FOV, near: 0.05, far: 60 }} shadows="percentage" frameloop="demand" dpr={mobiel ? [1, 1.5] : [1, 1.75]} style={{ touchAction: "pan-y" }} fallback={<p className={styles.melding}>3D is niet beschikbaar. De uitleg kun je gewoon lezen.</p>}>
                <Suspense fallback={null}><Woning key={houseType} sectie={sectie} houseType={houseType} mobiel={mobiel} onStap={setStap} onGeladen={onGeladen} /></Suspense>
              </Canvas>
              {geladen !== houseType && <p role="status" className={styles.laden}>Je woning wordt geladen…</p>}
            </ModelFout>
            {legenda && <span className={styles.legenda} aria-hidden="true">{legenda}</span>}
          </div>
        </div>
        <div className={styles.tekstKolom}>
          {STAPPEN.map((item, i) => (
            <section key={item.eyebrow} className={styles.paneel} data-cutaway-stap={i}>
              <p className={styles.eyebrow}>{item.eyebrow}</p>
              {i === 0 ? <h1 className={styles.titel}>{item.titel}</h1> : <h2 className={styles.titel}>{item.titel}</h2>}
              {item.tekst.map(t => <p key={t} className={styles.tekst}>{t}</p>)}
              {item.legenda && <p className={styles.lagen}>In beeld: {item.legenda.toLowerCase()}.</p>}
              {item.link && <Link className={styles.link} href={item.link.href}>{item.link.label} <span aria-hidden="true">→</span></Link>}
              {(i === 0 || i === LAATSTE) && (
                <div className={styles.scanKaart}>
                  <h3 className={styles.scanTitel}>Start de woningscan</h3>
                  <p className={styles.scanIntro}>Vul je adres in en ontdek wat er mogelijk is voor jouw woning.</p>
                  <AddressScan />
                </div>
              )}
            </section>
          ))}
          <p className={styles.noot}>Illustratieve woningweergave. De doorsnede laat zien waar onderdelen ongeveer zitten; het is geen tekening van jouw woning.</p>
        </div>
      </section>
      <div>{children}</div>
    </>
  );
}
