import type { Metadata } from "next";
import { SITE_URL, SEO_INDEXABLE } from "@/lib/seo";
import SeoSchema from "@/components/SeoSchema";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { WoningDraftProvider } from "@/components/woning/WoningDraftProvider";

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
      <body className={`${openSans.variable} antialiased`}><SeoSchema/><WoningDraftProvider>{children}</WoningDraftProvider></body>
    </html>
  );
}
