# Google-reviews activeren

De homepage haalt echte beoordelingen op via Places API (New). De sleutel blijft op de server. Zonder configuratie of bij een storing verdwijnt de sectie; er wordt geen vaste score of fictieve review getoond.

1. Controleer in Google Maps het juiste bedrijfsprofiel van Gijs / Groen in je straat en het adres. Kopieer de Place ID van dat profiel. Gebruik geen zoekresultaat op alleen de bedrijfsnaam.
2. Activeer Places API (New) in het eigen Google Cloud-project. Stel quota en budgetmeldingen in; beperk de sleutel tot Places API en waar mogelijk het server-IP. Google kan hiervoor kosten rekenen.
3. Voeg lokaal aan `.env.local` toe (niet committen):

```
GOOGLE_PLACES_API_KEY=je_server_sleutel
GOOGLE_PLACE_ID=de_gecontroleerde_place_id
```

4. Herstart de ontwikkelserver. Controleer bedrijfsnaam, cijfer, aantal en Google Maps-link op de homepage. Plaats dezelfde servervariabelen bij de hosting van gijs.eco wanneer de site wordt gepubliceerd.

Google levert maximaal vijf reviews op relevantie. De homepage toont die selectie zonder alleen positieve reviews te kiezen, met originele tekst, auteur, datum en bronlinks. De totaalscore en het totale aantal komen rechtstreeks van Google. Er wordt geen reviewcontent blijvend gecachet. Gelijktijdige aanvragen worden samengevoegd; na een fout geldt een korte pauze.

Voor publicatie: neem de toepasselijke Google-voorwaarden en privacyverwijzing op in de publieke voorwaarden/privacyverklaring; controleer de EEA-voorwaarden van het gebruikte account. Die pagina's vallen buiten deze prototypewijziging.

Bronnen: [Place Details](https://developers.google.com/maps/documentation/places/web-service/place-details), [bronvermelding en beleid](https://developers.google.com/maps/documentation/places/web-service/policies). Het officiële ongewijzigde logo staat in `public/images/shared/reviews/google-maps-attribution.svg`.
