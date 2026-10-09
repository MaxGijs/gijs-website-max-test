"use client";

import { InstallatieAnimatie } from "./animatie/InstallatieAnimatie";
import * as scene from "./warmtepomp-animatie/scene";

// Geanimeerde versie van de Gijs-infographic "Hybride warmtepomp plaatsen in
// één dag". Scène en regie: ./warmtepomp-animatie/scene.ts (gedeeld met de video).

const STAPPEN = [
  { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
  { titel: "Uitleg", tekst: "We lichten toe wat er precies gaat gebeuren." },
  { titel: "Voorbereiding", tekst: "We bereiden het leidingwerk voor." },
  { titel: "Buitenunit", tekst: "We plaatsen de buitenunit, sluiten die aan op je huidige of nieuwe cv-installatie en regelen alles in." },
  { titel: "Opleveren", tekst: "Het systeem is ingeregeld en wordt opgeleverd. We lopen alles met je na en leggen het uit." },
  { titel: "Genieten", tekst: "Geniet van je warmtepomp en een lage energierekening." },
];

export function WarmtepompInstallatieAnimatie() {
  return <InstallatieAnimatie scene={scene} stappen={STAPPEN} label="Animatie: zo plaatst Gijs een hybride warmtepomp in één dag, in zes stappen." />;
}
