"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ALLE_TOESTEMMING, GEEN_TOESTEMMING, type ConsentPreferences } from "@/lib/consent/types";
import { leesOpgeslagenConsent, schrijfConsent } from "@/lib/consent/storage";
import { werkConsentModeBij } from "@/lib/consent/consentMode";

type ConsentContextWaarde = ConsentPreferences & {
  /** False tijdens de allereerste render (server + eerste client-render), vóórdat localStorage is gelezen — voorkomt dat de banner heel even flitst voor bezoekers die al een keuze hebben gemaakt. */
  gereed: boolean;
  /** True zodra de bezoeker (ooit, in deze browser) een keuze heeft gemaakt — bepaalt of de banner verschijnt. */
  hasDecided: boolean;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  accepteerAlles: () => void;
  weigerAlles: () => void;
  bewaarVoorkeuren: (voorkeuren: ConsentPreferences) => void;
};

const ConsentContext = createContext<ConsentContextWaarde | null>(null);

export function useConsent(): ConsentContextWaarde {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent moet binnen <ConsentProvider> gebruikt worden.");
  return context;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [gereed, setGereed] = useState(false);
  const [hasDecided, setHasDecided] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const opgeslagen = leesOpgeslagenConsent();
    if (opgeslagen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- eenmalig herstellen na hydratatie (localStorage bestaat pas in de browser)
      setStatistics(opgeslagen.statistics);
      setMarketing(opgeslagen.marketing);
      setHasDecided(true);
      // Consent Mode start bij elke paginalading op "denied" (ConsentDefaultScript); hier wordt
      // de al eerder gekozen, echte voorkeur direct doorgegeven.
      werkConsentModeBij(opgeslagen);
    }
    setGereed(true);
  }, []);

  function toepassen(nieuw: ConsentPreferences) {
    // Gaat een eerder toegestane categorie nu uit? Dan is dit een intrekking: scripts die al
    // geladen zijn (GTM-tags, Clarity, Contentsquare) stoppen niet vanzelf halverwege, dus een
    // herlaadbeurt garandeert dat ze niet stilletjes blijven doorlopen.
    const isIntrekking = hasDecided && ((statistics && !nieuw.statistics) || (marketing && !nieuw.marketing));
    setStatistics(nieuw.statistics);
    setMarketing(nieuw.marketing);
    setHasDecided(true);
    setSettingsOpen(false);
    schrijfConsent(nieuw);
    werkConsentModeBij(nieuw);
    if (isIntrekking && typeof window !== "undefined") window.location.reload();
  }

  const waarde: ConsentContextWaarde = {
    gereed,
    hasDecided,
    statistics,
    marketing,
    settingsOpen,
    openSettings: () => setSettingsOpen(true),
    closeSettings: () => setSettingsOpen(false),
    accepteerAlles: () => toepassen(ALLE_TOESTEMMING),
    weigerAlles: () => toepassen(GEEN_TOESTEMMING),
    bewaarVoorkeuren: toepassen,
  };

  return <ConsentContext.Provider value={waarde}>{children}</ConsentContext.Provider>;
}
