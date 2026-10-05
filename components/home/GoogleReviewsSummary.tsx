"use client";
/* eslint-disable @next/next/no-img-element -- Google author photos and attribution are displayed directly without caching or image transformation. */
import { useEffect, useRef, useState } from "react";
import { isGoogleReviews, type GoogleReviews } from "@/lib/google-reviews";
import styles from "./GoogleReviews.module.css";

const safeLink = (url?: string) => url?.startsWith("https://") ? url : undefined;

export default function GoogleReviewsSummary() {
  const trigger = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GoogleReviews | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      fetch("/api/google-reviews", { signal: controller.signal, cache: "no-store" })
        .then(response => response.ok ? response.json() : null)
        .then(result => { if (result?.available && isGoogleReviews(result.data)) setData(result.data); })
        .catch(() => { /* Reviews are optional; never interrupt the homepage or show invented data. */ });
    });
    if (trigger.current) observer.observe(trigger.current);
    return () => { observer.disconnect(); controller.abort(); };
  }, []);
  return <div ref={trigger}>
    {data && <section className={styles.section} aria-label="Google-reviews">
      <div className={styles.inner}>
        <div className={styles.summary}>
          <h2>Zo ervaren anderen {data.displayName.text}</h2>
          <p>{data.rating !== undefined ? <strong>{data.rating.toLocaleString("nl-NL")} uit 5</strong> : "Nog geen beoordeling"}{data.userRatingCount !== undefined && ` · ${data.userRatingCount} reviews`}</p>
          <a href={data.googleMapsUri} target="_blank" rel="noopener noreferrer">Bekijk alle reviews</a>
        </div>
        <img src="/images/shared/reviews/google-maps-attribution.svg" alt="Google Maps" className={styles.source} />
        <p className={styles.notice}>Een selectie van maximaal vijf reviews, door Google gerangschikt op relevantie.</p>
        <div className={styles.grid}>{data.reviews?.slice(0, 5).map(review => <article key={review.name} className={styles.review}>
          <div className={styles.author}>
            {safeLink(review.authorAttribution.photoUri) && <img src={review.authorAttribution.photoUri} alt="" className={styles.avatar} referrerPolicy="no-referrer" />}
            <a href={safeLink(review.authorAttribution.uri)} target="_blank" rel="noopener noreferrer">{review.authorAttribution.displayName}</a>
          </div>
          <p aria-label={`${review.rating} uit 5 sterren`}>{"★".repeat(Math.round(review.rating))}{"☆".repeat(5 - Math.round(review.rating))}</p>
          {review.originalText?.text && <blockquote>{review.originalText.text}</blockquote>}
          <small>{review.relativePublishTimeDescription}</small>
          {safeLink(review.googleMapsUri) && <a href={review.googleMapsUri} target="_blank" rel="noopener noreferrer">Bekijk deze review op Google Maps</a>}
        </article>)}</div>
      </div>
    </section>}
  </div>;
}
