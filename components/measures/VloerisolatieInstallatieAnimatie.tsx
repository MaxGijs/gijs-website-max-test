"use client";

import { InstallatieAnimatieKeuze } from "./animatie/InstallatieAnimatieKeuze";
import * as platen from "./vloerisolatie-animatie/scene";
import * as schuim from "./vloerisolatie-pur-animatie/scene";

// Geanimeerde versies van de Gijs-infographics "Vloerisolatie plaatsen in één dag" (onder de vloer en spuitschuim). Scènes: ./vloerisolatie-animatie en ./vloerisolatie-pur-animatie.

export function VloerisolatieInstallatieAnimatie() {
  return (
    <InstallatieAnimatieKeuze
      vraag="Kies de manier van isoleren"
      varianten={[
        {
          label: "Onder de vloer",
          scene: platen,
          animatieLabel: "Animatie: zo isoleert Gijs een vloer vanuit de kruipruimte, in zes stappen.",
          stappen: [
            { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
            { titel: "Uitleg", tekst: "We lichten toe wat er precies gaat gebeuren." },
            { titel: "Voorbereiden", tekst: "We bereiden alles voor en kijken de kruipruimte na." },
            { titel: "Isoleren", tekst: "We brengen de isolatie aan tegen de onderkant van de vloer." },
            { titel: "Opleveren", tekst: "We vertellen wat er is gedaan en wijzen je op eventuele bijzonderheden." },
            { titel: "Genieten", tekst: "Geniet van warme voeten en een lage energierekening." },
          ],
        },
        {
          label: "Spuitschuim",
          scene: schuim,
          animatieLabel: "Animatie: zo isoleert Gijs een vloer met spuitschuim, in zes stappen.",
          stappen: [
            { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
            { titel: "Uitleg", tekst: "We lichten toe wat er precies gaat gebeuren." },
            { titel: "Even de deur uit", tekst: "Tijdens het spuiten ben je niet in huis; dat is verplicht. We zijn binnen enkele uren klaar." },
            { titel: "Isoleren", tekst: "We spuiten de isolatie tegen de onderkant van de vloer." },
            { titel: "Opleveren", tekst: "We vertellen wat er is gedaan en wijzen je op eventuele bijzonderheden." },
            { titel: "Genieten", tekst: "Geniet van warme voeten en een lage energierekening." },
          ],
        },
      ]}
    />
  );
}
