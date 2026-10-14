"use client";

import Script from "next/script";
import { useConsent } from "./ConsentProvider";

// Container-ID instellen via de environment variable NEXT_PUBLIC_GTM_ID
// (Vercel-projectinstellingen of .env.local) — zonder die variabele laadt
// deze component niets, ook niet als er toestemming is. GTM zelf laadt pas
// zodra er toestemming is voor minstens één van de twee optionele
// categorieën: dat is strenger dan strikt noodzakelijk (losse Google-tags
// respecteren Consent Mode zelf al), maar maakt in de Network-tab meteen
// zichtbaar dat er vóór toestemming niets wordt opgehaald. Tags binnen GTM
// die zelf ook toestemming vereisen (bv. niet-Google-tags) moeten in GTM
// bovendien met een eigen consent-trigger worden ingesteld.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

export function GtmLoader() {
  const { statistics, marketing } = useConsent();
  if (!GTM_ID || (!statistics && !marketing)) return null;
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
