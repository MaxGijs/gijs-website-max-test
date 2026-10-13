"use client";

import { InstallatieAnimatie } from "./animatie/InstallatieAnimatie";
import * as scene from "./dakisolatie-animatie/scene";

// Geanimeerde versie van de Gijs-infographic "Dakisolatie plaatsen in één dag":
// klimaatfolie over de gordingen en daartussen isolatie inblazen.
// Scène: ./dakisolatie-animatie/scene.ts.

const STAPPEN = [
  { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
  { titel: "Uitleg", tekst: "We lichten toe wat er precies gaat gebeuren." },
  { titel: "Folie en isolatie", tekst: "We spannen klimaatfolie over de gordingen en blazen de isolatie ertussen." },
  { titel: "Afdichten", tekst: "We dichten de boorgaten af en controleren of alles goed gevuld is." },
  { titel: "Opleveren", tekst: "We lopen alles met je na en leveren het werk netjes op." },
  { titel: "Genieten", tekst: "Geniet van je dakisolatie en een lage energierekening." },
];

export function DakisolatieInstallatieAnimatie() {
  return <InstallatieAnimatie scene={scene} stappen={STAPPEN} label="Animatie: zo isoleert Gijs een dak in één dag, in zes stappen." />;
}
