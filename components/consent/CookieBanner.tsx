"use client";

import { Button } from "@/components/ds/core/Button";
import { useConsent } from "./ConsentProvider";

// Vaste balk onderaan (geen overlay, geen backdrop): blokkeert bewust nooit
// de rest van de pagina, dat mag niet (zie opdracht). "Alles accepteren" en
// "Alles weigeren" zijn allebei een echte, even grote knop — geen "nudging"
// waarbij accepteren opvalt en weigeren een klein linkje is.
export function CookieBanner() {
  const { gereed, hasDecided, settingsOpen, accepteerAlles, weigerAlles, openSettings } = useConsent();

  if (!gereed || hasDecided || settingsOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[var(--z-toast)] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6" role="region" aria-label="Cookiemelding">
      <div className="gijs-card w-full max-w-[720px] !bg-white !shadow-[var(--shadow-3)] flex flex-col gap-4">
        <div>
          <h2 className="text-[19px] font-bold text-[var(--gijs-donkergroen)]">Gijs gebruikt cookies</h2>
          <p className="mt-2 text-[15px] text-[var(--grey-800)]">
            We gebruiken noodzakelijke cookies om de website goed te laten werken. Met toestemming gebruiken we ook cookies om te begrijpen hoe bezoekers onze website gebruiken. Zo kunnen we de website en de digitale woning van Gijs blijven verbeteren.
          </p>
        </div>
        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
          <Button variant="secondary" size="lg" fullWidth className="sm:w-auto" onClick={weigerAlles}>Alles weigeren</Button>
          <Button variant="primary" size="lg" fullWidth className="sm:w-auto" onClick={accepteerAlles}>Alles accepteren</Button>
          <button type="button" className="min-h-11 font-semibold underline text-[var(--accent-700)] sm:ml-2" onClick={openSettings}>
            Instellingen
          </button>
        </div>
      </div>
    </div>
  );
}
