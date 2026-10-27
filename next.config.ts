import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Build verification must never replace files used by the running local server.
export default function nextConfig(phase: string): NextConfig {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-local" : ".next",
    images: {
      // Next 16 alleen toestaat wat hier expliciet staat. 75 is de default;
      // 100 wordt gebruikt voor diagrammen/uitlegbeelden met tekst en dunne
      // lijnen, waar de standaard WebP/AVIF-compressie (kwaliteit 75)
      // zichtbaar zachtere randen geeft dan de originele PNG.
      qualities: [75, 100],
    },
    async redirects() {
      return [
        // /home bestond op de oude site; Google had het geïndexeerd. 301 zodat Google
        // stopt met crawlen en de canonical-duplicate in GSC verdwijnt.
        { source: "/home", destination: "/", permanent: true },
        { source: "/installatie", destination: "/maatregelen#installaties", permanent: true },
        { source: "/installatie/", destination: "/maatregelen#installaties", permanent: true },
        // Hernoemd voor duidelijkere, SEO-vriendelijkere URL (bevatte niet
        // het woord "muur"). 301 zodat bestaande links/bookmarks blijven werken.
        { source: "/maatregelen/spouwisolatie", destination: "/maatregelen/spouwmuurisolatie", permanent: true },
        { source: "/warmtepompen", destination: "/maatregelen/warmtepomp", permanent: true },
        // Oude URL's van de vorige site die Google nog toont (Search Console, 90 dagen).
        // Trailing-slash varianten apart toegevoegd (GSC zag dubbele hop).
        { source: "/spouwmuurisolatie", destination: "/maatregelen/spouwmuurisolatie", permanent: true },
        { source: "/spouwmuurisolatie/", destination: "/maatregelen/spouwmuurisolatie", permanent: true },
        { source: "/thuisbatterij", destination: "/maatregelen/thuisbatterij", permanent: true },
        { source: "/kozijnen", destination: "/maatregelen/kozijnen", permanent: true },
        // Vloerisolatiepagina legt het verschil met bodemisolatie uit.
        { source: "/bodemisolatie", destination: "/maatregelen/vloerisolatie", permanent: true },
        // Verscheen alleen op de merkzoekopdracht "gijs groen in je straat".
        { source: "/plans-pricing", destination: "/", permanent: true },
        // Juridische documenten: 301 (permanent) zodat Google /avg-verklaring niet
        // blijft crawlen als "pagina met omleiding". Als de bestandsnaam ooit wijzigt,
        // update dan ook de destination hier.
        { source: "/algemene-voorwaarden", destination: "/documenten/algemene-voorwaarden-gijs.pdf", permanent: true },
        { source: "/avg-verklaring", destination: "/documenten/avg-verklaring-gijs.pdf", permanent: true },
      ];
    },
    async headers() {
      // Bewust geen Content-Security-Policy hier: de site laadt scripts/beelden
      // van meerdere externe bronnen (Google Places/Street View, Supabase,
      // Resend, PDOK/BAG/EP-Online via de server, lettertypen) en een te
      // strenge CSP zou Next.js/Three.js of die koppelingen kunnen breken
      // zonder eerst een volledige inventarisatie van alle bronnen.
      return [
        {
          source: "/:path*",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          ],
        },
      ];
    },
  };
}
