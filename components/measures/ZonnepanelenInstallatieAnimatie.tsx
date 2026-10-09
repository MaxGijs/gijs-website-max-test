"use client";

import { InstallatieAnimatie } from "./animatie/InstallatieAnimatie";
import * as scene from "./zonnepanelen-animatie/scene";

// Geanimeerde versie van de Gijs-infographic "Zonnepanelen plaatsen in één
// dag". Scène en regie: ./zonnepanelen-animatie/scene.ts (gedeeld met de video).

const STAPPEN = [
  { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
  { titel: "Valbeveiliging", tekst: "We zetten een valbeveiliging op en bereiden alles voor." },
  { titel: "Constructie", tekst: "We monteren de constructie voor de zonnepanelen op het dak." },
  { titel: "Panelen", tekst: "We leggen de zonnepanelen op de constructie." },
  { titel: "Opleveren", tekst: "We sluiten de zonnepanelen binnen aan en leveren het systeem op. We leggen alles uit." },
  { titel: "Genieten", tekst: "Geniet van je zonnepanelen en een lage energierekening." },
];

export function ZonnepanelenInstallatieAnimatie() {
  return <InstallatieAnimatie scene={scene} stappen={STAPPEN} label="Animatie: zo plaatst Gijs zonnepanelen in één dag, in zes stappen." />;
}
