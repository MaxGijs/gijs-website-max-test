// Korte uitleg van de merknaam (op verzoek van Max: "ergens uitleggen
// dat Gijs voor Groen in je straat staat"). De naam zelf staat al in
// de huisstijl/Design System als "Gijs | Groen in je straat" — dit
// zet die bestaande naamstijl in een zin, zonder een nieuwe missie,
// belofte of proces te verzinnen die niet al ergens anders in het
// prototype staat.
export default function AboutName() {
  return (
    <section className="bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)] mb-2">
          Onze naam
        </p>
        <h2 className="text-[var(--fs-500)] font-bold text-[var(--gijs-donkergroen)] mb-2">
          Gijs staat voor Groen in je straat
        </h2>
        <p className="text-zinc-600">
          Verduurzamen, huis voor huis: dat is waar de naam vandaan komt.
        </p>
      </div>
    </section>
  );
}
