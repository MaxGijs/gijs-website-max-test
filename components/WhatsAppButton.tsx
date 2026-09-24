"use client";

import { WHATSAPP_NUMMER } from "@/lib/content/contact";

// Zwevende contactknop rechtsonder (sectie "WhatsApp" van de opdracht).
// Regel van Max: nooit een verzonnen WhatsApp-nummer. Zolang
// lib/content/contact.ts leeg is, opent deze knop daarom de bestaande
// contactpagina (met het WhatsApp-icoon als herkenbare visuele hint dat
// WhatsApp een van de kanalen is) in plaats van een wa.me-link met een
// nummer dat niet bestaat. Zodra Gijs een echt zakelijknummer aanlevert,
// schakelt dit component vanzelf over op een echte WhatsApp-chat.
//
// Het WhatsApp-logo hieronder is een losse, ingesloten SVG (geen nieuwe
// dependency): het Lucide-icoonpakket dat de rest van de site gebruikt
// (zie components/ds/core/Icon.jsx) bevat bewust geen merklogo's.
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.362.101 11.945c0 2.105.549 4.16 1.595 5.972L0 24l6.335-1.652a11.95 11.95 0 0 0 5.71 1.454h.005c6.585 0 11.946-5.362 11.949-11.945a11.86 11.86 0 0 0-3.479-8.408" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const heeftEchtNummer = Boolean(WHATSAPP_NUMMER);
  const href = heeftEchtNummer ? `https://wa.me/${WHATSAPP_NUMMER}` : "/contact";

  return (
    <a
      href={href}
      target={heeftEchtNummer ? "_blank" : undefined}
      rel={heeftEchtNummer ? "noopener noreferrer" : undefined}
      aria-label={heeftEchtNummer ? "Stel je vraag via WhatsApp" : "Stel je vraag aan Gijs"}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 h-11 md:h-12 pl-3.5 pr-4 md:pl-4 md:pr-5 rounded-[var(--radius-pill)] bg-[#25D366] text-white font-semibold text-[13px] md:text-sm shadow-[var(--shadow-3)] no-underline"
    >
      <WhatsAppIcon />
      Stel je vraag
    </a>
  );
}
