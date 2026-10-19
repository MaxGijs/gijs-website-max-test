# Straatbeeld en woningtype in stap 1 van de woningscan

## Straatbeeld (foto van de woning)

Stap 1 toont een Google Street View-foto van het adres (`components/woning/Woningbeeld.tsx`). De browser vraagt die op bij de eigen route `app/api/straatbeeld/route.ts`; die haalt het beeld op de server op, zodat de Google-sleutel nooit in de browser of in een afbeeldings-URL staat.

- Eerst wordt de gratis Street View-metadata gevraagd of er een buitenbeeld bij het adres bestaat. Alleen dan wordt het (betaalde) beeld opgehaald. Zonder beeld, sleutel of bij een storing antwoordt de route met 404 en blijft de placeholder staan.
- Sleutel: `GOOGLE_STREETVIEW_API_KEY`, of anders dezelfde serversleutel als de Google-reviews (`GOOGLE_PLACES_API_KEY`). Die sleutel moet in Google Cloud onder *API restrictions* ook **Street View Static API** mogen gebruiken, zonder websitebeperking (de aanvraag komt van de server, niet van de website).
- Kosten: Street View Static heeft een gratis maandtegoed (10.000 beelden). Zet in Google Cloud een daglimiet op de Street View Static API zodat dat niet overschreden wordt. Daarnaast remt de route per IP-adres (20 beelden per 10 minuten).
- Niets wordt gecachet of opgeslagen (`Cache-Control: no-store`), conform de Google Maps Platform-voorwaarden. Het Google-logo staat in het beeld zelf.

## Woningtype

Het woningtype wordt automatisch bepaald in `StapBevestigen.tsx`:

1. **EP-Online** (`lib/ep-online/energielabel.ts`): het gebouwtype dat bij het energielabel is geregistreerd. Heeft het adres geen geregistreerd label, dan is er ook geen gebouwtype.
2. **BAG-plattegrond** (`lib/bag/woningtypeGeometrie.ts`, opgehaald via de openbare BAG WFS van PDOK in `lib/bag/bagWfs.ts`, geen sleutel nodig): het pand en de omliggende panden. Het type volgt uit het aantal buurwoningen waarmee het pand een muur deelt (minimaal 2 meter):
   - geen → vrijstaande woning
   - twee of meer → tussenwoning
   - één, en die buur zit verder nergens aan vast → twee-onder-een-kap
   - één, en die buur zit wél aan een volgende woning vast → hoekwoning
   Panden zonder woonfunctie (garages, schuren) tellen niet mee. Bevat het eigen pand meer dan één woning (flat, boven-/benedenwoning, rij als één pand ingetekend), dan wordt niets geraden.
3. Combinatie (`combineerWoningtype` in `lib/ep-online/woningtypeMapping.ts`): een eenduidig EP-Online-type gaat voor; bij de EP-Online-waarde "twee-onder-een-kap / rijwoning hoek" beslist de BAG tussen die twee; zonder bruikbaar EP-Online-type geldt de BAG. Lukt geen van beide, dan kiest de bewoner zelf ("Kon niet automatisch worden bepaald").
