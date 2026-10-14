"use client";

import { useConsent } from "./ConsentProvider";

/** Opent het cookie-instellingenvenster opnieuw — voor in de footer, naast de (statische) /cookies-informatiepagina. */
export function CookieSettingsLink() {
  const { openSettings } = useConsent();
  return (
    <button type="button" onClick={openSettings} className="no-underline hover:text-white text-left">
      Cookie-instellingen
    </button>
  );
}
