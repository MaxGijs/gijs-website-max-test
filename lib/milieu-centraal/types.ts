// Gedeelde types voor de subsidiecheck (server én browser). Geen geheimen, geen API-aanroepen.

export type RegelingType = "subsidie" | "lening" | "overig";
export type Niveau = "gemeentelijk" | "regionaal" | "provinciaal" | "landelijk";
export type Doelgroep = "eigenaar" | "vve";

export type SubsidieRegeling = {
  id: string;
  titel: string;
  type: RegelingType;
  niveau: Niveau;
  intro?: string;
  aanvullend?: string;
  bedragen?: string;
  voorwaarden?: string;
  /** Pagina van de regeling op verbeterjehuis.nl. */
  url?: string;
  aanbieder?: string;
  aanbiederUrl?: string;
  /** Maatregelen zoals Milieu Centraal ze noemt (bijv. "Isolatie en glas"). */
  maatregelenMc: string[];
  /** Maatregel-id's van Gijs (lib/measures.ts) waarvoor de regeling geldt. */
  voor: string[];
  /** Geldt maar in een deel van de gemeente (bepaalde postcodes of wijken). */
  deelgebied?: boolean;
  einde?: string;
};

export type Gemeente = { code: string; naam: string; provincie: string };

export type SubsidieUitkomst =
  | { status: "ok"; gemeente: Gemeente; adres?: string; regelingen: SubsidieRegeling[]; opgehaaldOp: string }
  | { status: "ongeldig"; melding: string }
  | { status: "niet-gevonden" }
  | { status: "storing" };

export const NIVEAU_LABEL: Record<Niveau, string> = {
  gemeentelijk: "Gemeente",
  regionaal: "Regio",
  provinciaal: "Provincie",
  landelijk: "Landelijk",
};

export const TYPE_LABEL: Record<RegelingType, string> = {
  subsidie: "Subsidie",
  lening: "Lening",
  overig: "Overige regeling",
};

export const BRON_MILIEU_CENTRAAL = {
  naam: "Milieu Centraal, Energiesubsidiewijzer (Verbeter Je Huis)",
  url: "https://www.verbeterjehuis.nl/energiesubsidiewijzer/",
};
