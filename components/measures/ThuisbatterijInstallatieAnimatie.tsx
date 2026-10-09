"use client";

import { InstallatieAnimatie } from "./animatie/InstallatieAnimatie";
import * as scene from "./thuisbatterij-animatie/scene";

// Geanimeerde versie van de Gijs-infographic "Thuisbatterij plaatsen in één
// dag". Scène en regie: ./thuisbatterij-animatie/scene.ts (gedeeld met de video).

const STAPPEN = [
  { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
  { titel: "Voorbereiden", tekst: "We bereiden alles voor en beschermen de vloer." },
  { titel: "Onderdelen", tekst: "We monteren de onderdelen voor je thuisbatterij." },
  { titel: "Batterij", tekst: "We monteren je thuisbatterij en sluiten hem aan in de meterkast." },
  { titel: "Opleveren", tekst: "We sluiten alles aan en leveren het systeem op. We leggen alles uit." },
  { titel: "Genieten", tekst: "Geniet van je thuisbatterij en een lage energierekening." },
];

export function ThuisbatterijInstallatieAnimatie() {
  return <InstallatieAnimatie scene={scene} stappen={STAPPEN} label="Animatie: zo plaatst Gijs een thuisbatterij in één dag, in zes stappen." />;
}
