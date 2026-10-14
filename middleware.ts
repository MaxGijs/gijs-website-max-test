import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Alleen deze twee hosts zijn het officiële, publieke domein van Gijs. Vercel's eigen
// *.vercel.app-aliassen (de automatische productie-alias, de "-thom-1865s-projects"-variant, elke
// git-branch-preview) blijven net zo publiek bereikbaar als nu — dat is Vercel's eigen, bewuste
// gedrag (Standard/SSO Protection beschermt de productie-alias bewust niet, deploymentType
// "all_except_custom_domains") — maar krijgen hier een expliciete "X-Robots-Tag: noindex", zodat ze
// nooit door Google geïndexeerd worden. SEO_INDEXABLE (lib/seo.ts) is een site-brede vlag die geen
// onderscheid maakt tussen domeinen; deze header is de hostafhankelijke aanvulling daarop. Zie
// Vercel's eigen advies: https://vercel.com/guides/avoiding-duplicate-content-with-vercel-app-urls
const OFFICIELE_HOSTS = new Set(["groeninjestraat.nl", "www.groeninjestraat.nl"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const response = NextResponse.next();
  if (!OFFICIELE_HOSTS.has(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
