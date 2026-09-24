# Lokale prototype-update — 10 september 2026

## Bekijken

- `/`: contact en social media, compacter woningverhaal en blijvend onthulde installaties bij terugscrollen.
- `/contact`: opgegeven adres, e-mail, telefoon en adviesroute.
- `/isolatie`: basisinformatie, drie spouwmaterialen en originele doorsneden uit de aangeleverde productbladen; proces en praktische voorbereiding.
- `/installaties`: basispagina voor zonnepanelen, warmtepomp en energieopslag. De oude website was inhoudelijke bron; onduidelijke bedrijfsclaims en financiële voorbeelden zijn weggelaten.
- `/maatregelen`: kaarten verwijzen door naar de nieuwe inhoud.
- `/woning`: herkenbare digitale scan, voorbeeldwoning zonder buren, zes directe keuzes, aanklikbare bereikte stappen, woningplan en berichtvoorbeeld.

## Woning en scan

De hoekwoning heeft een groot voorraam, smal wc-raam tussen voordeur en groot raam, slaapkamerraam en horizontaal badkamerraam. Achter staan twee bovenramen en beneden een groot raam en één deur. De vrije zijgevel heeft alleen het zolderraam. De buurwoning op de homepage volgt de nieuwe indeling. Ramen hebben echte uitsparingen in de drie gevelvlakken; ook de vrijstaande woning is hierop bijgewerkt.

Het bestaande garage-element sluit al aan op de bovenzijde van de deur en onderzijde van het dak. Het is gecontroleerd en niet opnieuw gebouwd. De eerder vergrote dakkapel en aangepaste schoorsteen zijn behouden.

De scan begint zonder maatregelen. Keuzes voegen de installaties toe of openen de isolatieopbouw. De camera wordt niet opnieuw aangemaakt bij een keuze of woningwissel. De voorbeelden tonen het principe; het zijn geen exacte bouwkundige modellen of automatisch herkende woningen.

Stap, bereikte stappen, woningtype, adres, maatregelen en naam worden in sessionStorage bewaard. Een ander adres begint met lege maatregelen. Een nieuwe scan vraagt eerst om bevestiging voordat de huidige invoer verdwijnt.

## Controles

- Desktop en mobiele browserweergave van 390 × 844; geen horizontale overloop in de gecontroleerde homepage, isolatiepagina en scan.
- Mobiel menu met interne links en alle drie sociale profielen.
- Overdracht van gekozen vrijstaande woning en postcode/huisnummer van homepage naar scan; adrescontrole via PDOK met het openbare bedrijfsadres.
- Alle zes maatregelen geselecteerd en weer uitgezet. Woningplan en berichtvoorbeeld bevatten de selectie.
- Terugklikken en vernieuwen bewaren stap, woningtype, adres, naam en maatregelen.
- Beide woningtypen, 360°-knoppen, mobiele activeringsknop en achtergevel hoekwoning bekeken.
- Alle zes hoofdstuklinks; late instap en omhoog scrollen met behouden zonnepanelen en warmtepomp.
- Geometriecontroles: acht ramen hoekwoning, wc-positie, horizontaal badkamerraam, één zijraam, raycasts door raamopeningen, aansluiting garage/latei/dak, buurwoning alleen op homepage, vrije ruimte tussen dakkapel en voorste zonnepanelen en onafhankelijke materialen.
- TypeScript en productiebuild geslaagd. Lint: geen fouten; vijf bestaande waarschuwingen over ongebruikte variabelen/functies in modelgeneratiescripts.
- Schone browsercontrole na herladen en wisselen tussen beide modellen: geen consolefouten. De gebruikte 3D-bibliotheek geeft nog een THREE.Clock-waarschuwing. Tijdens live codeverversingen kunnen oude ontwikkelmeldingen in een reeds geopend tabblad blijven staan; herlaad dat tabblad.

## Nog te configureren

- Het echte zakelijke WhatsApp-nummer in `lib/content/contact.ts`. Het gewone telefoonnummer wordt hiervoor niet automatisch gebruikt. Tot die tijd toont de laatste stap het bericht met kopieerknop, telefoon en e-mail. Er wordt niets automatisch verstuurd.
- De bestaande Google-reviewsintegratie blijft behouden; de serverconfiguratie voor de API en gecontroleerde Place ID moet worden ingevuld om echte reviews te tonen.

Niets gedeployed. Geen WhatsApp-bericht, echte aanvraag of socialmedia-actie uitgevoerd. De oorspronkelijke pdf's zijn niet gewijzigd.
