import type { CSSProperties } from "react";

// Foto- en titelovergang van een kaart naar de bijbehorende pagina (kennisartikel, maatregel).
// De kaart en de pagina geven dezelfde naam aan hun foto en titel; de browser koppelt ze bij een
// navigatie met transitionTypes={OVERGANG_TYPES} en laat ze naar hun nieuwe plek schuiven. De
// animatie zelf staat in app/globals.css onder "Foto-overgang".
//
// De foto loopt via components/FotoOvergang.tsx (React <ViewTransition>; zonder zo'n component start
// React geen overgang). De titel loopt via een gewone CSS-eigenschap: React koppelde het titelpaar
// niet, de browser doet het met deze eigenschap wel betrouwbaar.
export const OVERGANG_TYPES = ["foto-open"];

export const titelOvergang = (id: string) =>
  ({ viewTransitionName: "titel-" + id, viewTransitionClass: "titel-overgang" }) as CSSProperties;
