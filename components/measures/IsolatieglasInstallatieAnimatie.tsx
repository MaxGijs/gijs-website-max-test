"use client";

import { InstallatieAnimatie } from "./animatie/InstallatieAnimatie";
import * as scene from "./isolatieglas-animatie/scene";

// Geanimeerde versie van de Gijs-infographic "Isolatieglas plaatsen in één dag". Scène: ./isolatieglas-animatie/scene.ts.

const STAPPEN = [
  { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
  { titel: "Uitleg", tekst: "We lichten toe wat er precies gaat gebeuren." },
  { titel: "Oud glas eruit", tekst: "We halen je oude beglazing weg." },
  { titel: "Nieuw glas", tekst: "We plaatsen het isolatieglas." },
  { titel: "Opleveren", tekst: "We lopen alles met je na en leveren het werk netjes op." },
  { titel: "Genieten", tekst: "Geniet van je isolatieglas en een lage energierekening." },
];

export function IsolatieglasInstallatieAnimatie() {
  return <InstallatieAnimatie scene={scene} stappen={STAPPEN} label="Animatie: zo plaatst Gijs isolatieglas in één dag, in zes stappen." />;
}
