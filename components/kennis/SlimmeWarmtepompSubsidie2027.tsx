import Image from "next/image";
import Link from "next/link";
import { ENERGIESCAN_HREF } from "@/lib/seo";
import { TEKSTLINK } from "@/components/regio/regio-template-styles";
import { ArtikelCtaKnop } from "@/components/kennis/ArtikelCtaKnop";
import { ArtikelH2, ArtikelFoto } from "@/components/kennis/ArtikelOpmaak";
import { CONTACT } from "@/lib/content/contact";

// Tekst letterlijk uit "slimme warmtepomp 2027 v1.1" (PDF van Max), alinea-indeling en koppen
// behouden. Alleen de gelinkte woorden uit de PDF zijn links geworden. Bedragen en voorwaarden
// zijn gecontroleerd op https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2027
// (RVO, "gecontroleerd op 12 november 2026"); de wijzigingen voor 2027 zijn daar nog voorgenomen.
export const RVO_ISDE_2027_URL = "https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2027";

const TABEL = [
  { onderdeel: "Basisbedrag", j2026: "€ 1.025", j2027: "€ 1.025" },
  { onderdeel: "Vermogens\u00ADvergoeding per kW", j2026: "€ 225", j2027: "€ 120" },
  { onderdeel: "Bonus energielabel A+++", j2026: "€ 200", j2027: "€ 250" },
  { onderdeel: "Bonus slimme aansturing", j2026: "€ 0", j2027: "€ 200", nadruk: true },
];

/** Eerste alinea uit de PDF; staat op de pagina direct onder de titel, boven de foto. */
export function SlimmeWarmtepompInleiding({ className }: { className?: string }) {
  return (
    <p className={className}>
      Vanaf 2027 wil de overheid slimme warmtepompen extra stimuleren met een subsidiebonus van €200. Dit is goed
      nieuws als je overweegt om je woning te verduurzamen. Een slimme warmtepomp kan namelijk niet alleen helpen om
      minder gas te gebruiken, maar ook helpen om elektriciteit slimmer te benutten. Bijvoorbeeld door rekening te
      houden met de opbrengst van je zonnepanelen of wisselende stroomprijzen. Maar wat maakt een warmtepomp dan
      precies slim, hoeveel subsidie kun je krijgen en wat betekent dit voor jouw woning?
    </p>
  );
}

export function SlimmeWarmtepompSubsidie2027({ slug }: { slug: string }) {
  return (
    <>

      <ArtikelH2 id="extra-subsidie-2027">Vanaf 2027 extra subsidie voor slimme warmtepompen</ArtikelH2>
      <p>
        De overheid stimuleert de aanschaf van warmtepompen via de Investeringssubsidie duurzame energie en
        energiebesparing (ISDE). Hierdoor kunnen woningeigenaren onder verschillende voorwaarden een deel van hun
        investering terugkrijgen. Vanaf 1 januari 2027 wil de overheid de regeling uitbreiden met een eenmalige bonus
        van €200 voor warmtepompen met slimme aansturing. Naast deze nieuwe bonus veranderen ook andere onderdelen van
        de subsidieregeling. Zo stijgt de extra subsidie voor warmtepompen met energielabel A+++, terwijl de vergoeding
        per kilowatt vermogen juist daalt. Hieronder zie je de belangrijkste aangekondigde wijzigingen op een rij.
      </p>

      <figure className="my-8">
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white">
          <table className="w-full border-collapse text-left text-[14px] sm:text-base">
            <caption className="sr-only">ISDE-bedragen voor lucht-waterwarmtepompen: 2026 en 2027 (voorgenomen)</caption>
            <thead className="bg-[var(--surface-tint)] text-[var(--gijs-donkergroen)]">
              <tr>
                <th scope="col" className="px-2.5 py-3 sm:px-5 font-semibold">Onderdeel</th>
                <th scope="col" className="px-2.5 py-3 sm:px-5 font-semibold text-right whitespace-nowrap">2026</th>
                <th scope="col" className="px-2.5 py-3 sm:px-5 font-semibold text-right">
                  2027 <span className="block sm:inline whitespace-nowrap font-normal sm:font-semibold">(voorgenomen)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {TABEL.map(r => (
                <tr key={r.onderdeel} className={"border-t border-[var(--border-default)]" + (r.nadruk ? " font-semibold text-[var(--gijs-donkergroen)]" : "")}>
                  <th scope="row" className={"px-2.5 py-3 sm:px-5 " + (r.nadruk ? "font-semibold" : "font-normal")}>{r.onderdeel}</th>
                  <td className="px-2.5 py-3 sm:px-5 text-right whitespace-nowrap tabular-nums">{r.j2026}</td>
                  <td className="px-2.5 py-3 sm:px-5 text-right whitespace-nowrap tabular-nums">{r.j2027}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <figcaption className="mt-2 text-[13px] italic leading-relaxed text-zinc-500">
          De bedragen voor het basisbedrag en de vermogensvergoeding gelden voor de hier besproken categorie
          lucht-waterwarmtepompen.
        </figcaption>
      </figure>

      <p>
        Door deze veranderingen kan het totale subsidiebedrag per warmtepomp verschillen. Zo krijg je volgens de plannen
        vanaf 2027 €50 meer voor een warmtepomp met energielabel A+++. De vergoeding per kilowatt gaat echter omlaag van
        €225 naar €120. Daar staat tegenover dat je met een geschikte slimme warmtepomp mogelijk €200 extra subsidie
        ontvangt. Hoeveel subsidie je uiteindelijk krijgt, hangt daarom af van het type warmtepomp, het vermogen, het
        energielabel en de mogelijkheden voor slimme aansturing.
      </p>
      <p>
        De Rijksdienst voor Ondernemend Nederland (RVO) geeft bijvoorbeeld een slimme lucht-waterwarmtepomp van 4 kW
        met energielabel A+++ als rekenvoorbeeld. Hiervoor komt de totale subsidie volgens de voorgenomen regels uit
        op <strong>€1.955</strong>. Dit bedrag bestaat uit €1.025 basisbedrag, €480 vermogensvergoeding, €250 voor
        energielabel A+++ en €200 voor slimme aansturing. De wijzigingen zijn op dit moment nog voorgenomen en moeten
        definitief worden vastgelegd.
      </p>
      <p className="text-[15px] italic text-zinc-600">
        Bron:{" "}
        <a href={RVO_ISDE_2027_URL} target="_blank" rel="noopener noreferrer" className={TEKSTLINK}>
          RVO – ISDE: wat wijzigt er vanaf 2027?<span className="sr-only"> (opent in nieuw tabblad)</span>
        </a>.
      </p>

      <ArtikelH2 id="wat-is-een-slimme-warmtepomp">Wat is een slimme warmtepomp en hoe werkt die?</ArtikelH2>
      <p>
        Een warmtepomp gebruikt elektriciteit om warmte uit de omgeving te halen en daarmee je huis te verwarmen. Bij
        een hybride warmtepomp gebeurt dat in samenwerking met je cv-ketel, terwijl een volledig elektrische warmtepomp
        de verwarming helemaal overneemt. Een slimme warmtepomp werkt volgens hetzelfde principe, maar kan daarnaast
        informatie uitwisselen met andere apparaten en systemen in huis. Hierdoor kan de verwarming beter worden
        afgestemd op je energieverbruik en de beschikbare elektriciteit.
      </p>
      <ArtikelFoto src="/images/woningscan/maatregelen/zonnepanelen-dak.jpg" alt="Zonnepanelen op een schuin pannendak tegen een blauwe lucht" />
      <p>
        Heb je bijvoorbeeld{" "}
        <Link href="/maatregelen/zonnepanelen" className={TEKSTLINK}>zonnepanelen</Link>? Dan kan je slimme warmtepomp rekening houden met momenten waarop je zelf veel
        elektriciteit opwekt. Die stroom kan vervolgens worden gebruikt om je woning of warm water op een gunstig moment
        te verwarmen. Daarnaast biedt slimme aansturing mogelijkheden als je een dynamisch energiecontract hebt. Omdat de
        stroomprijzen gedurende de dag veranderen, kan een geschikt systeem een deel van het verwarmingswerk verschuiven
        naar goedkopere momenten. Daardoor kun je de beschikbare elektriciteit beter benutten. Hoeveel je hiermee
        bespaart, hangt echter af van je woning, je energiecontract en de instellingen van de warmtepomp. Daarbij blijft
        een comfortabele temperatuur in huis natuurlijk het belangrijkste.
      </p>

      <ArtikelH2 id="voorwaarden-extra-subsidie">Wanneer kom je in aanmerking voor de extra subsidie?</ArtikelH2>
      <p>
        Om voor de extra subsidiebonus van €200 in aanmerking te komen, moet een warmtepomp aan specifieke technische
        voorwaarden voldoen. Volgens RVO moet het systeem namelijk in twee richtingen kunnen communiceren via EEBus, S2
        of Matter. Dit zijn communicatieprotocollen waarmee apparaten gegevens kunnen versturen én ontvangen. Een
        warmtepomp die je alleen via een app kunt bedienen, voldoet daarom niet automatisch aan deze voorwaarden.
      </p>
      <p>
        Als woningeigenaar hoef je je niet uitgebreid te verdiepen in de techniek achter deze protocollen. Wel is het
        verstandig om bij het vergelijken van warmtepompen niet alleen naar het vermogen en het energielabel te kijken,
        maar ook naar de mogelijkheden voor slimme aansturing. Gijs kan je helpen om verschillende modellen te
        vergelijken en te controleren of deze aan de aangekondigde voorwaarden voldoen. RVO werkt de officiële
        meldcodelijst voor warmtepompen nog bij, waardoor op dit moment niet voor ieder model duidelijk is of het straks
        voor de nieuwe bonus in aanmerking komt. Via de{" "}
        <Link href="/subsidiecheck" className={TEKSTLINK}>subsidiecheck van Gijs</Link> kun je je verder oriënteren op
        de subsidiemogelijkheden voor jouw woning.
      </p>

      <ArtikelH2 id="bestaande-warmtepomp-slimmer-maken">Kun je een bestaande warmtepomp slimmer maken?</ArtikelH2>
      <p>
        Heb je al een warmtepomp? Dan is het in sommige gevallen mogelijk om deze slimmer te maken met aanvullende
        software of een energiemanagementsysteem (EMS). Zo&apos;n systeem houdt het energieverbruik en de opgewekte
        elektriciteit in huis bij. Als je warmtepomp hiervoor geschikt is, kan het EMS helpen om de verwarming beter af
        te stemmen op momenten waarop je zelf stroom opwekt of elektriciteit goedkoper is. Of dit mogelijk is, hangt
        echter af van het merk, het model en de beschikbare aansluitmogelijkheden.
      </p>
      <p>
        Niet iedere warmtepomp ondersteunt dezelfde functies. Het toevoegen van slimme software betekent bovendien niet
        automatisch dat je recht hebt op de nieuwe subsidiebonus van €200. Volgens RVO krijg je deze bonus niet met
        terugwerkende kracht wanneer je warmtepomp pas na een software-update aan de voorwaarden voldoet. Heb je al een
        warmtepomp en wil je meer uit je installatie halen? Laat dan eerst controleren welke mogelijkheden jouw systeem
        biedt.
      </p>

      <ArtikelH2 id="besparing">Hoeveel kun je besparen met een slimme of hybride warmtepomp?</ArtikelH2>
      <p>
        Een warmtepomp is voor veel woningeigenaren interessant omdat deze kan helpen om minder gas te gebruiken. Bij een
        hybride warmtepomp neemt de warmtepomp een deel van de verwarming over van de cv-ketel. Hierdoor gebruik je
        minder gas, maar wel meer elektriciteit. Om een beeld te krijgen van de mogelijke besparing, kun je kijken naar
        je huidige gasverbruik. Stel dat je jaarlijks 1.000 m³ gas gebruikt voor het verwarmen van je woning. Als een
        hybride warmtepomp dat verbruik bijvoorbeeld met 60 procent vermindert, bespaar je in dit rekenvoorbeeld 600 m³
        gas per jaar. Daar staat echter tegenover dat de warmtepomp extra elektriciteit gebruikt. De besparing op je
        energierekening is daardoor niet hetzelfde als de besparing op gas. Hoe groot die uiteindelijk is, hangt onder
        andere af van de isolatie van je huis, je huidige energieverbruik en de energieprijzen. Daarnaast kan slimme
        aansturing helpen om de elektriciteitskosten te beperken, afhankelijk van je situatie.
      </p>
      <p>
        Het is daarbij belangrijk om onderscheid te maken tussen de besparing op je energierekening en de subsidie voor
        de aanschaf. De subsidie verlaagt namelijk je investering, terwijl de uiteindelijke energiebesparing afhangt van
        hoe de warmtepomp in jouw woning presteert. Ook de kosten van een warmtepomp in een bestaande woning verschillen
        per situatie. Maar hoeveel levert een warmtepomp dan daadwerkelijk op voor jouw woning? Gijs helpt je om dit
        inzichtelijk te maken. We kijken naar je huidige energieverbruik, de isolatie van je woning en de mogelijkheden
        voor verschillende verduurzamingsmaatregelen. Op basis daarvan kunnen we de verwachte besparing, de
        aanschafkosten en de beschikbare subsidies in kaart brengen. Zo krijg je niet alleen inzicht in wat een
        warmtepomp kan opleveren, maar ook of dit op dit moment de verstandigste investering is. Op de pagina over{" "}
        <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepompen van Gijs</Link> lees je meer over de
        verschillende mogelijkheden.
      </p>

      <ArtikelH2 id="welke-warmtepomp-past">Welke warmtepomp past bij jouw woning?</ArtikelH2>
      <p>
        Welke warmtepomp het beste bij je past, hangt vooral af van je woning en je huidige verwarmingssysteem. Heb je
        bijvoorbeeld nog een cv-ketel en wil je minder gas gebruiken? Dan kan een hybride warmtepomp een goede stap
        zijn. Wil je juist volledig elektrisch verwarmen? Dan is het belangrijk dat je woning en verwarmingssysteem
        daarvoor geschikt zijn. Daarnaast speelt de isolatie van je woning een belangrijke rol. Een goed geïsoleerde
        woning verliest namelijk minder warmte, waardoor je efficiënter kunt verwarmen.
      </p>
      <ArtikelFoto src="/images/over-gijs/hero/duurzame-wijk.png" alt="Rij Nederlandse woningen met zonnepanelen aan het water" />
      <p>
        Maar is een warmtepomp op dit moment wel de beste investering voor jouw woning? Misschien levert het isoleren
        van je <Link href="/maatregelen/spouwmuurisolatie" className={TEKSTLINK}>spouwmuur</Link> of{" "}
        <Link href="/maatregelen/dakisolatie" className={TEKSTLINK}>dak</Link> op dit moment wel meer op. Gijs kijkt daarom als onafhankelijke
        verduurzamingsspecialist naar je hele woning. We zijn niet gebonden aan één merk of maatregel, maar onderzoeken
        welke verbeteringen voor jouw situatie het meeste verschil kunnen maken. Met een energiescan brengen we de
        mogelijkheden voor verduurzaming in kaart. Hierdoor krijg je inzicht in welke verbeteringen bij jouw woning
        passen en in welke volgorde je deze het beste kunt uitvoeren. Zo voorkom je dat je direct investeert in een
        warmtepomp, terwijl een andere maatregel mogelijk een betere eerste stap is.
      </p>
      <p className="font-semibold text-[var(--gijs-donkergroen)]">
        Bovendien ben je bij Gijs niet alleen aan het juiste adres voor advies. We helpen je ook bij het regelen en
        uitvoeren van de passende maatregelen. Zo heb je één vertrouwd aanspreekpunt dat je van A tot Z ontzorgt.
      </p>

      {/* Afsluitende CTA: donkergroen Gijs-blok met het witte logo, zoals de footer. Bewust geen
          adviseur erbij: het artikel komt van Gijs zelf. */}
      <aside aria-label="Contact met Gijs" className="mt-12 rounded-[var(--radius-xl)] bg-[var(--gijs-donkergroen)] px-6 py-9 sm:px-10 sm:py-11 text-white">
        <Image src="/images/shared/logo/logo-white.png" alt="Gijs" width={912} height={520} className="h-auto w-[84px] sm:w-[96px]" />
        <p className="!mt-6 !mb-0 font-bold tracking-[-0.02em] text-white text-[clamp(1.25rem,1.05rem+0.6vw,1.625rem)] leading-[1.3] [text-wrap:balance]">
          Benieuwd welke maatregelen voor jouw woning het meeste opleveren? Neem contact op en ontdek samen met ons
          waar je het beste kunt beginnen.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <ArtikelCtaKnop artikel={slug} href={ENERGIESCAN_HREF} variant="inverse" size="lg" iconRight="arrow-right" className="w-full sm:w-auto justify-center !whitespace-normal !h-auto min-h-[52px] py-3 text-center">
            Vraag een gratis energiescan aan
          </ArtikelCtaKnop>
          <p className="!m-0 text-[16px] text-white/85">
            of bel{" "}
            <a href={CONTACT.phoneHref} className="font-semibold text-white underline underline-offset-[3px] decoration-white/40 hover:decoration-white">{CONTACT.phone}</a>
          </p>
        </div>
        <p className="!mt-4 !mb-0 text-[15px] text-white/75">De energiescan aan huis is gratis en vrijblijvend, ter waarde van €349.</p>
      </aside>
    </>
  );
}
