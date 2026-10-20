"use server";

import { magDoorgaan } from "@/lib/rate-limit";
import { gemeenteVoorAdres, regelingenVoorGemeente } from "@/lib/milieu-centraal/regelingen";
import type { Doelgroep, SubsidieUitkomst } from "@/lib/milieu-centraal/types";

// Subsidies en regelingen voor een adres, uit de Energiesubsidiewijzer van Milieu Centraal.
// Draait op de server: de API-sleutel komt nooit in de browser, en het adres gaat alleen naar
// PDOK (Kadaster) om de gemeente te bepalen. Er wordt niets opgeslagen.

const POSTCODE = /^[1-9][0-9]{3}[A-Z]{2}$/;
const HUISNUMMER = /^[0-9]{1,5}[A-Za-z0-9 -]{0,6}$/;

export async function zoekSubsidies(postcodeIn: unknown, huisnummerIn: unknown, doelgroepIn: unknown = "eigenaar"): Promise<SubsidieUitkomst> {
  const postcode = typeof postcodeIn === "string" ? postcodeIn.toUpperCase().replace(/\s+/g, "") : "";
  const huisnummer = typeof huisnummerIn === "string" ? huisnummerIn.trim() : "";
  const doelgroep: Doelgroep = doelgroepIn === "vve" ? "vve" : "eigenaar";
  if (!POSTCODE.test(postcode)) return { status: "ongeldig", melding: "Vul een geldige postcode in, bijvoorbeeld 7556 BN." };
  if (huisnummer && !HUISNUMMER.test(huisnummer)) return { status: "ongeldig", melding: "Dit is geen geldig huisnummer." };
  // Ruimer dan bij de formulieren (wisselen tussen filters is normaal gebruik), maar wel een rem op scripts.
  if (!(await magDoorgaan("subsidies", 40))) return { status: "ongeldig", melding: "Je hebt net veel zoekopdrachten gedaan. Probeer het over een paar minuten opnieuw." };

  const plek = await gemeenteVoorAdres(postcode, huisnummer || undefined);
  if (plek === null) return { status: "storing" };
  if (plek === "niet-gevonden") return { status: "niet-gevonden" };

  const regelingen = await regelingenVoorGemeente(plek.gemeente, doelgroep);
  if (!regelingen) return { status: "storing" };
  return { status: "ok", gemeente: plek.gemeente, adres: plek.adres, regelingen, opgehaaldOp: new Date().toISOString().slice(0, 10) };
}
