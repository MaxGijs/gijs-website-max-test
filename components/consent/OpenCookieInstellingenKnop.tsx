"use client";

import { Button } from "@/components/ds/core/Button";
import { useConsent } from "./ConsentProvider";

/** Voor op de /cookies-pagina: opent hetzelfde instellingenvenster als de banner en de footer. */
export function OpenCookieInstellingenKnop() {
  const { openSettings } = useConsent();
  return <Button variant="primary" size="lg" onClick={openSettings}>Cookie-instellingen openen</Button>;
}
