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
        { source: "/installatie", destination: "/maatregelen#installaties", permanent: true },
        // Hernoemd voor duidelijkere, SEO-vriendelijkere URL (bevatte niet
        // het woord "muur"). 301 zodat bestaande links/bookmarks blijven werken.
        { source: "/maatregelen/spouwisolatie", destination: "/maatregelen/spouwmuurisolatie", permanent: true },
      ];
    },
  };
}
