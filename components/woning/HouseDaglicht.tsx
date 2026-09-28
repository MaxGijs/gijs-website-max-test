"use client";
/* eslint-disable react-hooks/immutability -- de Three.js-scene wordt hier imperatief van omgevingslicht voorzien. */

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * Gedeeld daglicht voor de Gijs 3D-woning (landingspagina én woningscan):
 * één zon met zachte schaduw, hemellicht en een rustige omgevingsreflectie
 * (procedureel, geen HDR-download). `kant` bepaalt vanaf welke zijde de zon
 * schijnt; `bereik` is de halve breedte van het schaduwvlak rond de woning.
 */
export function HouseDaglicht({ kant = "rechts", mobiel = false, bereik = 3.2 }: { kant?: "links" | "rechts" | "voor"; mobiel?: boolean; bereik?: number }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const kamer = new RoomEnvironment();
    const omgeving = pmrem.fromScene(kamer, 0.04).texture;
    scene.environment = omgeving;
    scene.environmentIntensity = 0.45;
    kamer.dispose();
    pmrem.dispose();
    return () => { scene.environment = null; omgeving.dispose(); };
  }, [gl, scene]);
  const s = kant === "links" ? -1 : 1;
  const kaartMaat = mobiel ? 1024 : 2048;
  return (
    <>
      <hemisphereLight args={["#dde8f0", "#8a8468", 0.85]} />
      <directionalLight position={[3.6 * s, 6.2, 4.4]} intensity={2.3} color="#fff2df" castShadow shadow-mapSize={[kaartMaat, kaartMaat]} shadow-bias={-0.0004} shadow-normalBias={0.03} shadow-radius={3}>
        <orthographicCamera attach="shadow-camera" args={[-bereik, bereik, bereik, -bereik, 0.5, 20]} />
      </directionalLight>
      <directionalLight position={[-4 * s, 2.5, -3]} intensity={0.35} color="#e8eef4" />
    </>
  );
}
