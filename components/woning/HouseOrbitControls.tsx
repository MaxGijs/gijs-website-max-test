"use client";
/* eslint-disable react-hooks/immutability -- Three.js owns the camera/controls instances mutated here. */

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Gedeelde orbit/drag-besturing voor de 3D-woning — gebruikt zowel in de
 * scan (components/woning/HouseViewer.tsx) als op de landingspagina
 * (components/home/HouseModelPrototype.tsx). Bewust één component: de
 * opdracht was expliciet om niet twee losse interaction-systems te
 * bouwen (de landingspagina had voorheen een eigen, beperktere
 * yaw-only sleepafhandeling zonder zoom/kanteling).
 *
 * `command`/`onView` zijn optioneel zodat een eenvoudiger gebruik (zoals
 * op de homepage, zonder camera-preset-knoppen of zichtbaar labeltje)
 * dezelfde besturing kan hergebruiken zonder die extra UI te hoeven bouwen.
 */
const NOOP_ON_VIEW: (label: string) => void = () => {};

export function HouseOrbitControls({
  enabled,
  command,
  onView = NOOP_ON_VIEW,
}: {
  enabled: boolean;
  command?: { id: number; action: string };
  onView?: (label: string) => void;
}) {
  const { camera, gl, invalidate } = useThree();
  const orbit = useRef<OrbitControls | null>(null);
  // onView mag gerust een nieuwe closure per render zijn (zoals
  // setView in HouseViewer.tsx) zonder de OrbitControls-instantie zelf
  // te laten hermaken — anders verliest bv. "reset" zijn opgeslagen
  // beginstand zodra de ouder om een andere reden opnieuw rendert.
  const onViewRef = useRef(onView);
  useEffect(() => { onViewRef.current = onView; }, [onView]);
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.target.set(0, 0, 0);
    controls.enablePan = false;
    controls.minPolarAngle = .12;
    controls.maxPolarAngle = Math.PI*.94;
    controls.minDistance = 3;
    controls.maxDistance = 9;
    controls.addEventListener("change", () => {
      onViewRef.current(camera.position.y < -1 ? "Onderzijde · vloer en fundering" : camera.position.z > Math.abs(camera.position.x)*.55 ? "Voorzijde · voordeur met luifel en brievenbus" : camera.position.z < -Math.abs(camera.position.x)*.55 ? "Achterzijde · achterdeur met groot glasvlak" : "Zijgevel");
      invalidate();
    });
    controls.update();
    controls.saveState();
    orbit.current = controls;
    return () => { controls.dispose(); orbit.current = null; };
  }, [camera, gl, invalidate]);
  useEffect(() => { if (orbit.current) orbit.current.enabled = enabled; }, [enabled]);
  useEffect(() => {
    const controls = orbit.current;
    if (!controls || !command) return;
    const action = command.action;
    if (action === "reset") controls.reset();
    if (action === "front") camera.position.set(0,1.8,7);
    if (action === "back") camera.position.set(0,1.8,-7);
    if (action === "side") camera.position.set(7,1.8,0.6);
    if (action === "below") camera.position.set(4,-4,5);
    if (action === "left" || action === "right") {
      const angle = action === "left" ? -Math.PI / 8 : Math.PI / 8;
      const x = camera.position.x, z = camera.position.z;
      camera.position.x = x * Math.cos(angle) + z * Math.sin(angle);
      camera.position.z = z * Math.cos(angle) - x * Math.sin(angle);
    }
    if (action === "in" || action === "out") camera.position.multiplyScalar(action === "in" ? 0.85 : 1.18).clampLength(3, 9);
    controls.update();
    invalidate();
    // command.id (niet het hele object) als dependency: zo triggert dit
    // effect precies één keer per klik, ongeacht of de ouder `command`
    // als nieuw object-literal doorgeeft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command?.id, camera, invalidate]);
  return null;
}
