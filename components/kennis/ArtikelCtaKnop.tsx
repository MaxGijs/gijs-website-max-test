"use client";

import { Button, type ButtonProps } from "@/components/ds/core/Button";
import { track } from "@/lib/analytics";

/**
 * Afsluitende CTA-knop van een kennisartikel. Eén klik = één eigen event
 * `kennis_artikel_cta_clicked` (met artikel-slug en bestemming), zodat in GA4 te zien is hoeveel
 * bezoekers vanuit welk artikel doorklikken. Gaat de knop naar WhatsApp, dan telt hij daarnaast,
 * net als elke andere energiescanknop op de site, mee in `whatsapp_clicked` (plaats
 * "kennisartikel"), zodat dat sitebrede totaal klopt. Geen `lead_created`: dat event is alleen
 * voor een daadwerkelijk aangemaakte lead.
 */
export function ArtikelCtaKnop({ artikel, href, ...props }: ButtonProps & { artikel: string; href: string }) {
  const bestemming = href.startsWith("https://wa.me/") ? "whatsapp" : href;
  return (
    <Button
      {...props}
      href={href}
      onClick={() => {
        track({ name: "kennis_artikel_cta_clicked", artikel, bestemming });
        if (bestemming === "whatsapp") track({ name: "whatsapp_clicked", plaats: "kennisartikel" });
      }}
    />
  );
}
