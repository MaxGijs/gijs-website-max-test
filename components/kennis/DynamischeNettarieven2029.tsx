import Link from "next/link";
import type { ReactNode } from "react";
import { TEKSTLINK } from "@/components/regio/regio-template-styles";
import { ArtikelCta } from "@/components/kennis/ArtikelCta";
import { ArtikelH2, ExterneLink } from "@/components/kennis/ArtikelOpmaak";
import { NettariefGrafiek } from "@/components/kennis/NettariefGrafiek";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";

const FAQ: FAQItem[] = [
  {
    question: "Zijn dynamische nettarieven vanaf 2029 definitief?",
    answer:
      "Nee, het gaat op dit moment nog om een voorstel. De ACM verwacht begin 2027 een definitief besluit te nemen. De beoogde invoeringsdatum voor huishoudens is 1 januari 2029.",
  },
  {
    question: "Kan ik dynamische nettarieven vermijden met een vast energiecontract?",
    answer:
      "Nee, bij invoering gelden de nieuwe nettarieven ook wanneer je een vast energiecontract hebt. De transportkosten staan los van de leveringsprijs die je met jouw energieleverancier hebt afgesproken.",
  },
  {
    question: "Is elektriciteit in de zomer tussen 10.00 en 17.00 uur straks gratis?",
    answer:
      "Nee. In het huidige rekenvoorbeeld van de ACM bedraagt het variabele transporttarief tijdens deze uren nul euro per kWh. Je betaalt nog steeds voor de geleverde elektriciteit, belastingen en overige vaste kosten. Bovendien zijn de uiteindelijke tarieven voor 2029 nog niet bekend.",
  },
];

/** Responsieve tabel: scrolt horizontaal op smalle schermen. `rechts` = kolommen met bedragen. */
function Tabel({ kop, rijen, rechts = [], minBreedte = 480 }: { kop: ReactNode[]; rijen: ReactNode[][]; rechts?: number[]; minBreedte?: number }) {
  const uitlijning = (i: number) => (rechts.includes(i) ? "text-right tabular-nums" : "text-left");
  return (
    <div className="-mx-1 my-6 overflow-x-auto">
      <table className="w-full border-collapse text-[15px] leading-[1.55]" style={{ minWidth: minBreedte }}>
        <thead>
          <tr className="bg-[var(--gijs-donkergroen)] text-white">
            {kop.map((k, i) => (
              <th key={i} className={`px-4 py-3 font-semibold ${uitlijning(i)} ${i === 0 ? "rounded-tl-lg" : ""} ${i === kop.length - 1 ? "rounded-tr-lg" : ""}`}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rijen.map((rij, r) => (
            <tr key={r} className={r % 2 === 0 ? "bg-[var(--gijs-lichtgroen,#f0f5f0)]" : "bg-white"}>
              {rij.map((cel, i) => (
                <td key={i} className={`border-t border-black/[0.06] px-4 py-3 align-top ${uitlijning(i)}`}>{cel}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Noot = ({ children }: { children: ReactNode }) => <p className="!mb-6 text-[14px] italic leading-relaxed text-zinc-500">{children}</p>;
const Tussenkop = ({ children }: { children: ReactNode }) => <p className="!mb-0 mt-6 font-semibold text-[var(--gijs-donkergroen)]">{children}</p>;

/** Inleiding boven de hero-foto. */
export function DynamischeNettarievenInleiding({ className }: { className?: string }) {
  return (
    <>
      <p className={className}>
        Laad je jouw elektrische auto op zodra je thuiskomt, verwarm je jouw woning met een warmtepomp of zet je
        &apos;s avonds de wasmachine aan? Vanaf 2029 kan het moment waarop je elektriciteit gebruikt invloed hebben op
        je energierekening. Volgens het voorstel voor dynamische nettarieven ga je op drukke momenten meer betalen voor
        het gebruik van het elektriciteitsnet dan op rustige momenten.
      </p>
      <p className={className}>
        Vooral wanneer je jouw woning elektrisch verwarmt of thuis een elektrische auto oplaadt, kan dit financiële
        gevolgen hebben. Gelukkig kun je hier zelf invloed op uitoefenen, zonder dat je daarvoor meteen grote
        investeringen hoeft te doen. Maar wat verandert er precies, wanneer ga je meer betalen en waar moet je rekening
        mee houden als je jouw woning wilt verduurzamen? In dit artikel leggen we uit wat je kunt verwachten en hoe je
        hierop kunt inspelen.
      </p>
    </>
  );
}

export function DynamischeNettarieven2029({ slug }: { slug: string }) {
  return (
    <>
      <ArtikelH2 id="wat-zijn-dynamische-nettarieven">Wat zijn dynamische nettarieven?</ArtikelH2>
      <p>
        Wanneer je jouw energierekening erbij pakt, zie je dat je niet alleen betaalt voor de elektriciteit die je
        verbruikt. Je betaalt ook voor het transport van die elektriciteit, het gebruik van je aansluiting en je
        elektriciteitsmeter. Met deze inkomsten onderhouden netbeheerders het elektriciteitsnet en investeren zij in de
        uitbreiding ervan.
      </p>
      <p>
        Op dit moment betaal je voor het transport van elektriciteit een vast bedrag dat afhankelijk is van de
        capaciteit van je aansluiting. Wanneer jij en je buren bij dezelfde netbeheerder dezelfde aansluiting hebben,
        betalen jullie hetzelfde transporttarief. Het maakt daarbij niet uit of je jaarlijks 2.000 of 6.000 kWh
        elektriciteit van het net afneemt.
      </p>
      <p>
        Op 8 oktober 2026 publiceerde de{" "}
        <ExterneLink href="https://www.acm.nl/nl/publicaties/acm-publiceert-voorstel-voor-tijdsafhankelijke-nettarieven-voor-huishoudens-die-ruimte-op-het-elektriciteitsnet-moeten-vergroten">
          Autoriteit Consument &amp; Markt (ACM) een voorstel
        </ExterneLink>{" "}
        om dit vanaf 1 januari 2029 te veranderen. Gemiddeld blijft een derde van het transporttarief afhankelijk van
        je aansluiting. Het overige deel wordt afhankelijk van hoeveel elektriciteit je van het net afneemt en wanneer
        je dit doet.
      </p>
      <p>
        Officieel noemt de ACM dit volume- en tijdsafhankelijke nettarieven. Het gaat op dit moment nog om een voorstel,
        waarover begin 2027 een definitief besluit wordt verwacht.
      </p>

      <ArtikelH2 id="waarom-veranderen-de-nettarieven">Waarom veranderen de nettarieven?</ArtikelH2>
      <p>
        Steeds meer huishoudens stappen over op elektrisch verwarmen, elektrisch rijden en koken op inductie.
        Tegelijkertijd gebruiken veel huishoudens op ongeveer dezelfde momenten elektriciteit. Denk bijvoorbeeld aan
        het einde van de middag, wanneer mensen thuiskomen, beginnen met koken, hun woning verwarmen en hun elektrische
        auto opladen.
      </p>
      <p>
        Op andere momenten is er meer ruimte beschikbaar op het elektriciteitsnet. Door elektriciteit afnemen op die
        momenten goedkoper te maken, willen de netbeheerders ervoor zorgen dat huishoudens hun verbruik beter
        verspreiden. Hierdoor kan het bestaande elektriciteitsnet beter worden benut en zijn op termijn mogelijk minder
        kostbare uitbreidingen nodig.
      </p>
      <p>
        Voor jou als woningeigenaar betekent dit dat je naast het verminderen van je energieverbruik ook financieel
        voordeel kunt behalen door het moment waarop je elektriciteit gebruikt aan te passen.
      </p>

      <ArtikelH2 id="meer-of-minder-betalen">Op welke momenten ga je meer of minder betalen?</ArtikelH2>
      <p>
        Het elektriciteitsnet wordt in de winter op andere momenten belast dan in de zomer. In de winter wordt er meer
        elektriciteit gebruikt voor het verwarmen van woningen, terwijl zonnepanelen in de zomer overdag veel
        elektriciteit kunnen opwekken. Daarom maakt de ACM in het voorstel onderscheid tussen verschillende tijdsblokken
        per seizoen.
      </p>
      <NettariefGrafiek />
      <p>
        Onderstaande tabellen laten zien hoe deze tijdsblokken eruitzien volgens de{" "}
        <ExterneLink href="https://www.acm.nl/nl/publicaties/uitleg-bij-ontwerp-codebesluit-volume-en-tijdsafhankelijke-tarieven-voor-kleine-aansluitingen">
          uitgebreide toelichting van de ACM van 8 oktober 2026
        </ExterneLink>
        .
      </p>
      <Tussenkop>Winterperiode (oktober tot en met maart)</Tussenkop>
      <Tabel
        kop={["Tijdstip", "Indicatief transporttarief"]}
        rechts={[1]}
        minBreedte={320}
        rijen={[
          ["00.00 – 01.00 uur", "€ 0,11 per kWh"],
          ["01.00 – 15.00 uur", "€ 0,08 per kWh"],
          ["15.00 – 17.00 uur", "€ 0,11 per kWh"],
          ["17.00 – 22.00 uur", "€ 0,17 per kWh"],
          ["22.00 – 00.00 uur", "€ 0,11 per kWh"],
        ]}
      />
      <Tussenkop>Zomerperiode (april tot en met september)</Tussenkop>
      <Tabel
        kop={["Tijdstip", "Indicatief transporttarief"]}
        rechts={[1]}
        minBreedte={320}
        rijen={[
          ["00.00 – 03.00 uur", "€ 0,08 per kWh"],
          ["03.00 – 10.00 uur", "€ 0,05 per kWh"],
          ["10.00 – 17.00 uur", "€ 0,00 per kWh"],
          ["17.00 – 19.00 uur", "€ 0,05 per kWh"],
          ["19.00 – 00.00 uur", "€ 0,11 per kWh"],
        ]}
      />
      <Noot>
        De bedragen zijn rekenvoorbeelden op basis van de netbeheerkosten in 2026. De daadwerkelijke tarieven voor 2029
        worden naar verwachting eind 2028 vastgesteld.
      </Noot>
      <p>
        Opvallend is dat je in de winter tussen 17.00 en 22.00 uur in dit voorbeeld ruim twee keer zoveel betaalt voor
        het variabele transportdeel als tijdens de goedkoopste uren. In de zomer geldt tussen 10.00 en 17.00 uur zelfs
        een transporttarief van nul euro per kWh.
      </p>
      <p>
        Dat betekent overigens niet dat elektriciteit op die momenten gratis is. Je betaalt nog steeds voor de
        geleverde elektriciteit, belastingen en de overige vaste kosten.
      </p>

      <ArtikelH2 id="hoeveel-verschil">Hoeveel verschil maakt het moment waarop je stroom gebruikt?</ArtikelH2>
      <p>
        Stel dat je thuiskomt van je werk en jouw elektrische auto wilt opladen. Je hebt daarvoor 40 kWh elektriciteit
        nodig. Op dit moment maakt het voor je transportkosten niet uit wanneer je dit doet. Met dynamische nettarieven
        kan dat veranderen.
      </p>
      <p>Op basis van de indicatieve wintertarieven van de ACM ziet dat er als volgt uit.</p>
      <Tabel
        kop={["Moment van opladen", "Variabel transporttarief", "Kosten bij 40 kWh"]}
        rechts={[1, 2]}
        rijen={[
          ["Tijdens de avondpiek", "€ 0,17 per kWh", "€ 6,80"],
          ["Tijdens de goedkoopste uren", "€ 0,08 per kWh", "€ 3,20"],
          [<strong key="v">Verschil</strong>, "", <strong key="b">€ 3,60</strong>],
        ]}
      />
      <p>
        Wanneer je dezelfde hoeveelheid elektriciteit tijdens de goedkoopste uren afneemt, betaal je in dit voorbeeld
        € 3,60 minder aan variabele transportkosten. Wanneer je regelmatig thuis een elektrische auto oplaadt, kunnen
        dergelijke verschillen zich gedurende het jaar opstapelen.
      </p>
      <p>
        Het gaat hierbij uitsluitend om het verschil in transportkosten, ervan uitgaande dat je de volledige hoeveelheid
        elektriciteit binnen het betreffende tijdsblok kunt afnemen. De leveringsprijs van elektriciteit kan daarnaast
        ook verschillen.
      </p>

      <ArtikelH2 id="energierekening-hoger">Wordt jouw energierekening vanaf 2029 hoger?</ArtikelH2>
      <p>
        Niet iedereen gaat door de nieuwe nettarieven meer betalen. Volgens de berekeningen in de toelichting van de ACM
        gaat naar verwachting 53 tot 64% van de huishoudens minder betalen dan onder het huidige tariefstelsel het
        geval zou zijn geweest. Voor de overige 36 tot 47% vallen de nettarieven hoger uit.
      </p>
      <p>Vooral huishoudens die veel elektriciteit van het net afnemen, kunnen te maken krijgen met hogere transportkosten.</p>
      <Tabel
        kop={["Voorbeeldsituatie", "Verschil in jaarlijkse nettarieven ten opzichte van het oude tariefstelsel"]}
        rechts={[1]}
        rijen={[
          ["Gemiddeld appartement", "€ 100 tot € 200 lager"],
          ["Vrijstaande woning met een hoog stroomverbruik, waarbij het verbruik zoveel mogelijk wordt aangepast", "€ 300 tot € 500 hoger"],
        ]}
      />
      <Noot>Bron: ACM, uitgebreide toelichting van 8 oktober 2026.</Noot>
      <p>
        Houd er rekening mee dat bovenstaande bedragen een vergelijking zijn tussen twee tariefstelsels. Het betekent
        dus niet automatisch dat je in 2029 minder betaalt dan in 2028. Ook de algemene kosten voor het onderhouden en
        uitbreiden van het elektriciteitsnet kunnen veranderen.
      </p>
      <p>
        Bovendien vormen de nettarieven slechts een onderdeel van je energierekening. Wanneer je door het plaatsen van
        een warmtepomp meer elektriciteit gebruikt, maar tegelijkertijd veel minder gas nodig hebt, kunnen je totale
        energiekosten alsnog dalen.
      </p>

      <ArtikelH2 id="dynamisch-energiecontract">Heb je een dynamisch energiecontract nodig?</ArtikelH2>
      <p>
        Dynamische nettarieven worden gemakkelijk verward met een dynamisch energiecontract, terwijl het twee
        verschillende onderdelen van je energierekening zijn.
      </p>
      <Tabel
        kop={["", "Dynamisch energiecontract", "Dynamische nettarieven"]}
        minBreedte={560}
        rijen={[
          [<strong key="1">Waar betaal je voor?</strong>, "De geleverde elektriciteit", "Het transport van elektriciteit"],
          [<strong key="2">Waarvan is het tarief afhankelijk?</strong>, "De elektriciteitsmarkt en je contract", "Het moment en de hoeveelheid stroomafname"],
          [<strong key="3">Moet je hiervoor kiezen?</strong>, "Ja", "Nee, bij invoering geldt het nieuwe tariefstelsel ook bij een vast contract"],
        ]}
      />
      <p>
        De nieuwe nettarieven worden bij invoering via je energieleverancier in rekening gebracht. Je hoeft daarvoor
        niet over te stappen naar een andere energieleverancier of een dynamisch energiecontract af te sluiten.
      </p>
      <p>
        Heb je al een dynamisch energiecontract? Houd er dan rekening mee dat het goedkoopste moment om elektriciteit in
        te kopen niet automatisch het moment is waarop de transportkosten het laagst zijn. Wanneer je apparaten slim
        aanstuurt, is het daarom verstandig om rekening te houden met beide tarieven.
      </p>

      <ArtikelH2 id="welke-apparaten">Welke apparaten moet je straks op andere momenten gebruiken?</ArtikelH2>
      <p>
        Je hoeft straks niet voortdurend op de klok te kijken voordat je een elektrisch apparaat aanzet. Ook hoef je
        niet te stoppen met koken op momenten waarop de nettarieven hoger zijn. Volgens de ACM hebben verlichting,
        televisies en kleinere huishoudelijke apparaten relatief weinig invloed op je totale netkosten. Ook het effect
        van koken op inductie is doorgaans beperkt.
      </p>
      <p>
        Je kunt beter beginnen bij apparaten die veel elektriciteit gebruiken en waarvan je het gebruik gemakkelijk kunt
        verplaatsen. Denk aan een elektrische auto, warmtepomp, elektrische boiler, wasmachine of vaatwasser. Controleer
        of deze apparaten beschikken over een timer, uitgestelde startfunctie of slimme aansturing en gebruik die alleen
        wanneer dat veilig kan.
      </p>
      <p>Begin dus bij de grootste stroomverbruikers in jouw woning, in plaats van je volledige dagelijkse routine aan te passen.</p>

      <ArtikelH2 id="warmtepomp">Wat betekenen dynamische nettarieven voor jouw warmtepomp?</ArtikelH2>
      <p>
        Wanneer je jouw woning elektrisch verwarmt, heb je vooral in de winter elektriciteit nodig. Juist tijdens de
        winteravonden gelden volgens het huidige voorstel de hoogste transporttarieven. Je vraagt je daarom misschien af
        of het nog wel verstandig is om een{" "}
        <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepomp</Link> aan te schaffen.
      </p>
      <p>
        Volgens onderzoek waarnaar de ACM verwijst, blijven huishoudens met een hybride of volledig elektrische
        warmtepomp gemiddeld financieel beter af dan huishoudens met een cv-ketel, ook wanneer de aanschafkosten worden
        meegerekend. Hoewel de transportkosten kunnen toenemen, staat daar een besparing op het gasverbruik tegenover.
      </p>
      <p>
        Wel wordt het interessanter om te onderzoeken hoe je jouw warmtepomp slim kunt aansturen. Wanneer jouw woning
        voldoende geïsoleerd is, kun je bijvoorbeeld vóór een duur tijdsblok de woning iets extra verwarmen. Hierdoor
        hoeft je warmtepomp tijdens de piekuren mogelijk minder elektriciteit af te nemen.
      </p>
      <p>
        Schakel je warmtepomp echter niet zomaar iedere avond uit. Wanneer je woning te ver afkoelt, kan dit ten koste
        gaan van je wooncomfort en het rendement van je installatie.
      </p>
      <p>
        Ben je van plan om een warmtepomp aan te schaffen? Vraag dan ook naar de mogelijkheden om deze in de toekomst te
        laten reageren op verschillende energietarieven. Lees meer over{" "}
        <Link href="/kennis/slimme-warmtepomp-subsidie-2027" className={TEKSTLINK}>slimme warmtepompen</Link>.
      </p>

      <ArtikelH2 id="isolatie">Waarom wordt de isolatie van je woning belangrijker?</ArtikelH2>
      <p>
        Wanneer je woning snel afkoelt zodra je de verwarming lager zet, heb je weinig mogelijkheden om het verwarmen
        van je woning uit te stellen. Je wilt immers ook tussen 17.00 en 22.00 uur comfortabel op de bank kunnen zitten,
        ongeacht de hoogte van de nettarieven.
      </p>
      <p>
        Een goed geïsoleerde woning houdt de opgewekte warmte langer vast. Daardoor heb je minder energie nodig om je
        woning op temperatuur te houden en ontstaat er mogelijk meer ruimte om het stroomverbruik van je
        verwarmingsinstallatie te verschuiven.
      </p>
      <p>
        Voordat je investeert in slimme installaties of energieopslag, is het daarom verstandig om te onderzoeken
        hoeveel energie jouw woning daadwerkelijk nodig heeft. Misschien kun je door betere{" "}
        <Link href="/maatregelen/dakisolatie" className={TEKSTLINK}>dakisolatie</Link>,{" "}
        <Link href="/maatregelen/vloerisolatie" className={TEKSTLINK}>vloerisolatie</Link>,{" "}
        <Link href="/maatregelen/spouwmuurisolatie" className={TEKSTLINK}>spouwmuurisolatie</Link> of{" "}
        <Link href="/maatregelen/isolatieglas" className={TEKSTLINK}>isolatieglas</Link> je warmtevraag verder beperken.
      </p>
      <p>
        <strong className="text-[var(--gijs-donkergroen)]">Energie die je niet nodig hebt, hoef je ook niet tegen een duurder tarief af te nemen.</strong>
      </p>

      <ArtikelH2 id="zonnepanelen">Wat verandert er als je zonnepanelen hebt?</ArtikelH2>
      <p>
        Wanneer je <Link href="/maatregelen/zonnepanelen" className={TEKSTLINK}>zonnepanelen</Link> hebt, gebruik je een
        deel van de opgewekte elektriciteit direct in je woning. Voor deze elektriciteit hoef je geen gebruik te maken
        van het elektriciteitsnet. Daardoor betaal je over die direct gebruikte zonnestroom ook geen variabele
        transportkosten.
      </p>
      <p>
        Het blijft daarom interessant om zoveel mogelijk van je eigen opgewekte elektriciteit te benutten. Heb je
        bijvoorbeeld een warmtepomp, elektrische boiler of elektrische auto? Onderzoek dan of je deze kunt laten werken
        op momenten waarop je zonnepanelen voldoende elektriciteit opwekken.
      </p>
      <p>
        Houd er wel rekening mee dat zonnepanelen juist in de winter, wanneer je warmtepomp veel elektriciteit nodig kan
        hebben, minder opwekken. De jaarlijkse opbrengst van je zonnepanelen vertelt dus niet het volledige verhaal. Het
        gaat er ook om hoeveel van die elektriciteit je kunt gebruiken op het moment dat je deze nodig hebt.
      </p>
      <p>
        Lees ook:{" "}
        <Link href="/kennis/zonnepanelen-rendabel-zonder-salderen" className={TEKSTLINK}>
          Is zonnepanelen kopen nog wel rendabel zonder salderingsregeling?
        </Link>
      </p>

      <ArtikelH2 id="thuisbatterij">Wordt een thuisbatterij interessanter door dynamische nettarieven?</ArtikelH2>
      <p>
        Met een <Link href="/maatregelen/thuisbatterij" className={TEKSTLINK}>thuisbatterij</Link> kun je elektriciteit
        opslaan en op een later moment gebruiken. Hierdoor kun je bijvoorbeeld elektriciteit die je overdag met
        zonnepanelen opwekt, bewaren voor de avond. Ook kun je met een geschikte installatie onderzoeken of het
        interessant is om elektriciteit tijdens goedkope uren af te nemen en tijdens dure uren te gebruiken.
      </p>
      <p>
        Toch betekent een groter prijsverschil tussen verschillende momenten niet automatisch dat je een thuisbatterij
        sneller terugverdient. Je moet ook rekening houden met de aanschafkosten, de energie die tijdens het opslaan
        verloren gaat en de hoeveelheid elektriciteit die je daadwerkelijk kunt verschuiven.
      </p>
      <p>
        Koop daarom niet uitsluitend vanwege de komst van dynamische nettarieven een thuisbatterij. Onderzoek eerst
        welke mogelijkheden je hebt om je bestaande installaties slimmer te gebruiken en meer van je eigen zonnestroom
        direct te benutten.
      </p>
      <p>
        Lees ook:{" "}
        <Link href="/kennis/salderen-stopt-2027-thuisbatterij" className={TEKSTLINK}>
          Salderen stopt in 2027, dus een thuisbatterij kopen? Of toch niet?
        </Link>
      </p>

      <ArtikelH2 id="voorbereiden">Hoe bereid je jouw woning voor op dynamische nettarieven?</ArtikelH2>
      <p>
        Je hoeft op dit moment nog geen grote aanpassingen te doen vanwege de voorgestelde nettarieven. Wel kun je
        alvast inzicht krijgen in je huidige energieverbruik en controleren welke mogelijkheden je bestaande apparaten
        en installaties bieden.
      </p>
      <p>
        Ga je binnenkort investeren in het verduurzamen van je woning? Dan zijn er een aantal zaken waar je nu al
        rekening mee kunt houden.
      </p>
      <Tabel
        kop={["Jouw situatie", "Wat kun je nu doen?"]}
        rijen={[
          ["Je hebt een elektrische auto", "Controleer of je het opladen automatisch kunt inplannen."],
          ["Je hebt een warmtepomp", "Onderzoek de mogelijkheden voor slimme aansturing."],
          ["Je wilt een warmtepomp kopen", "Vraag of de installatie toekomstige tijdsafhankelijke nettarieven kan verwerken."],
          ["Je hebt zonnepanelen", "Onderzoek hoeveel zonnestroom je direct zelf gebruikt."],
          ["Je woning koelt snel af", "Laat onderzoeken waar je woning warmte verliest."],
          ["Je overweegt een thuisbatterij", "Laat eerst berekenen of energieopslag voldoende financieel voordeel biedt."],
          ["Je hebt geen grote elektrische installaties", "Breng je verbruik in kaart en wacht de definitieve regels af."],
        ]}
      />
      <p>
        Heb je een slimme meter? Bekijk dan, voor zover deze gegevens beschikbaar zijn, op welke momenten je de meeste
        elektriciteit van het net afneemt. Zo ontdek je waar voor jouw huishouden de grootste mogelijkheden liggen.
      </p>
      <p>
        Volgens het gewijzigde voorstel wordt bij huishoudens waarvoor geen verbruiksgegevens per kwartier beschikbaar
        zijn, gewerkt met een standaardverbruiksprofiel. Controleer daarom na het definitieve besluit hoe jouw
        metergegevens worden gebruikt.
      </p>

      <ArtikelH2 id="nu-of-wachten">Moet je nu al iets doen of kun je beter wachten?</ArtikelH2>
      <p>
        De komst van dynamische nettarieven betekent niet dat je het verduurzamen van je woning moet uitstellen. Wel is
        het verstandig om onderscheid te maken tussen maatregelen die onder de huidige omstandigheden al interessant zijn
        en investeringen die vooral afhankelijk zijn van toekomstige tarieven.
      </p>
      <Tabel
        kop={["Wanneer?", "Wat kun je verwachten?"]}
        rijen={[
          ["2026", "Het voorstel is gepubliceerd. Je kunt je huidige energieverbruik onderzoeken."],
          ["Begin 2027", "De ACM verwacht een definitief besluit te nemen."],
          ["Eind 2028", "Naar verwachting worden de daadwerkelijke tarieven voor 2029 vastgesteld."],
          ["1 januari 2029", "Beoogde invoering van de nieuwe nettarieven voor huishoudens."],
        ]}
      />
      <p>
        Wanneer jouw woning op dit moment veel warmte verliest, hoef je niet tot 2029 te wachten met isoleren. Iedere
        winter waarin je onnodig veel energie gebruikt, brengt immers kosten met zich mee. Wil je daarentegen
        uitsluitend een thuisbatterij aanschaffen vanwege de toekomstige nettarieven? Dan is het verstandig om eerst
        meer duidelijkheid te krijgen over de daadwerkelijke financiële voordelen.
      </p>

      <ArtikelH2 id="welke-maatregelen">Welke maatregelen zijn voor jouw woning verstandig?</ArtikelH2>
      <p>
        Met de veranderende energietarieven wordt het steeds belangrijker om niet alleen naar afzonderlijke
        verduurzamingsmaatregelen te kijken, maar ook naar hoe deze maatregelen op elkaar aansluiten. Misschien denk je
        aan een thuisbatterij om je energiekosten te beperken, terwijl je woning juist meer baat heeft bij betere
        isolatie of een slimme warmtepomp.
      </p>
      <p>
        Bij een bedrijf dat uitsluitend thuisbatterijen installeert, ligt de nadruk voornamelijk op energieopslag. Bij
        een warmtepompinstallateur wordt vooral gekeken naar de mogelijkheden om je woning elektrisch te verwarmen. Maar
        wat als een andere investering voor jouw woning meer oplevert?
      </p>
      <p>
        Bij Gijs kijken we tijdens een gratis energiescan naar jouw volledige woning. We brengen de huidige situatie in
        kaart, bespreken je energieverbruik en kijken welke maatregelen bij jouw woning en toekomstplannen passen.
        Wanneer je vervolgens besluit om je woning te verduurzamen, verzorgen we ook de uitvoering. Zo voorkom je dat je
        investeert in een oplossing voordat je weet of dit daadwerkelijk de beste oplossing is.
      </p>
      <p>
        Woon je in Overijssel, Gelderland, Utrecht of Flevoland? Bekijk de mogelijkheden voor{" "}
        <Link href="/regio" className={TEKSTLINK}>verduurzaming in jouw regio</Link>. Of ontdek met onze{" "}
        <Link href="/subsidiecheck" className={TEKSTLINK}>subsidiecheck</Link> welke subsidiemogelijkheden er voor jouw
        woning zijn.
      </p>

      <ArtikelCta
        slug={slug}
        titel="Weet waar je aan toe bent voordat je investeert."
        regel="Tijdens een gratis energiescan kijken we samen naar wat jouw woning nu en in de toekomst nodig heeft."
      />

      <ArtikelH2 id="veelgestelde-vragen">Veelgestelde vragen over dynamische nettarieven</ArtikelH2>
      <FAQAccordion
        items={FAQ}
        className="[&_.gijs-accordion__trigger]:py-5 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg"
      />
    </>
  );
}
