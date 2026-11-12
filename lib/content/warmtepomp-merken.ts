// De warmtepompmerken die Gijs plaatst, voor de merkenstrook op /maatregelen/warmtepomp.
// Vastgesteld door Max (12-11-2026): deze zeven, in deze volgorde, met de originele kleuren
// en verhoudingen. Bewust alleen naam + logo: geen merkvergelijking, geen productcatalogus,
// geen ranking en geen aparte merkpagina's.
//
// De logobestanden komen uit de door Max aangeleverde Archief.zip en staan in
// public/images/merken/warmtepomp/. Het Remeha-bestand is alleen bijgesneden (de transparante
// rand besloeg 76% van het beeld); aan de logo's zelf is verder niets veranderd.
//
// LET OP bij vervangen: twee bestanden zijn aan de krappe kant en mogen vervangen worden zodra
// Thom een officieel bestand uit de mediabank van het merk heeft:
// - remeha.png is na het bijsnijden 269x63 px. Dat is scherp genoeg voor de hoogte hieronder,
//   maar niet voor een grotere weergave.
// - nefit-bosch.png is een gestapelde twee-merken-lockup (NEFIT boven, BOSCH onder) en daardoor
//   bijna vierkant. Vandaar een grotere hoogte dan de brede woordmerken: op gelijke hoogte zou
//   dit logo optisch veel kleiner ogen. Een horizontale variant zou netter zijn.
//
// `hoogte` is een Tailwind-hoogteklasse en wordt per merk op het oog gekozen, zodat alle zeven
// even zwaar ogen. Logo's hebben sterk verschillende verhoudingen (van 1,3:1 tot 6,6:1), dus
// dezelfde hoogte voor iedereen geeft juist een onrustig beeld.

export type WarmtepompMerk = {
  naam: string;
  bestand: string;
  breedte: number;
  hoogte: number;
  /** Tailwind-hoogte in de strook (mobiel kleiner via de component). */
  klasse: string;
};

export const WARMTEPOMP_MERKEN: WarmtepompMerk[] = [
  { naam: "Weheat", bestand: "/images/merken/warmtepomp/weheat.png", breedte: 2000, hoogte: 303, klasse: "h-6 sm:h-8" },
  { naam: "Remeha", bestand: "/images/merken/warmtepomp/remeha.png", breedte: 269, hoogte: 63, klasse: "h-8 sm:h-10" },
  { naam: "DeWarmte", bestand: "/images/merken/warmtepomp/dewarmte.png", breedte: 3209, hoogte: 1182, klasse: "h-9 sm:h-11" },
  { naam: "Daikin", bestand: "/images/merken/warmtepomp/daikin.webp", breedte: 960, hoogte: 207, klasse: "h-7 sm:h-8" },
  { naam: "Intergas", bestand: "/images/merken/warmtepomp/intergas.png", breedte: 1024, hoogte: 328, klasse: "h-8 sm:h-10" },
  { naam: "Heative", bestand: "/images/merken/warmtepomp/heative.webp", breedte: 1386, hoogte: 420, klasse: "h-7 sm:h-8" },
  { naam: "Nefit Bosch", bestand: "/images/merken/warmtepomp/nefit-bosch.png", breedte: 2160, hoogte: 1639, klasse: "h-12 sm:h-14" },
];
