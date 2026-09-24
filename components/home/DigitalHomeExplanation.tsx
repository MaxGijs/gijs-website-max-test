import { Stepper } from "@/components/ds/navigation/Stepper";
import { Button } from "@/components/ds/core/Button";

// Uitlegsectie voor de "Digitale Gijs-woning" zelf (sectie "Digitale
// woningroute" van de opdracht) — dit is een ander blok dan "Zo werkt
// Gijs" (dat over het hele Gijs-traject gaat, van scan tot uitvoering)
// en legt specifiek de vijf stappen van de online tool uit. De
// staplabels zijn dezelfde als in de daadwerkelijke flow op /woning
// (zie components/woning/WoningFlow.tsx), zodat verwachting en
// werkelijkheid overeenkomen.
const STAPPEN = [
  "Woning bevestigen",
  "Mijn woning",
  "Mogelijkheden",
  "Mijn woningplan",
  "Energiescan",
];

export default function DigitalHomeExplanation() {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-6 py-[var(--section-y)] flex flex-col items-center text-center gap-6">
        <h2 className="text-[var(--fs-display-2)] font-bold text-[var(--gijs-donkergroen)]">
          Jouw woning, digitaal in kaart
        </h2>
        <p className="max-w-2xl text-zinc-600">
          Met postcode en huisnummer bouw je een persoonlijke woningomgeving
          op. Daarin bekijk je de mogelijkheden voor jouw woning en stel je
          een eigen woningplan samen, als voorbereiding op een gesprek met
          Gijs.
        </p>

        <div className="w-full max-w-3xl overflow-x-auto py-2">
          <Stepper steps={STAPPEN} current={0} />
        </div>

        <Button href="/woning" variant="accent" size="lg" iconRight="arrow-right">
          Start de woningscan
        </Button>
      </div>
    </section>
  );
}
