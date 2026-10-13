"use client";

import { InstallatieAnimatie } from "./animatie/InstallatieAnimatie";
import * as scene from "./ketel-animatie/scene";

// Geanimeerde uitvoering van het vervangen van een cv-ketel (stappen uit de aangeleverde procesvisuals). Scène: ./ketel-animatie/scene.ts.

const STAPPEN = [
  { titel: "Aankomst", tekst: "De installateur komt op het afgesproken moment." },
  { titel: "Uitleg", tekst: "Kort bespreken wat er vandaag gaat gebeuren." },
  { titel: "Voorbereiding", tekst: "De oude cv-ketel wordt verwijderd." },
  { titel: "Nieuwe ketel plaatsen", tekst: "De nieuwe cv-ketel wordt geplaatst." },
  { titel: "Controle", tekst: "De nieuwe cv-ketel wordt gecontroleerd." },
  { titel: "Opleveren", tekst: "Het werk wordt netjes afgerond." },
];

export function KetelInstallatieAnimatie() {
  return <InstallatieAnimatie scene={scene} stappen={STAPPEN} label="Animatie: zo vervangt Gijs een cv-ketel, in zes stappen." />;
}
