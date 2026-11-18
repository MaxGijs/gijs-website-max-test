// Voorbeelden van warmtepompen op /maatregelen/warmtepomp (sectie "Voorbeelden van warmtepompen").
// Namen, labels en teksten letterlijk zoals aangeleverd door Max (12-11-2026). Bewust geen prijzen,
// voorraad, specificaties of bestelknoppen: de sectie is informatief, geen webshop.
//
// NOG TE CONTROLEREN DOOR GIJS vóór publicatie:
// - of alle vier de modellen nog leverbaar zijn en daadwerkelijk door Gijs worden geplaatst;
// - kenmerken van de Mercuria Ace: daar is geen brochure van aangeleverd, dus staan er (nog) geen.
// Foto's: officiële productfoto's, allemaal vrijstaand (transparant) zodat ze op dezelfde lichte
// achtergrond en in hetzelfde kader staan. Pomp AO uit zipzip.zip (Max, 12-11-2026), alleen de lege
// rand eraf gesneden; Pomp MP en Mercuria Ace uit warmtepomp.zip; Elga Ace uit de eerder aangeleverde
// brochures (een nieuwe Elga Ace-foto zat niet in zipzip.zip). Valt een foto ooit weg (`foto: null`),
// dan toont de kaart het merklogo.
//
// Kenmerken: één of twee controleerbare punten per model, letterlijk uit de brochurecijfers in
// lib/content/warmtepomp-producten.ts (DeWarmte-datasheets en de Remeha Elga Ace-brochure), steeds met
// de meetconditie erbij. Geen prijzen, geen COP/SCOP, geen besparingspercentages.
//
// `slug` is ook de waarde van ?model= op /contact; ContactForm vult dan het bericht vooraf in met
// adviesBerichtVoorModel(). Alleen modellen uit deze lijst worden herkend, nooit vrije tekst uit de URL.

export type WarmtepompVoorbeeld = {
  slug: string;
  merk: string;
  model: string;
  label: string;
  tekst: string;
  /** Eén of twee controleerbare kenmerken uit de officiële brochure; leeg als er geen brochure is. */
  kenmerken: string[];
  /** Officiële productfoto, of null als die nog niet is aangeleverd. */
  foto: { src: string; alt: string; breedte: number; hoogte: number } | null;
  /** Merklogo voor het beeldvak zolang er geen productfoto is. */
  logo: { src: string; breedte: number; hoogte: number };
};

export const WARMTEPOMP_VOORBEELDEN: WarmtepompVoorbeeld[] = [
  {
    slug: "dewarmte-pomp-ao",
    merk: "DeWarmte",
    model: "Pomp AO",
    label: "Lucht/water-warmtepomp",
    tekst: "Een compacte uitvoering die bij veel bestaande woningen kan passen.",
    kenmerken: ["Vermogen van 1,4 tot 8,3 kW", "42,2 dB(A) op 1,5 m in de stille modus (23.00 tot 07.00 uur)"],
    foto: { src: "/images/maatregelen/warmtepomp/warmtepomp-dewarmte-pomp-ao.webp", alt: "DeWarmte Pomp AO, buitenunit met houten lamellen", breedte: 1037, hoogte: 774 },
    logo: { src: "/images/merken/warmtepomp/dewarmte.png", breedte: 3209, hoogte: 1182 },
  },
  {
    slug: "dewarmte-pomp-mp",
    merk: "DeWarmte",
    model: "Pomp MP",
    label: "Lucht/water-warmtepomp",
    tekst: "Een krachtigere uitvoering voor woningen met een grotere warmtevraag.",
    kenmerken: ["Vermogen van 1,9 tot 16,5 kW, inclusief ingebouwde booster van 3 kW", "Afgiftetemperatuur tot 70 °C"],
    foto: { src: "/images/maatregelen/warmtepomp/warmtepomp-dewarmte-pomp-mp.webp", alt: "DeWarmte Pomp MP, buitenunit met houten lamellen", breedte: 1400, hoogte: 953 },
    logo: { src: "/images/merken/warmtepomp/dewarmte.png", breedte: 3209, hoogte: 1182 },
  },
  {
    slug: "remeha-elga-ace",
    merk: "Remeha",
    model: "Elga Ace",
    label: "Hybride warmtepomp",
    tekst: "Werkt samen met de cv-ketel en is ontwikkeld voor bestaande woningen.",
    kenmerken: ["Leverbaar in 4 kW en 6 kW", "Installatie in één dag, zonder ingrijpende verbouwing"],
    foto: { src: "/images/maatregelen/warmtepomp/warmtepomp-elgaace.png", alt: "Remeha Elga Ace, binnenunit van de hybride warmtepomp", breedte: 397, hoogte: 686 },
    logo: { src: "/images/merken/warmtepomp/remeha.png", breedte: 269, hoogte: 63 },
  },
  {
    slug: "remeha-mercuria-ace",
    merk: "Remeha",
    model: "Mercuria Ace",
    label: "Volledig elektrische warmtepomp",
    tekst: "Een all-electric oplossing voor woningen die daarvoor geschikt zijn.",
    kenmerken: [],
    foto: { src: "/images/maatregelen/warmtepomp/warmtepomp-remeha-mercuria-ace.webp", alt: "Remeha Mercuria Ace, buitenunit en binnenunit", breedte: 1152, hoogte: 1520 },
    logo: { src: "/images/merken/warmtepomp/remeha.png", breedte: 269, hoogte: 63 },
  },
];

export function contactLinkVoorModel(slug: string) {
  return `/contact?onderwerp=warmtepomp&model=${slug}#contactformulier`;
}

/** Vooraf ingevuld bericht voor het contactformulier, of null als het model onbekend is. */
export function adviesBerichtVoorModel(onderwerp: string | null, slug: string | null): string | null {
  if (onderwerp !== "warmtepomp" || !slug) return null;
  const v = WARMTEPOMP_VOORBEELDEN.find(x => x.slug === slug);
  return v ? `Ik wil graag advies over de ${v.merk} ${v.model}.` : null;
}
