"use client";
/* eslint-disable @next/next/no-img-element -- het officiële Google-attributielogo wordt ongewijzigd getoond, zonder beeldtransformatie. */
import type { GoogleReview } from "@/lib/google-reviews";
import { useGoogleReviews, veiligeLink, reviewDatum } from "@/lib/useGoogleReviews";
import { GoogleSterren } from "./GoogleSterren";

// Reviewsectie: links de samenvatting (score, sterren, aantal), rechts drie echte Google-reviews
// met naam, sterren en datum.
// Alles live uit /api/google-reviews. Zonder geldige data, zonder score of zonder reviews met tekst
// verdwijnt de hele sectie, inclusief de kop: er komt nooit een vaste score of verzonnen review.
//
// Keuze van de drie reviews: Google levert er maximaal vijf. Daaruit tellen alleen inhoudelijke
// reviews (met een tekst van enige lengte, niet alleen sterren of "Top!"), gesorteerd op datum, nieuwste
// eerst. Zijn er minder dan drie inhoudelijke, dan vullen de overige reviews met tekst aan, ook op datum.
// Er wordt niet op aantal sterren gefilterd.

const MIN_TEKENS_INHOUDELIJK = 60;

function tijd(r: GoogleReview) {
  const t = r.publishTime ? Date.parse(r.publishTime) : NaN;
  return Number.isNaN(t) ? 0 : t;
}

function kiesReviews(reviews: GoogleReview[]): GoogleReview[] {
  const metTekst = reviews.filter(r => r.originalText?.text?.trim()).sort((a, b) => tijd(b) - tijd(a));
  const inhoudelijk = metTekst.filter(r => r.originalText!.text!.trim().length >= MIN_TEKENS_INHOUDELIJK);
  const rest = metTekst.filter(r => !inhoudelijk.includes(r));
  return [...inhoudelijk, ...rest].slice(0, 3);
}

export function GoogleReviewsSectie({
  className = "",
  titel = "Wat klanten over Gijs zeggen",
  intro = "Echte ervaringen van klanten die Gijs hielp met advies én uitvoering.",
}: { className?: string; titel?: string; intro?: string }) {
  const data = useGoogleReviews();
  const reviews = kiesReviews(data?.reviews ?? []);
  if (!data || data.rating === undefined || reviews.length === 0) return null;
  const alleReviews = veiligeLink(data.googleMapsUri);

  return (
    <section id="reviews" aria-labelledby="reviews-titel" className={className}>
      <div className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-5 py-8 sm:px-10 lg:px-12 lg:py-11">
        <div className="flex flex-col gap-3 mb-8 max-w-3xl">
          <h2 id="reviews-titel" className="text-[clamp(1.75rem,1.2rem+1.9vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--gijs-donkergroen)] [text-wrap:balance]">
            {titel}
          </h2>
          <p className="text-[clamp(17px,1rem+0.35vw,21px)] leading-[1.55] text-[var(--text-muted)] [text-wrap:pretty]">
            {intro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-4 lg:gap-5 items-stretch">
          <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] bg-white p-6 sm:p-7">
            <img src="/images/shared/reviews/google-maps-attribution.svg" alt="Google Maps" className="h-[18px] w-auto self-start" />
            <GoogleSterren rating={data.rating} className="text-[22px] mt-1" />
            <p className="text-[clamp(2.25rem,1.8rem+1.6vw,3rem)] font-bold leading-none tracking-[-0.04em] text-[var(--gijs-donkergroen)]">
              {data.rating.toLocaleString("nl-NL")} <span className="text-[0.5em] font-semibold tracking-normal">uit 5</span>
            </p>
            {data.userRatingCount !== undefined && (
              <p className="text-[15px] text-[var(--text-muted)]">Op basis van {data.userRatingCount.toLocaleString("nl-NL")} Google-beoordelingen</p>
            )}
            {alleReviews && (
              <a href={alleReviews} target="_blank" rel="noopener noreferrer" className="mt-auto pt-2 text-[15px] font-semibold text-[var(--accent-700)] underline underline-offset-[3px] decoration-[var(--accent-200)] hover:decoration-[var(--accent-700)]">
                Bekijk alle Google-reviews<span className="sr-only"> (opent in nieuw tabblad)</span>
              </a>
            )}
          </div>

          {/* Op mobiel horizontaal bladerbaar (binnen dit blok, dus geen pagina-overflow); vanaf md naast elkaar. */}
          <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mb-0 lg:gap-5 list-none p-0 m-0">
            {reviews.map(review => {
              const datum = reviewDatum(review);
              const link = veiligeLink(review.googleMapsUri);
              return (
                <li key={review.name} className="flex w-[85%] shrink-0 snap-start flex-col gap-3 rounded-[var(--radius-lg)] bg-white p-6 md:w-auto">
                  <GoogleSterren rating={review.rating} className="text-[17px]" />
                  <blockquote className="text-[15px] leading-relaxed text-zinc-800 [text-wrap:pretty] line-clamp-[8]">
                    &ldquo;{review.originalText!.text!.trim()}&rdquo;
                  </blockquote>
                  <div className="mt-auto flex flex-col gap-0.5 pt-2">
                    <span className="font-semibold text-[var(--gijs-donkergroen)]">{review.authorAttribution.displayName}</span>
                    <span className="text-[13px] text-zinc-500">
                      {datum && <>{datum} · </>}
                      {link
                        ? <a href={link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--gijs-donkergroen)]">Google-review<span className="sr-only"> (opent in nieuw tabblad)</span></a>
                        : "Google-review"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-5 text-[13px] text-zinc-500">
          Actueel opgehaald via Google: de meest recente inhoudelijke reviews uit de reviews die Google meelevert. Lange reviews zijn ingekort, de volledige tekst staat op Google.
        </p>
      </div>
    </section>
  );
}
