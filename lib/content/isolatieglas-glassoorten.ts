// Bron: "Informatie isolatieglas van Gijs met aanvullende voorwaarden.pdf",
// pagina 3 ("Productblad isolatieglas HR EcoGlazz"). U-waarden zijn
// woordelijk overgenomen uit het schema in de brochure, in dezelfde
// volgorde als daar afgebeeld (van buitenzijde / enkelglas naar
// binnenzijde / beste isolatiewaarde).
//
// De kolommen "Hoe goed isoleert het?" en "Wat is het?" zijn een
// leken-vriendelijke vereenvoudiging (op verzoek herschreven, minder
// technisch dan de eerdere versie met kenmerk/temperatuur/bouwjaar) —
// de onderliggende U-waarden zijn ongewijzigd en nog steeds de brontabel.
export type Glassoort = {
  naam: string;
  hoeGoed: string;
  uWaarde: string;
  uitleg: string;
};

export const GLASSOORTEN: Glassoort[] = [
  { naam: "Enkelglas", hoeGoed: "Zeer beperkt", uWaarde: "5,6", uitleg: "Eén glasplaat" },
  { naam: "Dubbelglas", hoeGoed: "Beperkt", uWaarde: "2,9", uitleg: "Twee glasplaten" },
  { naam: "HR", hoeGoed: "Beter", uWaarde: "1,9", uitleg: "Met warmtereflecterende coating" },
  { naam: "HR+", hoeGoed: "Beter", uWaarde: "1,6", uitleg: "Met gasvulling" },
  { naam: "HR++", hoeGoed: "Goed", uWaarde: "1,2", uitleg: "Verbeterde coating" },
  { naam: "HR++ (G)", hoeGoed: "Zeer goed", uWaarde: "0,8", uitleg: "Coating en kunststof afstandhouder" },
  { naam: "HR+++", hoeGoed: "Zeer goed", uWaarde: "0,7", uitleg: "Driedubbel glas" },
];

// Glassoorten die voldoen aan de minimale U-waarde van 1,2 voor subsidie
// (zie sectie "Subsidie bij isolatieglas") — gebruikt om deze rijen in de
// vergelijkingstabel visueel iets beter herkenbaar te maken, zonder een
// aparte "beste keuze"-claim toe te voegen.
export const GLASSOORTEN_HIGHLIGHT = new Set(["HR++", "HR++ (G)", "HR+++"]);
