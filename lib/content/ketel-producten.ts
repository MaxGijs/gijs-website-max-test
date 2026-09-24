// Ketels waarmee Gijs werkt (bevestigd door de opdrachtgever, 2026-09-24).
// Productgegevens UITSLUITEND van de twee aangeleverde Warmteservice-pagina's:
// - HRE 28/24: https://www.warmteservice.nl/Verwarming/Cv-ketel/HR-Combiketel/Intergas-Kombi-Kompakt-HRE-28-24-RF-HR-Combiketel-6,9---22,8-kW-CW4/v/BP_009109
//   Dit is een variantenoverzicht: alleen titel (vermogen, CW-klasse) en de drie
//   rookgasuitvoeringen. Geen omschrijving of specificatietabel.
// - HRE 36/30: https://www.warmteservice.nl/Verwarming/Cv-ketel/HR-Combiketel/Intergas-Kombi-Kompakt-HRE-36-30-RF-HR-Combiketel-7,1---26,3-kW-CW5/p/13754564
//   Omschrijving, kenmerken en specificaties (tabelwaarden gecontroleerd in de
//   productdata van de pagina zelf).
// Geen eigen aanvullingen, geen rangorde en geen uitspraak over wanneer Gijs welke ketel inzet.
export type KetelProduct = {
  merk: string;
  naam: string;
  type: string;
  warmwater: string;
  kenmerken: string[];
  technisch: { label: string; waarde: string }[];
};

const ROOKGAS_UITVOERINGEN = "2 × 80 mm excentrisch, 60/100 mm concentrisch of 80/125 mm concentrisch";

export const KETELS: KetelProduct[] = [
  {
    merk: "Intergas",
    naam: "Kombi Kompakt HRE 28/24",
    type: "HR-combiketel",
    warmwater: "Warmwatercomfort CW4",
    kenmerken: [],
    technisch: [
      { label: "Vermogen", waarde: "6,9 - 22,8 kW" },
      { label: "Warmwaterklasse", waarde: "CW4" },
      { label: "Rookgasaansluiting", waarde: ROOKGAS_UITVOERINGEN },
    ],
  },
  {
    merk: "Intergas",
    naam: "Kombi Kompakt HRE 36/30",
    type: "HR-combiketel",
    warmwater: "Warmwatercomfort CW5",
    kenmerken: [
      "15 liter warm water (40°C) per minuut",
      "Het vermogen past zich automatisch aan de warmtebehoefte aan",
      "Eenvoudig in gebruik en onderhoudsvriendelijk",
      "Compacte afmetingen",
      "15 jaar garantie op de warmtewisselaar, 2 jaar op onderdelen",
    ],
    technisch: [
      { label: "Vermogen cv (80/60 °C)", waarde: "7,1 - 26,3 kW" },
      { label: "Vermogen cv (50/30 °C)", waarde: "7,8 - 27,1 kW" },
      { label: "Warmwaterklasse", waarde: "CW5" },
      { label: "Warm water bij 40 °C / 60 °C", waarde: "15 / 9 liter per minuut" },
      { label: "Energielabel verwarming / warm water", waarde: "A / A" },
      { label: "Afmetingen (h × b × d)", waarde: "710 × 450 × 240 mm" },
      { label: "Gewicht", waarde: "36 kg" },
      { label: "OpenTherm", waarde: "Ja" },
      { label: "Warmtepomp ready", waarde: "Ja" },
      { label: "Inclusief thermostaat", waarde: "Nee" },
      { label: "Pomp", waarde: "A-label pomp" },
      { label: "Rookgasaansluiting", waarde: ROOKGAS_UITVOERINGEN },
    ],
  },
];
