"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsent } from "./ConsentProvider";
import { useMeetomgeving } from "@/lib/consent/meetomgeving";

// Vercel Web Analytics is cookieloos en telt zelf geen individuele bezoekers op basis van een
// identifier — Vercel's eigen documentatie noemt het daarom "geen cookiebanner nodig". Omdat dat
// voor dit project niet met zekerheid is vast te stellen (zie de opdracht: "wanneer dit niet
// voldoende kan worden vastgesteld, laat de tracking dan uitsluitend laden na
// statistiekentoestemming"), wordt het hier toch achter dezelfde "Statistieken"-toestemming
// gehangen als Clarity/Contentsquare — dezelfde, voorzichtigste lijn als de rest van dit
// toestemmingssysteem. Werkt op elk Vercel-abonnement (ook Hobby) binnen het gratis maandelijkse
// quotum; alleen gebruik daarboven kost geld, en daar wordt hier niets voor geactiveerd.
export function VercelAnalyticsLoader() {
  const { statistics } = useConsent();
  const { meten } = useMeetomgeving();
  if (!statistics || !meten) return null;
  return <Analytics />;
}
