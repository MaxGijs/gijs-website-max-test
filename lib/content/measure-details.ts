export const MEASURE_DETAILS: Record<string, { types: string[]; execution: string }> = {
  Zonnepanelen: {
    types: ["Panelen op een schuin dak of plat dak. Het legplan houdt rekening met de beschikbare ruimte en eventuele bestaande panelen.", "Een omvormer maakt de opgewekte stroom bruikbaar in huis. De keuze voor een centrale omvormer, optimizers of micro-omvormers bespreken we bij het ontwerp."],
    execution: "Gijs bekijkt het dak, de bevestiging, kabelroute en elektrische aansluiting. Daarna volgen een passend legplan, plaatsing en controle van de installatie. Op de uitvoeringsdag komt de installateur meestal tussen 08:00 en 09:00 uur aan, wordt eerst een valbeveiliging opgezet en de constructie gemonteerd, waarna de panelen geplaatst en aangesloten worden. Tot slot lopen we het systeem samen met jou na.",
  },
  Warmtepomp: {
    types: ["Hybride: een warmtepomp werkt samen met een cv-ketel. We bekijken of de bestaande ketel kan blijven of vervanging nodig is.", "Volledig elektrisch: we bekijken een oplossing voor verwarming en warm water zonder cv-ketel. De woning, warmteafgifte en beschikbare ruimte bepalen wat past.", "Vermogen, temperatuur en merk volgen uit het advies. Je hoeft die technische keuze niet zelf vooraf te maken."],
    execution: "Tijdens de opname bekijken we de isolatie, radiatoren of vloerverwarming en de ruimte voor binnen- en buitenonderdelen en eventueel een warmwatervat. We bespreken plaatsing en leidingwerk voordat er wordt geïnstalleerd. Op de uitvoeringsdag komt de installateur meestal tussen 08:00 en 09:00 uur aan, lichten we eerst toe wat er gaat gebeuren en bereiden we het leidingwerk voor. Daarna wordt de buitenunit geplaatst en aangesloten op de cv-installatie, ingeregeld, en samen met jou nagelopen en opgeleverd.",
  },
  Dakisolatie: {
    types: ["Houtvezel: biobased houtvezelisolatie.", "Isolatiewol: inblaaswol en glaswol.", "Andere aangeboden systemen zijn reflecterende folie-isolatie en schuimisolatie. We beoordelen per dak welke toepassing mogelijk is."],
    execution: "We bekijken bestaande isolatie, de dakopbouw, afwerking en bereikbaarheid. Ook dakramen en de dakkapel worden besproken. Vervolgens spreken we af hoe de isolatie en afwerking worden aangebracht. Op de uitvoeringsdag komt de installateur meestal tussen 08:00 en 09:00 uur aan, lichten we eerst toe wat er gaat gebeuren en isoleren we het dak. Het isolatiemateriaal wordt netjes afgedicht, waarna we het werk samen met jou nalopen en opleveren.",
  },
  Spouwisolatie: {
    types: ["Glaswol: glaswolvlokken.", "EPS-parels: EPS-isolatieparels met grafiet.", "Schuimisolatie: PUR-isolatieschuim. Bekijk hieronder de materialen en doorsneden."],
    execution: "Na de opname en voorbereiding worden kleine gaten in de voegen gemaakt. Via die gaten wordt het gekozen materiaal in de spouw aangebracht. De gaten worden afgewerkt en het werk wordt nagelopen. De installateur komt hiervoor meestal tussen 08:00 en 09:00 uur aan en licht van tevoren toe wat er precies gaat gebeuren, waarna rondom de woning wordt gelopen om het werk naar tevredenheid op te leveren.",
  },
  Vloerisolatie: {
    types: ["Vloerisolatie komt aan de onderzijde van de vloer. De bronnen noemen PUR-schuim, schuimsprayisolatie en reflecterende folie-isolatie.", "Bodemisolatie komt op de bodem van de kruipruimte, bijvoorbeeld met EPS-isolatieparels. Dit is een andere plek en aanpak dan isolatie direct onder de vloer."],
    execution: "We bekijken de vloerconstructie, bereikbaarheid en vochtomstandigheden van de kruipruimte. Daarna bespreken we de geschikte aanpak en voorbereiding. Op de uitvoeringsdag komt de installateur meestal tussen 08:00 en 09:00 uur aan, wordt de kruipruimte nagelopen op bijzonderheden en het isolatiemateriaal aangebracht; bij de oplevering vertellen we precies wat er is gedaan. Overweeg je een nieuwe vloer met vloerverwarming? Bekijk dan het onderdeel Vloerverwarming.",
  },
  Isolatieglas: {
    types: ["Isolatieglas vervangt het bestaande glas in het kozijn. De brochure noemt HR, HR+, HR++, HR++ (G) en HR+++, elk met een eigen U-waarde.", "Hoe lager de U-waarde, hoe minder warmte het glas doorlaat."],
    execution: "Voor de plaatsing wordt het glas ingemeten; de inmeter neemt hiervoor telefonisch contact op. Op de uitvoeringsdag komt de installateur meestal tussen 08:00 en 09:00 uur aan, licht toe wat er gaat gebeuren, haalt de oude beglazing weg en plaatst het nieuwe isolatieglas. Daarna wordt het werk nagelopen en opgeleverd.",
  },
  Kozijnen: {
    types: ["Kunststof kozijnen: goedkoper en beter bestand tegen zilte lucht, in 70, 85 of 120 mm inbouwdiepte.", "Aluminium kozijnen: lichter van gewicht en geschikter voor grote constructies.", "Ook deuren en schuifpuien kunnen worden meegenomen."],
    execution: "De ramen worden ingemeten, waarna samen met jou wordt bepaald welk profiel en welke uitvoering passen. Daarna wordt het nieuwe kozijn geplaatst en afgewerkt, en wordt het werk nagelopen en opgeleverd.",
  },
  Vloerverwarming: {
    types: ["In een geschikte bestaande vloer: bijvoorbeeld door de leidingen in te frezen. Een volledig nieuwe vloeropbouw is dan niet vanzelfsprekend nodig.", "In een nieuwe vloeropbouw: we bekijken welke onderbouw en dekvloer bij je woning passen. Bij Gijs worden schuimbeton, zandcementdekvloeren en gietdekvloeren uitsluitend toegepast in combinatie met vloerverwarming."],
    execution: "We beoordelen de bestaande vloer, beschikbare opbouw en aansluiting op de verwarming. Daarna bespreken we de uitvoering en de voorbereiding voor de uiteindelijke afwerkvloer. Of levering en plaatsing van die afwerkvloer onderdeel van de opdracht zijn, wordt apart afgesproken.",
  },
  Thuisbatterij: {
    types: ["Eigen zonnestroom bewaren om later te gebruiken: het doel en je energiegebruik vormen het vertrekpunt.", "Een eventuele back-upfunctie vraagt om een systeem en aansluiting die dit ondersteunen. Niet iedere thuisbatterij kan bij stroomuitval je woning van stroom voorzien."],
    execution: "We bespreken wat je wilt bereiken, de aanwezige zonnepanelen, aansluiting en beschikbare plaats. Daarna volgt advies over een passend systeem. Financieel voordeel is geen vaste uitkomst en wordt niet vooraf beloofd.",
  },
};
