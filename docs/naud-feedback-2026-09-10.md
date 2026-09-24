# Verwerking feedback van Max en Naud

Deze ronde vervangt de eerdere keuze voor aanklikbare scanstappen en losse categoriepagina's.

- Stappen 1 en 2 tonen de basiswoning. Geselecteerde maatregelen blijven bewaard en worden vanaf stap 3 weer zichtbaar.
- De voortgang is informatief. Per stap blijft één terugknop beschikbaar voor correcties; dubbele wijzigknoppen zijn verwijderd.
- Scanmaatregelen hebben geen nummers en staan in twee groepen: Installaties en Isolatie.
- De viewer heeft vaste voor-, achter- en onderaanzichten. De voordeur heeft een luifel, brievenbus en smal glas; de achterdeur heeft een groter glasvlak.
- De vrijstaande woning heeft twaalf nieuwe ramen, waaronder herkenbare wc- en badkamerramen, extra slaapkamerramen en een normale enkele achterdeur. De muuruitsparingen volgen de nieuwe ramen.
- Dakisolatie wordt in de dakopbouw onthuld zonder de dakkapel op te tillen. Beide modellen hebben twee compacte voorbeeldpanelen op de dakkapel.
- Bij Spouwisolatie speelt een korte schematische animatie met vrachtwagen, monteur en slang. Opnieuw afspelen kan in de viewer. Verminderde beweging wordt gerespecteerd.
- `/maatregelen` bevat beide categorieën met uitklapbare informatie. De drie spouwmaterialen en afbeeldingen uit de productbladen zijn daar apart uitklapbaar. `/isolatie` en `/installaties` verwijzen door naar de betreffende groep.

## Controle

Desktop en mobiele weergave van de maatregelenpagina en viewer bekeken. Geen horizontale overflow op 390 px. Uitklappen van spouwinformatie en EcoPearl gecontroleerd. Teruggaan naar stap 1 verwijdert zichtbare maatregelen; terugkeren naar stap 3 behoudt de keuzes. Voor-, achter-, onderaanzicht en vrij draaien gecontroleerd. Twee panelen op de dakkapel visueel gecontroleerd vanuit bovenaanzicht. De animatie is zichtbaar na een stilstaande viewer; de eerste grote tijdsprong bij hervatten wordt begrensd. Geen consolefouten bij de controles na herladen.

Modelcontrole met de werkelijke GLB-bestanden: onafhankelijke scènes, geen scanburen, hoekwoningraamopeningen, twaalf vrijstaande ramen, normale achterdeurbreedte, twee panelen binnen iedere dakkapelrand en aansluiting garage-latei-dak geslaagd. TypeScript en lint zonder fouten; vijf bestaande waarschuwingen in de modelgeneratoren. Lokale productiebuild geslaagd.

De animatie en paneelafmetingen zijn schematisch; de viewer is geen uitvoeringsontwerp. WhatsApp-nummer en Google Places-configuratie zijn in deze ronde niet geactiveerd. Niets gepubliceerd en geen aanvraag of bericht verstuurd.
