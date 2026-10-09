// Warmtepomp-productgegevens: alleen de DeWarmte-warmtepompen (de andere merken, Remeha Elga Ace
// en Intergas Xtend, staan op verzoek van Gijs niet meer op de site). Uitsluitend overgenomen uit de door Gijs
// aangeleverde bronnen: de Warmtepomp-ZIP (deWarmte-, Remeha- en
// Intergas-documenten), de aanvullend aangeleverde "Brochure DeWarmte
// Hybride warmtepomp 112025" (versie november 2025, incl. het officiële
// Datasheet Pomp MP) en de warmtepomp-pagina's uit alle_brochures_in_1.pdf.
// Zie het eindverslag voor de volledige, per-claim bronverwijzing.
//
// Bewust NIET opgenomen (zie ook code-comments in WarmtepompPage.tsx):
// - COP/sCOP en energieklasse: wel aangetroffen in de bronnen (o.a. het
//   officiële DeWarmte-datasheet en de Remeha/Intergas-spec-tabellen),
//   maar expliciet uitgesloten op verzoek ("geen COP/SCOP verzinnen" —
//   hier toegepast als: ook niet tonen wanneer wél gevonden).
// - Prijzen, meerkosten, gasbesparingspercentages en
//   woningwaardestijgingspercentages: idem, wel in de bronnen
//   aangetroffen (bijv. "bespaar tot 85% op gas", "gemiddeld 9%
//   woningwaardestijging", prijsopbouw DeWarmte, meerkosten-tabel), maar
//   niet gebruikt.
// - De concurrentievergelijking ("Traditionele hybride pomp van de
//   lokale loodgieter" vs. DeWarmte) uit de november 2025-brochure: dit
//   is ongenuanceerde marketingretoriek over concurrenten, niet gevraagd
//   en niet gebruikt.
// - "Dubbele Pomp MP" (33 kW cascade-opstelling van twee Pomp MP's): een
//   nichetoepassing, niet als apart product opgenomen.
//
// Geluidswaarden zijn overgenomen inclusief meetafstand en modus/conditie
// (nooit een los getal zonder context), omdat de bronnen per product
// meerdere dB(A)-waarden voor verschillende afstanden/omstandigheden
// geven.
//
// TEGENSTRIJDIGHEID: de marketingtekst in de november 2025-brochure noemt
// het gewicht van de Pomp MP "134 kg", maar het officiële Datasheet Pomp
// MP in dezelfde brochure noemt 150 kg. Deze pagina gebruikt het
// datasheet-gewicht (150 kg) als leidend.
export type WarmtepompProduct = {
  merk: string;
  naam: string;
  ondertitel: string;
  vermogen: string;
  afmetingen: string;
  geluid: string;
  garantie?: string;
  image: string;
  imageAlt: string;
  kenmerken: string[];
};

export const WARMTEPOMP_PRODUCTEN: WarmtepompProduct[] = [
  {
    merk: "Monoblock",
    naam: "Hybride warmtepomp tot 8,3 kW",
    ondertitel: "Hybride warmtepomp, lucht/water monoblock",
    vermogen: "6,4 kW (bij A7/W35), modulatiebereik 1,4 - 8,3 kW",
    afmetingen: "1100 × 455 × 850 mm (B × D × H), gewicht 102 kg",
    geluid: "44,9 dB(A) op 1,5 m · 42,2 dB(A) op 1,5 m in stille modus (23.00 - 07.00 uur)",
    garantie: "2 jaar productgarantie, levenslang storingshulp op afstand",
    image: "/images/maatregelen/warmtepomp/warmtepomp-dewarmte-product.png",
    imageAlt: "Hybride warmtepomp (monoblock) die Gijs het meest plaatst",
    kenmerken: [
      "Verhogen van je energielabel",
      "Flinke besparing op het gas",
      "Toekomstbestendig product",
      "Uniek ontwerp",
      "Waarde verbetering van de woning",
    ],
  },
  {
    merk: "Monoblock",
    naam: "Hybride warmtepomp tot 16,5 kW",
    ondertitel: "Hybride warmtepomp, lucht/water monoblock (nieuw)",
    vermogen: "Modulatiebereik 1,9 - 16,5 kW (incl. ingebouwde elektrische booster van 3 kW)",
    afmetingen: "1223 × 461 × 854 mm (B × D × H), gewicht 150 kg",
    geluid: "34,0 dB(A) op 2 m · 32,8 dB(A) op 2 m in stille modus",
    garantie: "2 jaar productgarantie, levenslang storingshulp op afstand",
    image: "/images/maatregelen/warmtepomp/warmtepomp-dewarmte-product.png",
    imageAlt: "Grotere hybride warmtepomp (monoblock)",
    kenmerken: [
      "Geschikt voor alle huizen, ook de grootste",
      "Milieuvriendelijk koudemiddel (propaan) met een beperkte impact op het klimaat",
      "Super stil",
      "Hogere maximale afgiftetemperatuur (tot 70°C)",
    ],
  },
];
