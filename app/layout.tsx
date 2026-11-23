import type { Metadata } from "next";
import { SITE_URL, SEO_INDEXABLE, GOOGLE_SITE_VERIFICATION } from "@/lib/seo";
import SeoSchema from "@/components/SeoSchema";
import localFont from "next/font/local";
import "./globals.css";
import { WoningDraftProvider } from "@/components/woning/WoningDraftProvider";
import { ConsentDefaultScript } from "@/components/consent/ConsentDefaultScript";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { CookieSettingsModal } from "@/components/consent/CookieSettingsModal";
import { GtmLoader } from "@/components/consent/GtmLoader";
import { ClarityLoader } from "@/components/consent/ClarityLoader";
import { ContentsquareLoader } from "@/components/consent/ContentsquareLoader";
import { VercelAnalyticsLoader } from "@/components/consent/VercelAnalyticsLoader";
import { PageViewTracker } from "@/components/consent/PageViewTracker";
import { PhoneClickTracker } from "@/components/analytics/PhoneClickTracker";

// Zelf-gehost via next/font/local (19-11-2026): next/font/google met Turbopack gaf hier altijd een
// 500 ("next/font/google queries have exactly one entry"). Oorzaak: Google Fonts serveert Open Sans
// aan moderne browsers nu als één variabel lettertypebestand (alle gewichten in één bestand via de
// wght-as), terwijl deze Next.js-versie (16.3.4) per gewicht nog een eigen bestand verwacht — dat
// mismatch laat de Turbopack-fontplugin crashen, los van cache, netwerk of een foutief pakket.
// Omzeild door het bestand zelf te downloaden en lokaal in te laden; dat kende de site al als doel
// ("geen externe fontrequest nodig tijdens runtime"), nu ook zonder het Google-build-time-verzoek.
// Bestand: variabele latin-subset van Open Sans v44 (fonts.gstatic.com), wght-as 300–800, dus 400/600/
// 700 (de enige gebruikte gewichten) zitten er ruim in. Blootgesteld als CSS-variabele --font-open-sans,
// die globals.css gebruikt voor --font-core (GIJS Design System-token).
const openSans = localFont({
  src: "./fonts/open-sans-variable.woff2",
  weight: "300 800",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: { index: SEO_INDEXABLE, follow: true },
  title: "Gijs | Groen in je straat",
  description: "Woning verduurzamen met gratis en vrijblijvend persoonlijk advies van Gijs.",
  // Alleen gevuld als NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is ingesteld (zie lib/seo.ts) — anders
  // rendert Next.js hier simpelweg niets, precies zoals voorheen.
  ...(GOOGLE_SITE_VERIFICATION && { verification: { google: GOOGLE_SITE_VERIFICATION } }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${openSans.variable} antialiased`}>
        <ConsentDefaultScript />
        <ConsentProvider>
          <SeoSchema/>
          <WoningDraftProvider>{children}</WoningDraftProvider>
          <CookieBanner />
          <CookieSettingsModal />
          <GtmLoader />
          <ClarityLoader />
          <ContentsquareLoader />
          <VercelAnalyticsLoader />
          <PageViewTracker />
          <PhoneClickTracker />
        </ConsentProvider>
      </body>
    </html>
  );
}
