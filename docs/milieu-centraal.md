# Subsidies via Milieu Centraal (Energiesubsidiewijzer)

De site haalt alle subsidies, leningen en overige regelingen op uit de Energiesubsidiewijzer-API van
Milieu Centraal (verbeterjehuis.nl). Dezelfde koppeling draait ook op Digitaal Energieloket.

## Waar het staat

- `lib/milieu-centraal/client.ts`: de API-client (sleutel alleen op de server, antwoorden een dag gecachet).
- `lib/milieu-centraal/regelingen.ts`: gemeente bepalen (PDOK, Kadaster), niveau (gemeente, regio,
  provincie, landelijk) en vertaling naar de maatregelen van Gijs (`lib/measures.ts`).
- `app/subsidiecheck/actions.ts`: server action voor de subsidiecheck en de woningscan.
- `/subsidiecheck`: postcode (en huisnummer) in, alle regelingen eruit, te filteren op maatregel en soort.
  Elke regeling heeft als actie "Start de woningscan" (adres en eventueel maatregel gaan mee, via
  sessionStorage); de officiële bron staat klein onder de kaart.
- Woningscan, stap "Jouw woningplan": relevante regelingen voor het adres, bij de aangevinkte maatregelen.
  Bewust zonder links naar buiten of naar andere pagina's: bedragen en voorwaarden klappen open in de scan.
- Regiopagina's (gemeente en plaats): de actuele regelingen van de gemeente, regio en provincie, ook met
  "Start de woningscan" als actie.

## Instellingen

- `MILIEU_CENTRAAL_API_KEY` (Vercel, productie). Zonder sleutel of bij een storing tonen de pagina's de
  oude, algemene subsidieteksten; er gaat niets stuk.
- `MILIEU_CENTRAAL_API_BASIS`: alleen voor lokaal testen met een nagemaakte API. Niet zetten in Vercel.

## Afspraken uit de API-gids (21 mei 2025)

- Sleutel in de header `apiKey`. Filters (gemeenten, maatregelen) altijd via `getfilters`.
- Niet gebruiken: Stackable, Amount, Details, Location, LocationIDs. Wel: AdditionalIntro, AmountsText,
  Conditions, Locations.
- Teksten uit de API worden omgezet naar platte tekst; er wordt nooit HTML van buiten getoond.
- Altijd de bron vermelden: "Milieu Centraal, Energiesubsidiewijzer (Verbeter Je Huis)".
