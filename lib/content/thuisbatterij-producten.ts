// Thuisbatterij-productgegevens. Uitsluitend overgenomen uit het door Gijs
// aangeleverde "Sigenergy Infoblad" (SigenStor) en de thuisbatterij-pagina's
// uit alle_brochures_in_1.pdf. Zie het eindverslag voor de volledige
// bronverwijzing.
//
// BELANGRIJKE BEPERKING: het Sigenergy-infoblad is een generiek,
// internationaal marketingblad (geen Gijs-specifiek productblad) en bevat
// GEEN capaciteit (kWh), afmetingen, gewicht, prijs of garantietermijn.
// Deze velden zijn daarom bewust leeg gelaten in plaats van elders
// vandaan gehaald of geschat — "als iets niet uit de bron blijkt: niet
// toevoegen".
export type ThuisbatterijKenmerk = { titel: string; tekst: string };

export const SIGENSTOR = {
  merk: "Thuisbatterij",
  naam: "Modulaire thuisbatterij",
  ondertitel: "Modulaire, stapelbare thuisbatterij",
  image: "/images/maatregelen/thuisbatterij/thuisbatterij-sigenstor.png",
  imageAlt: "Modulaire, stapelbare thuisbatterij",
  // Bron: Sigenergy Infoblad, pagina 1-2. Kwalitatieve kenmerken, geen
  // verzonnen capaciteit/vermogen. IP66 is in de zin zelf uitgelegd
  // (vereenvoudiging voor leken, geen wijziging van de brongegevens).
  kenmerken: [
    "Modulair en stapelbaar, uit te breiden met extra batterijpakketten",
    "Bidirectioneel laden en ontladen, ook geschikt voor elektrische auto's (V2X)",
    "Geschikt voor buitenshuis gebruik, met bescherming tegen stof en water (IP66)",
    "Stabiele werking tot -20°C dankzij ingebouwd warmtekussen",
  ] as string[],
  // Bron: Sigenergy Infoblad, pagina 2 — de drie werkmodi die het infoblad noemt.
  werkmodi: [
    { titel: "AI-modus", tekst: "Past het gebruik automatisch aan op basis van energieverbruikspatronen." },
    { titel: "TOU-modus", tekst: "Time of Use: afgestemd op de elektriciteitstarieven op verschillende momenten van de dag." },
    { titel: "Max. eigen verbruik", tekst: "Gericht op het zoveel mogelijk zelf verbruiken van opgewekte energie." },
  ] as ThuisbatterijKenmerk[],
  // Bron: Sigenergy Infoblad, pagina 2 — veiligheidskenmerken.
  veiligheid: [
    "Veiligheid op EV-niveau",
    "Interne brandbluskit",
    "Geïsoleerde pads met hoge temperatuursweerstand (aerogel)",
    "Decompressieklep",
    "Temperatuurdetectie met volledige dekking",
  ] as string[],
  // Bron: Sigenergy Infoblad, pagina 2. "*Onder specifieke voorwaarden."
  levenscyclus: "10.000 keer levenscyclus per batterijcel*",
  levenscyclusNoot: "*Onder specifieke voorwaarden, zoals vermeld door de fabrikant.",
};
