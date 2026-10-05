// Bron: de drie aangeleverde Gijs-productbladen "Informatie
// spouwmuurisolatie (...) met aanvullende voorwaarden.pdf" (HR EcoWool,
// HR EcoPearl, HR IsoFoam) — pagina 3 (beschrijving, productvoordelen).
// De productafbeeldingen zijn losse, door Max aangeleverde productfoto's
// van het materiaal zelf, met beschrijvende SEO-bestandsnamen. Volgorde en
// tekst zijn gebaseerd op deze bladen; voordelen zijn ingekort tot de 3-5
// belangrijkste per materiaal, zonder interne verkoopcontext (zoals
// toepassingsfrequentie) als publieke claim. `alt` is een korte,
// beschrijvende alt-tekst per productfoto (geen keyword stuffing).
export const SPOUW_PRODUCTS = [
  {
    name: "Glaswolvlokken",
    image: "/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-hr-ecowool.png",
    alt: "Glaswolvlokken voor spouwmuurisolatie",
    // In de praktijk de meest gebruikte toepassing voor het na-isoleren
    // van een ongeïsoleerde spouw — daarom als eerste genoemd, met een
    // licht getinte kaart en een subtiel label, zonder dit als
    // cijfermatige claim ("90%") te tonen.
    highlight: true,
    badge: "Veel toegepast door Gijs",
    text: "Inblaaswol (glaswolvlokken) voor het thermisch en akoestisch na-isoleren van een ongeïsoleerde spouwmuur.",
    benefits: [
      "Geen risico op inzakken door optimale vulling en verdeling in de spouw",
      "Waterafstotend en vochtwerend",
      "Onbrandbaar (brandklasse A1)",
      "Eurofins Gold certificaat voor een gezonde binnenluchtkwaliteit",
    ],
  },
  {
    name: "EPS-isolatieparels",
    image: "/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-hr-ecopearl.png",
    alt: "EPS-isolatieparels voor de spouw",
    highlight: false,
    text: "Donkergrijze EPS-isolatieparels met grafiet, die tijdens het inblazen met een bindmiddel worden verlijmd tot een stabiele isolatielaag.",
    benefits: [
      "Zeer goede isolatiewaarde (λD 0,034 W/(m·K))",
      "Gelijkmatige vulling van de spouw, ook rondom oneffenheden",
      "Snelle verwerking via kleine vulopeningen in de gevel",
    ],
  },
  {
    name: "PUR-isolatieschuim",
    image: "/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-hr-isofoam.png",
    alt: "PUR-isolatieschuim voor spouwmuurisolatie",
    highlight: false,
    text: "Opencellig PUR-isolatieschuim dat via kleine vulopeningen in de spouw wordt aangebracht en daar expandeert.",
    benefits: [
      "Vult naden, kieren en moeilijk bereikbare plekken in de spouw",
      "Vermindert ongewenste luchtstromen en tocht via de gevel",
      "Vormvast materiaal dat niet kan uitzakken",
    ],
  },
];
