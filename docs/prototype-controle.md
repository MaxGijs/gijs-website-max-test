# Prototypecontrole — 9 september 2026

Lokaal uitgevoerd in `gijs-website-playground`. Niets gepubliceerd.

## Wijzigingen

- Grotere groene header, prominentere woningkeuze, grotere verhaal- en resultaatteksten. De losse groene resultaatlijn en pijl zijn weg.
- Losse maatregelafbeeldingen staan op `/maatregelen`. Het interactieve verhaal met zes maatregelen blijft op home. Volgorde: zonnepanelen, warmtepomp, dakisolatie, spouwisolatie, vloerisolatie, glas en kozijnen.
- De naamuitleg en de dubbele digitale-procesuitleg zijn van home verwijderd.
- Eén gedeelde woningkeuze en adresinvoer voor de homepage, het scanvenster en `/woning`. De scan gebruikt dezelfde GLB-modellen als home.
- Vrije 360°-bediening in de scan, zoomgrenzen, draaiknoppen en beginstand. Op smalle schermen wordt de bediening bewust ingeschakeld, zodat normaal scrollen mogelijk blijft.
- Zonnepanelen en warmtepomp reageren op de actuele scrollpositie. Daktoebehoren bewegen mee met de daklaag; zonnepanelen op de garage blijven bij de garage.
- Grotere dakkapellen, passend schoorsteenmateriaal, vrijstaande woning met klein zolderraam aan de garagezijde, uitgelijnde gevelindeling van de hoek- en buurwoning. De buitenunit van het hoekhuis is zichtbaar naast de vrije zijgevel.
- Mobiele voortgangstekst voorkomt horizontale overflow. Zwevende knoppen bedekken op mobiel geen formulier of verhaaltekst.
- Serverkoppeling met Google Places, inclusief officiële bronvermelding en foutafhandeling. Geen vaste of verzonnen beoordeling meer.

## Uitgevoerde controles

- Productiebuild inclusief TypeScript: geslaagd.
- ESLint op alle gewijzigde bronbestanden: geslaagd.
- Desktop en 390 × 844: homepage, woningkeuze, maatregelenpagina, mobiel menu, scanvenster en scanroute bekeken.
- Openbaar testadres Dam 1, 1012 JS Amsterdam: adresopzoeking, doorgifte van gekozen woningtype en alle vijf scanstappen gecontroleerd. Geen energiescanaanvraag verstuurd.
- Terug naar home behoudt woningkeuze en invoer binnen dezelfde sessie.
- Rechtstreekse hoofdstuklinks, verschijnen van zonnepanelen en terugscrollen naar een woning zonder installaties visueel gecontroleerd. Daklagen en aanwijzing gecontroleerd.
- Materiaalisolatie tussen modelinstanties, geveluitlijning en vrije ruimte tussen hoekwoning-dakkapel en zonnepanelen gecontroleerd met een modelscripttest.
- Google-koppeling met uitsluitend testfixtures gecontroleerd: ontbrekende configuratie, geldige/ongeldige gegevens, gelijktijdige aanvragen, no-store en foutpauze bij een upstream-fout. Geen live Google-reviewaanvraag gedaan.

## Nog nodig

- `GOOGLE_PLACES_API_KEY` en de gecontroleerde `GOOGLE_PLACE_ID`; zie [google-reviews.md](google-reviews.md). Live reviews en de uiteindelijke gevulde reviewsectie kunnen pas daarna worden gecontroleerd.
- Tussenwoning blijft bewust uitgeschakeld totdat er een geschikt model is.
- Woningkenmerken, berekeningen en aanvraagafhandeling blijven de bestaande prototypefuncties. Het gekozen woningtype is wel echt de keuze van de bezoeker.
- Aanraken/knijpen op een fysiek mobiel toestel is niet getest; de mobiele layout en bediening zijn op telefoonformaat gecontroleerd.
