import Script from "next/script";

// Zet de Google Consent Mode v2-standaard (alles "denied") zo vroeg mogelijk,
// vóór enige Next.js-code draait (strategy="beforeInteractive" injecteert dit
// in de initiële HTML en voert het uit vóórdat de pagina interactief wordt) —
// dit voorkomt dat trackers tijdens het allereerste laden per ongeluk
// toestemming "aannemen". ConsentProvider stuurt vlak daarna de echte
// (opgeslagen of zojuist gekozen) voorkeur door via consent "update"
// (lib/consent/consentMode.ts). Draait altijd, ook zonder GTM-container-id:
// het definieert alleen window.dataLayer en een consent-standaard, dat is op
// zichzelf onschadelijk en vereist geen toestemming.
export function ConsentDefaultScript() {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- deze regel dateert van vóór de App Router: Next.js' eigen documentatie staat beforeInteractive in app/layout.tsx (de root layout) expliciet toe.
    <Script id="consent-mode-default" strategy="beforeInteractive">
      {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
    </Script>
  );
}
