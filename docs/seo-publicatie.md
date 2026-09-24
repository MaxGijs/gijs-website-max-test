# SEO en publicatie op gijs.eco

De canonieke website is https://gijs.eco. De oude site wordt niet aangepast of doorgestuurd.

## Voor publicatie
- Stel uitsluitend op de publieke productieomgeving SEO_INDEXABLE=true in en bouw opnieuw. Zonder deze instelling hebben alle pagina's noindex en is de sitemap leeg. Houd previews op de standaardinstelling.
- Controleer de primaire host: HTTPS en één keuze tussen gijs.eco en www. Regel de hostredirect bij de hosting.
- Verifieer gijs.eco in Google Search Console en dien /sitemap.xml in. Controleer enkele URL's en gestructureerde gegevens met Googles inspectietools.
- Controleer de verhouding tot groeninjestraat.nl per pagina. Verhuisde inhoud krijgt alleen een redirect wanneer de oude pagina echt vervalt; stuur niet de hele oude website door.
- Controleer echte contact- en aanvraagverzending. Dit staat los van indexatie.
- /woning blijft noindex, ook in productie. Queryparameters met adresgegevens staan niet in canonicals, metadata of sitemap.
- Cases en de juridische placeholders blijven noindex en buiten de sitemap totdat hun inhoud is aangeleverd. Verwijder daarna index:false in lib/seo.ts als indexatie gewenst is.
- Canonicals, metadata, deelgegevens en sitemap gebruiken dezelfde centrale URL. Geen verzonnen beoordelingen, prijzen of certificaten in gestructureerde gegevens.

## Inhoud die nog nodig is
Echte projecten, eigen teaminformatie/foto's, definitieve juridische documenten en gecontroleerde actuele subsidie-informatie. Voeg geen generieke stadspagina's of zoekwoordenlijsten toe zonder eigen relevante inhoud.

## Controle
Controleer statuscodes, unieke titels en beschrijvingen, één H1 per inhoudspagina, werkende interne links en server-gerenderde inhoud. Meet na livegang zoekopdrachten en aanvragen in Search Console en verbeter daarna gericht.

Bronnen:
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/appearance/structured-data/organization
