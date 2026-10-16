"use client";

import { useSyncExternalStore } from "react";

// Bepaalt of de meettools (GTM/GA4, Clarity, Contentsquare, Vercel Analytics) in deze browser mogen
// laden, los van cookietoestemming. Doel: testverkeer buiten de cijfers houden.
// - Alleen op het echte domein; lokaal ontwikkelen en Vercel-previews meten nooit.
// - Tag Assistant-sessies (GTM-debug) laden alleen Tag Manager, zodat debuggen blijft werken maar
//   Clarity, Contentsquare en Vercel Analytics die testsessies niet meetellen.
// - Eigen browsers (Max, Thom) eenmalig uitzetten met ?intern=aan; weer aanzetten met ?intern=uit.

const PRODUCTIE_HOSTS = new Set(["groeninjestraat.nl", "www.groeninjestraat.nl"]);
const INTERN_KEY = "gijs-intern-verkeer";
const TAG_ASSISTANT_KEY = "gijs-tag-assistant";

export type Meetomgeving = {
  /** Alle meettools mogen laden (mits er toestemming is). */
  meten: boolean;
  /** Alleen Tag Manager laden (Tag Assistant-debugsessie). */
  alleenGtm: boolean;
};

const NIETS: Meetomgeving = { meten: false, alleenGtm: false };
let cache: Meetomgeving | null = null;

function bepaal(): Meetomgeving {
  if (!PRODUCTIE_HOSTS.has(window.location.hostname)) return NIETS;
  const params = new URLSearchParams(window.location.search);
  let intern = false;
  let tagAssistant = false;
  try {
    if (params.get("intern") === "aan") localStorage.setItem(INTERN_KEY, "1");
    if (params.get("intern") === "uit") localStorage.removeItem(INTERN_KEY);
    if (params.has("gtm_debug") || document.referrer.startsWith("https://tagassistant.google.com")) {
      sessionStorage.setItem(TAG_ASSISTANT_KEY, "1");
    }
    intern = localStorage.getItem(INTERN_KEY) === "1";
    tagAssistant = sessionStorage.getItem(TAG_ASSISTANT_KEY) === "1";
  } catch { /* opslag geblokkeerd: dan gewoon meten volgens toestemming */ }
  if (tagAssistant) return { meten: false, alleenGtm: true };
  if (intern) return NIETS;
  return { meten: true, alleenGtm: false };
}

const getSnapshot = () => (cache ??= bepaal());
const getServerSnapshot = () => NIETS;
const subscribe = () => () => {};

export function useMeetomgeving(): Meetomgeving {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
