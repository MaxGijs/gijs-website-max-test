export type WoningsituatieType = "ouder" | "vrijstaand" | "rijtjes" | "twee-onder-een-kap" | "goed-geisoleerd";

type WoningFoto = { src: string; alt: string; positie?: string };

const FOTOS: Record<WoningsituatieType, WoningFoto[]> = {
  ouder: [
    { src: "/images/regio/sfeer/sfeer-04.jpg", alt: "Landelijke vrijstaande woning met houten hek in het Overijsselse landschap" },
    { src: "/images/regio/woningsituaties/ouder-26950500.jpg", alt: "Oudere bakstenen woning in een Nederlandse straat" },
    { src: "/images/regio/sfeer/sfeer-05.jpg", alt: "Oude Nederlandse boerderij met rood pannendak in een groene omgeving" },
  ],
  vrijstaand: [
    { src: "/images/regio/woningsituaties/vrijstaand-33404647.jpg", alt: "Vrijstaande boerderij met rieten dak en bakstenen gevel aan een watergang in het weiland" },
    { src: "/images/regio/woningsituaties/vrijstaand-37345060.jpg", alt: "Vrijstaande woning met trapgevel in een Nederlandse tuin" },
    { src: "/images/regio/sfeer/sfeer-16.jpg", alt: "Vrijstaande woning in het landelijk gebied met weiland ervoor" },
  ],
  rijtjes: [
    { src: "/images/regio/sfeer/sfeer-10.jpg", alt: "Tussenwoning met rode bakstenen gevel en donkere dakpannen" },
    { src: "/images/regio/sfeer/sfeer-06.jpg", alt: "Nederlandse rijtjeswoningen met vlaggen in een woonwijk" },
    { src: "/images/regio/sfeer/sfeer-08.jpg", alt: "Moderne geometrische rijtjeswoningen in een nieuwbouwwijk" },
    { src: "/images/regio/woningsituaties/modern-14128509.jpg", alt: "Rij moderne bakstenen tussenwoningen met puntige gevels onder blauwe hemel" },
    { src: "/images/regio/woningsituaties/rijtjes-15524090.jpg", alt: "Kleurrijke Nederlandse tussenwoningen in oranje en rood baksteen op een woonstraat" },
  ],
  // Let op: alleen foto's van precies twee woningen onder één dak; rijen tussenwoningen horen bij "rijtjes".
  "twee-onder-een-kap": [
    { src: "/images/regio/sfeer/sfeer-06.jpg", alt: "Twee-onder-een-kapwoningen in een Nederlandse woonwijk" },
    { src: "/images/regio/sfeer/sfeer-10.jpg", alt: "Tussenwoning en twee-onder-een-kap met rode bakstenen gevel" },
  ],
  "goed-geisoleerd": [
    { src: "/images/regio/woningsituaties/modern-20433822.jpg", alt: "Moderne goed geïsoleerde woningen met zonnepanelen aan het water", positie: "50% 20%" },
  ],
};

export function selecteerWoningFoto(type: WoningsituatieType, gemeente: string): WoningFoto {
  let h = 0;
  for (const c of gemeente) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const pool = FOTOS[type];
  return pool[h % pool.length];
}
