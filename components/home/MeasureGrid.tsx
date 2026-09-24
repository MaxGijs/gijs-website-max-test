import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ds/core/Card";
import { MAATREGELEN } from "@/lib/content/maatregelen";

// Maatregelensectie voor de homepage (sectie "Maatregelensectie" van de
// opdracht). Titel + korte inleiding + precies de zes maatregelkaarten
// (3 kolommen op desktop) — het losse overzichtsbeeld dat hier eerder
// boven de kaarten stond, is op verzoek van Max verwijderd.
// Kaartafbeeldingen zijn uitgesneden uit het aangeleverde 6-vaks
// overzicht, met de bijschriften die letterlijk op dat beeld stonden —
// geen technische claim of besparingscijfer toegevoegd die niet al op
// het beeld of in de Productbriefing stond. Geen los pictogram
// bovenop de foto's: elke tegel had al een eigen icoon + bijschrift
// ingebakken.
export default function MeasureGrid() {
  const order = ["Zonnepanelen", "Warmtepomp", "Dakisolatie", "Spouwisolatie", "Vloerisolatie", "Glas en kozijnen"];
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-[var(--section-y)]">
        <div className="max-w-2xl mb-8">
          <h2 className="text-[var(--fs-display-2)] font-bold text-[var(--gijs-donkergroen)] mb-3">
            Maatregelen voor jouw woning
          </h2>
          <p className="text-zinc-600">
            Isolatie helpt warmte binnen te houden. Installaties kunnen je
            helpen zelf stroom op te wekken of anders te verwarmen. Ontdek
            deze zes mogelijkheden voor je woning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...MAATREGELEN].sort((a, b) => order.indexOf(a.titel) - order.indexOf(b.titel)).map((m) => (
            <Card key={m.titel} variant="default" flush as="article">
              <div className="relative aspect-[4/3]">
                <Image
                  src={m.afbeelding}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[var(--gijs-donkergroen)] mb-1">
                  {m.titel}
                </h3>
                <p className="text-sm text-zinc-600">{m.beschrijving}</p>
                <Link className="inline-block mt-4 font-semibold" href={order.indexOf(m.titel) < 2 ? `/installaties#${order.indexOf(m.titel) === 0 ? "zonnepanelen" : "warmtepomp"}` : `/isolatie#${["", "", "dakisolatie", "spouwisolatie", "vloerisolatie", "glas-en-kozijnen"][order.indexOf(m.titel)]}`}>Ontdek {m.titel.toLowerCase()} →</Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
