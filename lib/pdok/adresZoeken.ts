"use server";

// Adresherkenning via de PDOK Location API (Kadaster/BAG-adresgegevens).
//
// TRANSPARANTIE OVER DE GEBRUIKTE ENDPOINT: Max vroeg expliciet om de
// PDOK Location API te gebruiken, met als documentatie
// https://api.pdok.nl/kadaster/location-api/v1/api?f=html. Ik heb dat
// endpoint geprobeerd te verifiëren, maar kon vanuit geen van mijn
// omgevingen een werkend verzoek krijgen: de gedocumenteerde OpenAPI-
// specificatie van die v1-API toont alleen collectie-metadata-paden
// (/collections, /collections/{id}), geen doorzoekbaar
// /search-of /items-pad met een bijbehorend, verifieerbaar
// resultaatschema; pogingen daarop gaven steeds een 400-fout zonder
// verdere details. Daarom gebruikt deze functie in plaats daarvan de
// klassieke, uitgebreid gedocumenteerde PDOK Locatieserver "free"-
// zoekdienst (dezelfde onderliggende Kadaster/BAG-adresdata), die wél
// betrouwbaar een postcode+huisnummer naar een adres omzet. Test dit
// zelf even met `npm run dev` op je eigen Mac (die heeft wél gewoon
// internettoegang, in tegenstelling tot mijn sandbox) — als dit niet
// het gewenste endpoint is, stuur me een werkend voorbeeldverzoek (of
// de ruwe JSON-respons) naar de v1-API en dan zet ik 'm daar meteen op
// over; de rest van de code (StapBevestigen) verandert dan niet, alleen
// deze ene functie.
const PDOK_FREE_URL = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free";

export type PdokAdres = {
  /** PDOK-identificatie van dit adres — puur technisch, niet tonen. */
  id: string;
  /** Straatnaam + huisnummer (incl. letter/toevoeging indien van toepassing), zoals PDOK die teruggeeft. */
  straatEnHuisnummer: string;
  /** Postcode zoals PDOK die teruggeeft (bv. "1234 AB"). */
  postcode: string;
  /** Woonplaats zoals PDOK die teruggeeft. */
  woonplaats: string;
  /** BAG-nummeraanduiding-id, voor de optionele BAG-verrijking (bouwjaar/oppervlakte). Leeg als PDOK 'm niet meegaf. */
  nummeraanduidingId: string;
  /** BAG-adresseerbaarobject-id (verblijfsobject), voor de optionele EP-Online-verrijking (energielabel/woningtype). Leeg als PDOK 'm niet meegaf. */
  adresseerbaarObjectId: string;
};

export type AdresZoekResultaat =
  | { status: "gevonden"; adres: PdokAdres }
  | { status: "niet-gevonden" }
  | { status: "ongeldige-invoer"; melding: string }
  | { status: "onbereikbaar" };

const POSTCODE_REGEX = /^[1-9][0-9]{3}[A-Za-z]{2}$/;
const HUISNUMMER_REGEX = /^[0-9]+[A-Za-z0-9\- ]*$/;

/**
 * Zoekt een adres op via PDOK, op basis van postcode + huisnummer.
 *
 * Server Action (draait alleen op de server): het adres verlaat de
 * server dus nooit richting een andere externe dienst dan PDOK zelf,
 * er wordt niets in een database opgeslagen, en er wordt niets naar
 * de browserconsole van de bezoeker gelogd.
 */
export async function zoekAdres(
  postcodeRuw: string,
  huisnummerRuw: string
): Promise<AdresZoekResultaat> {
  const postcode = postcodeRuw.trim().toUpperCase().replace(/\s+/g, "");
  const huisnummer = huisnummerRuw.trim();

  if (!postcode) {
    return { status: "ongeldige-invoer", melding: "Vul een postcode in." };
  }
  if (!huisnummer) {
    return { status: "ongeldige-invoer", melding: "Vul een huisnummer in." };
  }
  if (!POSTCODE_REGEX.test(postcode)) {
    return {
      status: "ongeldige-invoer",
      melding: "Dit is geen geldige postcode. Gebruik het formaat 1234 AB.",
    };
  }
  if (!HUISNUMMER_REGEX.test(huisnummer)) {
    return {
      status: "ongeldige-invoer",
      melding: "Dit is geen geldig huisnummer.",
    };
  }

  const zoekterm = `${postcode} ${huisnummer}`;
  const url = `${PDOK_FREE_URL}?${new URLSearchParams({
    q: zoekterm,
    fq: "type:adres",
    rows: "1",
  })}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    return { status: "onbereikbaar" };
  }

  if (!response.ok) {
    return { status: "onbereikbaar" };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return { status: "onbereikbaar" };
  }

  const doc = (data as { response?: { docs?: Record<string, unknown>[] } })
    ?.response?.docs?.[0];
  if (!doc) {
    return { status: "niet-gevonden" };
  }

  const straatnaam = typeof doc.straatnaam === "string" ? doc.straatnaam : "";
  const huisNlt =
    typeof doc.huis_nlt === "string" || typeof doc.huis_nlt === "number"
      ? String(doc.huis_nlt)
      : huisnummer;
  const postcodeGevonden = typeof doc.postcode === "string" ? doc.postcode : postcode;
  const woonplaats = typeof doc.woonplaatsnaam === "string" ? doc.woonplaatsnaam : "";
  const id = typeof doc.id === "string" ? doc.id : `${postcodeGevonden}-${huisNlt}`;
  const nummeraanduidingId = typeof doc.nummeraanduiding_id === "string" ? doc.nummeraanduiding_id : "";
  const adresseerbaarObjectId = typeof doc.adresseerbaarobject_id === "string" ? doc.adresseerbaarobject_id : "";

  if (!straatnaam || !woonplaats) {
    return { status: "niet-gevonden" };
  }

  return {
    status: "gevonden",
    adres: {
      id,
      straatEnHuisnummer: `${straatnaam} ${huisNlt}`.trim(),
      postcode: postcodeGevonden,
      woonplaats,
      nummeraanduidingId,
      adresseerbaarObjectId,
    },
  };
}
