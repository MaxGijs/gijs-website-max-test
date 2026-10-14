"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { leesOpgeslagenConsent } from "@/lib/consent/storage";
import { pushToDataLayer } from "@/lib/consent/dataLayer";

// Next.js (App Router) ververst de pagina niet bij client-side navigatie, dus GTM's eigen
// "Initialisatie"/"Geschiedigeniswijziging"-triggers missen de meeste paginaweergaven. Dit stuurt
// daarom zelf een "page_view"-dataLayer-event bij elke navigatie (inclusief de eerste). In GTM moet
// de GA4-configuratietag daarom met "Send a page view event when this configuration loads" UIT
// staan, en een apart GA4-event-tag op dit "page_view"-dataLayer-event getriggerd worden — zie het
// analytics-rapport voor de exacte GTM-instructie.
//
// Zelfde toestemmingsgrens als lib/analytics.ts: alleen pushen als er al statistieken-toestemming
// is. In een losse Suspense-boundary (useSearchParams vereist dat in de App Router), zodat de rest
// van de statisch gegenereerde pagina's dat niet hoeven te worden.
function PageViewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (leesOpgeslagenConsent()?.statistics !== true) return;
    const query = searchParams.toString();
    pushToDataLayer({
      event: "page_view",
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  );
}
