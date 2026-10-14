"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ds/core/Button";
import { IconButton } from "@/components/ds/core/IconButton";
import { Checkbox } from "@/components/ds/forms/Checkbox";
import { useConsent } from "./ConsentProvider";

// Instellingenvenster: bereikbaar vanuit de cookiebanner ("Instellingen") én
// vanuit de footer ("Cookie-instellingen"), ook nadat de bezoeker al eerder
// een keuze maakte (zo kan die later gewijzigd of ingetrokken worden — zie
// ConsentProvider.toepassen voor wat er gebeurt als een categorie wordt
// uitgezet nadat hij eerder aanstond).
export function CookieSettingsModal() {
  const { settingsOpen, closeSettings, statistics, marketing, accepteerAlles, weigerAlles, bewaarVoorkeuren } = useConsent();
  const [lokaalStatistics, setLokaalStatistics] = useState(statistics);
  const [lokaalMarketing, setLokaalMarketing] = useState(marketing);
  const dialoogRef = useRef<HTMLDivElement>(null);

  // Elke keer dat het venster opent, de lokale schakelaars weer gelijkzetten aan de echte,
  // opgeslagen voorkeur (niet aan wat er de vorige keer per ongeluk half aangepast was), en de
  // focus naar het venster verplaatsen (toetsenbordtoegankelijkheid).
  useEffect(() => {
    if (settingsOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lokale schakelaars resetten naar de echte voorkeur telkens als het venster opent
      setLokaalStatistics(statistics);
      setLokaalMarketing(marketing);
      dialoogRef.current?.focus();
    }
  }, [settingsOpen, statistics, marketing]);

  useEffect(() => {
    if (!settingsOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeSettings();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [settingsOpen, closeSettings]);

  if (!settingsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-[rgba(19,62,53,0.45)] p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) closeSettings(); }}
    >
      <div
        ref={dialoogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-instellingen-titel"
        className="gijs-card z-[var(--z-dialog)] w-full max-w-[560px] max-h-[85vh] overflow-y-auto !bg-white !shadow-[var(--shadow-4)] flex flex-col gap-5 focus:outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="cookie-instellingen-titel" className="text-[21px] font-bold text-[var(--gijs-donkergroen)]">Cookie-instellingen</h2>
          <IconButton icon="x" label="Sluiten" onClick={closeSettings} />
        </div>

        <p className="text-[15px] text-[var(--grey-800)]">
          Kies hieronder welke cookies Gijs mag gebruiken. Noodzakelijke cookies staan altijd aan: zonder die werkt de website, waaronder de woningscan, niet goed.
        </p>

        <div className="flex flex-col gap-3">
          <Checkbox card checked disabled label="Noodzakelijk" description="Nodig voor de werking van de website, waaronder het technisch functioneren van de woningscan." />
          <Checkbox
            card
            checked={lokaalStatistics}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLokaalStatistics(e.target.checked)}
            label="Statistieken"
            description="Helpen ons begrijpen hoe bezoekers de website gebruiken (bijvoorbeeld via Google Analytics, Microsoft Clarity of Contentsquare), zodat we de website en de digitale woning van Gijs kunnen verbeteren."
          />
          <Checkbox
            card
            checked={lokaalMarketing}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLokaalMarketing(e.target.checked)}
            label="Marketing"
            description="Alleen relevant zodra Gijs in de toekomst advertentietracking gebruikt. Daar is nu nog niets van actief."
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" className="w-full" onClick={() => bewaarVoorkeuren({ statistics: lokaalStatistics, marketing: lokaalMarketing })}>Voorkeuren opslaan</Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" size="lg" className="w-full sm:flex-1" onClick={weigerAlles}>Alles weigeren</Button>
            <Button variant="ghost" size="lg" className="w-full sm:flex-1" onClick={accepteerAlles}>Alles accepteren</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
