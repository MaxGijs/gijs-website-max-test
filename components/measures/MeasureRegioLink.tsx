import Link from "next/link";
import { Icon } from "@/components/ds/core/Icon";

// Isolatie-maatregelpagina's linkten nergens terug naar de regiopagina's,
// terwijl de regiopagina's wel naar deze 5 isolatiemaatregelen linken
// (components/regio/RegioBlokken.tsx). Dit maakt die link wederzijds.
export function MeasureRegioLink() {
  return (
    <p className="text-sm text-zinc-600 mt-8">
      Benieuwd of Gijs ook in jouw gemeente actief is?{" "}
      <Link href="/regio" className="font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] no-underline inline-flex items-center gap-1">
        Bekijk isoleren per regio <Icon name="arrow-right" size="sm" />
      </Link>
    </p>
  );
}
