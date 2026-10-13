"use client";

import { InstallatieAnimatie } from "./animatie/InstallatieAnimatie";
import * as scene from "./spouwmuur-animatie/scene";

// Geanimeerde versie van de Gijs-infographic "Spouwmuurisolatie plaatsen in één dag". Scène: ./spouwmuur-animatie/scene.ts.

const STAPPEN = [
  { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
  { titel: "Uitleg", tekst: "We lichten toe wat er precies gaat gebeuren." },
  { titel: "Gaten boren", tekst: "We boren gaten in de voegen van de buitenmuur." },
  { titel: "Isoleren", tekst: "We spuiten de isolatie in de spouw en voegen de gaten netjes af." },
  { titel: "Opleveren", tekst: "We lopen alles met je na en leveren het werk netjes op." },
  { titel: "Genieten", tekst: "Geniet van je muurisolatie en een lage energierekening." },
];

export function SpouwmuurInstallatieAnimatie() {
  return <InstallatieAnimatie scene={scene} stappen={STAPPEN} label="Animatie: zo isoleert Gijs een spouwmuur in één dag, in zes stappen." />;
}
