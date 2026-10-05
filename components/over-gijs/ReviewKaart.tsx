"use client";
/* eslint-disable @next/next/no-img-element -- Google-attributie wordt ongewijzigd getoond, zonder beeldtransformatie. */
import { useEffect, useRef, useState } from "react";
import { isGoogleReviews, type GoogleReviews } from "@/lib/google-reviews";
import { Icon } from "@/components/ds/core/Icon";

// Eén echte Google-review tegelijk, met vorige/volgende-knoppen. Dezelfde
// bron als de homepage (/api/google-reviews). Zolang die koppeling niet actief
// is, staat er een duidelijk gemarkeerde placeholder — maar niet in productie
// (toonPlaceholder, door de aanroepende server-pagina gezet via SEO_INDEXABLE
// uit lib/seo.ts): nooit een verzonnen review, en nooit bracket-placeholder-
// tekst zichtbaar voor echte bezoekers.
export function ReviewKaart({ groot = false, toonPlaceholder = true }: { groot?: boolean; toonPlaceholder?: boolean }) {
  const trigger = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GoogleReviews | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      observer.disconnect();
      fetch("/api/google-reviews", { signal: controller.signal, cache: "no-store" })
        .then(r => (r.ok ? r.json() : null))
        .then(result => { if (result?.available && isGoogleReviews(result.data)) setData(result.data); })
        .catch(() => { /* reviews zijn optioneel */ });
    });
    if (trigger.current) observer.observe(trigger.current);
    return () => { observer.disconnect(); controller.abort(); };
  }, []);

  const reviews = data?.reviews?.filter(r => r.originalText?.text) ?? [];
  const review = reviews[index];

  return (
    <div ref={trigger} className="flex flex-col gap-4">
      {review && groot ? (
        <figure className="flex flex-col gap-6" aria-live="polite">
          <p className="text-[#e3a51c] text-xl" aria-label={`${review.rating} uit 5 sterren`}>{"★".repeat(Math.round(review.rating))}{"☆".repeat(5 - Math.round(review.rating))}</p>
          <blockquote className="text-[clamp(1.5rem,1rem+2vw,2.75rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--gijs-donkergroen)] [text-wrap:pretty]">&ldquo;{review.originalText?.text}&rdquo;</blockquote>
          <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-semibold text-[var(--gijs-donkergroen)]">{review.authorAttribution.displayName}</span>
            {review.relativePublishTimeDescription && <span className="text-sm text-zinc-600">{review.relativePublishTimeDescription} · Google-review</span>}
            <img src="/images/shared/reviews/google-maps-attribution.svg" alt="Google Maps" className="h-4 w-auto" />
          </figcaption>
        </figure>
      ) : review ? (
        <figure className="gijs-card gijs-card--elevated flex flex-col gap-3" aria-live="polite">
          <p className="text-[#e3a51c] text-lg" aria-label={`${review.rating} uit 5 sterren`}>{"★".repeat(Math.round(review.rating))}{"☆".repeat(5 - Math.round(review.rating))}</p>
          <blockquote className="text-[17px] leading-relaxed text-zinc-800">&ldquo;{review.originalText?.text}&rdquo;</blockquote>
          <figcaption className="flex flex-col gap-1">
            <span className="font-semibold text-[var(--gijs-donkergroen)]">{review.authorAttribution.displayName}</span>
            {review.relativePublishTimeDescription && <span className="text-sm text-zinc-600">{review.relativePublishTimeDescription} · Google-review</span>}
          </figcaption>
          <img src="/images/shared/reviews/google-maps-attribution.svg" alt="Google Maps" className="h-4 w-auto self-start" />
        </figure>
      ) : !toonPlaceholder ? null : groot ? (
        <div className="flex flex-col gap-5">
          <p className="text-sm font-semibold text-zinc-600">Google-review · [Google beoordeling]</p>
          <p className="text-[clamp(1.5rem,1rem+2vw,2.75rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-zinc-500">&ldquo;[Echte Google-review toevoegen]&rdquo;</p>
          <p className="text-sm text-zinc-600">[Naam klant]</p>
          <p className="text-sm text-zinc-500">Placeholder: hier verschijnen echte Google-reviews zodra de koppeling actief is.</p>
        </div>
      ) : (
        <div className="gijs-card gijs-card--muted flex flex-col gap-3">
          <p className="text-sm font-semibold text-zinc-600">Google-review · [Google beoordeling]</p>
          <p className="text-[17px] text-zinc-600">&ldquo;[Echte Google review toevoegen]&rdquo;</p>
          <p className="text-sm text-zinc-600">[Naam klant]</p>
          <p className="text-sm text-zinc-500">Placeholder: hier verschijnen echte Google-reviews zodra de koppeling actief is.</p>
        </div>
      )}
      {reviews.length > 1 && (
        <div className="flex items-center gap-3">
          <button type="button" className="gijs-iconbtn gijs-iconbtn--outline" aria-label="Vorige review" onClick={() => setIndex(i => (i - 1 + reviews.length) % reviews.length)}>
            <Icon name="arrow-left" size="md" />
          </button>
          <span className="text-sm text-zinc-600">{index + 1} van {reviews.length}</span>
          <button type="button" className="gijs-iconbtn gijs-iconbtn--outline" aria-label="Volgende review" onClick={() => setIndex(i => (i + 1) % reviews.length)}>
            <Icon name="arrow-right" size="md" />
          </button>
          {data?.googleMapsUri && <a href={data.googleMapsUri} target="_blank" rel="noopener noreferrer" className="ml-auto text-sm font-semibold underline text-[var(--accent-700)]">Alle reviews op Google</a>}
        </div>
      )}
    </div>
  );
}
