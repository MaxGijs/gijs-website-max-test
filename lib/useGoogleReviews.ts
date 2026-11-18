"use client";
import { useEffect, useState } from "react";
import { isGoogleReviews, type GoogleReviews, type GoogleReview } from "@/lib/google-reviews";

// Eén gedeelde ophaalactie per paginabezoek voor /api/google-reviews, zodat de score in de hero en
// de reviewsectie verderop niet elk een eigen aanvraag doen. Alles komt live van Google via de
// bestaande API-route: geen vaste score, geen vast aantal en nooit een verzonnen review. Is de
// koppeling niet beschikbaar (geen sleutel, storing), dan blijft het resultaat null en tonen de
// componenten niets. De route zelf bewaart bewust geen reviewcontent (zie docs/google-reviews.md),
// dus er is ook geen oudere kopie om op terug te vallen.

let verzoek: Promise<GoogleReviews | null> | null = null;

function haalOp(): Promise<GoogleReviews | null> {
  verzoek ??= fetch("/api/google-reviews", { cache: "no-store" })
    .then(r => (r.ok ? r.json() : null))
    .then(result => (result?.available && isGoogleReviews(result.data) ? result.data : null))
    .catch(() => null)
    .then(data => {
      // Mislukt? Bij een volgende pagina opnieuw proberen in plaats van de fout te onthouden.
      if (!data) verzoek = null;
      return data;
    });
  return verzoek;
}

export function useGoogleReviews(): GoogleReviews | null {
  const [data, setData] = useState<GoogleReviews | null>(null);
  useEffect(() => {
    let actief = true;
    haalOp().then(d => { if (actief) setData(d); });
    return () => { actief = false; };
  }, []);
  return data;
}

export const veiligeLink = (url?: string) => (url?.startsWith("https://") ? url : undefined);

/** Datum van een review: de echte publicatiedatum als Google die meelevert, anders Google's eigen
 *  omschrijving ("2 maanden geleden"). */
export function reviewDatum(review: GoogleReview): string | undefined {
  if (review.publishTime) {
    const d = new Date(review.publishTime);
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  }
  return review.relativePublishTimeDescription;
}
