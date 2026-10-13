"use client";

import { InstallatieAnimatieKeuze } from "./animatie/InstallatieAnimatieKeuze";
import * as platen from "./dakisolatie-animatie/scene";
import * as inblazen from "./dakisolatie-inblazen-animatie/scene";

// Geanimeerde versies van de Gijs-infographics "Dakisolatie plaatsen in één dag" (platen en inblazen). Scènes: ./dakisolatie-animatie en ./dakisolatie-inblazen-animatie.

export function DakisolatieInstallatieAnimatie() {
  return (
    <InstallatieAnimatieKeuze
      vraag="Kies de manier van isoleren"
      varianten={[
        {
          label: "Platen en folie",
          scene: platen,
          animatieLabel: "Animatie: zo isoleert Gijs een dak met platen en folie, in zes stappen.",
          stappen: [
            { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
            { titel: "Uitleg", tekst: "We lichten toe wat er precies gaat gebeuren." },
            { titel: "Isoleren", tekst: "We isoleren het dak vanaf de zolder." },
            { titel: "Afdichten", tekst: "We dichten alles naadloos af en brengen eventueel klimaatfolie aan." },
            { titel: "Opleveren", tekst: "We lopen alles met je na en leveren het werk netjes op." },
            { titel: "Genieten", tekst: "Geniet van je dakisolatie en een lage energierekening." },
          ],
        },
        {
          label: "Inblazen",
          scene: inblazen,
          animatieLabel: "Animatie: zo isoleert Gijs een dak met inblaasisolatie, in zes stappen.",
          stappen: [
            { titel: "Aankomst", tekst: "De installateurs komen tussen 08.00 en 09.00 uur aan." },
            { titel: "Uitleg", tekst: "We lichten toe wat er precies gaat gebeuren." },
            { titel: "Folie en isolatie", tekst: "We brengen eventueel folie aan en blazen de isolatie in het dak." },
            { titel: "Controleren", tekst: "We dichten de boorgaten af en controleren of alles goed gevuld is." },
            { titel: "Opleveren", tekst: "We lopen alles met je na en leveren het werk netjes op." },
            { titel: "Genieten", tekst: "Geniet van je dakisolatie en een lage energierekening." },
          ],
        },
      ]}
    />
  );
}
