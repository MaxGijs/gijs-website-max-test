"use client";
/* eslint-disable react-hooks/immutability -- Three.js-scene, camera, Anime.js-timelines en annotatie-elementen worden buiten React om bijgewerkt. */

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Vector3, type Light } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createScope, onScroll, type Timeline } from "animejs";
import { prepareHouse, disposeHouse } from "@/lib/house-model";
import { maakRealistisch } from "@/lib/house-realism";
import { HOUSE_MODELS } from "@/lib/woning-types";
import { HouseDaglicht } from "@/components/woning/HouseDaglicht";
import { maakCutaway } from "../maquette";
import { FOV, ModelFout, bouwRoute, mengStanden, type Stand } from "../WoningScene";
import type { Annotatie } from "../stappen";
import { bouwOvergang, maakDoelen } from "./regie";
import { FOCUS, STATEN, type Regie } from "./staten";
import basis from "../../HouseModelPrototype.module.css";

/*
 * PROTOTYPE (branch animejs-poppenhuis-prototype): de homepage_woning met Anime.js v4.
 *
 * Eén lus: R3F (frameloop="demand") is de enige render- én animatielus voor de woning.
 * - De 3D-overgangen zijn Anime.js-timelines met autoplay: false. Ze komen nooit in de Anime.js-engine;
 *   useFrame zet ze met tl.seek(verstreken tijd) en vraagt alleen een volgend frame (invalidate)
 *   zolang er een overgang loopt. Daarna staat alles stil: geen idle-animatie, geen renders.
 * - Scroll: Anime.js ScrollObserver (onScroll) per hoofdstuk, alleen onEnter op hoofdstukgrenzen,
 *   niet per scrollpixel. De ScrollObserver gebruikt wel de eigen engine-tick van Anime.js (rAF) tijdens
 *   het scrollen (+500 ms); die doet alleen scrollboekhouding, geen Three.js-werk en geen renders.
 * - Buiten beeld (ScrollObserver op de hele sectie, isInView): overgangen springen direct naar hun
 *   eindstand zonder te renderen; bij terugkomst één frame.
 */

const KLEIN = 0.8; // bewegingen op mobiel iets kleiner

type Props = {
  sectie: RefObject<HTMLElement | null>;
  onStaat: (staat: number) => void;
  onGeladen: () => void;
  mobiel: boolean;
  annotaties: RefObject<Record<string, Annotatie>>;
  regie: RefObject<Regie | null>;
};

function Woning({ sectie, onStaat, onGeladen, mobiel, annotaties, regie }: Props) {
  const gltf = useLoader(GLTFLoader, HOUSE_MODELS.hoekwoning.url);
  const { invalidate, camera, size, scene: wereld } = useThree();

  const opgebouwd = useMemo(() => {
    // Exact dezelfde opbouw als de huidige homepage (WoningScene.tsx): geen nieuw model, geen nieuwe texturen.
    const { scene, scale, position, bounds } = prepareHouse(gltf.scene, "hoekwoning");
    const realistisch = maakRealistisch(scene);
    const cutaway = maakCutaway(scene);
    const route = bouwRoute(scene, scale, position, bounds);
    const doelen = maakDoelen(scene, route, cutaway.kopgevel, cutaway.kopMaterialen);
    const stand0 = doelen.standen[0];
    const toestand = {
      tl: null as Timeline | null,
      start: 0,
      doel: -1,
      van: stand0 as Stand,
      naar: stand0 as Stand,
      huidig: { pos: stand0.pos.clone(), look: stand0.look.clone() },
      zichtbaar: false,
      vuil: false,
      minder: false,
      direct: true,
      // Thuisbatterij <-> overzicht springt van een close-up in de trapkast naar een wijds
      // exterieurbeeld: een rechtstreekse boog (mengStanden) sneed daarbij door de gevel, omdat de
      // straal halverwege al krimpt terwijl de hoek nog draait. omkeer+tussenstand splitsen die ene
      // overgang in twee veilige helften, zie useFrame hieronder. Geen andere overgang gebruikt dit.
      omkeer: false,
      tussenstand: null as Stand | null,
      labelAan: {} as Record<string, boolean>,
      labelMaat: new Map<string, { w: number; h: number }>(),
    };
    return { scene, scale, position, doelen, toestand, texturen: [...realistisch, ...cutaway.texturen] };
  }, [gltf]);
  const { scene, scale, position, doelen: d, toestand: r } = opgebouwd;
  const tijdelijk = useRef({ pos: new Vector3(), punt: new Vector3() });

  useEffect(() => {
    onGeladen();
    return () => { r.tl?.cancel(); disposeHouse(scene); opgebouwd.texturen.forEach(t => t.dispose()); };
  }, [scene, opgebouwd, r, onGeladen]);

  // Naar een staat: één nieuwe timeline vanaf de huidige waarden. Scroll en dev-knoppen gebruiken dit allebei.
  const naarRef = useRef<(i: number) => void>(() => {});
  useEffect(() => {
    naarRef.current = (i: number) => {
      if (i === r.doel || !STATEN[i]) return;
      const vorigeId = STATEN[r.doel]?.id;
      r.doel = i;
      onStaat(i);
      if (!d.lichten.length) wereld.traverse(o => { const l = o as Light; if (l.isLight) d.lichten.push({ licht: l, basis: l.intensity }); });
      r.van = { pos: r.huidig.pos.clone(), look: r.huidig.look.clone() };
      r.naar = d.standen[i];
      r.omkeer = (vorigeId === "batterij" && STATEN[i].id === "overzicht") || (vorigeId === "overzicht" && STATEN[i].id === "batterij");
      if (r.omkeer) {
        // Fase 1 (t<0.5): rechte lijn terug, zelfde hoek rond de woning, zelfde kijkrichting —
        // puur verder weg, geen draai. Fase 2 (t>=0.5): normale boog (mengStanden) van dit
        // tussenpunt naar de eindstand, op een constante (dus veilige) straal.
        const ha = Math.atan2(r.van.pos.x - d.midden.x, r.van.pos.z - d.midden.z);
        const rb = Math.hypot(r.naar.pos.x - d.midden.x, r.naar.pos.z - d.midden.z);
        r.tussenstand = {
          pos: new Vector3(d.midden.x + Math.sin(ha) * rb, r.van.pos.y, d.midden.z + Math.cos(ha) * rb),
          look: r.van.look.clone(),
        };
      }
      r.tl?.cancel();
      r.tl = bouwOvergang(d, STATEN[i], mobiel ? KLEIN : 1);
      r.start = performance.now();
      // Eerste keer, minder beweging of buiten beeld: direct naar de eindstand, geen animatie.
      if (r.direct || r.minder || !r.zichtbaar) { r.tl.seek(r.tl.duration); r.tl = null; }
      r.direct = false;
      if (r.zichtbaar) invalidate(); else r.vuil = true;
    };
  }, [r, d, wereld, mobiel, onStaat, invalidate]);

  useEffect(() => {
    regie.current = { naar: i => naarRef.current(i) };
    return () => { regie.current = null; };
  }, [regie]);

  // Andere schermbreedte (mobiel/desktop): huidige staat direct opnieuw neerzetten met de andere bewegingsgrootte.
  useEffect(() => {
    if (r.doel < 0) return;
    const i = r.doel;
    r.doel = -1;
    r.direct = true;
    naarRef.current(i);
  }, [mobiel, r]);

  // Labelmaten opnieuw meten als het canvas van grootte verandert (niet elk frame: dat forceert layout).
  useEffect(() => { r.labelMaat.clear(); invalidate(); }, [size.width, size.height, r, invalidate]);

  // Anime.js ScrollObserver: zichtbaarheid van de sectie en hoofdstukgrenzen. createScope ruimt alles op
  // en bouwt de observers opnieuw op bij een andere media query (mobiel / minder beweging).
  useEffect(() => {
    const el = sectie.current;
    if (!el) return;
    const scope = createScope({ root: el, mediaQueries: { mobiel: "(max-width: 767px)", minder: "(prefers-reduced-motion: reduce)" } }).add(self => {
      r.minder = !!self?.matches.minder;
      // Zelfde focuslijn als de huidige homepage: halverwege (desktop) of op 64% (mobiel, woning staat bovenin).
      const lijn = self?.matches.mobiel ? "64%" : "50%";
      onScroll({
        target: el,
        onEnter: () => { r.zichtbaar = true; if (r.vuil) { r.vuil = false; invalidate(); } },
        onLeave: () => { r.zichtbaar = false; },
      });
      for (const paneel of el.querySelectorAll<HTMLElement>("[data-staat]")) {
        const i = Number(paneel.dataset.staat);
        onScroll({ target: paneel, enter: `${lijn} top`, leave: `${lijn} bottom`, onEnter: () => naarRef.current(i) });
      }
    });
    return () => scope.revert();
  }, [sectie, r, invalidate]);

  useFrame(() => {
    // 1. Anime.js-timeline vooruitzetten binnen het R3F-frame (geen eigen Anime.js-lus voor de 3D).
    if (r.tl) {
      const t = r.zichtbaar ? performance.now() - r.start : Infinity;
      r.tl.seek(Math.min(t, r.tl.duration));
      if (t >= r.tl.duration) r.tl = null;
    }

    // 2. Proxywaarden toepassen. Camera: boog rond de woning, zoals op de huidige homepage.
    const { pos, punt } = tijdelijk.current;
    if (r.omkeer && r.tussenstand) {
      if (d.camera.t < 0.5) {
        r.huidig.pos.lerpVectors(r.van.pos, r.tussenstand.pos, d.camera.t / 0.5);
        r.huidig.look.copy(r.van.look);
      } else {
        mengStanden(r.tussenstand, r.naar, (d.camera.t - 0.5) / 0.5, d.midden, r.huidig.pos, r.huidig.look);
      }
    } else {
      mengStanden(r.van, r.naar, d.camera.t, d.midden, r.huidig.pos, r.huidig.look);
    }
    pos.copy(r.huidig.pos);
    if (mobiel) pos.sub(r.huidig.look).multiplyScalar(1.12).add(r.huidig.look);
    camera.position.copy(pos);
    camera.lookAt(r.huidig.look);
    camera.updateMatrixWorld();
    // Helemaal vervaagd = niet meer tekenen (scheelt draw calls).
    d.kopgevel.visible = !d.kopMaterialen.length || d.kopMaterialen.some(m => m.opacity > 0.003);
    for (const inst of Object.values(d.installaties)) {
      const zicht = (inst.materialen[0]?.opacity ?? 0) > 0.01;
      for (const o of inst.objecten) o.visible = zicht;
    }

    // 3. Annotatie bij het bouwdeel in focus. Labelmaat wordt gecachet, dus geen layout-reads per frame.
    for (const sleutel of FOCUS) {
      const a = annotaties.current?.[sleutel];
      if (!a?.label || !a.lijn || !a.punt) continue;
      const anker = d.ankers[sleutel];
      const zicht = anker ? d.labels[sleutel].zicht : 0;
      if (zicht < 0.01 || !anker) {
        if (r.labelAan[sleutel]) { a.label.style.opacity = "0"; a.lijn.style.opacity = "0"; a.punt.style.opacity = "0"; r.labelAan[sleutel] = false; }
        continue;
      }
      r.labelAan[sleutel] = true;
      anker.object.updateWorldMatrix(true, false);
      anker.object.localToWorld(punt.copy(anker.lokaal)).project(camera);
      const x = (punt.x + 1) / 2 * size.width, y = (1 - punt.y) / 2 * size.height;
      let maat = r.labelMaat.get(sleutel);
      if (!maat) { maat = { w: a.label.offsetWidth, h: a.label.offsetHeight }; r.labelMaat.set(sleutel, maat); }
      const lx = Math.min(Math.max(16, x + (mobiel ? 36 : 90)), size.width - maat.w - 16);
      const ly = Math.min(Math.max(16, y - (mobiel ? 70 : 110)), size.height - maat.h - 16);
      const o = String(zicht);
      a.label.style.transform = `translate(${lx}px, ${ly}px)`;
      a.label.style.opacity = o;
      a.lijn.setAttribute("x1", String(x)); a.lijn.setAttribute("y1", String(y));
      a.lijn.setAttribute("x2", String(lx)); a.lijn.setAttribute("y2", String(ly + maat.h / 2));
      a.lijn.style.opacity = o;
      a.punt.setAttribute("cx", String(x)); a.punt.setAttribute("cy", String(y));
      a.punt.style.opacity = o;
    }

    // 4. Alleen een volgend frame zolang er een overgang loopt; daarna rust.
    if (r.tl) invalidate();
  });

  return (
    <>
      {/* Zelfde lichtopstelling als de huidige homepage. Dit licht vanaf de open kant geeft als enige
          schaduw binnen de homepage_woning (de zon komt van de dichte kant), dus het blijft schaduw werpen.
          1024² (was 2048² op desktop) met halve radius: zelfde breedte van de schaduwrand, 4x minder texels. */}
      <HouseDaglicht kant="rechts" mobiel={mobiel} bereik={5} />
      <directionalLight position={[6, 3.6, 2.4]} intensity={1.35} color="#fff3e2" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} shadow-normalBias={0.02} shadow-radius={mobiel ? 3 : 1.5}>
        <orthographicCamera attach="shadow-camera" args={[-3.2, 3.2, 3.2, -3.2, 0.5, 20]} />
      </directionalLight>
      <group scale={scale} position={position}><primitive object={scene} /></group>
    </>
  );
}

export default function AnimeWoningScene(props: Props) {
  return (
    <ModelFout>
      {/* shadows="percentage": three.js 0.185 zet "soft" (PCFSoftShadowMap, deprecated) toch om naar PCF,
          met een waarschuwing bij elke Canvas-configure; zo is het meteen PCF, zelfde beeld.
          dpr max 1.5 (was 1.75 op desktop): ~27% minder pixels per frame op retina-schermen. */}
      <Canvas camera={{ position: [4, 3, 5], fov: FOV, near: 0.05, far: 60 }} shadows="percentage" frameloop="demand" dpr={[1, 1.5]} style={{ touchAction: "pan-y" }} fallback={<p className={basis.fallback}>3D is niet beschikbaar. De uitleg kun je gewoon lezen.</p>}>
        <Suspense fallback={null}><Woning {...props} /></Suspense>
      </Canvas>
    </ModelFout>
  );
}
