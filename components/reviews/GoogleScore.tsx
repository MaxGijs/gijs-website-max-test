"use client";
/* eslint-disable @next/next/no-img-element -- het officiële Google-attributielogo wordt ongewijzigd getoond, zonder beeldtransformatie. */
import { useGoogleReviews, veiligeLink } from "@/lib/useGoogleReviews";
import { GoogleSterren } from "./GoogleSterren";

// Compacte Google-score voor in een hero: bron, score, sterren, aantal en een link naar alle
// reviews. Alles live uit /api/google-reviews; zonder geldige data staat hier niets.
export function GoogleScore() {
  const data = useGoogleReviews();
  if (!data || data.rating === undefined) return null;
  const link = veiligeLink(data.googleMapsUri);
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[15px] text-zinc-700">
      <img src="/images/shared/reviews/google-maps-attribution.svg" alt="Google Maps" className="h-[15px] w-auto" />
      <GoogleSterren rating={data.rating} className="text-[17px]" />
      <span>
        <strong className="font-semibold text-[var(--gijs-donkergroen)]">{data.rating.toLocaleString("nl-NL")} uit 5</strong>
        {data.userRatingCount !== undefined && <> · {data.userRatingCount.toLocaleString("nl-NL")} Google-beoordelingen</>}
      </span>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--accent-700)] underline underline-offset-[3px] decoration-[var(--accent-200)] hover:decoration-[var(--accent-700)]">
          Bekijk alle reviews<span className="sr-only"> (opent in nieuw tabblad)</span>
        </a>
      )}
    </p>
  );
}
