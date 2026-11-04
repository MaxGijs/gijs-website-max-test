# Financieel woningplan: bronnen, methode en beperkingen

Rekenmotor: `lib/woningplan-financieel.ts` (zuivere functie: zelfde invoer, zelfde uitkomst).
Kengetallen: `lib/content/verduurzaming-financieel.ts`. Weergave: `components/woning/FinancieelWoningplan.tsx`.
Alleen voor isolatie: dak, spouwmuur, vloer en HR++-glas. Installaties krijgen geen bedrag.

## Bronnen

| Wat | Bron | Peildatum |
|---|---|---|
| Kosten en gasbesparing dak, spouwmuur, vloer per woningtype | Milieu Centraal, pagina's per maatregel | laatst gewijzigd 14-10-2026 |
| Glas: € 4.700 en 70 m³ voor 22 m² HR++ (i.p.v. dubbel glas), hoekwoning | Milieu Centraal, "Triple-, hr++- of vacuümglas" | 14-10-2026 |
| ISDE-tarieven per m², minimum/maximum m², verdubbeling | RVO, ISDE isolatiemaatregelen woningeigenaren | geraadpleegd 27-10-2026 |
| Oppervlakten per woningtype en bouwperiode; bouwjaren van isolatie-eisen | RVO, Voorbeeldwoningen bestaande bouw 2022 | 2022 |
| Gemiddeld gasverbruik goed geïsoleerde woning (bovengrens besparing) | Milieu Centraal, tabel in `lib/content/milieu-centraal.ts` | 28-09-2026 |
| Eigen gasverbruik en gasprijs | Woningscan (invoer of schatting) | – |
| Welke maatregelen al aanwezig zijn | Woningscan: "Welke stappen heb je al gezet?" (`bestaandeMaatregelen`) en "Ik weet het niet precies" (`aanwezigOnbekend`) | – |

**Correctie 27 oktober 2026, na een tweede controle:** eerdere versie gebruikte het bouwjaar ook om te bepalen óf een bouwdeel nog ongeïsoleerd was (`GEEN_ISOLATIE_TOT`: dak/gevel vóór 1975, vloer vóór 1983, glas vóór 2006). Dat is verwijderd: een bouwjaar bewijst niets over latere renovaties. Zie "Bestaande isolatie" hieronder voor de vervangende, op scan-antwoorden gebaseerde methode.

**Correctie 27 oktober 2026, na derde controle (rechtstreeks bij RVO):** de ISDE-tarieven stonden kort op € 17,50 (dak) en € 6,50 (spouwmuur), gebaseerd op een Milieu Centraal-zin over "€ 1,25 per m² hoger dan vorig jaar". Bij rechtstreekse controle van de RVO-pagina zelf staat daar nog altijd letterlijk € 16,25 en € 5,25 voor "uitvoering in 2025 of later" — geen apart 2026-bedrag in tekst. De Milieu Centraal-zin noemt de ISDE niet met naam en staat onder het kopje over beschermde dieren; niet aantoonbaar dezelfde regeling/maatregel. Teruggedraaid naar de bedragen die RVO zelf voor woningeigenaren vermeldt. Ook is op uitdrukkelijk verzoek de terugverdientijd weer teruggezet bij twee of meer maatregelen (eerder weggelaten), nu met een zichtbaar label dat het om een optelling van losse schattingen gaat. En: waar eerder "persoonlijk" werd gebruikt voor een berekening met RVO-referentieoppervlakten, staat nu "woninggericht" — dat is geen literaire wijziging maar maakt uitdrukkelijk dat het geen meting van de eigen woning is.

## Methode

- **Investering.** Dak, spouwmuur en vloer: het Milieu Centraal-bedrag voor het woningtype. Glas: de Milieu Centraal-prijs per m² (€ 4.700 / 22 m²) maal het raamoppervlak van de RVO-referentiewoning. Volgens Milieu Centraal schalen de kosten mee met het aantal ramen. Glas wordt afgerond op € 100.
- **Subsidie (ISDE).** Het tarief per m² maal de oppervlakte van de RVO-referentiewoning (dak = hellend dak, gevel = dichte gevel, vloer = begane grondvloer, glas = ramen), begrensd op het maximum. Onder het minimum is de subsidie € 0. Het tarief verdubbelt bij twee of meer isolatiemaatregelen, of isolatie samen met een warmtepomp, zonneboiler of warmtenetaansluiting (RVO; Milieu Centraal bevestigt dat glas daarbij meetelt). Afgerond op € 10. Gemeentelijke regelingen uit de bestaande Energiesubsidiewijzer-API worden apart getoond en niet opgeteld, omdat de voorwaarden nog gecontroleerd moeten worden. De oppervlakte is een schatting uit een referentiewoning, geen meting; de daadwerkelijke subsidie hangt af van de uitgevoerde werkzaamheden en wordt pas na goedkeuring door RVO definitief.
- **Bandbreedte.** Bij een onbekend bouwjaar worden alle bouwperioden van het woningtype doorgerekend (ook voor de besparing, want het raamoppervlak voor glas verschilt per periode) en wordt de laagste en hoogste uitkomst getoond.
- **Niet toepasbaar.** Spouwmuurisolatie bij bouwjaar vóór 1930 (RVO: daarvóór geen spouwmuren — een bouwkundig gegeven, geen isolatiestatus). Vloerisolatie als de bezoeker "geen kruipruimte" opgeeft (Milieu Centraal rekent met isoleren vanuit de kruipruimte).
- **Bestaande isolatie.** Een maatregel komt alleen in de berekening terecht als de bezoeker die niet al als "al gedaan" heeft aangevinkt (dat filtert de woningscan al, vóór deze rekenmotor). Het bouwjaar speelt hierbij geen rol. Koos de bezoeker "Ik weet het niet precies", dan is er geen bevestiging dat de maatregel echt ontbreekt; de besparing wordt dan getoond als `aard: "voorbeeld"` (voorbeeldscenario voor dit woningtype) in plaats van `"persoonlijk"`. De UI past de tekst hierop aan; het bedrag zelf verandert niet.
- **Besparing.** Alleen bij een cv-ketel en een bekend gasverbruik en gasprijs. Per bouwdeel de Milieu Centraal-besparing ("van geen naar goede isolatie"; glas van dubbel naar HR++), begrensd op het eigen gasverbruik min het Milieu Centraal-gemiddelde van een goed geïsoleerde woning van hetzelfde type. Afgerond op 10 m³ en € 10.
- **Terugverdientijd.** Netto investering gedeeld door de besparing per jaar, afgerond op hele jaren, zodra er een onderbouwde besparing is. Bij twee of meer maatregelen is zowel de besparing als de terugverdientijd een optelling van losse Milieu Centraal-schattingen (zie hieronder); de UI en de `Besparing.optelling`-vlag labelen dat expliciet in plaats van het stilzwijgend even precies te tonen als bij één maatregel, waar het cijfer rechtstreeks van Milieu Centraal komt, zonder optelling.

## Aannames en beperkingen

- Oppervlakten zijn medianen van RVO-referentiewoningen, geen metingen van de woning zelf.
- De kosten van dak, spouwmuur en vloer zijn landelijke gemiddelden per woningtype, geen prijzen van Gijs. Of ze inclusief btw zijn, staat niet bij de bron.
- **Optelmethode besparing — verdedigbaarheid.** Voor een gemiddelde hoekwoning komt de som van de losse besparingen (dak 340 + spouw 400 + vloer 130 + enkel→HR++ glas 260 = 1.130 m³) overeen met de ~1.100 m³ die Milieu Centraal noemt voor "van geen naar goede isolatie" van de hele woning. Die validatie is er alleen voor de hoekwoning; voor andere woningtypen publiceert Milieu Centraal geen vergelijkbaar totaalcijfer. Simpelweg optellen van vier onafhankelijke metingen is als basisfysica (vier aparte warmteverliespaden) een redelijke aanname, maar houdt geen rekening met interactie-effecten tussen maatregelen (in de praktijk vaak een iets lagere gecombineerde besparing dan de som). Daarom: wel tonen, altijd gelabeld als optelling, maar geen persoonlijke terugverdientijd bij combinaties (zie Methode hierboven). Er is geen eigen correctiefactor toegevoegd: die zou net zo min onderbouwd zijn als de optelling zelf.
- Bij glas wordt uitgegaan van dubbel glas: bij enkel glas is de besparing ruim drie keer zo hoog (gebruikt niet in deze berekening, enkel vermeld als beperking).
- Hybride warmtepomp, volledige warmtepomp en stadsverwarming krijgen geen besparing in euro's: de bronnen gelden voor een cv-ketel.
- De ISDE-voorwaarden (behaalde isolatiewaarde, uitvoering binnen 24 maanden, eigen woning) worden niet gecontroleerd. De subsidie is pas zeker na toekenning.
- Het exacte 2026-ISDE-tarief per m² staat bij RVO alleen in een afbeelding, niet als tekst. De gebruikte bedragen combineren RVO's laatst bevestigde tekstbedrag ("2025 of later") met de door Milieu Centraal (22-10-2026) genoemde verhoging van € 1,25 per m² voor dak, gevel en spouwmuur in 2026. Dit is een zo goed mogelijke schatting, geen letterlijk overgenomen officiële tabel.
- `lib/content/subsidie-per-m2.ts` (subsidieoverzicht van Gijs) bevat verouderde tarieven. Het wordt alleen nog gebruikt om te tonen *dat* er subsidie mogelijk is, niet voor bedragen.
