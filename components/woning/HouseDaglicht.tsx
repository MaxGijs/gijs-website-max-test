"use client";
/* eslint-disable react-hooks/immutability -- de Three.js-scene wordt hier imperatief van omgevingslicht voorzien. */

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * Gedeeld daglicht voor de Gijs 3D-woning (landingspagina én woningscan):
 * één zon met zachte schaduw, hemellicht en een rustige omgevingsreflectie
 * (procedureel, geen HDR-download). `kant` is de zijde waar de camera staat:
 * de zon schijnt schuin van de andere kant op de voorgevel, zodat de
 * slagschaduw van de woning zichtbaar achter het huis valt. `bereik` is de
 * halve breedte van het schaduwvlak rond de woning.
 */
export function HouseDaglicht({ kant = "rechts", mobiel = false, bereik = 4.6 }: { kant?: "links" | "rechts" | "voor"; mobiel?: boolean; bereik?: number }) {
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
  // Shadow map overal 1024² (was 2048² op desktop): 4x minder texels om te tekenen en te bewaren.
  // shadow-radius telt in texels; op desktop gehalveerd zodat de zachte schaduwrand in de wereld
  // even breed blijft als met de oude 2048²-kaart. Mobiel had al 1024² en blijft gelijk.
  const kaartMaat = 1024;
  return (
    <>
      <hemisphereLight args={["#dde8f0", "#8a8468", 0.85]} />
      <directionalLight position={[-4.4 * s, 5.2, 3.6]} intensity={2.5} color="#fff1dc" castShadow shadow-mapSize={[kaartMaat, kaartMaat]} shadow-bias={-0.0004} shadow-normalBias={0.03} shadow-radius={mobiel ? 4 : 2}>
        <orthographicCamera attach="shadow-camera" args={[-bereik, bereik, bereik, -bereik, 0.5, 24]} />
      </directionalLight>
      <directionalLight position={[4 * s, 2.5, -3]} intensity={0.35} color="#e8eef4" />
    </>
  );
}
