"use client";
/* eslint-disable react-hooks/immutability -- Three.js owns these cloned scenes and the imperative camera controls. */

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Color, Mesh, MeshStandardMaterial, Plane, Vector3 } from "three";
import { prepareHouse, disposeHouse } from "@/lib/house-model";
import { HOUSE_MODELS } from "@/lib/woning-types";
import { useWoningDraft } from "./WoningDraftProvider";
import { HouseOrbitControls } from "./HouseOrbitControls";
import { makeInsulationCrew } from "@/lib/insulation-crew";
import { maakRealistisch } from "@/lib/house-realism";
import { inLaag } from "@/lib/house-states";
import { HouseDaglicht } from "./HouseDaglicht";
import styles from "./HouseViewer.module.css";

type Props = {
  selectedMeasureIds: string[];
  className?: string;
  replayCrew?: number;
  /** Standaard true (bestaande modellen hebben de dakkapel altijd al gebakken in de GLB). */
  dakkapelAanwezig?: boolean;
  /** Standaard true; heeft alleen zichtbaar effect bij een vrijstaand-achtig woningtype (de garage-groep). */
  aanbouwAanwezig?: boolean;
};

function Model({ selectedMeasureIds, onLoaded, replayCrew = 0, dakkapelAanwezig = true, aanbouwAanwezig = true }: Props & { onLoaded: () => void }) {
  const { draft } = useWoningDraft();
  const gltf = useLoader(GLTFLoader, HOUSE_MODELS[draft.houseType].url);
  // Zelfde woning als op de landingspagina: zelfde model, zelfde realistische
  // materialen (lib/house-realism.ts) en hetzelfde daglicht (HouseDaglicht).
  const model = useMemo(() => {
    const huis = prepareHouse(gltf.scene, draft.houseType, true);
    return { ...huis, texturen: maakRealistisch(huis.scene) };
  }, [gltf, draft.houseType]);
  const crew = useMemo(() => makeInsulationCrew(draft.houseType),[draft.houseType]);
  const crewTime = useRef(3.4);
  const hadCavity = useRef(selectedMeasureIds.includes("gevelisolatie"));
  const previousReplay = useRef(replayCrew);
  const fillPlane=useMemo(()=>new Plane(new Vector3(0,-1,0),0),[]);
  const parts = useMemo(() => model.scene.children.map(root => ({
    root, origin: root.position.clone(), scale: root.scale.clone(),
    materials: (() => { const result: { mat: MeshStandardMaterial; color: Color; name: string; opacity: number; transparent: boolean }[] = []; root.traverse(part => {
      if (!(part as Mesh).isMesh) return;
      const mesh = part as Mesh;
      for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) if ((mat as MeshStandardMaterial).isMeshStandardMaterial) result.push({ mat: mat as MeshStandardMaterial, color: (mat as MeshStandardMaterial).color.clone(), name: part.name, opacity: mat.opacity, transparent: mat.transparent });
    }); return result; })()
  })), [model]);
  const amounts = useRef<Record<string, number>>({});
  const initialized = useRef(false);
  const reduced = useRef(false);
  const { invalidate } = useThree();
  useEffect(() => { onLoaded(); return () => { disposeHouse(model.scene); model.texturen.forEach(t => t.dispose()); }; }, [model, onLoaded]);
  useEffect(() => () => disposeHouse(crew.crew),[crew]);
  useEffect(() => {
    const selected=selectedMeasureIds.includes("gevelisolatie");
    if((selected&&!hadCavity.current)||replayCrew!==previousReplay.current) crewTime.current=0;
    if(!selected)crewTime.current=3.4;
    hadCavity.current=selected;previousReplay.current=replayCrew;
    invalidate();
  },[selectedMeasureIds,replayCrew,invalidate]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reduced.current = media.matches; invalidate(); };
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [invalidate]);
  useEffect(() => { invalidate(); }, [selectedMeasureIds, dakkapelAanwezig, aanbouwAanwezig, invalidate]);
  useFrame((_, delta) => {
    let moving = false;
    const selectedCavity=selectedMeasureIds.includes("gevelisolatie");
    crewTime.current=reduced.current?3.4:Math.min(3.4,crewTime.current+Math.min(delta,.05));
    const t=crewTime.current;
    const filling=selectedCavity&&t<3;
    const fill=selectedCavity?Math.max(0,Math.min(1,(t-1)/2)):0;
    fillPlane.constant=model.position.y+model.scale*(-2.75+fill*8.5);
    for (const id of ["zonnepanelen", "warmtepomp", "dakisolatie", "gevelisolatie", "vloerisolatie", "glas-kozijnen", "vloerverwarming", "thuisbatterij"]) {
      const target = selectedMeasureIds.includes(id) && (id!=="gevelisolatie"||!filling) ? 1 : 0;
      const current = amounts.current[id] ?? 0;
      amounts.current[id] = !initialized.current || reduced.current ? target : current + (target-current)*(1-Math.exp(-12*delta));
      if (Math.abs(amounts.current[id]-target) < .001) amounts.current[id] = target; else moving = true;
    }
    initialized.current = true;
    const a = amounts.current;
    for (const { root, origin, scale, materials } of parts) {
      const name = root.name;
      root.position.copy(origin); root.scale.copy(scale); root.visible = true;
      if (name.startsWith("Dakkapel") && !dakkapelAanwezig) root.visible = false;
      if (root.userData.dormerPanel && !dakkapelAanwezig) root.visible = false;
      if (name === "Garage" && !aanbouwAanwezig) root.visible = false;
      const installation = inLaag(name, "solar-panels") ? "zonnepanelen" : inLaag(name, "heat-pump") ? "warmtepomp" : inLaag(name, "battery") ? "thuisbatterij" : null;
      if (installation) { root.visible = a[installation] > .001; root.scale.multiplyScalar(Math.max(.001, a[installation])); }
      if (/^(Dakisolatie)/.test(name)) { root.visible = a.dakisolatie > .001;root.position.y+=a.dakisolatie*1.2; }
      const cavity=/^(Spouwisolatie|Zijgevel_garage_isolatie)/.test(name);
      if(cavity)root.visible=selectedCavity&&(fill>0||a.gevelisolatie>.001);
      // Vloerisolatie: het huis tilt op van de fundering; de isolatie blijft
      // iets achter, zodat je haar als losse laag tussen huis en fundering ziet.
      if (name === "Vloerisolatie") { root.visible = a.vloerisolatie > .001; root.position.y += a.vloerisolatie*.5; }
      else if (!root.userData.garagePanel && installation !== "warmtepomp" && !/^(Fundering|Buurwoning|Garage|Zijgevel_garage)/.test(name)) root.position.y += a.vloerisolatie*1.1;
      if (name === "Vloerverwarming") { root.visible = a.vloerverwarming > .001; }
      if (name === "Vloer") root.position.y += a.vloerverwarming*.18;
      if (name === "Vloerconstructie") root.position.y -= a.vloerverwarming*.12;
      if (name.startsWith("Fundering")) root.position.y -= a.vloerverwarming*.12;
      if(name==="Dakconstructie")root.position.y+=a.dakisolatie*.45;
      if(/^(Dakpannen|Tengellatten|Panlatten|Dakkapel|Schoorsteen|Dakgoot)/.test(name)||(name.startsWith("Zonnepaneel")&&!root.userData.garagePanel))root.position.y+=a.dakisolatie*2.4;
      const outer = !root.userData.sharedWall && (name.startsWith("Buitengevel") || name === "Zijgevel_garage_buiten");
      const window = /^(Raam|Kozijn|Voordeur|Achterdeur)/.test(name);
      for(const child of root.children){
        if(child.name==="Kunststof_profiel")child.visible=a["glas-kozijnen"]>.5;
        if(child.name.startsWith("kozijn"))child.visible=a["glas-kozijnen"]<=.5;
      }
      if (outer || window) {
        if (name.includes("voor") || name === "Voordeur") root.position.z += a.gevelisolatie*.65;
        else if (name.includes("achter") || name === "Achterdeur") root.position.z -= a.gevelisolatie*.65;
        else if (name.includes("rechts")) root.position.x += a.gevelisolatie*.65;
        else if (name.includes("links")) root.position.x -= a.gevelisolatie*.65;
      }
      for (const { mat, color, name: partName, opacity: basisOpacity, transparent: basisTransparent } of materials) {
        const glass = /glas/i.test(partName);
        mat.color.copy(color);
        if (window&&glass) mat.color.lerp(new Color("#6eb5cd"), a["glas-kozijnen"]);
        if(cavity)mat.color.lerp(new Color("#4baa71"),a.gevelisolatie);
        mat.clippingPlanes=cavity&&filling?[fillPlane]:null;
        mat.transparent = outer || basisTransparent;
        mat.opacity = outer ? 1-(filling&&t>=1?.8:a.gevelisolatie*.65) : basisOpacity;
        mat.depthWrite = mat.opacity > .5;
      }
    }
    crew.crew.visible=selectedCavity&&t<3.4&&!reduced.current;
    crew.truck.position.x=crew.truckX+(t<1?(1-t)*-2.4:t>3?(t-3)/.4*2.4:0);
    crew.worker.visible=t>=.4&&t<3;
    crew.worker.position.z=crew.workerZ+Math.max(0,1-(t-.4)/.6)*1.1;
    crew.pipe.visible=t>=1&&t<3;crew.particles.visible=crew.pipe.visible;
    crew.truck.traverse(part=>{if((part as Mesh).isMesh){const mesh=part as Mesh;for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material]){material.transparent=t>3;material.opacity=t>3?Math.max(0,1-(t-3)/.4):1;}}});
    crew.particles.children.forEach((particle,i)=>{particle.position.z=.08+((t*3+i*.17)%1)*.2;});
    if(selectedCavity&&t<3.4&&!reduced.current)moving=true;
    if (moving) invalidate();
  });
  return <group scale={model.scale} position={model.position}><primitive object={model.scene} /><primitive object={crew.crew} /></group>;
}

class ViewerBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className={styles.unavailable}><p>De 3D-woning is nu niet beschikbaar.</p><p>Je kunt de scan en de maatregelen hieronder gewoon gebruiken.</p></div> : this.props.children; }
}

export function HouseViewer(props: Props) {
  const { draft } = useWoningDraft();
  const [loaded, setLoaded] = useState("");
  const [touch, setTouch] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const [command, setCommand] = useState({ id: 0, action: "" });
  const [view,setView] = useState("Voorzijde · voordeur met luifel en brievenbus");
  const [replayCrew,setReplayCrew] = useState(0);
  const [compareOriginal,setCompareOriginal]=useState(false);
  const onLoaded = useMemo(() => () => setLoaded(draft.houseType), [draft.houseType]);
  const act = (action: string) => setCommand(previous => ({ id: previous.id + 1, action }));
  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const update = () => setTouch(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return <div className={`${styles.viewer} ${props.className ?? ""}`}>
    <h2 className="sr-only">Illustratieve woningweergave</h2>
    <p className="sr-only" role="status">{view}</p>
    <ViewerBoundary>
      <div className={styles.scene} role="group" aria-label={`3D-weergave van je ${HOUSE_MODELS[draft.houseType].label.toLowerCase()}`}>
        <Canvas onCreated={({gl})=>{gl.localClippingEnabled=true;}} camera={{ position: [4.1, 2.8, 5.2], fov: 42 }} shadows="percentage" frameloop="demand" dpr={touch ? [1, 1.5] : [1, 1.75]} style={{ touchAction: touch && !touchActive ? "pan-y" : "none" }} fallback={<p aria-hidden="true">3D niet beschikbaar. Je kunt de scan gewoon gebruiken.</p>}>
          <HouseDaglicht mobiel={touch} bereik={4} />
          <Suspense fallback={null}><Model {...props} selectedMeasureIds={compareOriginal?props.selectedMeasureIds.filter(id=>id!=="glas-kozijnen"):props.selectedMeasureIds} replayCrew={replayCrew} onLoaded={onLoaded} /></Suspense>
          <HouseOrbitControls enabled={!touch || touchActive} command={command} onView={setView} />
        </Canvas>
        {loaded !== draft.houseType && <p className={styles.loading} role="status">Je woning wordt geladen…</p>}
        {props.selectedMeasureIds.includes("gevelisolatie") && <button type="button" className={styles.crewButton} onClick={() => { act("front"); setReplayCrew(i=>i+1); }}>Bekijk de monteur · 3 sec.</button>}
        {touch && <button className={styles.touchToggle} onClick={() => setTouchActive(!touchActive)} type="button" aria-pressed={touchActive}>{touchActive ? "Klaar met draaien" : "Draai de woning"}</button>}
      </div>
      <div className={styles.controls} aria-label="Woning bekijken">
        <button type="button" onClick={() => act("front")}>Voorkant</button>
        <button type="button" onClick={() => act("side")}>Zijkant</button>
        <button type="button" onClick={() => act("back")}>Achterkant</button>
        <button type="button" onClick={() => act("below")}>Onderkant</button>
        <button type="button" className={styles.icoon} aria-label="Inzoomen" onClick={() => act("in")}>+</button>
        <button type="button" className={styles.icoon} aria-label="Uitzoomen" onClick={() => act("out")}>−</button>
        <button type="button" className={styles.icoon} aria-label="Terug naar beginstand" onClick={() => act("reset")}>↺</button>
      </div>
    </ViewerBoundary>
    <p className={styles.caption}><strong>{HOUSE_MODELS[draft.houseType].label}</strong> · {touch ? "Tik op \"Draai de woning\" om te draaien." : "Sleep om te draaien."} Illustratieve weergave, niet exact jouw woning.{(draft.houseType==="tussenwoning"||draft.houseType==="twee-onder-een-kap")&&" De grijze muur is de gedeelde muur met de buren."}</p>
    {props.selectedMeasureIds.includes("glas-kozijnen")&&<details className={styles.profileDetail} onToggle={e=>{if(!e.currentTarget.open)setCompareOriginal(false);}}><summary>Bekijk vóór en na →</summary><p>Zo ziet je woning eruit met nieuwe ramen en kozijnen. Wissel hieronder: de kijkhoek blijft hetzelfde.</p><div className={styles.controls}><button aria-pressed={compareOriginal} onClick={()=>setCompareOriginal(true)}>Bestaand</button><button aria-pressed={!compareOriginal} onClick={()=>setCompareOriginal(false)}>Nieuw</button></div><div className={styles.profileComparison}><div><span className={styles.oldProfile}>Glas</span><strong>Bestaand</strong><p>Een eenvoudig bestaand profiel.</p></div><div><span className={styles.newProfile}>Glas</span><strong>Nieuw · kunststof kozijn</strong><p>Witte profielen met meer diepte en zichtbare glasrubbers.</p></div></div><p>Schematisch detail; kleur en uitvoering bespreek je met Gijs.</p></details>}
  </div>;
}
