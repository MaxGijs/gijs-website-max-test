"use client";

import { useEffect } from "react";
import { useConsent } from "./ConsentProvider";
import { useMeetomgeving } from "@/lib/consent/meetomgeving";

// Project-ID instellen via NEXT_PUBLIC_CLARITY_PROJECT_ID — zonder die
// variabele doet dit niets. Laadt pas ná toestemming voor "Statistieken", en
// alleen één keer (window.clarity bestaat al zodra het script eerder liep).
// Clarity maskeert tekstinvoer in formulieren standaard al automatisch;
// components/ContactForm.tsx en de aanvraagstap van de woningscan hebben
// daarnaast expliciet data-clarity-mask="True" op het <form>-element, als
// extra zekerheid bovenop dat automatische gedrag.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "";

type ClarityFn = { (...args: unknown[]): void; q: unknown[] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

export function ClarityLoader() {
  const { statistics } = useConsent();
  const { meten } = useMeetomgeving();

  useEffect(() => {
    if (!CLARITY_ID || !meten || !statistics || typeof window === "undefined" || window.clarity) return;
    const c = ((...args: unknown[]) => { c.q.push(args); }) as ClarityFn;
    c.q = [];
    window.clarity = c;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    document.head.appendChild(script);
  }, [statistics, meten]);

  return null;
}
