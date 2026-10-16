"use client";

import { useEffect } from "react";
import { useConsent } from "./ConsentProvider";
import { useMeetomgeving } from "@/lib/consent/meetomgeving";

// Site-ID instellen via NEXT_PUBLIC_CONTENTSQUARE_SITE_ID — zonder die
// variabele doet dit niets. Laadt pas ná toestemming voor "Statistieken".
// Staat los van ClarityLoader.tsx (elk via zijn eigen environment variable
// onafhankelijk aan/uit te zetten), maar bezoekers zien in de instellingen
// maar één categorie "Statistieken" — niet allebei apart, dat zou alleen
// verwarren (zie opdracht). Contentsquare maskeert zelf standaard niet alles:
// geef gevoelige onderdelen (formuliervelden, de woningscan) in het
// Contentsquare-dashboard zelf de "cs-mask"-klasse of het data-cs-mask-
// attribuut zodra het echte site-ID er is — dat kan nu nog niet geverifieerd
// worden zonder een live project.
const CONTENTSQUARE_ID = process.env.NEXT_PUBLIC_CONTENTSQUARE_SITE_ID ?? "";

declare global {
  interface Window {
    _uxaLoaded?: boolean;
    _uxa?: unknown[];
  }
}

export function ContentsquareLoader() {
  const { statistics } = useConsent();
  const { meten } = useMeetomgeving();

  useEffect(() => {
    if (!CONTENTSQUARE_ID || !meten || !statistics || typeof window === "undefined" || window._uxaLoaded) return;
    window._uxaLoaded = true;
    window._uxa = window._uxa || [];
    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = `https://t.contentsquare.net/uxa/${CONTENTSQUARE_ID}.js`;
    document.head.appendChild(script);
  }, [statistics, meten]);

  return null;
}
