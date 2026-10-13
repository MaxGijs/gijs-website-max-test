"use client";

import { InstallatieAnimatie } from "./animatie/InstallatieAnimatie";
import * as scene from "./kozijnen-animatie/scene";

// Geanimeerde versie van de Gijs-infographic "Kozijnen plaatsen binnen enkele dagen". Scène: ./kozijnen-animatie/scene.ts.

const STAPPEN = [
  { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
  { titel: "Uitleg", tekst: "We lichten toe wat er precies gaat gebeuren." },
  { titel: "Oude kozijnen eruit", tekst: "We halen je oude kozijnen weg." },
  { titel: "Nieuwe kozijnen", tekst: "We plaatsen je nieuwe kozijnen." },
  { titel: "Opleveren", tekst: "We lopen alles met je na en leveren het werk netjes op." },
  { titel: "Genieten", tekst: "Geniet van je kozijnen en een lage energierekening." },
];

export function KozijnenInstallatieAnimatie() {
  return <InstallatieAnimatie scene={scene} stappen={STAPPEN} label="Animatie: zo plaatst Gijs nieuwe kozijnen, in zes stappen." />;
}
