import type { Metadata } from "next";
import { SITE_URL, SEO_INDEXABLE } from "@/lib/seo";
import SeoSchema from "@/components/SeoSchema";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { WoningDraftProvider } from "@/components/woning/WoningDraftProvider";
import { ConsentDefaultScript } from "@/components/consent/ConsentDefaultScript";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { CookieSettingsModal } from "@/components/consent/CookieSettingsModal";
import { GtmLoader } from "@/components/consent/GtmLoader";
import { ClarityLoader } from "@/components/consent/ClarityLoader";
import { ContentsquareLoader } from "@/components/consent/ContentsquareLoader";

// Zelf-gehost via next/font (geen externe fontrequest nodig tijdens
// runtime). Blootgesteld als CSS-variabele --font-open-sans, die
// globals.css gebruikt voor --font-core (GIJS Design System-token).
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: { index: SEO_INDEXABLE, follow: true },
  title: "Gijs | Groen in je straat",
  description: "Verduurzaam je woning, stap voor stap.",
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
        </ConsentProvider>
      </body>
    </html>
  );
}
