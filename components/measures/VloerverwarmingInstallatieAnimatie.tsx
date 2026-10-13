"use client";

import { InstallatieAnimatie } from "./animatie/InstallatieAnimatie";
import * as scene from "./vloerverwarming-animatie/scene";

// Geanimeerde uitvoering van vloerverwarming (stappen uit de aangeleverde procesvisuals). Scène: ./vloerverwarming-animatie/scene.ts.

const STAPPEN = [
  { titel: "Aankomst", tekst: "De installateur komt op het afgesproken moment." },
  { titel: "Uitleg", tekst: "Kort bespreken wat er vandaag gaat gebeuren." },
  { titel: "Voorbereiden", tekst: "De vloer en werkplek worden voorbereid." },
  { titel: "Leidingen plaatsen", tekst: "De verwarmingsleidingen worden aangebracht." },
  { titel: "Controleren", tekst: "Controle voordat de vloer wordt afgewerkt." },
  { titel: "Storten & afwerken", tekst: "De vloer wordt aangebracht en afgewerkt." },
  { titel: "Drogen & opstarten", tekst: "De vloer droogt en wordt rustig opgestart." },
];

export function VloerverwarmingInstallatieAnimatie() {
  return <InstallatieAnimatie scene={scene} stappen={STAPPEN} label="Animatie: zo legt Gijs vloerverwarming aan, in zeven stappen." />;
}
