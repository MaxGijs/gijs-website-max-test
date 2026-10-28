"use client";

import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { opslaanRegioHerkomst } from "@/lib/regio-source";
import { Button } from "@/components/ds/core/Button";

// Vervangt de statische <Button href="/woning"> op regio-pagina's.
// Slaat de regioherkomst op in sessionStorage vóór de navigatie, zodat WoningFlow
// de params kan meesturen met woningscan_started, woningscan_completed en lead_created.
// Verstuurt ook region_to_scan als GTM-event op het moment van de klik.
export function RegioWoningscanKnop({
  provincie,
  gemeente,
  plaats,
  variant = "accent",
  className,
}: {
  provincie: string;
  gemeente: string;
  plaats?: string;
  variant?: "accent" | "secondary" | "primary";
  className?: string;
}) {
  const router = useRouter();

  function handleKlik() {
    const pagina = plaats
      ? `/regio/${provincie}/${gemeente}/${plaats}`
      : `/regio/${provincie}/${gemeente}`;

    const herkomst = {
      source_region_page: pagina,
      source_province: provincie,
      source_municipality: gemeente,
    };

    opslaanRegioHerkomst(herkomst);
    track({ name: "region_to_scan", ...herkomst });
    router.push("/woning");
  }

  return (
    <Button
      variant={variant}
      size="lg"
      iconRight="arrow-right"
      className={className}
      onClick={handleKlik}
    >
      Start de woningscan
    </Button>
  );
}

// Provincie-variant: geen gemeente bekend; slaat alleen provincie op.
export function RegioProvincieWoningscanKnop({
  provincie,
  className,
}: {
  provincie: string;
  className?: string;
}) {
  const router = useRouter();

  function handleKlik() {
    const herkomst = {
      source_region_page: `/regio/${provincie}`,
      source_province: provincie,
      source_municipality: "",
    };

    opslaanRegioHerkomst(herkomst);
    track({ name: "region_to_scan", ...herkomst });
    router.push("/woning");
  }

  return (
    <Button
      variant="accent"
      size="lg"
      iconRight="arrow-right"
      className={className}
      onClick={handleKlik}
    >
      Start de woningscan
    </Button>
  );
}
