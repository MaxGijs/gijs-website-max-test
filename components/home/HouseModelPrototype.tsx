"use client";
/* eslint-disable react-hooks/immutability -- Three.js scene clones are intentionally animated outside React rendering. */

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Box3, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import AddressScan from "@/components/AddressScan";
import { Accordion, type AccordionItem } from "@/components/ds/navigation/Accordion";
import styles from "./HouseModelPrototype.module.css";
import { prepareHouse, disposeHouse } from "@/lib/house-model";
import { HOUSE_MODELS, type HouseType } from "@/lib/woning-types";
import { useWoningDraft } from "@/components/woning/WoningDraftProvider";
import { HouseOrbitControls } from "@/components/woning/HouseOrbitControls";

const steps = [
  { label: "Je huis", title: "Verduurzaam je huis.", text: "Wat kun je doen om fijner te wonen en minder energie te gebruiken? Ontdek het, gewoon door te scrollen.", benefit: "", object: "" },
  { label: "Zonnepanelen", title: "Je dak maakt stroom.", text: "Zonnepanelen vangen zonlicht op en maken er elektriciteit van. Die kun je in huis gebruiken, bijvoorbeeld voor je wasmachine.", benefit: "Je wekt zelf een deel van je stroom op.", object: "Zonnepaneel_03" },
  { label: "Warmtepomp", title: "Warmte van buiten, voor binnen.", text: "Een warmtepomp haalt warmte uit de buitenlucht. Met elektriciteit maakt hij die warmte bruikbaar om je woning te verwarmen.", benefit: "Minder gas nodig om je woning te verwarmen.", object: "Warmtepomp_DeWarmte" },
  { label: "Dakisolatie", title: "Een warme muts voor je woning.", text: "Onder het dak komt een laag isolatie. Die helpt om de warmte binnen te houden, zodat je minder hoeft te stoken.", benefit: "Minder warmte die via het dak verdwijnt.", object: "Dakisolatie" },
  { label: "Spouwisolatie", title: "Een extra jas in je muur.", text: "Veel buitenmuren bestaan uit twee muren met ruimte ertussen. Die ruimte heet de spouw. Isolatie in die ruimte houdt de warmte beter binnen.", benefit: "Je woning koelt minder snel af.", object: "Spouwisolatie_voor" },
  { label: "Vloerisolatie", title: "Een deken onder je vloer.", text: "Een isolatielaag onder de vloer helpt de warmte in de kamer te houden. Daardoor voelt de vloer minder koud aan.", benefit: "Meer comfort voor je voeten.", object: "Vloerisolatie" },
  { label: "Glas en kozijnen", title: "Houd de kou buiten.", text: "Goed isolerend glas en passende kozijnen laten minder warmte ontsnappen. Zo voelt het prettiger als je bij het raam zit.", benefit: "Minder kou bij het raam.", object: "Raam_voor_02" },
];
// Categorieën voor de accordion in "Wat past bij jouw woning?".
// Vloerverwarming staat bewust niet in deze lijst: daar is nog geen
// inhoudelijk besluit over. Uitbreidbaar: een extra categorie of item
// toevoegen is alleen een extra entry in deze array.
const MAATREGEL_CATEGORIEEN: { id: string; label: string; items: { label: string; href?: string }[] }[] = [
  { id: "isolatie", label: "Isolatie", items: [
    { label: "Dakisolatie" },
    { label: "Spouwisolatie" },
    { label: "Vloerisolatie" },
    { label: "Glas en kozijnen" },
  ] },
  { id: "installaties", label: "Installaties", items: [
    { label: "Warmtepomp" },
    { label: "Zonnepanelen" },
    // Batterij heeft nog geen eigen hoofdstuk in de 3D-woningreis,
    // daarom naar de bestaande maatregelpagina in plaats van een anker.
    { label: "Batterij", href: "/maatregelen/thuisbatterij" },
  ] },
];

// Onderdelen die wel een hoofdstuk in de 3D-woningreis hebben, springen
// naar dat anker (zelfde ankers als de bestaande "woning-onderdeel-N" secties).
function stapHref(label: string): string | undefined {
  const index = steps.slice(1).findIndex(step => step.label === label);
  return index === -1 ? undefined : `#woning-onderdeel-${index + 1}`;
}

const MAATREGEL_ACCORDION_ITEMS: AccordionItem[] = MAATREGEL_CATEGORIEEN.map(categorie => ({
  id: categorie.id,
  question: categorie.label,
  answer: (
    <ul className={styles.categoryList}>
      {categorie.items.map(item => {
        const href = item.href ?? stapHref(item.label);
        return <li key={item.label}>{href ? <a href={href}>{item.label}</a> : item.label}</li>;
      })}
    </ul>
  ),
}));

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };

// Elke gevelkant (_voor/_achter/_links/_rechts) beweegt naar zijn eigen
// buitenkant toe — dit levert de richting (x, z) voor die kant.
function richting(name: string): [number, number] {
  const n = name.toLowerCase();
  if (n.includes("achter")) return [0, -1];
  if (n.includes("links")) return [-1, 0];
  if (n.includes("rechts")) return [1, 0];
  return [0, 1]; // voorgevel, en de default voor onbenoemde kanten
}

// The named Blender/GLB objects keep their original positions; each chapter adds an offset.
function movement(name: string): [number, number, number, number] {
  if (name.startsWith("Zonnepaneel")) return [0, 3.8, 0, 3];

  // Dak: alle drie lagen starten op hetzelfde moment en bewegen allemaal
  // omhoog, met Dakpannen (buitenste laag) altijd het verst en Dakconstructie
  // (binnenste laag) altijd het minst — zo blijft de volgorde buiten-naar-
  // binnen tijdens de hele animatie kloppen en "prikt" de isolatie nooit
  // even door de nog stilstaande pannen heen (dat gebeurde toen Dakpannen
  // later begon dan Dakisolatie).
  if (name === "Dakconstructie") return [0, 1.2, 0, 3];
  if (name.startsWith("Dakisolatie")) return [0, 2.4, 0, 3];
  if (/^(Dakpannen|Tengellatten|Panlatten|Dakkapel|Schoorsteen|Dakgoot)/.test(name)) return [0, 3.8, 0, 3];

  // Kozijnen/deuren/ramen bewegen van hun eigen gevelkant naar buiten.
  if (name.startsWith("Raam") || name.startsWith("Kozijn") || name === "Voordeur" || name === "Achterdeur") {
    const [dx, dz] = richting(name);
    return [dx * 2.4, 0, dz * 2.4, 4];
  }
  // Buitengevel/Spouwisolatie: per kant naar buiten, Binnenmuur blijft staan.
  if (name.startsWith("Buitengevel")) {
    const [dx, dz] = richting(name);
    return [dx * 2.4, 0, dz * 2.4, 4];
  }
  if (name.startsWith("Spouwisolatie")) {
    const [dx, dz] = richting(name);
    return [dx * 1.2, 0, dz * 1.2, 4];
  }

  // Vloeropbouw: afwerking het eerst omlaag, dan de constructieve vloer,
  // dan (het verst) de isolatie ertussenin zichtbaar.
  if (name === "Vloer") return [0, -0.8, 0, 5];
  if (name === "Vloerconstructie") return [0, -1.6, 0, 5];
  if (name === "Vloerisolatie") return [0, -2.4, 0, 5];

  if (name.startsWith("Warmtepomp")) return [0.6, 0, name.includes("binnenunit") ? -0.6 : 0, 2];
  return [0, 0, 0, 0];
}

type ModelProps = {
  section: RefObject<HTMLElement | null>;
  line: RefObject<SVGPathElement | null>;
  lineHalo: RefObject<SVGPathElement | null>;
  dot: RefObject<SVGCircleElement | null>;
  onStep: (step: number) => void;
  modelUrl: string;
  houseType: HouseType;
  onLoaded: () => void;
  revealed: RefObject<number>;
  /** Bewoner hovert de zwevende label-chip (subtiele highlight, zie item 2 van de opdracht). */
  hover: RefObject<boolean>;
  invalidateRef: RefObject<() => void>;
};

function House({ section, line, lineHalo, dot, onStep, modelUrl, houseType, onLoaded, revealed, hover, invalidateRef }: ModelProps) {
  const gltf = useLoader(GLTFLoader, modelUrl);
  const progress = useRef(0);
  const target = useRef(0);
  const initialized = useRef(false);
  const active = useRef(-1);
  const reduced = useRef(false);
  const { invalidate, camera, size } = useThree();
  const scratchRef = useRef({ box: new Box3(), point: new Vector3() });
  const glow = useRef(0);
  const glowChapter = useRef(-1);
  const glowMaterials = useRef<MeshStandardMaterial[]>([]);
  useEffect(() => { invalidateRef.current = invalidate; }, [invalidate, invalidateRef]);
  const { scene, scale, position, parts, zonMaterialen, pompMaterialen } = useMemo(() => {
    const { scene, scale, position } = prepareHouse(gltf.scene, houseType);
    const parts = scene.children.map(object => ({ object, origin: object.position.clone(), offset: object.userData.garagePanel || object.userData.sharedWall ? [0, 0, 0, 0] as [number, number, number, number] : movement(object.name) }));
    // Materialen van de maatregelen apart houden: die worden pas zichtbaar
    // bij hun eigen hoofdstuk, zodat de woning eerst als gewone woning leest.
    const zonMaterialen = new Set<{ transparent: boolean; opacity: number }>();
    const pompMaterialen = new Set<{ transparent: boolean; opacity: number }>();
    for (const { object } of parts) {
      const doel = object.name.startsWith("Zonnepaneel") ? zonMaterialen : object.name.startsWith("Warmtepomp") ? pompMaterialen : null;
      if (!doel) continue;
      object.visible = false;
      object.traverse(kind => {
        const materiaal = (kind as unknown as { material?: { transparent: boolean; opacity: number } }).material;
        if (materiaal) { materiaal.transparent = true; doel.add(materiaal); }
      });
    }
    return { scene, scale, position, parts, zonMaterialen, pompMaterialen };
  }, [gltf, houseType]);
  useEffect(() => { onLoaded(); return () => disposeHouse(scene); }, [scene, onLoaded]);

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
    const scratch = scratchRef.current;
    progress.current += (target.current - progress.current) * (reduced.current ? 1 : 1 - Math.exp(-12 * delta));
    const travel = progress.current;
    const p = travel < 7 ? travel : 6.95 * (1 - ease((travel - 7) / 0.7));
    const chapter = travel >= 7 ? 0 : Math.min(6, Math.floor(travel + 0.001));
    if (chapter !== active.current) { active.current = chapter; onStep(chapter); }
    for (const { object, origin, offset: [x, y, z, start] } of parts) {
      const amount = ease((p - start) / 0.65);
      const magKozijnExtra = object.name.startsWith("Raam") || object.name.startsWith("Kozijn") || object.name === "Voordeur" || object.name === "Achterdeur";
      const windowExtra = magKozijnExtra ? 1.1 * ease((p - 6) / 0.65) : 0;
      const [extraX, extraZ] = richting(object.name);
      object.position.set(origin.x + x * amount + extraX * windowExtra, origin.y + y * amount, origin.z + z * amount + extraZ * windowExtra);
    }
    // Retain reached installations for this page session, including across model switches.
    revealed.current = Math.max(revealed.current, travel);
    const verschijning = (vanaf: number) => ease((revealed.current - vanaf) / 0.3);
    const zonZichtbaar = verschijning(1);
    const pompZichtbaar = verschijning(2);
    for (const materiaal of zonMaterialen) materiaal.opacity = zonZichtbaar;
    for (const materiaal of pompMaterialen) materiaal.opacity = pompZichtbaar;
    for (const { object } of parts) {
      if (object.name.startsWith("Zonnepaneel")) object.visible = zonZichtbaar > 0.01;
      else if (object.name.startsWith("Warmtepomp")) object.visible = pompZichtbaar > 0.01;
    }

    scene.updateMatrixWorld(true);
    const object = scene.getObjectByName(steps[chapter].object);
    if (line.current && dot.current) {
      line.current.setAttribute("opacity", object ? "1" : "0");
      lineHalo.current?.setAttribute("opacity", object ? "1" : "0");
      dot.current.setAttribute("opacity", object ? "1" : "0");
      if (object) {
        scratch.box.setFromObject(object).getCenter(scratch.point);
        // Aim at an exposed edge so the marker is not hidden behind an outer layer.
        if (chapter === 3 || chapter === 5) {
          scratch.point.z = scratch.box.max.z;
          scratch.point.y = scratch.box.min.y + (scratch.box.max.y - scratch.box.min.y) * 0.25;
        }
        if (chapter === 4) scratch.point.x = scratch.box.max.x;
        scratch.point.project(camera);
        const x = (scratch.point.x * 0.5 + 0.5) * size.width;
        const y = (-scratch.point.y * 0.5 + 0.5) * size.height;
        const startX = size.width - Math.min(110, size.width * 0.25);
        const d = `M ${startX} 48 L ${startX} 68 L ${x} ${y}`;
        line.current.setAttribute("d", d);
        lineHalo.current?.setAttribute("d", d);
        dot.current.setAttribute("cx", String(x));
        dot.current.setAttribute("cy", String(y));
      }
    }

    // Subtiele, niet-drukke highlight van het gekoppelde woningonderdeel
    // wanneer de bewoner de zwevende label-chip hovert (opdracht item 2,
    // "eventueel"). Materialen zijn per instantie gekloond (zie
    // lib/house-model.ts), dus veilig om hier direct aan te passen.
    if (chapter !== glowChapter.current) {
      glowChapter.current = chapter;
      const materials: MeshStandardMaterial[] = [];
      object?.traverse(part => {
        if (!(part as Mesh).isMesh) return;
        for (const mat of Array.isArray((part as Mesh).material) ? (part as Mesh).material as MeshStandardMaterial[] : [(part as Mesh).material as MeshStandardMaterial]) {
          if (mat?.isMeshStandardMaterial) { mat.emissive.set("#06A77D"); materials.push(mat); }
        }
      });
      glowMaterials.current = materials;
    }
    const targetGlow = hover.current && object ? 0.3 : 0;
    glow.current += (targetGlow - glow.current) * (reduced.current ? 1 : 1 - Math.exp(-10 * delta));
    for (const mat of glowMaterials.current) mat.emissiveIntensity = glow.current;
    if (Math.abs(targetGlow - glow.current) > 0.001) invalidate();

    if (Math.abs(target.current - progress.current) > 0.0001) invalidate();
  });
  return <group scale={scale} position={position}><primitive object={scene} /></group>;
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
  const line = useRef<SVGPathElement>(null);
  const lineHalo = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const hover = useRef(false);
  const invalidateRef = useRef<() => void>(() => {});
  const dialog = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const { draft, setDraft } = useWoningDraft();
  const [pickingType, setPickingType] = useState(false);
  const houseType = draft.houseType;
  const modelUrl = HOUSE_MODELS[houseType].url;
  const [loadedModel, setLoadedModel] = useState("");
  const onLoaded = useMemo(() => () => setLoadedModel(modelUrl), [modelUrl]);
  const [barVisible, setBarVisible] = useState(false);
  const previousOverflow = useRef("");
  const scanOpen = useRef(false);

  // Orbit/drag-besturing van de 3D-woning: dezelfde gedeelde besturing als
  // de scan (components/woning/HouseOrbitControls.tsx, gebaseerd op
  // OrbitControls) — bewust hergebruikt in plaats van de eigen, beperktere
  // yaw-only sleepafhandeling die hier voorheen stond, zodat er geen twee
  // losse interaction-systems voor dezelfde 3D-woning ontstaan.
  const [touch, setTouch] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const [command, setCommand] = useState({ id: 0, action: "" });
  const act = (action: string) => setCommand(previous => ({ id: previous.id + 1, action }));
  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const update = () => setTouch(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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
            className={styles.visual + " " + styles.draggable}
            aria-label={step === 0 ? "3D-voorbeeldwoning, sleep om rond te kijken en zoom in op details" : `3D-woning met een aanwijzing bij ${steps[step].label.toLowerCase()}, sleep om rond te kijken`}
          >
            <div className={styles.halo} />
            <ModelErrorBoundary key={modelUrl}>
              <Canvas camera={{ position: [4, 3, 5], fov: 40 }} frameloop="demand" dpr={[1, 2]} style={{ touchAction: touch && !touchActive ? "pan-y" : "none" }} fallback={<p aria-hidden="true" className={styles.fallback}>3D is niet beschikbaar. De uitleg en de scan kun je gewoon gebruiken.</p>}>
                <ambientLight intensity={1.1} />
                <directionalLight position={[5, 8, 5]} intensity={1.9} />
                <directionalLight position={[-5, 3, -3]} intensity={0.7} />
                <Suspense fallback={null}><House key={modelUrl} section={section} line={line} lineHalo={lineHalo} dot={dot} onStep={setStep} modelUrl={modelUrl} houseType={houseType} onLoaded={onLoaded} revealed={revealed} hover={hover} invalidateRef={invalidateRef} /></Suspense>
                <HouseOrbitControls enabled={!touch || touchActive} command={command} />
              </Canvas>
            {loadedModel !== modelUrl && <p role="status" className={styles.loading}>Je woning wordt geladen…</p>}
            </ModelErrorBoundary>
            <svg className={styles.pointer} aria-hidden="true">
              <path ref={lineHalo} fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" opacity="0" />
              <path ref={line} fill="none" stroke="var(--accent-700)" strokeWidth="2.5" strokeLinecap="round" opacity="0" />
              <circle ref={dot} r="7" fill="var(--accent-700)" stroke="white" strokeWidth="3" opacity="0" />
            </svg>
            {step > 0 && (
              <span
                className={styles.label}
                onMouseEnter={() => { hover.current = true; invalidateRef.current(); }}
                onMouseLeave={() => { hover.current = false; invalidateRef.current(); }}
              >
                {steps[step].label}
              </span>
            )}
            {touch && !touchActive && (
              <button type="button" className={styles.touchToggle} onClick={() => setTouchActive(true)}>
                Tik om te draaien
              </button>
            )}
          </div>
          <div className={styles.hints}>
            <span className={styles.rotateHint}><span aria-hidden="true">↻</span> {touch ? "Veeg om rond te kijken. Knijp om in of uit te zoomen." : "Sleep om rond te kijken en zoom in op de details."}</span>
            <button type="button" className={styles.resetView} onClick={() => act("reset")}>Terug naar beginpositie</button>
          </div>
          <p className={styles.modelNote}>Voorbeeldwoning. Jouw woning kan anders zijn.</p>
          <a href="#woning-opties" className={styles.jump}>Bekijk de mogelijkheden ↓</a>
        </aside>
        <div className={styles.narrative}>
          <section className={styles.panel} data-house-progress="0">
            <p className={styles.eyebrow}>Groen in je straat</p>
            <h1 className={styles.title}>Verduurzaam je woning.</h1>
            <p className={styles.description}>Fijner wonen. Minder energie gebruiken. Ontdek stap voor stap wat er mogelijk is voor jouw woning.</p>
            <div className={styles.houseTypeRow}>
              {pickingType ? (
                <fieldset className={styles.houseTypeChips}>
                  <legend className={styles.houseTypeLegend}>Welk woningtype lijkt op de jouwe?</legend>
                  <div className={styles.chipsRow}>
                    {(Object.keys(HOUSE_MODELS) as HouseType[]).map(type => (
                      <button
                        key={type}
                        type="button"
                        className={styles.typeChip}
                        data-active={houseType === type}
                        onClick={() => { setDraft(current => ({ ...current, houseType: type })); setPickingType(false); }}
                      >
                        {HOUSE_MODELS[type].label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <p className={styles.houseTypeSummary}>
                  Woningtype: <strong>{HOUSE_MODELS[houseType].label}</strong>
                  <button type="button" className={styles.textButtonInline} onClick={() => setPickingType(true)}>Wijzig woningtype</button>
                </p>
              )}
            </div>
            <div className={styles.scanCard}>
              <h2 className={styles.scanCardTitle}>Start de digitale woningscan</h2>
              <p className={styles.scanCardIntro}>Vul je adres in en ontdek in een paar minuten wat er mogelijk is voor jouw woning.</p>
              <AddressScan />
            </div>
            <p className={styles.checkNote}>Een digitale woningscan als voorbereiding op advies van Gijs. Je kunt je woningtype later nog aanpassen bij &quot;Bouw jouw woning&quot;.</p>
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
          {steps.slice(1).map((item, index) => <section key={item.label} id={`woning-onderdeel-${index + 1}`} className={styles.panel} data-house-progress={index + 1}>
            <p className={styles.eyebrow}>{index + 1} / 6 · {item.label}</p>
            <h2 className={styles.title}>{item.title}</h2>
            <p className={styles.description}>{item.text}</p>
            <p className={styles.benefit}>{item.benefit}</p>
            <button className={styles.inlineScan} onClick={openScan}>Past dit bij mijn woning? Start de woningscan →</button>
          </section>)}
          <section id="woning-opties" className={styles.options} data-house-progress="7">
            <p className={styles.eyebrow}>Van ontdekken naar jouw mogelijkheden</p>
            <h2 className={styles.title}>Wat past bij jouw woning?</h2>
            <p className={styles.description}>Je hoeft niet alles tegelijk te doen. Klap een categorie open en bekijk wat erbij hoort.</p>
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
              <p className={styles.startNote}>Voorbeeldwoning. Jouw woning kan anders zijn.</p>
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
