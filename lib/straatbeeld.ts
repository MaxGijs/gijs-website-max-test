// Foto/straatbeeld van het adres (Google Street View), via onze eigen
// server-route app/api/straatbeeld/route.ts. Die haalt het beeld op met de
// Google-serversleutel, zodat die nooit in de browser komt. Is er geen sleutel
// of geen straatbeeld voor dit adres, dan antwoordt de route met 404 en toont
// Woningbeeld de placeholder. Zie docs/straatbeeld.md.

/** URL van de foto van dit adres, of null zonder adres. */
export function straatbeeldUrl(adres: string): string | null {
  const schoon = adres.trim();
  return schoon ? `/api/straatbeeld?adres=${encodeURIComponent(schoon)}` : null;
}
