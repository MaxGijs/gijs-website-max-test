import type { FAQItem } from "@/components/measures/FAQAccordion";

// Unieke, plaatsgerichte inhoud voor regiopagina's. Eén getypeerde bron, los van de presentatie
// (components/regio/LokalePagina.tsx) en van de regiostructuur (lib/content/regio.ts). Een nieuwe
// plaats krijgt een eigen pagina-inhoud door hier een entry toe te voegen onder zijn regiopad;
// zonder entry tonen de templates de generieke opzet.
//
// Bronnen: Berkum alleen op basis van berkumenergieneutraal.nl (home, over-ben, partners) en
// zwolle.nl/op-weg-naar-een-aardgasvrij-berkum. Borne, Hengelo en Enschede alleen op basis van de
// twee aangeleverde Deep Research-rapporten over lokale SEO in Twente. Geen subsidiebedragen,
// percentages, deadlines of voorwaarden: die worden later met Thom en BEN gecontroleerd.

/** Tekstdeel: gewone tekst, of een link (intern of extern) binnen een alinea. */
export type Tekst = string | { tekst: string; href: string; extern?: boolean };
export type Alinea = Tekst[];

export type LokaleSectie = {
  id: string;
  titel: string;
  alineas: Alinea[];
  punten?: { titel: string; tekst: string }[];
  /** Iconenkaarten náást de sectietekst (lucide-react icoonnamen, kebab-case) — bijv. "waar is deze
   * plaats bekend van". Als dit is ingevuld, wordt de sectie twee-koloms getoond: de normale tekst
   * (en eventuele punten) links, de kaarten rechts onder een klein kopje (kaartenTitel). */
  kaarten?: { icon: string; titel: string; tekst: string; href?: string }[];
  /** Klein kopje boven de kaarten rechts, bijv. "Waar is Almelo bekend van?". */
  kaartenTitel?: string;
};

export type LokaleInhoud = {
  seo: { title: string; description: string };
  kicker: string;
  h1: string;
  intro: Alinea[];
  ctaPrimair: { tekst: string; href: string };
  ctaSecundair: { tekst: string; href: string };
  /** Herkenbaar, uitgelicht blok (bijv. de samenwerking met BEN in Berkum). */
  uitgelicht?: LokaleSectie;
  secties: LokaleSectie[];
  maatregelen?: { titel: string; intro: string; items: { slug: string; naam: string; tekst: string }[] };
  gijs?: LokaleSectie;
  subsidies?: Alinea[];
  faq?: FAQItem[];
  verwant: { titel: string; links: { naam: string; href: string; tekst: string }[] };
  werkgebied: Alinea[];
};

const SUBSIDIE_TIJDLOOS: Alinea = [
  "Welke regelingen beschikbaar zijn, verschilt per woning, plaats en moment. Tijdens het advies bekijken we welke actuele mogelijkheden bij jouw situatie passen. Gijs kan niet garanderen dat je ergens recht op hebt.",
];

const BEN_HOME = "https://www.berkumenergieneutraal.nl/";
const BEN_OVER = "https://www.berkumenergieneutraal.nl/over-ben/";

const ZWOLLE: Record<string, LokaleInhoud> = {
  "/regio/overijssel/zwolle": {
    seo: {
      title: "Verduurzamen in Zwolle: Gijs in de wijk Berkum | Gijs",
      description: "In Zwolle helpt Gijs bewoners van de wijk Berkum, samen met het bewonersinitiatief Berkum Energieneutraal. Lees wat dat inhoudt en hoe je contact opneemt.",
    },
    kicker: "Gemeente Zwolle",
    h1: "Gijs in Zwolle",
    intro: [
      ["In Zwolle is Gijs vooral actief in de wijk ", { tekst: "Berkum", href: "/regio/overijssel/zwolle/berkum" }, ". Daar werken we samen met het bewonersinitiatief Berkum Energieneutraal (BEN). Op de pagina over Berkum lees je wat die samenwerking voor bewoners betekent."],
    ],
    ctaPrimair: { tekst: "Lees over Gijs in Berkum", href: "/regio/overijssel/zwolle/berkum" },
    ctaSecundair: { tekst: "Neem contact op", href: "/contact" },
    secties: [
      {
        id: "heel-zwolle",
        titel: "Heel Zwolle, niet alleen Berkum",
        alineas: [
          ["Woon je elders in Zwolle en wil je weten wat je aan je woning kunt doen? Neem gerust contact op. Dan kijken we samen of en hoe we je kunnen helpen."],
        ],
        kaartenTitel: "Waar is Zwolle bekend van?",
        kaarten: [
          { icon: "shield", titel: "PEC Zwolle", tekst: "De profclub van de stad." },
          { icon: "leaf", titel: "Berkum", tekst: "De wijk waar Gijs samenwerkt met Berkum Energieneutraal.", href: "/regio/overijssel/zwolle/berkum" },
        ],
      },
    ],
    verwant: {
      titel: "Verder lezen",
      links: [
        { naam: "Verduurzamen in Berkum", href: "/regio/overijssel/zwolle/berkum", tekst: "Hoe Gijs en BEN bewoners van Berkum op weg helpen." },
        { naam: "Zo werkt Gijs", href: "/zo-werkt-gijs", tekst: "Van woningscan naar persoonlijk advies, stap voor stap." },
      ],
    },
    werkgebied: [["De samenwerking met BEN geldt voor de wijk Berkum, niet voor heel Zwolle."]],
  },

  "/regio/overijssel/zwolle/berkum": {
    seo: {
      title: "Woning verduurzamen in Berkum (Zwolle) met Gijs en BEN | Gijs",
      description: "Woon je in Berkum? Gijs werkt samen met Berkum Energieneutraal en helpt je met een gratis energiescan op weg naar een zuiniger, aardgasvrij-klaar huis.",
    },
    kicker: "Berkum, gemeente Zwolle",
    h1: "Je woning verduurzamen in Berkum",
    intro: [
      ["In Berkum wordt al jaren samen gewerkt aan een wijk die minder energie gebruikt en straks zonder aardgas kan. Dat begint bij je eigen huis: hoe goed is het geïsoleerd, en wat is een logische volgende stap?"],
      ["Gijs helpt bewoners van Berkum om daar rustig en zonder verplichtingen achter te komen. Met een gratis energiescan krijg je inzicht in je woning en een helder beeld van wat er kan."],
    ],
    ctaPrimair: { tekst: "Vraag de gratis energiescan voor Berkum aan", href: "/contact#energiescan" },
    ctaSecundair: { tekst: "Start de woningscan", href: "/woning" },
    uitgelicht: {
      id: "gijs-en-ben",
      titel: "Gijs en BEN helpen Berkum vooruit",
      alineas: [
        [{ tekst: "Berkum Energieneutraal", href: BEN_HOME, extern: true }, ", kortweg BEN, is een initiatief van en voor bewoners van Berkum. Het wordt gedragen door vrijwilligers uit de wijk, verenigd in een stichting en een energiecoöperatie. Zij werken samen met onder meer de gemeente Zwolle en de woningcorporaties."],
        ["BEN wil dat Berkum minder energie gebruikt, zelf duurzame energie opwekt en uiteindelijk van het aardgas af gaat. De eerste stap daarin is het verduurzamen van de woningen zelf."],
        ["Gijs is samenwerkingspartner van BEN. Wij helpen bewoners met inzicht in hun woning en met de mogelijke vervolgstappen. Gijs is geen onderdeel van BEN, de gemeente of een woningcorporatie, en werkt ook niet exclusief namens BEN."],
      ],
      punten: [
        { titel: "Inzicht in je woning", tekst: "Tijdens de gratis energiescan kijkt een adviseur met je mee: waar verliest je huis warmte en wat past erbij?" },
        { titel: "Een praktisch startpunt", tekst: "Je krijgt een overzicht van mogelijke maatregelen en de volgorde die logisch is voor jouw huis." },
        { titel: "Jij beslist", tekst: "Welke maatregelen je neemt en met welke aanbieder, kies je helemaal zelf. Er zit geen verplichting aan vast." },
      ],
    },
    secties: [
      {
        id: "aardgasvrij-ready",
        titel: "Wat betekent aardgasvrij-ready?",
        alineas: [
          ["Berkum is één van de proeftuinen in het landelijke programma voor aardgasvrije wijken. BEN heeft daarbij de ambitie dat in 2028 alle woningen in Berkum aardgasvrij-ready zijn. Dat is een doel van BEN, geen belofte van Gijs."],
          ["Aardgasvrij-ready betekent dat je huis zo goed geïsoleerd is dat het straks met een lagere temperatuur verwarmd kan worden. Je stapt dus nog niet meteen van het gas af, maar je woning is er wel klaar voor. Hoe de wijk later precies verwarmd wordt, wordt vastgelegd in een warmteplan van de gemeente Zwolle. Wil je weten hoe BEN daaraan werkt? ", { tekst: "Lees meer over de plannen van BEN", href: BEN_OVER, extern: true }, "."],
        ],
      },
      {
        id: "waar-begin-je",
        titel: "Waar begin je in je eigen huis?",
        alineas: [
          ["Elke woning is anders, ook binnen één straat. Toch is de volgorde vaak hetzelfde: eerst zorgen dat warmte binnen blijft, daarna kijken naar de manier van verwarmen. Een goed geïsoleerd huis voelt comfortabeler, gebruikt minder energie en maakt een warmtepomp later beter mogelijk."],
          ["Twijfel je wat al gedaan is, bijvoorbeeld door een vorige eigenaar? Dat zoeken we tijdens de energiescan samen uit."],
        ],
      },
    ],
    maatregelen: {
      titel: "Maatregelen die vaak aan bod komen",
      intro: "Op weg naar een aardgasvrij-klaar huis gaat het meestal eerst om isoleren. Kies een maatregel om te lezen hoe het werkt.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Heeft je huis een lege spouw, dan is dit vaak een relatief eenvoudige eerste stap." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Warmte stijgt op. Een goed geïsoleerd dak houdt die warmte binnen." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte onder je huis kun je de vloer vaak van onderaf isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
        { slug: "warmtepomp", naam: "Warmtepomp", tekst: "Als je huis goed geïsoleerd is, komt verwarmen met een (hybride) warmtepomp in beeld." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je verder",
      alineas: [
        ["Je kunt beginnen met de digitale woningscan. Daarin vul je in wat je over je huis weet en zie je welke maatregelen bij je woningtype passen. Dat is een goede voorbereiding, maar het hoeft niet."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Samen bekijk je wat er al is gedaan, wat technisch kan en wat voor jou belangrijk is. Daarna weet je welke stappen logisch zijn. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Voor regelingen die specifiek voor Berkum gelden, kun je ook terecht bij BEN."],
    ],
    faq: [
      { question: "Wat is BEN?", answer: "BEN staat voor Berkum Energieneutraal. Het is een initiatief van bewoners uit Berkum, gedragen door vrijwilligers uit de wijk. BEN werkt aan energiebesparing in de wijk, het opwekken van duurzame energie en een toekomst zonder aardgas." },
      { question: "Is Gijs onderdeel van BEN of van de gemeente?", answer: "Nee. Gijs is een zelfstandig bedrijf en samenwerkingspartner van BEN. Gijs is geen onderdeel van BEN, de gemeente Zwolle of een woningcorporatie." },
      { question: "Ben ik verplicht om na de energiescan iets te laten doen?", answer: "Nee. De energiescan is gratis en vrijblijvend. Welke maatregelen je neemt en welke aanbieder je kiest, beslis je zelf." },
      { question: "Moet mijn huis in 2028 van het gas af?", answer: "Nee. Aardgasvrij-ready in 2028 is een ambitie van BEN: woningen zo goed isoleren dat ze later zonder aardgas verwarmd kunnen worden. Het is geen verplichting en geen belofte van Gijs." },
      { question: "Ik woon in Zwolle, maar niet in Berkum. Kan Gijs mij ook helpen?", answer: "De samenwerking met BEN geldt voor Berkum. Woon je elders in Zwolle, neem dan contact op. Dan kijken we of we je kunnen helpen." },
    ],
    verwant: {
      titel: "Verder lezen",
      links: [
        { naam: "Zo werkt Gijs", href: "/zo-werkt-gijs", tekst: "Van woningscan naar persoonlijk advies, stap voor stap." },
        { naam: "Gijs in Zwolle", href: "/regio/overijssel/zwolle", tekst: "Waar Gijs in de gemeente Zwolle actief is." },
      ],
    },
    werkgebied: [
      ["Deze pagina gaat over de wijk Berkum in de gemeente Zwolle. Gijs helpt hier bewoners in samenwerking met BEN. Woon je net buiten Berkum? Neem contact op, dan kijken we samen wat mogelijk is."],
    ],
  },
};

const TWENTE: Record<string, LokaleInhoud> = {
  "/regio/overijssel/borne": {
    seo: {
      title: "Woning isoleren in Borne, Zenderen en Hertme | Gijs",
      description: "Je woning isoleren in Borne? Lees wat het bouwjaar zegt over je isolatie, waarom natuurvriendelijk isoleren hier telt en hoe Gijs je helpt kiezen.",
    },
    kicker: "Gemeente Borne",
    h1: "Je woning isoleren in Borne",
    intro: [
      ["Borne is een compacte gemeente: de kern Borne, de dorpen ", { tekst: "Zenderen", href: "/regio/overijssel/borne/zenderen" }, " en ", { tekst: "Hertme", href: "/regio/overijssel/borne/hertme" }, " en het buitengebied eromheen. Een groot deel van de woningen is gebouwd vóór de jaren negentig. Juist bij die huizen valt vaak nog winst te halen met isolatie."],
      ["Gijs helpt je uitzoeken waar jouw huis warmte verliest en welke stap logisch is. Rustig, en zonder dat je ergens aan vastzit."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "bouwjaar",
        titel: "Wat zegt het bouwjaar van je huis?",
        alineas: [
          ["Volgens het warmteprogramma van de gemeente telde Borne in 2023 ruim 10.300 woningen. Ongeveer 3.700 daarvan zijn na 1992 gebouwd. Zo'n twee op de drie woningen is dus ouder."],
          ["Dat betekent niet dat al die huizen slecht geïsoleerd zijn. Veel woningen zijn in de loop der jaren al verbeterd. Maar bij een huis uit de jaren zestig of zeventig is de kans groter dat er nog iets te winnen valt dan bij recente nieuwbouw. Daarom kijken we eerst wat er al is gedaan, voordat we iets voorstellen."],
        ],
      },
      {
        id: "borne-zenderen-hertme",
        titel: "Borne, Zenderen, Hertme en het buitengebied",
        alineas: [
          ["Of je nu in een rijwoning in de kern woont of in een vrijstaand huis aan de rand van het dorp: de vraag is steeds waar de meeste warmte weglekt. Een vrijstaande woning heeft meer buitenmuur en dak dan een tussenwoning van dezelfde grootte. Daar weegt goede isolatie dus extra zwaar."],
          ["Woon je in een van de dorpen? Lees dan ook over isoleren in ", { tekst: "Zenderen", href: "/regio/overijssel/borne/zenderen" }, " of ", { tekst: "Hertme", href: "/regio/overijssel/borne/hertme" }, "."],
        ],
        kaartenTitel: "Waar is Borne bekend van?",
        kaarten: [
          { icon: "landmark", titel: "Bussemakerhuis", tekst: "Het enige bewaard gebleven linnenhandelshuis van Nederland, aan de Ennekerdijk. Herinnert aan 1675, toen Borne het belangrijkste linnenhandelscentrum van Twente was." },
        ],
      },
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren in Borne",
        alineas: [
          ["Alle woningeigenaren in de gemeente Borne moeten natuurvriendelijk isoleren. In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen, huismussen en gierzwaluwen. Een natuurvriendelijke werkwijze houdt daar rekening mee, bijvoorbeeld met het moment van uitvoeren en de melding die erbij hoort."],
          ["Spreek dit vooraf af met het bedrijf dat de isolatie uitvoert. Zo voorkom je dat een goede maatregel botst met de natuurregels."],
        ],
      },
      {
        id: "warmteprogramma",
        titel: "Waar werkt Borne naartoe?",
        alineas: [
          ["In het warmteprogramma beschrijft de gemeente hoe Borne stap voor stap minder aardgas gaat gebruiken. Als tussendoel noemt de gemeente dat rond 2030 ongeveer 2.100 woningen van het gas af zijn of een grote isolatiestap hebben gemaakt."],
          ["Hoe jouw straat later verwarmd wordt, hoef je nu nog niet te weten. Isoleren is hoe dan ook een logische eerste stap: een huis dat warmte goed vasthoudt, heeft minder energie nodig."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die bij oudere woningen vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van wat er al is gedaan. Dit zijn de onderdelen waar we meestal als eerste naar kijken.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij huizen van vóór de jaren tachtig is de spouw vaak nog leeg of beperkt gevuld. Let hier op natuurvriendelijk werken." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een koude zolder of een warme bovenverdieping in de zomer? Dan is het dak vaak een goede plek om te beginnen." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Koude voeten op de begane grond? Met een kruipruimte is de vloer vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder dubbel glas of enkel glas laat veel warmte door. Beter glas maakt het bij het raam merkbaar comfortabeler." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Borne",
      alineas: [
        ["In de digitale woningscan vul je in een paar minuten in wat je over je huis weet. Je ziet dan welke maatregelen bij je woningtype passen en wat je zelf belangrijk vindt."],
        ["Wil je zekerheid over jouw eigen huis? Dan komt een adviseur van Gijs langs voor de gratis energiescan. Samen kijk je wat er al is gedaan en wat een logische volgende stap is. Wat je daarmee doet, en met wie, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Borne heeft ook een eigen isolatieregeling. Of die op dit moment loopt en of jouw woning in aanmerking komt, lees je bij de gemeente zelf."],
    ],
    faq: [
      { question: "Moet ik in Borne natuurvriendelijk isoleren?", answer: "Ja, volgens de gemeente Borne moeten alle woningeigenaren natuurvriendelijk isoleren. In spouwmuren en daken kunnen beschermde dieren leven, zoals vleermuizen, huismussen en gierzwaluwen. Het bedrijf dat de isolatie uitvoert, moet daar rekening mee houden. Vraag er vooraf naar." },
      { question: "Mijn huis is gebouwd vóór 1992. Is isoleren dan zinvol?", answer: "Vaak wel, maar het hangt af van wat er al is gedaan. Veel oudere woningen zijn al deels verbeterd. Tijdens de energiescan kijken we wat er nog te winnen valt." },
      { question: "Helpt Gijs ook in Zenderen, Hertme en het buitengebied?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Borne, dus ook in de dorpen en daarbuiten." },
      { question: "Moet ik wachten tot duidelijk is hoe mijn wijk verwarmd gaat worden?", answer: "Nee. Isoleren helpt bij elke manier van verwarmen. Een goed geïsoleerd huis gebruikt nu minder energie en is straks klaar voor een duurzame warmtebron." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Hengelo", href: "/regio/overijssel/hengelo", tekst: "Veel woningen uit 1961 tot 2000: wat betekent dat voor isolatie?" },
        { naam: "Isoleren in Enschede", href: "/regio/overijssel/enschede", tekst: "Over appartementen, oudere woningen en wijken in de warmtetransitie." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in de hele gemeente Borne: in de kern Borne, in Zenderen, in Hertme en in het buitengebied. Woon je net over de gemeentegrens? Neem gerust contact op."],
    ],
  },

  "/regio/overijssel/hengelo": {
    seo: {
      title: "Woning isoleren in Hengelo: wat past bij jouw bouwjaar? | Gijs",
      description: "Veel woningen in Hengelo zijn gebouwd tussen 1961 en 2000. Lees welke isolatie bij die bouwjaren vaak aan bod komt en hoe Gijs je helpt de juiste stap te kiezen.",
    },
    kicker: "Gemeente Hengelo",
    h1: "Je woning isoleren in Hengelo",
    intro: [
      ["Hengelo telt ruim 40.000 woningen. Een groot deel daarvan is gebouwd in de tweede helft van de vorige eeuw, toen er heel anders werd gebouwd dan nu. Het bouwjaar van je huis zegt daarom veel over waar het warmte verliest."],
      ["Gijs helpt je dat voor jouw woning uit te zoeken en laat zien welke stap daarna logisch is."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "herkenningspunten",
        titel: "De torens van Hengelo",
        alineas: [
          ["Herkenningspunten voor de binnenstad van Hengelo zijn de torens van de Sint-Lambertusbasiliek en het stadhuis, allebei rijksmonument."],
          ["Hengelo bestaat ook uit het dorp ", { tekst: "Beckum", href: "/regio/overijssel/hengelo/beckum" }, ", het enige kerkdorp binnen de gemeente."],
        ],
        kaartenTitel: "Waar is Hengelo bekend van?",
        kaarten: [
          { icon: "building-2", titel: "De stadhuistoren", tekst: "59 meter hoog, met carillon, gebouwd tussen 1958 en 1963." },
          { icon: "church", titel: "Sint-Lambertusbasiliek", tekst: "Dateert uit 1889-1890 en is bijna even hoog als de stadhuistoren." },
        ],
      },
      {
        id: "bouwperioden",
        titel: "Twee bouwperioden springen eruit",
        alineas: [
          ["In het warmteprogramma van de gemeente Hengelo zijn twee groepen woningen het grootst: bijna 11.000 woningen uit de periode 1961 tot en met 1980, en bijna 9.900 woningen uit 1981 tot en met 2000. Samen gaat het om ruim 20.000 huizen."],
          ["Die twee periodes vragen vaak om een andere aanpak. Natuurlijk is elk huis anders, zeker als er al eerder is verbouwd."],
        ],
        punten: [
          { titel: "Gebouwd 1961 tot 1980", tekst: "In deze periode werd nog weinig geïsoleerd. De spouw is vaak leeg of beperkt gevuld, en dak en vloer zijn vaak niet of matig geïsoleerd." },
          { titel: "Gebouwd 1981 tot 2000", tekst: "Deze huizen kregen meestal al wat isolatie mee, maar minder dan nu gebruikelijk is. Extra isolatie of beter glas kan nog helpen; de winst verschilt sterk per huis." },
          { titel: "Al eerder verbouwd?", tekst: "Wat er sinds de bouw is verbeterd, zie je niet altijd aan de buitenkant. Daarom begint het bij Gijs met kijken wat er al is." },
        ],
      },
      {
        id: "isoleren-en-warmte",
        titel: "Van isoleren naar duurzame warmte",
        alineas: [
          ["De gemeente Hengelo werkt aan een warmteprogramma. Daarin staat hoe bestaande woningen de komende jaren minder aardgas gaan gebruiken, met isoleren en duurzame warmte als belangrijke onderdelen."],
          ["Hoe jouw wijk later verwarmd wordt, ligt misschien nog niet vast. Met isoleren kun je wel alvast beginnen. Een huis dat warmte goed vasthoudt, is zuiniger met elke vorm van verwarming, ook met een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
        ],
      },
      {
        id: "beschermde-dieren",
        titel: "Let op beschermde dieren",
        alineas: [
          ["In Overijssel kunnen vleermuizen en vogels die in gebouwen nestelen in spouwmuren en onder daken zitten. Bij spouw- en dakisolatie moet daar rekening mee worden gehouden. Gemeenten en provincie werken daarvoor met eigen afspraken. Vraag het bedrijf dat de isolatie uitvoert hoe het dit regelt."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie voor huizen uit 1961 tot 2000",
      intro: "Bij woningen uit deze periode komen we deze maatregelen het vaakst tegen. Kies er een om te lezen hoe het werkt.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Vooral bij huizen uit de jaren zestig en zeventig is de spouw vaak nog leeg. Dan is dit vaak een logische eerste stap." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een zolder die je wilt gebruiken, of een dak dat bij de bouw weinig isolatie kreeg? Dan loont het dak vaak." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Veel huizen uit deze periode hebben een kruipruimte. Daarmee is de vloer vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ook in huizen uit de jaren tachtig en negentig zit vaak nog ouder dubbel glas. Vervangen maakt het merkbaar comfortabeler." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Hengelo",
      alineas: [
        ["Begin met de digitale woningscan: daarin kies je je woningtype, vul je in wat je al weet en zie je welke maatregelen erbij passen. Dat is een handige voorbereiding, maar geen verplichting."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Hij of zij kijkt naar het bouwjaar, naar wat er al is gedaan en naar wat jij belangrijk vindt. Daarna weet je welke stappen logisch zijn. Jij beslist wat je ermee doet."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Ook de gemeente Hengelo heeft regelingen voor het verduurzamen van een woning. De actuele voorwaarden vind je bij de gemeente."],
    ],
    faq: [
      { question: "Mijn huis in Hengelo is van na 1980. Heeft isoleren dan nog zin?", answer: "Dat kan zeker. Huizen uit de jaren tachtig en negentig kregen wel isolatie mee, maar minder dan nu gangbaar is. Of extra isolatie of beter glas loont, hangt af van je huis. Dat bekijken we tijdens de energiescan." },
      { question: "Moet ik wachten op het warmteprogramma van de gemeente?", answer: "Nee. Hoe jouw wijk later ook verwarmd wordt, een goed geïsoleerd huis heeft minder warmte nodig. Isoleren is daarom altijd een zinvolle eerste stap." },
      { question: "Wat doe ik eerst: isoleren of een warmtepomp?", answer: "Meestal eerst isoleren. Een warmtepomp werkt het best in een huis dat warmte goed vasthoudt. Tijdens de energiescan bespreken we wat voor jouw woning een logische volgorde is." },
      { question: "Komt Gijs bij mij thuis in Hengelo?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats, zodat de adviseur je woning echt kan bekijken." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Borne", href: "/regio/overijssel/borne", tekst: "Over oudere woningen, de dorpen en natuurvriendelijk isoleren." },
        { naam: "Isoleren in Enschede", href: "/regio/overijssel/enschede", tekst: "Over appartementen en wijken in de warmtetransitie." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in de hele gemeente Hengelo. Woon je in een buurgemeente zoals Borne of Enschede? Ook daar kun je bij ons terecht."],
    ],
  },

  "/regio/overijssel/enschede": {
    seo: {
      title: "Woning isoleren in Enschede: advies per huis en wijk | Gijs",
      description: "Isoleren in Enschede? Lees waar je op let bij een eengezinswoning of appartement, hoe natuurvriendelijk isoleren werkt en hoe Gijs je op weg helpt.",
    },
    kicker: "Gemeente Enschede",
    h1: "Je huis isoleren in Enschede",
    intro: [
      ["Enschede is de grootste gemeente van Twente, met bijna 78.000 woningen. Die lopen sterk uiteen: van vooroorlogse huizen tot appartementen. Er is dus ook niet één isolatieadvies dat voor iedereen klopt."],
      ["Gijs helpt je kijken naar jouw eigen woning: wat is er al gedaan, waar lekt warmte weg en wat is een haalbare volgende stap?"],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "textielstad",
        titel: "Een stad gevormd door de textielindustrie",
        alineas: [
          ["Enschede groeide vooral in de negentiende en twintigste eeuw snel door de textielindustrie, die lange tijd het beeld van de stad bepaalde. Veel van de grote fabriekscomplexen verdwenen in de jaren zeventig en tachtig, maar de sociale woningbouw en tuinwijken uit die tijd staan er nog altijd."],
          ["Dat verklaart waarom Enschede zo'n brede mix van bouwperiodes kent, van vooroorlogse arbeiderswijken tot naoorlogse uitbreidingen."],
        ],
        kaartenTitel: "Waar is Enschede bekend van?",
        kaarten: [
          { icon: "church", titel: "De Grote Kerk", tekst: "Midden op de Oude Markt. De basis van het gebouw gaat terug op een Romaanse kerk van rond 1200." },
          { icon: "shield", titel: "FC Twente", tekst: "De profclub van de stad, met thuisbasis stadion De Grolsch Veste." },
        ],
      },
      {
        id: "eengezinswoning-of-appartement",
        titel: "Een eengezinswoning of een appartement?",
        alineas: [
          ["In Enschede zijn appartementen het meest voorkomende woningtype. Woon je in een appartement, dan beslis je vaak niet alleen: dak, gevel en vloer deel je meestal met andere eigenaren, bijvoorbeeld in een VvE. Beter glas of het aanpakken van tocht ligt soms wel binnen je eigen bereik."],
          ["Bij een eengezinswoning heb je meer zelf in de hand. Dan kun je per onderdeel kijken: dak, spouwmuur, vloer en glas. In beide gevallen helpt het om eerst te weten wat er al is gedaan."],
        ],
      },
      {
        id: "wijken-warmtetransitie",
        titel: "Wijken in de warmtetransitie",
        alineas: [
          ["De gemeente Enschede werkt per wijk aan de overstap naar duurzame warmte. Wijken als Twekkelerveld, Stroinkslanden Zuid en 't Lang komen daarin terug. Wat er in jouw buurt speelt, lees je op de website van de gemeente."],
          ["Isoleren is in elke wijk een goede eerste stap. Een goed geïsoleerd huis heeft minder warmte nodig, hoe je straks ook verwarmt."],
        ],
      },
      {
        id: "dorpen-van-enschede",
        titel: "De dorpen rond de stad",
        alineas: [
          ["Enschede is niet alleen de stad zelf: ", { tekst: "Boekelo", href: "/regio/overijssel/enschede/boekelo" }, ", ", { tekst: "Glanerbrug", href: "/regio/overijssel/enschede/glanerbrug" }, ", ", { tekst: "Lonneker", href: "/regio/overijssel/enschede/lonneker" }, ", ", { tekst: "Usselo", href: "/regio/overijssel/enschede/usselo" }, " en het buurtschap ", { tekst: "Twekkelo", href: "/regio/overijssel/enschede/twekkelo" }, " horen ook bij de gemeente, elk met een eigen karakter."],
        ],
      },
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren in Enschede",
        alineas: [
          ["De gemeente Enschede wijst op beschermde dieren die in en aan woningen leven, zoals huismussen, gierzwaluwen en vleermuizen. Bij het isoleren van spouwmuren en daken moet daar rekening mee worden gehouden."],
          ["Een isolatiebedrijf dat natuurvriendelijk werkt, regelt de melding die daarvoor nodig is. Vraag daar vooraf naar, dan weet je zeker dat het goed geregeld is."],
        ],
      },
    ],
    maatregelen: {
      titel: "Maatregelen voor woningen in Enschede",
      intro: "Wat bij jouw huis past, verschilt per woningtype en bouwjaar. Deze maatregelen komen in Enschede vaak ter sprake.",
      items: [
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Een stap die je ook in een appartement vaak zelf kunt zetten. Beter glas houdt warmte binnen en voelt minder koud aan." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Bij een eengezinswoning verdwijnt veel warmte via het dak. Een geïsoleerde zolder is bovendien beter bruikbaar." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een relatief eenvoudige stap. Let op natuurvriendelijk werken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte onder het huis is de vloer vaak van onderaf te isoleren, zonder breekwerk binnen." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Enschede",
      alineas: [
        ["Twijfel je waar je moet beginnen? In de digitale woningscan zie je in een paar minuten welke maatregelen bij jouw type woning passen."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs langs voor de gratis energiescan. Je krijgt een helder beeld van wat er kan en in welke volgorde. Je zit nergens aan vast en kiest zelf met wie je verdergaat."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Enschede heeft een eigen regeling voor isolatie. Of die op dit moment open staat en of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Ik woon in een appartement in Enschede. Kan ik dan iets doen?", answer: "Dat hangt af van je situatie. Dak en gevel regel je vaak samen met de VvE. Beter glas of het aanpakken van tocht ligt soms meer binnen je eigen bereik." },
      { question: "Wat betekent natuurvriendelijk isoleren voor mij?", answer: "Dat bij spouw- en dakisolatie rekening wordt gehouden met beschermde dieren zoals huismussen, gierzwaluwen en vleermuizen. Een natuurvriendelijk werkend isolatiebedrijf regelt de melding die daarbij hoort." },
      { question: "Mijn wijk zit in de warmtetransitie. Moet ik nu al iets doen?", answer: "Je bent niet verplicht om nu iets te doen. Wel is isoleren een verstandige eerste stap: je huis heeft dan minder warmte nodig, welke warmtebron er straks ook komt." },
      { question: "Wat kost de energiescan van Gijs?", answer: "Niets. De energiescan aan huis is gratis en vrijblijvend." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Hengelo", href: "/regio/overijssel/hengelo", tekst: "Veel woningen uit 1961 tot 2000: wat betekent dat voor isolatie?" },
        { naam: "Zo werkt Gijs", href: "/zo-werkt-gijs", tekst: "Van woningscan naar persoonlijk advies, stap voor stap." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Enschede, in alle wijken. Woon je net buiten de gemeente, bijvoorbeeld in Hengelo? Daar vind je een ", { tekst: "eigen pagina over isoleren in Hengelo", href: "/regio/overijssel/hengelo" }, "."],
    ],
  },
};

// Tweede ronde (Hof van Twente, Almelo, Oldenzaal), ook alleen op basis van de twee rapporten.
// Tijdgebonden punten om periodiek na te lopen: de wijkfocus van Almelo voor 2026 en de planning
// van het soortenmanagementplan in Oldenzaal.
const TWENTE_RONDE_2: Record<string, LokaleInhoud> = {
  "/regio/overijssel/hof-van-twente": {
    seo: {
      title: "Woning isoleren in Goor, Delden, Markelo en Hof van Twente | Gijs",
      description: "Isoleren in Hof van Twente? Veel vrijstaande en twee-onder-een-kapwoningen vragen om een eigen aanpak. Lees waar je op let en hoe Gijs je helpt.",
    },
    kicker: "Gemeente Hof van Twente",
    h1: "Je woning isoleren in Hof van Twente",
    intro: [
      ["Hof van Twente is een gemeente van dorpen en buitengebied: ", { tekst: "Goor", href: "/regio/overijssel/hof-van-twente/goor" }, ", ", { tekst: "Delden", href: "/regio/overijssel/hof-van-twente/delden" }, ", ", { tekst: "Markelo", href: "/regio/overijssel/hof-van-twente/markelo" }, ", ", { tekst: "Diepenheim", href: "/regio/overijssel/hof-van-twente/diepenheim" }, ", ", { tekst: "Hengevelde", href: "/regio/overijssel/hof-van-twente/hengevelde" }, " en ", { tekst: "Bentelo", href: "/regio/overijssel/hof-van-twente/bentelo" }, ". Veel mensen wonen hier in een eigen huis met een tuin eromheen. Dat merk je ook aan de isolatievraag."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt, en in welke volgorde je het beste kunt beginnen."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vrijstaand-en-twee-onder-een-kap",
        titel: "Veel vrijstaande huizen en twee-onder-een-kappers",
        alineas: [
          ["Volgens het warmteprogramma van de gemeente zijn de woningen in Hof van Twente grotendeels grondgebonden. Er staan relatief veel vrijstaande woningen en twee-onder-een-kapwoningen, en ongeveer zeven op de tien woningen zijn koopwoningen. De woningvoorraad is bovendien relatief oud."],
          ["Een vrijstaand huis heeft aan alle kanten buitenmuur en vaak een groot dak. Het verliest daardoor meer warmte dan een rijwoning van dezelfde grootte, dus goed isoleren levert relatief veel op. En omdat het je eigen huis is, bepaal je zelf wat je aanpakt en wanneer."],
        ],
        punten: [
          { titel: "Vrijstaand", tekst: "Vier gevels, een dak en een vloer die allemaal warmte kunnen verliezen. Kijk naar het geheel, niet naar één onderdeel." },
          { titel: "Twee-onder-een-kap", tekst: "Eén muur deel je met de buren. De andere gevels, het dak en de vloer bepalen hier het meeste warmteverlies." },
          { titel: "Oudere woning", tekst: "Bij een ouder huis is vaak nog veel te winnen. Wat er al is verbeterd, bekijken we eerst." },
        ],
      },
      {
        id: "dorpen",
        titel: "Van Goor tot Bentelo",
        alineas: [
          ["Of je nu in het centrum van Goor woont, in een van de dorpen of in het buitengebied: voor isolatie gaat het vooral om je eigen huis, het bouwjaar en wat er al is gedaan."],
          ["Lees ook over isoleren in ", { tekst: "Goor", href: "/regio/overijssel/hof-van-twente/goor" }, ", ", { tekst: "Delden", href: "/regio/overijssel/hof-van-twente/delden" }, ", ", { tekst: "Markelo", href: "/regio/overijssel/hof-van-twente/markelo" }, ", ", { tekst: "Diepenheim", href: "/regio/overijssel/hof-van-twente/diepenheim" }, ", ", { tekst: "Hengevelde", href: "/regio/overijssel/hof-van-twente/hengevelde" }, " of ", { tekst: "Bentelo", href: "/regio/overijssel/hof-van-twente/bentelo" }, "."],
        ],
        kaartenTitel: "Waar is Hof van Twente bekend van?",
        kaarten: [
          { icon: "castle", titel: "Landgoed Twickel", tekst: "Bij Delden: het grootste particuliere landgoed van Nederland, met een oudste vermelding uit 1347.", href: "/regio/overijssel/hof-van-twente/delden" },
          { icon: "mountain", titel: "De Markelose Berg", tekst: "Bij Markelo: hierop staat het Overijssels Verzetsmonument 1940-1945.", href: "/regio/overijssel/hof-van-twente/markelo" },
        ],
      },
      {
        id: "warmteprogramma",
        titel: "Het warmteprogramma tot 2035",
        alineas: [
          ["De gemeente werkt aan een warmteprogramma voor de periode 2026 tot 2035. Daaruit blijkt dat er in Hof van Twente een flinke verduurzamingsopgave ligt, juist omdat veel woningen wat ouder zijn."],
          ["Voor jou als bewoner is de eerste stap meestal dezelfde: zorg dat je huis warmte goed vasthoudt. Dat scheelt nu al op je energierekening en maakt een overstap naar duurzame warmte later makkelijker."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isoleren bij een grondgebonden woning",
      intro: "Bij vrijstaande en twee-onder-een-kapwoningen komen deze onderdelen het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen. Vaak de plek waar het meeste te winnen valt." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Heeft je huis veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap. Let op beschermde dieren in de spouw." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Een koude begane grond voel je in een vrijstaand huis snel. Met een kruipruimte is de vloer vaak van onderaf te isoleren." },
        { slug: "warmtepomp", naam: "Warmtepomp", tekst: "Is je huis goed geïsoleerd, dan komt verwarmen met een (hybride) warmtepomp in beeld." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Hof van Twente",
      alineas: [
        ["Met de digitale woningscan zie je snel welke maatregelen bij een vrijstaande woning, een twee-onder-een-kapper of een ander type passen. Handig als voorbereiding, maar niet nodig."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs bij je langs, ook in de dorpen en het buitengebied. Samen kijk je wat er al is gedaan en wat een verstandige volgende stap is. Wat je daarna doet en met wie, kies je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Hof van Twente heeft ook een eigen isolatieregeling. Of die op dit moment loopt en of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Ik woon in een vrijstaande woning. Waar begin ik?", answer: "Meestal bij het onderdeel waar de meeste warmte verloren gaat. Bij een vrijstaand huis is dat vaak het dak, maar het hangt af van wat er al is geïsoleerd. Tijdens de energiescan zetten we dat op een rij." },
      { question: "Is een twee-onder-een-kapwoning anders dan een vrijstaand huis?", answer: "Een beetje. Je deelt één muur met de buren, dus daar verlies je weinig warmte. De andere gevels, het dak en de vloer blijven belangrijk." },
      { question: "Helpt Gijs ook in de kleinere dorpen en het buitengebied?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hof van Twente, van Goor en Delden tot Hengevelde en Bentelo." },
      { question: "Wat betekent het warmteprogramma voor mijn huis?", answer: "Het programma beschrijft de koers voor de hele gemeente. Wat het precies voor jouw straat betekent, maakt de gemeente later bekend. Isoleren kun je nu al doen, en dat is nooit weggegooid." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Borne", href: "/regio/overijssel/borne", tekst: "Ook een gemeente met dorpen en buitengebied, en aandacht voor natuurvriendelijk isoleren." },
        { naam: "Isoleren in Hengelo", href: "/regio/overijssel/hengelo", tekst: "Wat het bouwjaar van je huis zegt over isolatie." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Hof van Twente: in Goor, Delden, Markelo, Diepenheim, Hengevelde, Bentelo en het buitengebied."],
    ],
  },

  "/regio/overijssel/almelo": {
    seo: {
      title: "Woning isoleren in Almelo: de eerste stap, wijk voor wijk | Gijs",
      description: "Almelo pakt de warmtetransitie wijk voor wijk aan, met isoleren als eerste stap. Lees wat dat voor jouw woning betekent en hoe Gijs je op weg helpt.",
    },
    kicker: "Gemeente Almelo",
    h1: "Je woning isoleren in Almelo",
    intro: [
      ["Almelo telt bijna 35.000 woningen. De gemeente werkt wijk voor wijk aan de overstap naar duurzame warmte, en noemt isoleren daarbij nadrukkelijk als eerste stap. Dat geldt voor elke wijk, ook als jouw buurt nog niet aan de beurt is."],
      ["Gijs helpt je om die eerste stap concreet te maken: wat kan er bij jouw huis, en waar begin je?"],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "wijk-voor-wijk",
        titel: "Wijk voor wijk van het aardgas af",
        alineas: [
          ["Voor 2026 noemt de gemeente de Binnenstad Noord, de Binnenstad Zuid en Ulk en omgeving als focus van de warmtetransitie. Daarna volgen onder meer Kerkelanden en Wester Sluitersveldlanden. Welke planning voor jouw buurt geldt, lees je bij de gemeente Almelo."],
          ["Woon je in een wijk die later aan de beurt is? Dan hoef je niet te wachten. Isoleren helpt in elke wijk en bij elke manier van verwarmen. Almelo bestaat ook uit dorpen los van de stad zelf: ", { tekst: "Aadorp", href: "/regio/overijssel/almelo/aadorp" }, ", ", { tekst: "Bornerbroek", href: "/regio/overijssel/almelo/bornerbroek" }, " en ", { tekst: "Harbrinkhoek-Mariaparochie", href: "/regio/overijssel/almelo/harbrinkhoek-mariaparochie" }, "."],
        ],
        kaartenTitel: "Waar is Almelo bekend van?",
        kaarten: [
          { icon: "landmark", titel: "De Grote Kerk", tekst: "Rijksmonument aan het Kerkplein, oorspronkelijk de slotkapel van de heren van Almelo. Het koor dateert uit 1493, het schip uit 1738." },
          { icon: "shield", titel: "Heracles Almelo", tekst: "De profclub van de stad, met thuisbasis het Asito Stadion." },
        ],
      },
      {
        id: "isoleren-eerst",
        titel: "Waarom isoleren eerst?",
        alineas: [
          ["Een huis dat warmte goed vasthoudt, heeft minder energie nodig. Dat merk je nu al op je energierekening en aan het comfort in huis. Later kun je met een kleinere of zuinigere installatie toe, welke warmtebron er in jouw wijk ook komt."],
          ["Andersom werkt minder goed: een nieuwe verwarming in een slecht geïsoleerd huis moet harder werken, en dat kost geld."],
        ],
      },
      {
        id: "appartement-vve",
        titel: "Woon je in een appartement?",
        alineas: [
          ["Bij een appartement loopt verduurzamen vaak via de Vereniging van Eigenaren, omdat dak, gevel en vloer van iedereen samen zijn. De gemeente Almelo heeft daar aparte aandacht voor, met een eigen regeling voor VvE's. De voorwaarden lees je bij de gemeente."],
        ],
      },
      {
        id: "natuurvriendelijk",
        titel: "Natuurvriendelijk isoleren en verbouwen",
        alineas: [
          ["Ook Almelo besteedt aandacht aan natuurvriendelijk isoleren en verbouwen. In spouwmuren en onder daken kunnen beschermde dieren zitten, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het daar rekening mee houdt."],
        ],
      },
    ],
    maatregelen: {
      titel: "Waar begin je met isoleren?",
      intro: "Dit zijn de maatregelen die bij een eengezinswoning het vaakst als eerste stap aan bod komen.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een relatief kleine ingreep met een merkbaar resultaat." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Warmere voeten op de begane grond. Met een kruipruimte meestal van onderaf te doen." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Almelo",
      alineas: [
        ["In de digitale woningscan zie je in een paar minuten welke maatregelen bij jouw type woning horen. Zo weet je al wat meer voordat je met iemand praat."],
        ["Bij de gratis energiescan bekijkt een adviseur van Gijs je huis ter plekke. Je krijgt een duidelijk beeld van wat er kan en in welke volgorde. Er zit geen verplichting aan vast: je kiest zelf of en met wie je verdergaat."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Welke regelingen de gemeente Almelo op dit moment heeft, lees je op de website van de gemeente."],
    ],
    faq: [
      { question: "Mijn wijk is nog niet aan de beurt. Moet ik wachten met isoleren?", answer: "Nee. Isoleren helpt bij elke manier van verwarmen. Een goed geïsoleerd huis is nu zuiniger en straks klaar voor duurzame warmte, wanneer jouw wijk ook aan de beurt is." },
      { question: "Waarom noemt de gemeente isoleren de eerste stap?", answer: "Omdat een huis dat weinig warmte verliest, minder energie nodig heeft. Dat maakt elke volgende stap, zoals een warmtepomp of een warmtenet, makkelijker en goedkoper in gebruik." },
      { question: "Ik woon in een appartement. Wat kan ik doen?", answer: "Veel loopt via de VvE, omdat dak en gevel gedeeld zijn. De gemeente Almelo heeft daar een eigen regeling voor. Beter glas of het aanpakken van tocht kun je soms ook zelf regelen." },
      { question: "Komt Gijs bij mij thuis in Almelo?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats, zodat de adviseur je woning echt kan bekijken." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Borne", href: "/regio/overijssel/borne", tekst: "Over oudere woningen, de dorpen en natuurvriendelijk isoleren." },
        { naam: "Isoleren in Enschede", href: "/regio/overijssel/enschede", tekst: "Over appartementen en wijken in de warmtetransitie." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Almelo, van de binnenstad tot de wijken eromheen. Twijfel je of we bij jou langskomen? Neem gerust contact op."],
    ],
  },

  "/regio/overijssel/oldenzaal": {
    seo: {
      title: "Woning isoleren in Oldenzaal: van tussenwoning tot dak | Gijs",
      description: "In Oldenzaal zijn tussenwoningen de grootste groep. Lees hoe je zo'n huis slim isoleert, wat het lopende natuuronderzoek betekent en hoe Gijs helpt.",
    },
    kicker: "Gemeente Oldenzaal",
    h1: "Je woning isoleren in Oldenzaal",
    intro: [
      ["Oldenzaal telt bijna 15.000 woningen. De grootste groep daarvan zijn tussenwoningen: huizen met aan twee kanten buren. Dat bepaalt voor een deel waar je huis warmte verliest, en dus waar je het beste kunt beginnen."],
      ["Gijs helpt je dat voor jouw eigen huis uit te zoeken, zodat je weet welke stap het meeste oplevert."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "plechelmusbasiliek",
        titel: "Waar is Oldenzaal bekend van?",
        alineas: [
          ["Midden in Oldenzaal staat de Basiliek van de Heilige Plechelmus, een Romaanse zandstenen kruisbasiliek en rijksmonument."],
        ],
        kaarten: [
          { icon: "church", titel: "Plechelmusbasiliek", tekst: "De kern van het gebouw stamt uit de tweede helft van de twaalfde eeuw; het gotische koor kwam er halverwege de vijftiende eeuw bij, het zuiderschip in 1480." },
        ],
      },
      {
        id: "tussenwoning",
        titel: "Een tussenwoning isoleren",
        alineas: [
          ["Met ruim 5.100 adressen zijn tussenwoningen in Oldenzaal de grootste woninggroep. Bij zo'n huis verlies je weinig warmte via de zijmuren, want daar wonen de buren. De warmte gaat vooral weg via het dak, de voor- en achtergevel, de vloer en de ramen."],
          ["Dat maakt de keuze overzichtelijk. Vaak begin je bij het dak of de zolder en kijk je daarna naar de gevels en het glas."],
        ],
        punten: [
          { titel: "Dak en zolder", tekst: "Warmte stijgt op. Bij een tussenwoning is het dak vaak de grootste lekpost en dus een logische eerste stap." },
          { titel: "Voor- en achtergevel", tekst: "Twee gevels met ramen en deuren. Een lege spouw en ouder glas maken hier veel verschil." },
          { titel: "Vloer", tekst: "Heb je een kruipruimte? Dan is de begane grondvloer vaak van onderaf te isoleren." },
        ],
      },
      {
        id: "natuuronderzoek",
        titel: "Natuuronderzoek in Oldenzaal",
        alineas: [
          ["De gemeente Oldenzaal heeft in de bebouwde kom uitgebreid onderzoek laten doen naar beschermde dieren die in en aan gebouwen leven, zoals huismussen, gierzwaluwen, zwaluwen, spreeuwen en vleermuizen. Dat onderzoek is de basis voor een soortenmanagementplan, dat de gemeente eind 2027 verwacht."],
          ["Met zo'n plan kan natuurvriendelijk isoleren straks voor een heel gebied geregeld worden, in plaats van per huis. Tot dat zover is, moet bij elke woning rekening worden gehouden met deze dieren, zeker bij spouw- en dakisolatie. Vraag het isolatiebedrijf hoe het dit aanpakt."],
        ],
      },
    ],
    maatregelen: {
      titel: "Maatregelen voor een tussenwoning",
      intro: "Bij rij- en tussenwoningen in Oldenzaal komen deze maatregelen het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Vaak de eerste stap: het dak is bij een tussenwoning het grootste oppervlak waarlangs warmte ontsnapt." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Voor- en achtergevel met een lege spouw? Dan is isoleren vaak goed te doen. Let op natuurvriendelijk werken." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Met ramen aan voor- en achterkant telt goed glas extra mee voor warmte en comfort." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Minder koude voeten en minder warmteverlies naar de kruipruimte." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Oldenzaal",
      alineas: [
        ["Kies in de digitale woningscan voor een tussenwoning of een ander type, en zie welke maatregelen erbij passen. Zo ben je goed voorbereid."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Samen kijk je naar het dak, de gevels, de vloer en het glas, en naar wat er al is gedaan. Daarna weet je wat een logische volgende stap is. Wat je ermee doet, beslis je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Oldenzaal heeft ook een eigen isolatieregeling. Of die op dit moment loopt en of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Ik woon in een tussenwoning in Oldenzaal. Waar begin ik?", answer: "Vaak bij het dak of de zolder, omdat daar bij een tussenwoning veel warmte verdwijnt. Daarna komen de voor- en achtergevel en het glas. Wat bij jouw huis de beste volgorde is, bekijken we tijdens de energiescan." },
      { question: "Wat betekent het soortenmanagementplan voor mij?", answer: "Met zo'n plan kan de gemeente natuurvriendelijk isoleren voor een heel gebied regelen. Tot het plan er is, moet bij elke woning rekening worden gehouden met beschermde dieren. Het isolatiebedrijf hoort dat te regelen." },
      { question: "Moet ik wachten tot het plan klaar is?", answer: "Nee. Je kunt nu al isoleren, zolang het natuurvriendelijk gebeurt. Vraag het isolatiebedrijf vooraf hoe het daarmee omgaat." },
      { question: "Helpt Gijs in heel Oldenzaal?", answer: "Ja. Gijs helpt bewoners in alle wijken van Oldenzaal." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Enschede", href: "/regio/overijssel/enschede", tekst: "Ook daar staat natuurvriendelijk isoleren centraal." },
        { naam: "Isoleren in Hengelo", href: "/regio/overijssel/hengelo", tekst: "Wat het bouwjaar van je huis zegt over isolatie." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Oldenzaal, van De Thij tot Graven Es. Woon je net buiten de gemeente? Neem gerust contact op."],
    ],
  },
};

// Dorpen binnen al bestaande gemeenten die eerst alleen de generieke template toonden (noindex).
// Op verzoek van Max (2026-10-19) krijgen alle officiële dorpen binnen de huidige gemeenten een
// eigen pagina, na het leggen van de aangeleverde plaatsenset naast
// https://nl.wikipedia.org/wiki/Lijst_van_steden_en_dorpen_in_Overijssel. Pure buurtschappen
// (geen dorpsstatus) blijven bewust noindex, zie de toelichting bij PUBLICATIE in lib/content/regio.ts.
//
// Herkenningspunten/lokale feiten in dit bestand (toegevoegd 2026-10-19, tweede onderzoeksronde
// o.b.v. een tweede ChatGPT-rapport dat VVV/Visit-sites, het Rijksmonumentenregister en AlleCijfers.nl
// als bronvolgorde adviseert) zijn stuk voor stuk bronvermeld te herleiden; waar geen betrouwbare
// bron is gevonden, is niets verzonnen en blijft de generieke tekst staan.
const HENGELO_BECKUM: Record<string, LokaleInhoud> = {
  "/regio/overijssel/hengelo/beckum": {
    seo: {
      title: "Woning isoleren in Beckum | Gijs",
      description: "Isoleren in Beckum, het enige kerkdorp van de gemeente Hengelo? Lees hoe Gijs je helpt.",
    },
    kicker: "Beckum, gemeente Hengelo",
    h1: "Je woning isoleren in Beckum",
    intro: [
      ["Beckum is het enige kerkdorp binnen de gemeente Hengelo, los van de stad zelf."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Beckum bekend van?",
        kaarten: [
          { icon: "users", titel: "'t Proggiehoes", tekst: "Het dorpshuis van Beckum, met ongeveer 1.000 inwoners een van de voorzieningen die het dorp zijn eigen karakter geven." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Beckum vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van wat er al is gedaan.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een logische stap." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Beckum",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Beckum valt onder de gemeente Hengelo, die een eigen regeling heeft voor isoleren. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Is Beckum hetzelfde als de stad Hengelo?", answer: "Nee. Beckum is het enige kerkdorp binnen de gemeente Hengelo, met een eigen dorpscentrum rond onder meer dorpshuis 't Proggiehoes." },
      { question: "Komt Gijs ook bij mij thuis in Beckum?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Gemeente Hengelo", href: "/regio/overijssel/hengelo", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Beckum en de rest van de gemeente Hengelo."]],
  },
};

const ENSCHEDE_DORPEN: Record<string, LokaleInhoud> = {
  "/regio/overijssel/enschede/boekelo": {
    seo: {
      title: "Woning isoleren in Boekelo | Gijs",
      description: "Isoleren in Boekelo, bekend van de zoutwinning en Military Boekelo-Enschede? Lees hoe Gijs je helpt.",
    },
    kicker: "Boekelo, gemeente Enschede",
    h1: "Je woning isoleren in Boekelo",
    intro: [
      ["Boekelo is een van de dorpen van de gemeente Enschede."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Boekelo bekend van?",
        kaarten: [
          { icon: "droplet", titel: "Zoutwinning", tekst: "Zouthuisjes en een zouttoren herinneren aan de tijd dat hier zout werd opgeboord, tot de winning na 1933 verschoof naar Hengelo en Enschede." },
          { icon: "trophy", titel: "Military Boekelo-Enschede", tekst: "Het jaarlijkse internationale paardensportevenement waar Boekelo om bekendstaat." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Boekelo vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van wat er al is gedaan.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een logische stap." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Boekelo",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Boekelo valt onder de gemeente Enschede, die een eigen regeling heeft voor isoleren. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Waar is Boekelo bekend van?", answer: "Vooral van de geschiedenis van de zoutwinning (zouthuisjes en een zouttoren) en van het jaarlijkse paardensportevenement Military Boekelo-Enschede." },
      { question: "Komt Gijs ook bij mij thuis in Boekelo?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Twekkelo", href: "/regio/overijssel/enschede/twekkelo", tekst: "Een ander buurtschap van de gemeente Enschede." },
        { naam: "Gemeente Enschede", href: "/regio/overijssel/enschede", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Boekelo en de rest van de gemeente Enschede."]],
  },

  "/regio/overijssel/enschede/glanerbrug": {
    seo: {
      title: "Woning isoleren in Glanerbrug | Gijs",
      description: "Isoleren in Glanerbrug, aan de grens met Duitsland? Lees hoe Gijs je helpt.",
    },
    kicker: "Glanerbrug, gemeente Enschede",
    h1: "Je woning isoleren in Glanerbrug",
    intro: [
      ["Glanerbrug ligt tegen de Duitse grens aan, bij de Glanerbeek."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Glanerbrug bekend van?",
        kaarten: [
          { icon: "fuel", titel: "Het Fina-tankstation", tekst: "Gebouwd in 1959-1960 door architect Sybold van Ravesteyn en aangewezen als rijksmonument: een zeldzaam bewaard wederopbouw-benzinestation." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Glanerbrug vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van wat er al is gedaan.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een logische stap." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Glanerbrug",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Glanerbrug valt onder de gemeente Enschede, die een eigen regeling heeft voor isoleren. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Wat is er bijzonder aan Glanerbrug?", answer: "Onder meer het voormalige Fina-tankstation uit 1959-1960 van architect Sybold van Ravesteyn, dat tot rijksmonument is verklaard als zeldzaam voorbeeld van een klein wederopbouw-benzinestation." },
      { question: "Komt Gijs ook bij mij thuis in Glanerbrug?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Lonneker", href: "/regio/overijssel/enschede/lonneker", tekst: "Een ander dorp van de gemeente Enschede." },
        { naam: "Gemeente Enschede", href: "/regio/overijssel/enschede", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Glanerbrug en de rest van de gemeente Enschede."]],
  },

  "/regio/overijssel/enschede/lonneker": {
    seo: {
      title: "Woning isoleren in Lonneker | Gijs",
      description: "Isoleren in Lonneker, bekend van de Lonneker Molen? Lees hoe Gijs je helpt.",
    },
    kicker: "Lonneker, gemeente Enschede",
    h1: "Je woning isoleren in Lonneker",
    intro: [
      ["Lonneker is een van de dorpen van de gemeente Enschede."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Lonneker bekend van?",
        kaarten: [
          { icon: "landmark", titel: "De Lonneker Molen", tekst: "Gebouwd in 1850-1851, de enige gemetselde molen in Nederland waarvan de romp met riet is bedekt. Rijksmonument, beheerd door een stichting." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Lonneker vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van wat er al is gedaan.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een logische stap." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Lonneker",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Lonneker valt onder de gemeente Enschede, die een eigen regeling heeft voor isoleren. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Wat is de Lonneker Molen?", answer: "Een rijksmonument uit 1850-1851, de enige gemetselde molen in Nederland met een romp die bedekt is met riet." },
      { question: "Komt Gijs ook bij mij thuis in Lonneker?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Usselo", href: "/regio/overijssel/enschede/usselo", tekst: "Een ander dorp van de gemeente Enschede." },
        { naam: "Gemeente Enschede", href: "/regio/overijssel/enschede", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Lonneker en de rest van de gemeente Enschede."]],
  },

  "/regio/overijssel/enschede/usselo": {
    seo: {
      title: "Woning isoleren in Usselo | Gijs",
      description: "Isoleren in Usselo, bekend van Wissinks Möl en de Laag van Usselo? Lees hoe Gijs je helpt.",
    },
    kicker: "Usselo, gemeente Enschede",
    h1: "Je woning isoleren in Usselo",
    intro: [
      ["Usselo is een van de dorpen van de gemeente Enschede."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Usselo bekend van?",
        kaarten: [
          { icon: "landmark", titel: "Wissinks Möl", tekst: "Een nog werkende standerdmolen uit 1802." },
          { icon: "milestone", titel: "De Laag van Usselo", tekst: "Een archeologische vindplaats met sporen van laat-paleolithische bewoning, eveneens rijksmonument." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Usselo vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van wat er al is gedaan.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een logische stap." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Usselo",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Usselo valt onder de gemeente Enschede, die een eigen regeling heeft voor isoleren. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Wat is Wissinks Möl?", answer: "Een nog werkende standerdmolen uit 1802 in Usselo, beheerd door een molenstichting." },
      { question: "Wat is de Laag van Usselo?", answer: "Een archeologische vindplaats bij Usselo met sporen van laat-paleolithische bewoning, aangewezen als rijksmonument." },
      { question: "Komt Gijs ook bij mij thuis in Usselo?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Boekelo", href: "/regio/overijssel/enschede/boekelo", tekst: "Een ander dorp van de gemeente Enschede." },
        { naam: "Gemeente Enschede", href: "/regio/overijssel/enschede", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Usselo en de rest van de gemeente Enschede."]],
  },

  "/regio/overijssel/enschede/twekkelo": {
    seo: {
      title: "Woning isoleren in Twekkelo | Gijs",
      description: "Isoleren in Twekkelo, gevormd door drie essen? Lees hoe Gijs je helpt.",
    },
    kicker: "Twekkelo, gemeente Enschede",
    h1: "Je woning isoleren in Twekkelo",
    intro: [
      ["Twekkelo is een buurtschap van de gemeente Enschede."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Twekkelo bekend van?",
        kaarten: [
          { icon: "church", titel: "De Johanneskerk", tekst: "Het kleine kerkje is het herkenningspunt van dit buurtschap, dat wordt gevormd door drie essen." },
          { icon: "droplet", titel: "Zoutwinning", tekst: "Verspreide boerhuisjes herinneren nog aan de zoutwinning die hier ooit plaatsvond." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Twekkelo vaak aan bod komt",
      intro: "Bij de verspreide, vaak historische bebouwing van Twekkelo is pandgericht maatwerk belangrijk.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een logische stap." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Twekkelo",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Twekkelo valt onder de gemeente Enschede, die een eigen regeling heeft voor isoleren. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Wat maakt Twekkelo bijzonder?", answer: "Het buurtschap wordt gevormd door drie essen, met de Johanneskerk als herkenningspunt en sporen van de vroegere zoutwinning in het gebied." },
      { question: "Komt Gijs ook bij mij thuis in Twekkelo?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Boekelo", href: "/regio/overijssel/enschede/boekelo", tekst: "Ook bekend van de zoutwinningsgeschiedenis." },
        { naam: "Gemeente Enschede", href: "/regio/overijssel/enschede", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Twekkelo en de rest van de gemeente Enschede."]],
  },
};

const BORNE_DORPEN: Record<string, LokaleInhoud> = {
  "/regio/overijssel/borne/hertme": {
    seo: {
      title: "Woning isoleren in Hertme | Gijs",
      description: "Isoleren in Hertme, een van de twee dorpen van de gemeente Borne? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Hertme, gemeente Borne",
    h1: "Je woning isoleren in Hertme",
    intro: [
      ["Hertme is, naast Zenderen, een van de twee dorpen van de gemeente Borne. Een groot deel van de woningen in de gemeente is gebouwd vóór de jaren negentig, en dat geldt ook voor veel huizen in en rond Hertme."],
      ["Gijs helpt je uitzoeken waar jouw huis warmte verliest en welke stap logisch is."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren in Hertme",
        alineas: [
          ["Alle woningeigenaren in de gemeente Borne moeten natuurvriendelijk isoleren. In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen, huismussen en gierzwaluwen. Spreek dit vooraf af met het bedrijf dat de isolatie uitvoert."],
        ],
        kaartenTitel: "Waar is Hertme bekend van?",
        kaarten: [
          { icon: "theater", titel: "Openluchttheater Hertme", tekst: "Buitentheater met ruim 2.000 zitplaatsen. Sinds 1953 vinden hier passiespelen plaats, tegenwoordig ook het Afrikafestival." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Hertme vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van wat er al is gedaan.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij huizen van vóór de jaren tachtig is de spouw vaak nog leeg of beperkt gevuld." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een koude zolder of een warme bovenverdieping in de zomer? Dan is het dak vaak een goede plek om te beginnen." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte is de vloer vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas laat veel warmte door. Beter glas maakt het bij het raam merkbaar comfortabeler." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Hertme",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs langs voor de gratis energiescan. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Hertme valt onder de gemeente Borne, die een eigen isolatieregeling heeft. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Moet ik in Hertme natuurvriendelijk isoleren?", answer: "Ja, volgens de gemeente Borne moeten alle woningeigenaren natuurvriendelijk isoleren. Kies een isolatiebedrijf dat natuurvriendelijk isoleert; dat regelt ook de verplichte melding bij de provincie." },
      { question: "Wat is het verschil tussen Hertme en Zenderen?", answer: "Het zijn twee eigen dorpen binnen dezelfde gemeente Borne, met dezelfde subsidieregeling en dezelfde aanpak van Gijs." },
      { question: "Komt Gijs ook bij mij thuis in Hertme?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Zenderen", href: "/regio/overijssel/borne/zenderen", tekst: "Het andere dorp van de gemeente Borne." },
        { naam: "Gemeente Borne", href: "/regio/overijssel/borne", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Hertme en de rest van de gemeente Borne, waaronder Zenderen."],
    ],
  },

  "/regio/overijssel/borne/zenderen": {
    seo: {
      title: "Woning isoleren in Zenderen | Gijs",
      description: "Isoleren in Zenderen, een van de twee dorpen van de gemeente Borne? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Zenderen, gemeente Borne",
    h1: "Je woning isoleren in Zenderen",
    intro: [
      ["Zenderen is, naast Hertme, een van de twee dorpen van de gemeente Borne. Een groot deel van de woningen in de gemeente is gebouwd vóór de jaren negentig, en dat geldt ook voor veel huizen in en rond Zenderen."],
      ["Gijs helpt je uitzoeken waar jouw huis warmte verliest en welke stap logisch is."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren in Zenderen",
        alineas: [
          ["Alle woningeigenaren in de gemeente Borne moeten natuurvriendelijk isoleren. In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen, huismussen en gierzwaluwen. Spreek dit vooraf af met het bedrijf dat de isolatie uitvoert."],
        ],
        kaartenTitel: "Waar is Zenderen bekend van?",
        kaarten: [
          { icon: "church", titel: "Het Karmelietenklooster", tekst: "Sinds 1889 staat aan de rand van Zenderen het Carmelitessenklooster, in de volksmond het Karmelietenklooster." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Zenderen vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van wat er al is gedaan.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij huizen van vóór de jaren tachtig is de spouw vaak nog leeg of beperkt gevuld." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een koude zolder of een warme bovenverdieping in de zomer? Dan is het dak vaak een goede plek om te beginnen." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte is de vloer vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas laat veel warmte door. Beter glas maakt het bij het raam merkbaar comfortabeler." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Zenderen",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs langs voor de gratis energiescan. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Zenderen valt onder de gemeente Borne, die een eigen isolatieregeling heeft. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Moet ik in Zenderen natuurvriendelijk isoleren?", answer: "Ja, volgens de gemeente Borne moeten alle woningeigenaren natuurvriendelijk isoleren. Kies een isolatiebedrijf dat natuurvriendelijk isoleert; dat regelt ook de verplichte melding bij de provincie." },
      { question: "Wat is het verschil tussen Zenderen en Hertme?", answer: "Het zijn twee eigen dorpen binnen dezelfde gemeente Borne, met dezelfde subsidieregeling en dezelfde aanpak van Gijs." },
      { question: "Komt Gijs ook bij mij thuis in Zenderen?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Hertme", href: "/regio/overijssel/borne/hertme", tekst: "Het andere dorp van de gemeente Borne." },
        { naam: "Gemeente Borne", href: "/regio/overijssel/borne", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Zenderen en de rest van de gemeente Borne, waaronder Hertme."],
    ],
  },
};

const HOF_VAN_TWENTE_HELP = {
  maatregelen: {
    titel: "Isolatie bij een grondgebonden woning",
    intro: "In Hof van Twente komen deze onderdelen het vaakst aan bod, bij vrijstaande en twee-onder-een-kapwoningen.",
    items: [
      { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
      { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Heeft je huis veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap. Let op beschermde dieren in de spouw." },
      { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Een koude begane grond voel je in een vrijstaand huis snel. Met een kruipruimte vaak van onderaf te isoleren." },
      { slug: "warmtepomp", naam: "Warmtepomp", tekst: "Is je huis goed geïsoleerd, dan komt verwarmen met een (hybride) warmtepomp in beeld." },
    ],
  },
  subsidieZin: (plaats: string): Alinea => [`${plaats} valt onder de gemeente Hof van Twente, die een eigen isolatieregeling heeft. Of jouw woning in aanmerking komt, lees je bij de gemeente.`],
};

const HOF_VAN_TWENTE_DORPEN: Record<string, LokaleInhoud> = {
  "/regio/overijssel/hof-van-twente/goor": {
    seo: {
      title: "Woning isoleren in Goor | Gijs",
      description: "Isoleren in Goor, de grootste kern van de gemeente Hof van Twente? Lees hoe Gijs je helpt, met aandacht voor vrijstaande en twee-onder-een-kapwoningen.",
    },
    kicker: "Goor, gemeente Hof van Twente",
    h1: "Je woning isoleren in Goor",
    intro: [
      ["Goor is de grootste kern van de gemeente Hof van Twente. Net als in de rest van de gemeente staan er relatief veel vrijstaande woningen en twee-onder-een-kapwoningen, en is de woningvoorraad gemiddeld wat ouder."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vrijstaand-isoleren",
        titel: "Veel vrijstaande woningen",
        alineas: [
          ["Een vrijstaand huis heeft aan alle kanten buitenmuur en vaak een groot dak. Het verliest daardoor meer warmte dan een rijwoning van dezelfde grootte, dus goed isoleren levert relatief veel op."],
        ],
        kaartenTitel: "Waar is Goor bekend van?",
        kaarten: [
          { icon: "train-front", titel: "Het voormalige stationsgebouw", tekst: "Er stopt nog een trein, maar treinkaartjes koop je tegenwoordig bij een automaat. Het gebouw huisvest nu het Goors Historisch Museum." },
        ],
      },
    ],
    maatregelen: HOF_VAN_TWENTE_HELP.maatregelen,
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Goor",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs langs voor de gratis energiescan. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [SUBSIDIE_TIJDLOOS, HOF_VAN_TWENTE_HELP.subsidieZin("Goor")],
    faq: [
      { question: "Is Goor hetzelfde als de gemeente Hof van Twente?", answer: "Goor is de grootste kern binnen de gemeente Hof van Twente, die verder bestaat uit onder meer Delden, Diepenheim, Bentelo, Hengevelde en Markelo." },
      { question: "Ik heb een vrijstaand huis. Waar begin ik?", answer: "Meestal bij het onderdeel waar de meeste warmte verloren gaat. Dat verschilt per huis en wordt tijdens de energiescan bekeken." },
      { question: "Komt Gijs ook bij mij thuis in Goor?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Delden", href: "/regio/overijssel/hof-van-twente/delden", tekst: "Dezelfde gemeente, een eigen dorpskarakter." },
        { naam: "Gemeente Hof van Twente", href: "/regio/overijssel/hof-van-twente", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Goor en de rest van de gemeente Hof van Twente."]],
  },

  "/regio/overijssel/hof-van-twente/delden": {
    seo: {
      title: "Woning isoleren in Delden | Gijs",
      description: "Isoleren in Delden, gemeente Hof van Twente? Lees hoe Gijs je helpt, met aandacht voor vrijstaande en twee-onder-een-kapwoningen.",
    },
    kicker: "Delden, gemeente Hof van Twente",
    h1: "Je woning isoleren in Delden",
    intro: [
      ["Delden heeft een eigen, karakteristieke dorpskern binnen de gemeente Hof van Twente. Net als in de rest van de gemeente staan er relatief veel vrijstaande woningen en twee-onder-een-kapwoningen."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vrijstaand-isoleren",
        titel: "Veel vrijstaande woningen",
        alineas: [
          ["Een vrijstaand huis heeft aan alle kanten buitenmuur en vaak een groot dak. Het verliest daardoor meer warmte dan een rijwoning van dezelfde grootte, dus goed isoleren levert relatief veel op."],
        ],
        kaartenTitel: "Waar is Delden bekend van?",
        kaarten: [
          { icon: "castle", titel: "Landgoed Twickel", tekst: "Het grootste particuliere landgoed van Nederland. De oudste vermelding van Twickel dateert al uit 1347." },
        ],
      },
    ],
    maatregelen: HOF_VAN_TWENTE_HELP.maatregelen,
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Delden",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs langs voor de gratis energiescan. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [SUBSIDIE_TIJDLOOS, HOF_VAN_TWENTE_HELP.subsidieZin("Delden")],
    faq: [
      { question: "Hoort Delden bij de gemeente Hof van Twente?", answer: "Ja. Delden is een van de kernen van de gemeente Hof van Twente, naast onder meer Goor, Diepenheim, Bentelo, Hengevelde en Markelo." },
      { question: "Ik heb een vrijstaand huis. Waar begin ik?", answer: "Meestal bij het onderdeel waar de meeste warmte verloren gaat. Dat verschilt per huis en wordt tijdens de energiescan bekeken." },
      { question: "Komt Gijs ook bij mij thuis in Delden?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Diepenheim", href: "/regio/overijssel/hof-van-twente/diepenheim", tekst: "Dezelfde gemeente, een eigen dorpskarakter." },
        { naam: "Gemeente Hof van Twente", href: "/regio/overijssel/hof-van-twente", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Delden en de rest van de gemeente Hof van Twente."]],
  },

  "/regio/overijssel/hof-van-twente/diepenheim": {
    seo: {
      title: "Woning isoleren in Diepenheim | Gijs",
      description: "Isoleren in Diepenheim, gemeente Hof van Twente? Lees hoe Gijs je helpt, met aandacht voor vrijstaande en twee-onder-een-kapwoningen.",
    },
    kicker: "Diepenheim, gemeente Hof van Twente",
    h1: "Je woning isoleren in Diepenheim",
    intro: [
      ["Diepenheim is een van de kleinere kernen van de gemeente Hof van Twente, omringd door landgoederen en buitengebied. Net als in de rest van de gemeente staan er relatief veel vrijstaande woningen."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vrijstaand-isoleren",
        titel: "Veel vrijstaande woningen",
        alineas: [
          ["Een vrijstaand huis heeft aan alle kanten buitenmuur en vaak een groot dak. Het verliest daardoor meer warmte dan een rijwoning van dezelfde grootte, dus goed isoleren levert relatief veel op."],
        ],
        kaartenTitel: "Waar is Diepenheim bekend van?",
        kaarten: [
          { icon: "castle", titel: "Landgoed Warmelo", tekst: "Een van de landgoederen rond Diepenheim, met een park van ruim 7 hectare." },
          { icon: "palette", titel: "Kunstdorp", tekst: "Diepenheim staat bekend als kunstdorp, onder meer met het Tekeningen Centrum." },
        ],
      },
    ],
    maatregelen: HOF_VAN_TWENTE_HELP.maatregelen,
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Diepenheim",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs langs voor de gratis energiescan, ook in het buitengebied rond Diepenheim."],
      ],
    },
    subsidies: [SUBSIDIE_TIJDLOOS, HOF_VAN_TWENTE_HELP.subsidieZin("Diepenheim")],
    faq: [
      { question: "Hoort Diepenheim bij de gemeente Hof van Twente?", answer: "Ja. Diepenheim is een van de kernen van de gemeente Hof van Twente, naast onder meer Goor, Delden, Bentelo, Hengevelde en Markelo." },
      { question: "Helpt Gijs ook in het buitengebied rond Diepenheim?", answer: "Ja. Gijs helpt bewoners in heel Diepenheim en het omliggende buitengebied." },
      { question: "Komt Gijs ook bij mij thuis in Diepenheim?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Markelo", href: "/regio/overijssel/hof-van-twente/markelo", tekst: "Dezelfde gemeente, een eigen dorpskarakter." },
        { naam: "Gemeente Hof van Twente", href: "/regio/overijssel/hof-van-twente", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Diepenheim en de rest van de gemeente Hof van Twente."]],
  },

  "/regio/overijssel/hof-van-twente/bentelo": {
    seo: {
      title: "Woning isoleren in Bentelo | Gijs",
      description: "Isoleren in Bentelo, gemeente Hof van Twente? Klein agrarisch dorp met veel vrijstaande woningen en voormalige boerderijen. Lees hoe Gijs je helpt.",
    },
    kicker: "Bentelo, gemeente Hof van Twente",
    h1: "Je woning isoleren in Bentelo",
    intro: [
      ["Bentelo is een van de kleinste dorpen van de gemeente Hof van Twente, met een uitgesproken agrarisch karakter. Je vindt er vrijstaande woningen, twee-onder-een-kapwoningen en voormalige boerderijen die nu als woning worden gebruikt."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vrijstaand-isoleren",
        titel: "Vrijstaande woningen en voormalige boerderijen",
        alineas: [
          ["Een vrijstaand huis heeft aan alle kanten buitenmuur en vaak een groot dak. Het verliest daardoor meer warmte dan een rijwoning van dezelfde grootte, dus goed isoleren levert relatief veel op."],
          ["In Bentelo staan ook voormalige agrarische gebouwen die nu als woning worden gebruikt. Die hebben soms een andere isolatievraag: denk aan oudere muren zonder spouw, grote onverwarmde bijruimten of een rieten dak. Gijs kijkt bij de energiescan naar wat realistisch is voor jouw specifieke huis."],
        ],
        kaartenTitel: "Waar is Bentelo bekend van?",
        kaarten: [
          { icon: "church", titel: "O.L.V. van Altijddurende Bijstand", tekst: "De rooms-katholieke kerk uit 1954 is het herkenbare middelpunt van het dorp." },
          { icon: "wheat", titel: "Agrarisch landschap", tekst: "Bentelo ligt midden in het Twentse boerenland, omringd door akkers en weiden." },
        ],
      },
    ],
    maatregelen: HOF_VAN_TWENTE_HELP.maatregelen,
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Bentelo",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs langs voor de gratis energiescan. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [SUBSIDIE_TIJDLOOS, HOF_VAN_TWENTE_HELP.subsidieZin("Bentelo")],
    faq: [
      { question: "Hoort Bentelo bij de gemeente Hof van Twente?", answer: "Ja. Bentelo is een van de kernen van de gemeente Hof van Twente, naast onder meer Goor, Delden, Diepenheim, Hengevelde en Markelo." },
      { question: "Ik heb een vrijstaand huis. Waar begin ik?", answer: "Meestal bij het onderdeel waar de meeste warmte verloren gaat. Dat verschilt per huis en wordt tijdens de energiescan bekeken." },
      { question: "Komt Gijs ook bij mij thuis in Bentelo?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Hengevelde", href: "/regio/overijssel/hof-van-twente/hengevelde", tekst: "Dezelfde gemeente, een eigen dorpskarakter." },
        { naam: "Gemeente Hof van Twente", href: "/regio/overijssel/hof-van-twente", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Bentelo en de rest van de gemeente Hof van Twente."]],
  },

  "/regio/overijssel/hof-van-twente/hengevelde": {
    seo: {
      title: "Woning isoleren in Hengevelde | Gijs",
      description: "Isoleren in Hengevelde, gemeente Hof van Twente? Klein kerkdorp met veel vrijstaande woningen en een gemengd woningbestand. Lees hoe Gijs je helpt.",
    },
    kicker: "Hengevelde, gemeente Hof van Twente",
    h1: "Je woning isoleren in Hengevelde",
    intro: [
      ["Hengevelde is een kerkdorp in de gemeente Hof van Twente. Het dorp is iets groter dan het nabijgelegen Bentelo en heeft naast vrijstaande woningen ook twee-onder-een-kapwoningen en een enkele tussenwoning."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vrijstaand-isoleren",
        titel: "Gemengd woningbestand in een klein dorp",
        alineas: [
          ["Hengevelde heeft een gemengd woningbestand: vrijstaande huizen, twee-onder-een-kapwoningen en een beperkt aantal rijwoningen. Vrijstaande en twee-onder-een-kapwoningen verliezen per vierkante meter meer warmte dan rijwoningen — bij die woningtypen levert isoleren relatief het meest op."],
          ["De meeste woningen in Hengevelde zijn gebouwd vóór de jaren negentig. Dat betekent dat dak, spouwmuur en vloer bij veel huizen nog ruimte voor verbetering bieden."],
        ],
        kaartenTitel: "Waar is Hengevelde bekend van?",
        kaarten: [
          { icon: "church", titel: "H.H. Petrus en Paulus", tekst: "De rooms-katholieke kerk in het dorpscentrum — gebouwd rond 1910 — is het herkenningsteken van Hengevelde." },
          { icon: "map-pin", titel: "Kerkdorp in Hof van Twente", tekst: "Hengevelde ligt in het groene buitengebied tussen Delden en Diepenheim." },
        ],
      },
    ],
    maatregelen: HOF_VAN_TWENTE_HELP.maatregelen,
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Hengevelde",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs langs voor de gratis energiescan. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [SUBSIDIE_TIJDLOOS, HOF_VAN_TWENTE_HELP.subsidieZin("Hengevelde")],
    faq: [
      { question: "Hoort Hengevelde bij de gemeente Hof van Twente?", answer: "Ja. Hengevelde is een van de kernen van de gemeente Hof van Twente, naast onder meer Goor, Delden, Diepenheim, Bentelo en Markelo." },
      { question: "Ik heb een vrijstaand huis. Waar begin ik?", answer: "Meestal bij het onderdeel waar de meeste warmte verloren gaat. Dat verschilt per huis en wordt tijdens de energiescan bekeken." },
      { question: "Komt Gijs ook bij mij thuis in Hengevelde?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Markelo", href: "/regio/overijssel/hof-van-twente/markelo", tekst: "Dezelfde gemeente, een eigen dorpskarakter." },
        { naam: "Gemeente Hof van Twente", href: "/regio/overijssel/hof-van-twente", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Hengevelde en de rest van de gemeente Hof van Twente."]],
  },

  "/regio/overijssel/hof-van-twente/markelo": {
    seo: {
      title: "Woning isoleren in Markelo | Gijs",
      description: "Isoleren in Markelo, aan de voet van de Markelose Berg? Lees hoe Gijs je helpt, met aandacht voor vrijstaande en twee-onder-een-kapwoningen.",
    },
    kicker: "Markelo, gemeente Hof van Twente",
    h1: "Je woning isoleren in Markelo",
    intro: [
      ["Markelo is een van de dorpen van de gemeente Hof van Twente. Net als in de rest van de gemeente staan er in Markelo relatief veel vrijstaande woningen en twee-onder-een-kapwoningen."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vrijstaand-isoleren",
        titel: "Veel vrijstaande woningen",
        alineas: [
          ["Een vrijstaand huis heeft aan alle kanten buitenmuur en vaak een groot dak. Het verliest daardoor meer warmte dan een rijwoning van dezelfde grootte, dus goed isoleren levert relatief veel op."],
        ],
        kaartenTitel: "Waar is Markelo bekend van?",
        kaarten: [
          { icon: "mountain", titel: "De Markelose Berg", tekst: "Een veertig meter hoge heuvel aan de rand van het dorp." },
          { icon: "flag", titel: "Overijssels Verzetsmonument", tekst: "Het centrale verzetsmonument van de provincie staat op de top van de Markelose Berg." },
        ],
      },
    ],
    maatregelen: HOF_VAN_TWENTE_HELP.maatregelen,
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Markelo",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs langs voor de gratis energiescan. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [SUBSIDIE_TIJDLOOS, HOF_VAN_TWENTE_HELP.subsidieZin("Markelo")],
    faq: [
      { question: "Hoort Markelo bij de gemeente Hof van Twente?", answer: "Ja. Markelo is een van de kernen van de gemeente Hof van Twente, naast onder meer Goor, Delden, Diepenheim, Bentelo en Hengevelde." },
      { question: "Ik heb een vrijstaand huis. Waar begin ik?", answer: "Meestal bij het onderdeel waar de meeste warmte verloren gaat. Dat verschilt per huis en wordt tijdens de energiescan bekeken." },
      { question: "Komt Gijs ook bij mij thuis in Markelo?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Goor", href: "/regio/overijssel/hof-van-twente/goor", tekst: "De grootste kern van de gemeente." },
        { naam: "Gemeente Hof van Twente", href: "/regio/overijssel/hof-van-twente", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Markelo en de rest van de gemeente Hof van Twente."]],
  },
};

const ALMELO_DORPEN: Record<string, LokaleInhoud> = {
  "/regio/overijssel/almelo/aadorp": {
    seo: {
      title: "Woning isoleren in Aadorp | Gijs",
      description: "Isoleren in Aadorp, een dorp binnen de gemeente Almelo? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Aadorp, gemeente Almelo",
    h1: "Je woning isoleren in Aadorp",
    intro: [
      ["Aadorp ligt aan het kanaal Almelo-De Haandrik en hoort sinds 2001 bij de gemeente Almelo, los van de stad zelf. In Aadorp is de vrijstaande woning het meest voorkomende type, ruim de helft van de woningen; ongeveer 80% is een koopwoning."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk",
        titel: "Natuurvriendelijk isoleren en verbouwen",
        alineas: [
          ["Ook in Aadorp kunnen beschermde dieren zitten in spouwmuren en onder daken, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het daar rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Aadorp bekend van?",
        kaarten: [
          { icon: "waves", titel: "Het kanaal Almelo-De Haandrik", tekst: "Aadorp ligt aan dit kanaal en hoort sinds 2001 bij de gemeente Almelo." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Dit zijn de maatregelen die bij een vrijstaande woning het vaakst als eerste stap aan bod komen.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een relatief kleine ingreep met een merkbaar resultaat." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Warmere voeten op de begane grond. Met een kruipruimte meestal van onderaf te doen." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Aadorp",
      alineas: [
        ["In de digitale woningscan zie je welke maatregelen bij jouw type woning horen."],
        ["Bij de gratis energiescan bekijkt een adviseur van Gijs je huis ter plekke. Je kiest zelf of en met wie je verdergaat."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Aadorp valt onder de gemeente Almelo. Welke regelingen de gemeente op dit moment heeft, lees je op de website van de gemeente."],
    ],
    faq: [
      { question: "Hoort Aadorp bij de stad Almelo?", answer: "Aadorp is een eigen dorp binnen de gemeente Almelo, los van de stad zelf." },
      { question: "Moet ik natuurvriendelijk isoleren in Aadorp?", answer: "Bij spouw- en dakisolatie moet rekening worden gehouden met beschermde dieren. Een natuurvriendelijk werkend isolatiebedrijf regelt dit." },
      { question: "Komt Gijs ook bij mij thuis in Aadorp?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Bornerbroek", href: "/regio/overijssel/almelo/bornerbroek", tekst: "Een ander dorp binnen de gemeente Almelo." },
        { naam: "Gemeente Almelo", href: "/regio/overijssel/almelo", tekst: "Overzicht van isoleren in de hele gemeente, inclusief de stad." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Aadorp en de rest van de gemeente Almelo."]],
  },

  "/regio/overijssel/almelo/bornerbroek": {
    seo: {
      title: "Woning isoleren in Bornerbroek | Gijs",
      description: "Isoleren in Bornerbroek, een dorp binnen de gemeente Almelo? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Bornerbroek, gemeente Almelo",
    h1: "Je woning isoleren in Bornerbroek",
    intro: [
      ["In Bornerbroek is de vrijstaande woning het meest voorkomende woningtype, ongeveer de helft van de woningen; zo'n 78% is een koopwoning."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk",
        titel: "Natuurvriendelijk isoleren en verbouwen",
        alineas: [
          ["Ook in Bornerbroek kunnen beschermde dieren zitten in spouwmuren en onder daken, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het daar rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Bornerbroek bekend van?",
        kaarten: [
          { icon: "church", titel: "Sint-Stephanuskerk", tekst: "Beeldbepalend rijksmonument. De huidige zaalkerk werd in 1919-1920 herbouwd naar ontwerp van architect J.A. Kropholler, rond een oudere waterstaatskerk." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Dit zijn de maatregelen die bij een vrijstaande woning het vaakst als eerste stap aan bod komen.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een relatief kleine ingreep met een merkbaar resultaat." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Warmere voeten op de begane grond. Met een kruipruimte meestal van onderaf te doen." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Bornerbroek",
      alineas: [
        ["In de digitale woningscan zie je welke maatregelen bij jouw type woning horen."],
        ["Bij de gratis energiescan bekijkt een adviseur van Gijs je huis ter plekke. Je kiest zelf of en met wie je verdergaat."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Bornerbroek valt onder de gemeente Almelo. Welke regelingen de gemeente op dit moment heeft, lees je op de website van de gemeente."],
    ],
    faq: [
      { question: "Hoort Bornerbroek bij de stad Almelo?", answer: "Bornerbroek is een eigen dorp binnen de gemeente Almelo, los van de stad zelf." },
      { question: "Moet ik natuurvriendelijk isoleren in Bornerbroek?", answer: "Bij spouw- en dakisolatie moet rekening worden gehouden met beschermde dieren. Een natuurvriendelijk werkend isolatiebedrijf regelt dit." },
      { question: "Komt Gijs ook bij mij thuis in Bornerbroek?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Aadorp", href: "/regio/overijssel/almelo/aadorp", tekst: "Een ander dorp binnen de gemeente Almelo." },
        { naam: "Gemeente Almelo", href: "/regio/overijssel/almelo", tekst: "Overzicht van isoleren in de hele gemeente, inclusief de stad." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Bornerbroek en de rest van de gemeente Almelo."]],
  },

  "/regio/overijssel/almelo/harbrinkhoek-mariaparochie": {
    seo: {
      title: "Woning isoleren in Harbrinkhoek-Mariaparochie | Gijs",
      description: "Isoleren in Harbrinkhoek-Mariaparochie, op de grens van Almelo en Tubbergen? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Harbrinkhoek-Mariaparochie, gemeente Almelo",
    h1: "Je woning isoleren in Harbrinkhoek-Mariaparochie",
    intro: [
      ["Harbrinkhoek-Mariaparochie ligt op de grens van de gemeenten Almelo en Tubbergen."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk",
        titel: "Natuurvriendelijk isoleren en verbouwen",
        alineas: [
          ["Ook hier kunnen beschermde dieren zitten in spouwmuren en onder daken, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het daar rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Harbrinkhoek-Mariaparochie bekend van?",
        kaarten: [
          { icon: "church", titel: "O.L.V. van Altijddurende Bijstand", tekst: "De kerk waar het dorp zijn naam aan ontleent: een neogotische kerk van architect Jan Stuyt, in twee fases gebouwd en in 1923 voltooid." },
        ],
      },
    ],
    maatregelen: {
      titel: "Waar begin je met isoleren?",
      intro: "Dit zijn de maatregelen die bij een eengezinswoning het vaakst als eerste stap aan bod komen.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een relatief kleine ingreep met een merkbaar resultaat." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Warmere voeten op de begane grond. Met een kruipruimte meestal van onderaf te doen." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Harbrinkhoek-Mariaparochie",
      alineas: [
        ["In de digitale woningscan zie je welke maatregelen bij jouw type woning horen."],
        ["Bij de gratis energiescan bekijkt een adviseur van Gijs je huis ter plekke. Je kiest zelf of en met wie je verdergaat."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Harbrinkhoek-Mariaparochie ligt grotendeels in de gemeente Almelo. Welke regelingen de gemeente op dit moment heeft, lees je op de website van de gemeente."],
    ],
    faq: [
      { question: "Ligt Harbrinkhoek-Mariaparochie in Almelo of in Tubbergen?", answer: "Het ligt op de grens van beide gemeenten. Gijs helpt bewoners aan beide kanten van de grens." },
      { question: "Moet ik natuurvriendelijk isoleren?", answer: "Bij spouw- en dakisolatie moet rekening worden gehouden met beschermde dieren. Een natuurvriendelijk werkend isolatiebedrijf regelt dit." },
      { question: "Komt Gijs ook bij mij thuis?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Aadorp", href: "/regio/overijssel/almelo/aadorp", tekst: "Een ander dorp binnen de gemeente Almelo." },
        { naam: "Gemeente Almelo", href: "/regio/overijssel/almelo", tekst: "Overzicht van isoleren in de hele gemeente, inclusief de stad." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in Harbrinkhoek-Mariaparochie en de rest van de gemeenten Almelo en Tubbergen."]],
  },
};

// Pilot B uit de Deep Research-uitbreiding naar Overijssel (2026-10-19): Rijssen-Holten,
// Hellendoorn/Nijverdal en Twenterand (Vriezenveen/Vroomshoop). Gemeentenaam en zoekplaats lopen
// hier sterk uiteen, dus Rijssen/Holten en Vriezenveen/Vroomshoop krijgen elk een eigen pagina
// in plaats van alleen een gemeentepagina. Woningvoorraadcijfers komen uit AlleCijfers.nl (zie
// lib/content/regio-woningvoorraad.ts). Subsidieregelingen zijn op 2026-10-19 gecontroleerd op de
// officiële gemeentelijke pagina (criteria, geen bedragen); bedragen en exacte voorwaarden worden
// bewust niet overgenomen, zie SUBSIDIE_TIJDLOOS.
const RIJSSEN_HOLTEN: Record<string, LokaleInhoud> = {
  "/regio/overijssel/rijssen-holten": {
    seo: {
      title: "Isoleren in Rijssen en Holten (gemeente Rijssen-Holten) | Gijs",
      description: "Rijssen en Holten zijn twee eigen plaatsen binnen één gemeente. Lees hoe Gijs je helpt met isoleren en wat de gemeentelijke subsidie inhoudt.",
    },
    kicker: "Gemeente Rijssen-Holten",
    h1: "Isoleren in de gemeente Rijssen-Holten",
    intro: [
      ["Rijssen-Holten is één gemeente, maar ", { tekst: "Rijssen", href: "/regio/overijssel/rijssen-holten/rijssen" }, " en ", { tekst: "Holten", href: "/regio/overijssel/rijssen-holten/holten" }, " voelen voor de meeste inwoners als twee eigen plaatsen. Daaromheen liggen kleinere buurtschappen zoals Dijkerhoek, Espelo, Beuseberg, Ligtenberg en Neerdorp."],
      ["Gijs helpt bewoners in de hele gemeente met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "rijssen-of-holten",
        titel: "Woon je in Rijssen of in Holten?",
        alineas: [
          ["Rijssen en Holten liggen zo'n tien kilometer uit elkaar en hebben allebei een eigen centrum. Dat verschil heeft ook een historische kant: Rijssen hoorde van oudsher bij Twente, Holten bij Salland. Pas in 2001 gingen de twee gemeenten samen op, sinds 2003 onder de naam Rijssen-Holten."],
          ["Voor isoleren maakt het niet uit in welke van de twee je woont: Gijs werkt in de hele gemeente op dezelfde manier."],
        ],
        kaartenTitel: "Waar is Rijssen-Holten bekend van?",
        kaarten: [
          { icon: "landmark", titel: "Rijssen", tekst: "De grootste kern, met de Pelmolen Ter Horst als herkenningspunt.", href: "/regio/overijssel/rijssen-holten/rijssen" },
          { icon: "flag", titel: "Holten", tekst: "Aan de voet van de Holterberg, met de Canadese Begraafplaats.", href: "/regio/overijssel/rijssen-holten/holten" },
        ],
      },
      {
        id: "vrijstaand-isoleren",
        titel: "Veel vrijstaande woningen",
        alineas: [
          ["In Rijssen-Holten is de vrijstaande woning het meest voorkomende woningtype. Zo'n huis heeft aan alle kanten buitenmuur, een dak en een vloer die allemaal warmte kunnen verliezen. Daarom loont het om naar het hele huis te kijken, niet naar één onderdeel."],
          ["Woon je in een rijwoning of een twee-onder-een-kapwoning? Ook dan is er vaak nog winst te halen, zeker bij een huis van vóór de jaren tachtig."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Deze onderdelen komen bij een vrijstaande woning het vaakst aan bod. Kies er een om te lezen hoe het werkt.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Heeft je huis veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte is de vloer vaak van onderaf te isoleren, zonder breekwerk binnen." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Rijssen-Holten",
      alineas: [
        ["In de digitale woningscan zie je in een paar minuten welke maatregelen bij jouw type woning passen. Dat is een handige voorbereiding, maar geen verplichting."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Samen bekijk je wat er al is gedaan en wat een logische volgende stap is. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Rijssen-Holten heeft een eigen regeling voor isolatie door een erkend bedrijf, voor zowel Rijssen als Holten. Of jouw woning in aanmerking komt en wat de actuele voorwaarden zijn, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Is Rijssen-Holten één plaats of twee?", answer: "Het is één gemeente met twee duidelijk eigen plaatsen: Rijssen en Holten. Daaromheen liggen kleinere buurtschappen zoals Dijkerhoek en Espelo." },
      { question: "Geldt de gemeentelijke subsidie voor zowel Rijssen als Holten?", answer: "Ja. De regeling van de gemeente Rijssen-Holten geldt voor de hele gemeente, dus voor zowel Rijssen als Holten." },
      { question: "Komt Gijs ook in de kleinere buurtschappen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Rijssen-Holten, dus ook in Dijkerhoek, Espelo, Beuseberg, Ligtenberg en Neerdorp." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt ook direct contact opnemen voor de gratis energiescan. De woningscan is een optionele voorbereiding." },
    ],
    verwant: {
      titel: "Verder lezen",
      links: [
        { naam: "Isoleren in Rijssen", href: "/regio/overijssel/rijssen-holten/rijssen", tekst: "Over isoleren in de grootste kern van de gemeente." },
        { naam: "Isoleren in Holten", href: "/regio/overijssel/rijssen-holten/holten", tekst: "Over isoleren aan de voet van de Holterberg." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in de hele gemeente Rijssen-Holten: in Rijssen, in Holten en in de buurtschappen daaromheen."],
    ],
  },

  "/regio/overijssel/rijssen-holten/rijssen": {
    seo: {
      title: "Woning isoleren in Rijssen | Gijs",
      description: "Isoleren in Rijssen? Lees wat het woningtype van je huis zegt over isolatie, hoe natuurvriendelijk isoleren werkt en hoe Gijs je helpt.",
    },
    kicker: "Rijssen, gemeente Rijssen-Holten",
    h1: "Je woning isoleren in Rijssen",
    intro: [
      ["Rijssen is de grootste kern van de gemeente Rijssen-Holten. In Rijssen zelf is de tussenwoning het meest voorkomende woningtype, ruim 2.600 van de woningen; ongeveer twee derde is een koopwoning. Welke isolatie het meeste oplevert, hangt vooral af van je eigen huis en wat daar al aan is gedaan."],
      ["Gijs helpt je dat uit te zoeken, zodat je weet welke stap echt zin heeft."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "woningtype",
        titel: "Vooral tussenwoningen in Rijssen",
        alineas: [
          ["Anders dan in de rest van de gemeente is in Rijssen zelf de tussenwoning het meest voorkomende woningtype, niet de vrijstaande woning. Bij zo'n huis gaat de meeste warmte verloren via het dak, de voor- en achtergevel en de vloer, niet via de zijmuren."],
          ["Woon je toch in een vrijstaand huis aan de rand van Rijssen? Dan speelt ook de spouwmuur een rol. Wat voor jouw woning de beste volgorde is, bekijken we tijdens de energiescan."],
        ],
        kaartenTitel: "Waar is Rijssen bekend van?",
        kaarten: [
          { icon: "landmark", titel: "Pelmolen Ter Horst", tekst: "Een achtkante bovenkruier-korenmolen uit 1752, aan de Regge net buiten Rijssen. Al sinds de achttiende eeuw een herkenningspunt in het landschap." },
        ],
      },
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen, zoals huismussen en gierzwaluwen. Ook de gemeentelijke isolatiesubsidie van Rijssen-Holten noemt natuurvriendelijk isoleren van de spouwmuur als onderdeel van de regeling."],
          ["Spreek dit vooraf af met het bedrijf dat de isolatie uitvoert, zodat een goede maatregel niet botst met de natuurregels."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Rijssen vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van het woningtype en wat er al is gedaan.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Bij veel woningtypen de plek waar het meeste te winnen valt." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een logische stap. Let op natuurvriendelijk werken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte onder het huis vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Rijssen",
      alineas: [
        ["Begin met de digitale woningscan: daarin kies je je woningtype en zie je welke maatregelen erbij passen. Dat is een handige voorbereiding, maar geen verplichting."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Samen kijk je wat er al is gedaan en wat een logische volgende stap is. Jij beslist wat je ermee doet."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Rijssen valt onder de gemeente Rijssen-Holten, die een eigen regeling heeft voor isolatie door een erkend bedrijf. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Geldt de isolatiesubsidie van de gemeente ook voor mij in Rijssen?", answer: "Ja. De regeling van de gemeente Rijssen-Holten geldt voor de hele gemeente, dus ook voor Rijssen." },
      { question: "Moet ik natuurvriendelijk isoleren in Rijssen?", answer: "Bij spouw- en dakisolatie moet rekening worden gehouden met beschermde dieren zoals vleermuizen en vogels die in gebouwen nestelen. Een isolatiebedrijf dat natuurvriendelijk werkt, regelt dit." },
      { question: "Wat is het verschil tussen isoleren in Rijssen en in Holten?", answer: "Beide vallen onder dezelfde gemeente en dezelfde subsidieregeling. Het verschil zit vooral in het dorpskarakter, niet in de isolatieaanpak." },
      { question: "Komt Gijs ook bij mij thuis in Rijssen?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats, zodat de adviseur je woning echt kan bekijken." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Holten", href: "/regio/overijssel/rijssen-holten/holten", tekst: "Dezelfde gemeente, een eigen dorpskarakter." },
        { naam: "Gemeente Rijssen-Holten", href: "/regio/overijssel/rijssen-holten", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Rijssen en de rest van de gemeente Rijssen-Holten, waaronder Holten en de buurtschappen daaromheen."],
    ],
  },

  "/regio/overijssel/rijssen-holten/holten": {
    seo: {
      title: "Woning isoleren in Holten | Gijs",
      description: "Isoleren in Holten, aan de voet van de Holterberg? Lees hoe Gijs je helpt van woningscan tot energiescan aan huis.",
    },
    kicker: "Holten, gemeente Rijssen-Holten",
    h1: "Je woning isoleren in Holten",
    intro: [
      ["Holten ligt aan de voet van de Holterberg en is een eigen plaats binnen de gemeente Rijssen-Holten, met buurtschappen als Dijkerhoek en Espelo eromheen."],
      ["Of je nu in het dorp zelf woont of net erbuiten: Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vrijstaand-aan-de-rand",
        titel: "Vrijstaande woningen rond het dorp",
        alineas: [
          ["In Holten zelf is de vrijstaande woning het meest voorkomende type, ruim 1.300 woningen; ongeveer driekwart is een koopwoning. Zo'n huis heeft aan alle kanten buitenmuur, dus isoleren van gevel, dak en vloer telt hier extra mee."],
        ],
        kaartenTitel: "Waar is Holten bekend van?",
        kaarten: [
          { icon: "flag", titel: "De Canadese Begraafplaats", tekst: "Aan de voet van de Holterberg, met 1.394 oorlogsgraven van vooral Canadese militairen. Ieder jaar op 24 december plaatsen basisschoolkinderen bij elk graf een lampion." },
        ],
      },
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren rond de Holterberg",
        alineas: [
          ["Dichtbij een natuurgebied als de Holterberg is extra aandacht voor beschermde dieren in en om de woning geen overbodige luxe. Bij spouw- en dakisolatie kan rekening gehouden moeten worden met vleermuizen of vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het dit aanpakt."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Bij woningen rond Holten komen deze onderdelen het vaakst aan bod.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap. Let op natuurvriendelijk werken." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren, zonder breekwerk binnen." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Holten",
      alineas: [
        ["Begin met de digitale woningscan: daarin zie je welke maatregelen bij jouw type woning passen. Dat is een handige voorbereiding, maar geen verplichting."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis, ook in de buurtschappen rond Holten. Samen kijk je wat er al is gedaan en wat een logische volgende stap is."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Holten valt onder de gemeente Rijssen-Holten, die een eigen regeling heeft voor isolatie door een erkend bedrijf. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Ik woon net buiten het dorp Holten, bijvoorbeeld in Espelo of Dijkerhoek. Helpt Gijs ook daar?", answer: "Ja. Gijs helpt bewoners in heel Holten en in de buurtschappen daaromheen." },
      { question: "Geldt de isolatiesubsidie van de gemeente ook voor mij in Holten?", answer: "Ja. De regeling van de gemeente Rijssen-Holten geldt voor de hele gemeente, dus ook voor Holten." },
      { question: "Moet ik rekening houden met natuur rond de Holterberg bij isoleren?", answer: "Bij spouw- en dakisolatie moet rekening worden gehouden met beschermde dieren. Een natuurvriendelijk werkend isolatiebedrijf regelt dit." },
      { question: "Komt Gijs ook bij mij thuis in Holten?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Rijssen", href: "/regio/overijssel/rijssen-holten/rijssen", tekst: "Dezelfde gemeente, een eigen dorpskarakter." },
        { naam: "Gemeente Rijssen-Holten", href: "/regio/overijssel/rijssen-holten", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Holten en de omliggende buurtschappen, en in de rest van de gemeente Rijssen-Holten."],
    ],
  },
};

const HELLENDOORN: Record<string, LokaleInhoud> = {
  "/regio/overijssel/hellendoorn": {
    seo: {
      title: "Woning isoleren in Nijverdal en Hellendoorn | Gijs",
      description: "Isoleren in de gemeente Hellendoorn, met Nijverdal als grootste kern? Lees hoe Gijs je helpt en wat de gemeentelijke subsidie inhoudt.",
    },
    kicker: "Gemeente Hellendoorn",
    h1: "Je woning isoleren in Hellendoorn en Nijverdal",
    intro: [
      ["De gemeente Hellendoorn bestaat uit het dorp Hellendoorn zelf en het grotere ", { tekst: "Nijverdal", href: "/regio/overijssel/hellendoorn/nijverdal" }, ", met daaromheen de kleinere kernen ", { tekst: "Daarle", href: "/regio/overijssel/hellendoorn/daarle" }, ", ", { tekst: "Daarlerveen", href: "/regio/overijssel/hellendoorn/daarlerveen" }, " en ", { tekst: "Haarle", href: "/regio/overijssel/hellendoorn/haarle" }, "."],
      ["Gijs helpt bewoners in de hele gemeente met isoleren, van Nijverdal tot de kleinere dorpen."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "nijverdal-en-hellendoorn",
        titel: "Nijverdal en Hellendoorn, elk met een eigen karakter",
        alineas: [
          ["Nijverdal is de grootste kern van de gemeente en ligt tegen de Sallandse Heuvelrug aan. Het dorp Hellendoorn zelf is kleiner. Lees meer over isoleren in ", { tekst: "Nijverdal", href: "/regio/overijssel/hellendoorn/nijverdal" }, "."],
          ["Woon je in ", { tekst: "Daarle", href: "/regio/overijssel/hellendoorn/daarle" }, ", ", { tekst: "Daarlerveen", href: "/regio/overijssel/hellendoorn/daarlerveen" }, " of ", { tekst: "Haarle", href: "/regio/overijssel/hellendoorn/haarle" }, "? Ook daar helpt Gijs je graag verder; de aanpak is in de hele gemeente hetzelfde."],
        ],
        kaartenTitel: "Waar is Hellendoorn bekend van?",
        kaarten: [
          { icon: "church", titel: "De NH kerk", tekst: "Aan de Dorpsstraat in het dorp Hellendoorn. De romaans-gotische kern van het gebouw stamt uit de twaalfde eeuw." },
          { icon: "tent-tree", titel: "Avonturenpark Hellendoorn", tekst: "Het attractiepark tegen de Sallandse Heuvelrug, een van de bekendste trekpleisters van de gemeente." },
        ],
      },
      {
        id: "vrijstaand-isoleren",
        titel: "Veel vrijstaande woningen",
        alineas: [
          ["In de gemeente Hellendoorn is de vrijstaande woning het meest voorkomende type. Zo'n huis verliest aan meerdere kanten warmte, dus loont het om naar het hele huis te kijken: dak, gevel, vloer en glas."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Deze onderdelen komen in de gemeente Hellendoorn het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Hellendoorn",
      alineas: [
        ["In de digitale woningscan zie je in een paar minuten welke maatregelen bij jouw type woning passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis, in Nijverdal en in de kleinere kernen. Samen kijk je wat er al is gedaan en wat een logische volgende stap is."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Hellendoorn heeft een eigen regeling voor woningisolatie. Of jouw woning in aanmerking komt en wat de actuele voorwaarden zijn, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Is Nijverdal hetzelfde als de gemeente Hellendoorn?", answer: "Nijverdal is de grootste kern binnen de gemeente Hellendoorn. Het dorp Hellendoorn zelf is kleiner en ligt iets noordelijker." },
      { question: "Helpt Gijs ook in Daarle, Daarlerveen en Haarle?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hellendoorn." },
      { question: "Welke gemeentelijke subsidie geldt in Hellendoorn?", answer: "De gemeente Hellendoorn heeft een eigen regeling voor woningisolatie. De actuele voorwaarden vind je bij de gemeente." },
      { question: "Is de energiescan van Gijs vrijblijvend?", answer: "Ja. De energiescan aan huis is gratis en vrijblijvend." },
    ],
    verwant: {
      titel: "Verder lezen",
      links: [
        { naam: "Isoleren in Nijverdal", href: "/regio/overijssel/hellendoorn/nijverdal", tekst: "De grootste kern van de gemeente, tegen de Sallandse Heuvelrug." },
        { naam: "Isoleren in Vriezenveen", href: "/regio/overijssel/twenterand/vriezenveen", tekst: "Buurgemeente Twenterand, met een eigen subsidieregeling." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in de hele gemeente Hellendoorn: in Nijverdal, in het dorp Hellendoorn zelf, en in Daarle, Daarlerveen en Haarle."],
    ],
  },

  "/regio/overijssel/hellendoorn/nijverdal": {
    seo: {
      title: "Woning isoleren in Nijverdal | Gijs",
      description: "Isoleren in Nijverdal, tegen de Sallandse Heuvelrug? Lees wat er voor jouw woning kan en hoe Gijs je helpt kiezen.",
    },
    kicker: "Nijverdal, gemeente Hellendoorn",
    h1: "Je woning isoleren in Nijverdal",
    intro: [
      ["Nijverdal is de grootste kern van de gemeente Hellendoorn en ligt tegen de Sallandse Heuvelrug aan."],
      ["In Nijverdal zelf is de tussenwoning het meest voorkomende woningtype; ongeveer 71% van de woningen is een koopwoning. Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt, ongeacht in welke wijk je woont."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "woningtype",
        titel: "Vooral tussenwoningen in Nijverdal",
        alineas: [
          ["Anders dan in de rest van de gemeente Hellendoorn is in Nijverdal zelf de tussenwoning het meest voorkomende type, niet de vrijstaande woning. Bij zo'n huis gaat de meeste warmte verloren via het dak, de voor- en achtergevel en de vloer."],
          ["Woon je toch in een vrijstaand huis aan de rand van Nijverdal? Dan telt ook de spouwmuur extra mee."],
        ],
        kaartenTitel: "Waar is Nijverdal bekend van?",
        kaarten: [
          { icon: "building-2", titel: "De watertoren", tekst: "Gebouwd rond 1915 bij het voormalige fabrieksterrein van de Nederlandsche Stoomblekerij, om koelwater en bluswater te leveren." },
        ],
      },
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren bij de heuvelrug",
        alineas: [
          ["Dichtbij de Sallandse Heuvelrug is extra aandacht voor beschermde dieren in en om de woning geen overbodige luxe. Bij spouw- en dakisolatie kan rekening gehouden moeten worden met vleermuizen of vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het dit aanpakt."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Nijverdal vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van het woningtype en wat er al is gedaan.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Bij veel woningtypen de plek waar het meeste te winnen valt." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een logische stap. Let op natuurvriendelijk werken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Nijverdal",
      alineas: [
        ["Begin met de digitale woningscan: daarin kies je je woningtype en zie je welke maatregelen erbij passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Samen kijk je wat er al is gedaan en wat een logische volgende stap is. Jij beslist wat je ermee doet."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Nijverdal valt onder de gemeente Hellendoorn, die een eigen regeling heeft voor woningisolatie. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Geldt de isolatiesubsidie van de gemeente ook voor mij in Nijverdal?", answer: "Ja. De regeling van de gemeente Hellendoorn geldt voor de hele gemeente, dus ook voor Nijverdal." },
      { question: "Moet ik natuurvriendelijk isoleren in Nijverdal?", answer: "Bij spouw- en dakisolatie moet rekening worden gehouden met beschermde dieren zoals vleermuizen en vogels die in gebouwen nestelen. Een natuurvriendelijk werkend isolatiebedrijf regelt dit." },
      { question: "Komt Gijs ook bij mij thuis in Nijverdal?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats, zodat de adviseur je woning echt kan bekijken." },
      { question: "Helpt Gijs ook in het dorp Hellendoorn zelf?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hellendoorn, inclusief het dorp Hellendoorn en de kleinere kernen." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Gemeente Hellendoorn", href: "/regio/overijssel/hellendoorn", tekst: "Overzicht van isoleren in de hele gemeente." },
        { naam: "Isoleren in Rijssen", href: "/regio/overijssel/rijssen-holten/rijssen", tekst: "Buurgemeente met een eigen subsidieregeling." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Nijverdal en de rest van de gemeente Hellendoorn."],
    ],
  },

  "/regio/overijssel/hellendoorn/daarle": {
    seo: {
      title: "Woning isoleren in Daarle | Gijs",
      description: "Isoleren in Daarle, gemeente Hellendoorn? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Daarle, gemeente Hellendoorn",
    h1: "Je woning isoleren in Daarle",
    intro: [
      ["Daarle is een van de kleinere kernen van de gemeente Hellendoorn. In Daarle is de vrijstaande woning het meest voorkomende type, ruim de helft van de woningen; ongeveer 82% is een koopwoning."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Daarle bekend van?",
        kaarten: [
          { icon: "church", titel: "De Hervormde kerk", tekst: "Het orgel is in 1872 gebouwd door L. van Dam & Zonen en in 1918 uitgebreid." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Deze onderdelen komen in Daarle het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Daarle",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis, ook in Daarle. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Daarle valt onder de gemeente Hellendoorn, die een eigen regeling heeft voor woningisolatie. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Hoort Daarle bij de gemeente Hellendoorn?", answer: "Ja. Daarle is een van de kleinere kernen van de gemeente Hellendoorn, naast Nijverdal, het dorp Hellendoorn, Daarlerveen en Haarle." },
      { question: "Geldt de isolatiesubsidie van de gemeente ook voor mij in Daarle?", answer: "Ja. De regeling van de gemeente Hellendoorn geldt voor de hele gemeente." },
      { question: "Komt Gijs ook bij mij thuis in Daarle?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Daarlerveen", href: "/regio/overijssel/hellendoorn/daarlerveen", tekst: "Een andere kleine kern van de gemeente." },
        { naam: "Gemeente Hellendoorn", href: "/regio/overijssel/hellendoorn", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Daarle en de rest van de gemeente Hellendoorn."]],
  },

  "/regio/overijssel/hellendoorn/daarlerveen": {
    seo: {
      title: "Woning isoleren in Daarlerveen | Gijs",
      description: "Isoleren in Daarlerveen, gemeente Hellendoorn? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Daarlerveen, gemeente Hellendoorn",
    h1: "Je woning isoleren in Daarlerveen",
    intro: [
      ["Daarlerveen is een van de kleinere kernen van de gemeente Hellendoorn, ontstaan als veenontginningsnederzetting. In Daarlerveen is de vrijstaande woning het meest voorkomende type, de helft van de woningen; ongeveer 80% is een koopwoning."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Daarlerveen bekend van?",
        kaarten: [
          { icon: "train-front", titel: "Het spoor", tekst: "Sinds 1906 aangesloten op de spoorlijn Almelo-Mariënberg." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Deze onderdelen komen in Daarlerveen het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Daarlerveen",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis, ook in Daarlerveen. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Daarlerveen valt onder de gemeente Hellendoorn, die een eigen regeling heeft voor woningisolatie. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Hoort Daarlerveen bij de gemeente Hellendoorn?", answer: "Ja. Daarlerveen is een van de kleinere kernen van de gemeente Hellendoorn, naast Nijverdal, het dorp Hellendoorn, Daarle en Haarle." },
      { question: "Geldt de isolatiesubsidie van de gemeente ook voor mij in Daarlerveen?", answer: "Ja. De regeling van de gemeente Hellendoorn geldt voor de hele gemeente." },
      { question: "Komt Gijs ook bij mij thuis in Daarlerveen?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Haarle", href: "/regio/overijssel/hellendoorn/haarle", tekst: "Een andere kleine kern van de gemeente." },
        { naam: "Gemeente Hellendoorn", href: "/regio/overijssel/hellendoorn", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Daarlerveen en de rest van de gemeente Hellendoorn."]],
  },

  "/regio/overijssel/hellendoorn/haarle": {
    seo: {
      title: "Woning isoleren in Haarle | Gijs",
      description: "Isoleren in Haarle, gemeente Hellendoorn? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Haarle, gemeente Hellendoorn",
    h1: "Je woning isoleren in Haarle",
    intro: [
      ["Haarle is een van de kleinere kernen van de gemeente Hellendoorn. Net als in de rest van de gemeente is de vrijstaande woning hier het meest voorkomende type."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Haarle bekend van?",
        kaarten: [
          { icon: "castle", titel: "Landhuis De Sprengenberg", tekst: "Met de bijbehorende Palthetoren, gebouwd tussen 1900 en 1910 in opdracht van de familie Van Wulfften Palthe." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Deze onderdelen komen in Haarle het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Haarle",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis, ook in Haarle. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Haarle valt onder de gemeente Hellendoorn, die een eigen regeling heeft voor woningisolatie. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Hoort Haarle bij de gemeente Hellendoorn?", answer: "Ja. Haarle is een van de kleinere kernen van de gemeente Hellendoorn, naast Nijverdal, het dorp Hellendoorn, Daarle en Daarlerveen." },
      { question: "Geldt de isolatiesubsidie van de gemeente ook voor mij in Haarle?", answer: "Ja. De regeling van de gemeente Hellendoorn geldt voor de hele gemeente." },
      { question: "Komt Gijs ook bij mij thuis in Haarle?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Daarle", href: "/regio/overijssel/hellendoorn/daarle", tekst: "Een andere kleine kern van de gemeente." },
        { naam: "Gemeente Hellendoorn", href: "/regio/overijssel/hellendoorn", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Haarle en de rest van de gemeente Hellendoorn."]],
  },
};

const TWENTERAND: Record<string, LokaleInhoud> = {
  "/regio/overijssel/twenterand": {
    seo: {
      title: "Woning isoleren in Vriezenveen en Vroomshoop | Gijs",
      description: "Isoleren in de gemeente Twenterand, met Vriezenveen en Vroomshoop als grootste kernen? Lees hoe Gijs je helpt en wat de gemeentelijke subsidie inhoudt.",
    },
    kicker: "Gemeente Twenterand",
    h1: "Je woning isoleren in Twenterand",
    intro: [
      ["De gemeente Twenterand ontstond in 2001 uit de fusie van de voormalige gemeenten Den Ham en Vriezenveen, en bestaat uit meerdere kernen, met Vriezenveen en Vroomshoop als de twee grootste. Daarnaast liggen er kernen als ", { tekst: "Den Ham", href: "/regio/overijssel/twenterand/den-ham" }, ", ", { tekst: "Geerdijk", href: "/regio/overijssel/twenterand/geerdijk" }, ", ", { tekst: "De Pollen", href: "/regio/overijssel/twenterand/de-pollen" }, " en ", { tekst: "Westerhaar-Vriezenveensewijk", href: "/regio/overijssel/twenterand/westerhaar-vriezenveensewijk" }, "."],
      ["Gijs helpt bewoners in de hele gemeente met isoleren. Lees meer over ", { tekst: "Vriezenveen", href: "/regio/overijssel/twenterand/vriezenveen" }, " of ", { tekst: "Vroomshoop", href: "/regio/overijssel/twenterand/vroomshoop" }, "."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vriezenveen-en-vroomshoop",
        titel: "Vriezenveen en Vroomshoop, twee eigen kernen",
        alineas: [
          ["Vriezenveen en Vroomshoop zijn allebei zelfstandige dorpen binnen de gemeente Twenterand, elk met een eigen centrum. Voor isoleren maakt het niet uit in welk dorp je woont: Gijs werkt in de hele gemeente op dezelfde manier."],
        ],
        kaartenTitel: "Waar is Twenterand bekend van?",
        kaarten: [
          { icon: "landmark", titel: "Vriezenveen", tekst: "De grootste kern, met de Leemansmolen als herkenningspunt.", href: "/regio/overijssel/twenterand/vriezenveen" },
          { icon: "waves", titel: "Vroomshoop", tekst: "Ontstaan als veenkolonie langs het Kanaal Almelo-De Haandrik.", href: "/regio/overijssel/twenterand/vroomshoop" },
        ],
      },
      {
        id: "vrijstaand-isoleren",
        titel: "Veel vrijstaande woningen",
        alineas: [
          ["In de gemeente Twenterand is de vrijstaande woning het meest voorkomende woningtype. Zo'n huis heeft aan alle kanten buitenmuur, dus loont het om naar het hele huis te kijken: dak, gevel, vloer en glas."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Deze onderdelen komen in de gemeente Twenterand het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Twenterand",
      alineas: [
        ["In de digitale woningscan zie je in een paar minuten welke maatregelen bij jouw type woning passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis, in Vriezenveen, Vroomshoop en de kleinere kernen. Samen kijk je wat er al is gedaan en wat een logische volgende stap is."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Twenterand heeft een eigen duurzaamheidssubsidie voor het isoleren van een koophuis. De regeling is bedoeld voor particuliere eigenaren; huurders en bedrijven komen er niet voor in aanmerking. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Wat is het verschil tussen Vriezenveen en Vroomshoop?", answer: "Het zijn twee eigen dorpen binnen dezelfde gemeente Twenterand, elk met een eigen centrum. De isolatieaanpak van Gijs is voor beide hetzelfde." },
      { question: "Geldt de subsidie van Twenterand ook voor huurwoningen?", answer: "Nee. De duurzaamheidssubsidie van de gemeente Twenterand is bedoeld voor particuliere eigenaren van een koophuis. Huurders en bedrijven komen niet in aanmerking." },
      { question: "Helpt Gijs ook in de kleinere kernen, zoals Den Ham of Geerdijk?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Twenterand." },
      { question: "Is de energiescan van Gijs vrijblijvend?", answer: "Ja. De energiescan aan huis is gratis en vrijblijvend." },
    ],
    verwant: {
      titel: "Verder lezen",
      links: [
        { naam: "Isoleren in Vriezenveen", href: "/regio/overijssel/twenterand/vriezenveen", tekst: "De grootste kern van de gemeente Twenterand." },
        { naam: "Isoleren in Vroomshoop", href: "/regio/overijssel/twenterand/vroomshoop", tekst: "Ontstaan bij het Overijssels Kanaal." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in de hele gemeente Twenterand: in Vriezenveen, in Vroomshoop en in de kleinere kernen daaromheen."],
    ],
  },

  "/regio/overijssel/twenterand/vriezenveen": {
    seo: {
      title: "Woning isoleren in Vriezenveen | Gijs",
      description: "Isoleren in Vriezenveen? Lees wat het woningtype van je huis zegt over isolatie en hoe Gijs je helpt kiezen.",
    },
    kicker: "Vriezenveen, gemeente Twenterand",
    h1: "Je woning isoleren in Vriezenveen",
    intro: [
      ["Vriezenveen is de grootste kern van de gemeente Twenterand en heeft van oudsher een lintvormige dorpsstructuur, met bebouwing langs één hoofdstraat."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "woningtype",
        titel: "Van rijwoning tot vrijstaand huis",
        alineas: [
          ["In Vriezenveen is de vrijstaande woning het meest voorkomende type, ongeveer 31% van de woningen; zo'n 68% is een koopwoning. Zo'n huis heeft meer buitenmuur en dak dan een tussenwoning en verliest daardoor ook meer warmte als het niet goed geïsoleerd is."],
          ["Woon je in een oudere woning in het lint van Vriezenveen? Dan zijn het dak en de gevel vaak de plekken waar nog winst te halen is."],
        ],
        kaartenTitel: "Waar is Vriezenveen bekend van?",
        kaarten: [
          { icon: "landmark", titel: "De Leemansmolen", tekst: "Een achtkante stellingmolen uit 1862, het laatst overgebleven herkenningspunt van de meerdere molens die het dorp ooit telde." },
        ],
      },
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Vriezenveen vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van het woningtype en wat er al is gedaan.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Bij veel woningtypen de plek waar het meeste te winnen valt." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een logische stap. Let op natuurvriendelijk werken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Vriezenveen",
      alineas: [
        ["Begin met de digitale woningscan: daarin kies je je woningtype en zie je welke maatregelen erbij passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Samen kijk je wat er al is gedaan en wat een logische volgende stap is."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Vriezenveen valt onder de gemeente Twenterand, die een duurzaamheidssubsidie heeft voor particuliere eigenaren van een koophuis. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Geldt de isolatiesubsidie van de gemeente ook voor mij in Vriezenveen?", answer: "Ja, als je eigenaar-bewoner bent van een koophuis. De duurzaamheidssubsidie van de gemeente Twenterand geldt voor de hele gemeente." },
      { question: "Wat is het verschil tussen isoleren in Vriezenveen en Vroomshoop?", answer: "Beide vallen onder dezelfde gemeente en dezelfde subsidieregeling. Het verschil zit vooral in het dorpskarakter, niet in de isolatieaanpak." },
      { question: "Moet ik natuurvriendelijk isoleren in Vriezenveen?", answer: "Bij spouw- en dakisolatie moet rekening worden gehouden met beschermde dieren. Een natuurvriendelijk werkend isolatiebedrijf regelt dit." },
      { question: "Komt Gijs ook bij mij thuis in Vriezenveen?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Vroomshoop", href: "/regio/overijssel/twenterand/vroomshoop", tekst: "Dezelfde gemeente, ontstaan bij het Overijssels Kanaal." },
        { naam: "Gemeente Twenterand", href: "/regio/overijssel/twenterand", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Vriezenveen en de rest van de gemeente Twenterand."],
    ],
  },

  "/regio/overijssel/twenterand/vroomshoop": {
    seo: {
      title: "Woning isoleren in Vroomshoop | Gijs",
      description: "Isoleren in Vroomshoop, ontstaan bij het Overijssels Kanaal? Lees hoe Gijs je helpt van woningscan tot energiescan aan huis.",
    },
    kicker: "Vroomshoop, gemeente Twenterand",
    h1: "Je woning isoleren in Vroomshoop",
    intro: [
      ["Vroomshoop is ontstaan als veenkolonie langs het Kanaal Almelo-De Haandrik. Het dorp is nu een van de twee grootste kernen van de gemeente Twenterand."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "woningtype",
        titel: "Tussenwoning en vrijstaand huis, vrijwel gelijk verdeeld",
        alineas: [
          ["Anders dan in de rest van de gemeente Twenterand is in Vroomshoop de tussenwoning net zo vaak voorkomend als de vrijstaande woning, allebei rond een kwart van de woningen; ongeveer 66% is een koopwoning."],
          ["Woon je in een tussenwoning dicht bij het kanaal? Dan gaat de meeste warmte verloren via het dak, de voor- en achtergevel en de vloer. Woon je vrijstaand? Dan telt ook de spouwmuur extra mee."],
        ],
        kaartenTitel: "Waar is Vroomshoop bekend van?",
        kaarten: [
          { icon: "waves", titel: "Het Kanaal Almelo-De Haandrik", tekst: "Gegraven vanaf 1859. Rond 1875 verschoof de economie naar aardappelteelt, mede dankzij kolonisten uit Groningen en Drenthe." },
        ],
      },
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die in Vroomshoop vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van het woningtype en wat er al is gedaan.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Bij veel woningtypen de plek waar het meeste te winnen valt." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een logische stap. Let op natuurvriendelijk werken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Vroomshoop",
      alineas: [
        ["Begin met de digitale woningscan: daarin kies je je woningtype en zie je welke maatregelen erbij passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Samen kijk je wat er al is gedaan en wat een logische volgende stap is."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Vroomshoop valt onder de gemeente Twenterand, die een duurzaamheidssubsidie heeft voor particuliere eigenaren van een koophuis. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Geldt de isolatiesubsidie van de gemeente ook voor mij in Vroomshoop?", answer: "Ja, als je eigenaar-bewoner bent van een koophuis. De duurzaamheidssubsidie van de gemeente Twenterand geldt voor de hele gemeente." },
      { question: "Wat is het verschil tussen isoleren in Vroomshoop en Vriezenveen?", answer: "Beide vallen onder dezelfde gemeente en dezelfde subsidieregeling. Het verschil zit vooral in het dorpskarakter, niet in de isolatieaanpak." },
      { question: "Moet ik natuurvriendelijk isoleren in Vroomshoop?", answer: "Bij spouw- en dakisolatie moet rekening worden gehouden met beschermde dieren. Een natuurvriendelijk werkend isolatiebedrijf regelt dit." },
      { question: "Komt Gijs ook bij mij thuis in Vroomshoop?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Vriezenveen", href: "/regio/overijssel/twenterand/vriezenveen", tekst: "Dezelfde gemeente, de grootste kern." },
        { naam: "Gemeente Twenterand", href: "/regio/overijssel/twenterand", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Vroomshoop en de rest van de gemeente Twenterand."],
    ],
  },

  "/regio/overijssel/twenterand/den-ham": {
    seo: {
      title: "Woning isoleren in Den Ham | Gijs",
      description: "Isoleren in Den Ham, gemeente Twenterand? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Den Ham, gemeente Twenterand",
    h1: "Je woning isoleren in Den Ham",
    intro: [
      ["Den Ham wordt al in 1333 genoemd, in een leenakte als parochie van de heer van Egede."],
      ["Net als in de rest van de gemeente is de vrijstaande woning hier naar verwachting het meest voorkomende type. Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Den Ham bekend van?",
        kaarten: [
          { icon: "church", titel: "De kerktoren", tekst: "Met een torenvierkant uit 1325-1425 het oudste bouwwerk van het dorp; de klokkenstoel bevat klokken uit 1447 en 1520." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Deze onderdelen komen in Den Ham het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Den Ham",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Den Ham valt onder de gemeente Twenterand, die een duurzaamheidssubsidie heeft voor particuliere eigenaren van een koophuis. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Hoort Den Ham bij de gemeente Twenterand?", answer: "Ja. Den Ham is een van de kernen van de gemeente Twenterand, naast Vriezenveen, Vroomshoop, De Pollen, Geerdijk en Westerhaar-Vriezenveensewijk." },
      { question: "Geldt de subsidie van Twenterand ook voor mij in Den Ham?", answer: "Ja, als je eigenaar-bewoner bent van een koophuis. De duurzaamheidssubsidie van de gemeente Twenterand geldt voor de hele gemeente." },
      { question: "Komt Gijs ook bij mij thuis in Den Ham?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Geerdijk", href: "/regio/overijssel/twenterand/geerdijk", tekst: "Een andere kern van de gemeente." },
        { naam: "Gemeente Twenterand", href: "/regio/overijssel/twenterand", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Den Ham en de rest van de gemeente Twenterand."]],
  },

  "/regio/overijssel/twenterand/de-pollen": {
    seo: {
      title: "Woning isoleren in De Pollen | Gijs",
      description: "Isoleren in De Pollen, gemeente Twenterand? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "De Pollen, gemeente Twenterand",
    h1: "Je woning isoleren in De Pollen",
    intro: [
      ["De Pollen is een van de kernen van de gemeente Twenterand, tussen Vriezenveen en Den Ham. Net als in de rest van de gemeente is de vrijstaande woning hier naar verwachting het meest voorkomende type."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is De Pollen bekend van?",
        kaarten: [
          { icon: "church", titel: "De Hervormde kerk", tekst: "Het kabinetorgel dateert uit 1766 en is in 1932 per spoor naar De Pollen verhuisd." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Deze onderdelen komen in De Pollen het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in De Pollen",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De Pollen valt onder de gemeente Twenterand, die een duurzaamheidssubsidie heeft voor particuliere eigenaren van een koophuis. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Hoort De Pollen bij de gemeente Twenterand?", answer: "Ja. De Pollen is een van de kernen van de gemeente Twenterand, naast Vriezenveen, Vroomshoop, Den Ham, Geerdijk en Westerhaar-Vriezenveensewijk." },
      { question: "Geldt de subsidie van Twenterand ook voor mij in De Pollen?", answer: "Ja, als je eigenaar-bewoner bent van een koophuis. De duurzaamheidssubsidie van de gemeente Twenterand geldt voor de hele gemeente." },
      { question: "Komt Gijs ook bij mij thuis in De Pollen?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Den Ham", href: "/regio/overijssel/twenterand/den-ham", tekst: "Een andere kern van de gemeente." },
        { naam: "Gemeente Twenterand", href: "/regio/overijssel/twenterand", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel De Pollen en de rest van de gemeente Twenterand."]],
  },

  "/regio/overijssel/twenterand/geerdijk": {
    seo: {
      title: "Woning isoleren in Geerdijk | Gijs",
      description: "Isoleren in Geerdijk, gemeente Twenterand? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Geerdijk, gemeente Twenterand",
    h1: "Je woning isoleren in Geerdijk",
    intro: [
      ["Geerdijk is een van de kernen van de gemeente Twenterand, ontstaan halverwege de negentiende eeuw als veenkoloniale nederzetting langs het Kanaal Almelo-De Haandrik. In Geerdijk is de vrijstaande woning verreweg het meest voorkomende type, 75% van de woningen; ongeveer 89% is een koopwoning."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Geerdijk bekend van?",
        kaarten: [
          { icon: "church", titel: "De Willibrordkerk", tekst: "Neogotische kerk uit 1867-1868, aan het kanaal." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Deze onderdelen komen in Geerdijk het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Geerdijk",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Geerdijk valt onder de gemeente Twenterand, die een duurzaamheidssubsidie heeft voor particuliere eigenaren van een koophuis. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Hoort Geerdijk bij de gemeente Twenterand?", answer: "Ja. Geerdijk is een van de kernen van de gemeente Twenterand, naast Vriezenveen, Vroomshoop, Den Ham, De Pollen en Westerhaar-Vriezenveensewijk." },
      { question: "Geldt de subsidie van Twenterand ook voor mij in Geerdijk?", answer: "Ja, als je eigenaar-bewoner bent van een koophuis. De duurzaamheidssubsidie van de gemeente Twenterand geldt voor de hele gemeente." },
      { question: "Komt Gijs ook bij mij thuis in Geerdijk?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Vroomshoop", href: "/regio/overijssel/twenterand/vroomshoop", tekst: "Een van de twee grootste kernen van de gemeente." },
        { naam: "Gemeente Twenterand", href: "/regio/overijssel/twenterand", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Geerdijk en de rest van de gemeente Twenterand."]],
  },

  "/regio/overijssel/twenterand/westerhaar-vriezenveensewijk": {
    seo: {
      title: "Woning isoleren in Westerhaar-Vriezenveensewijk | Gijs",
      description: "Isoleren in Westerhaar-Vriezenveensewijk, gemeente Twenterand? Lees hoe Gijs je helpt, met aandacht voor natuurvriendelijk isoleren.",
    },
    kicker: "Westerhaar-Vriezenveensewijk, gemeente Twenterand",
    h1: "Je woning isoleren in Westerhaar-Vriezenveensewijk",
    intro: [
      ["Westerhaar-Vriezenveensewijk is een van de kernen van de gemeente Twenterand, ontstaan rond 1890 als veenkolonie bij de afgraving van de Engbertsdijksvenen. Net als in de rest van de gemeente is de vrijstaande woning hier het meest voorkomende type."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren",
        alineas: [
          ["In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het hier rekening mee houdt."],
        ],
        kaartenTitel: "Waar is Westerhaar-Vriezenveensewijk bekend van?",
        kaarten: [
          { icon: "tent-tree", titel: "Het Veenmuseum", tekst: "Door vrijwilligers gerund museum dat de veengeschiedenis van het dorp levend houdt." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een vrijstaande woning",
      intro: "Deze onderdelen komen in Westerhaar-Vriezenveensewijk het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Westerhaar-Vriezenveensewijk",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Westerhaar-Vriezenveensewijk valt onder de gemeente Twenterand, die een duurzaamheidssubsidie heeft voor particuliere eigenaren van een koophuis. Of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Hoort Westerhaar-Vriezenveensewijk bij de gemeente Twenterand?", answer: "Ja. Het is een van de kernen van de gemeente Twenterand, naast Vriezenveen, Vroomshoop, Den Ham, De Pollen en Geerdijk." },
      { question: "Geldt de subsidie van Twenterand ook voor mij hier?", answer: "Ja, als je eigenaar-bewoner bent van een koophuis. De duurzaamheidssubsidie van de gemeente Twenterand geldt voor de hele gemeente." },
      { question: "Komt Gijs ook bij mij thuis?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Geerdijk", href: "/regio/overijssel/twenterand/geerdijk", tekst: "Een andere kern van de gemeente." },
        { naam: "Gemeente Twenterand", href: "/regio/overijssel/twenterand", tekst: "Overzicht van isoleren in de hele gemeente." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Westerhaar-Vriezenveensewijk en de rest van de gemeente Twenterand."]],
  },
};

const GELDERLAND_DORPEN: Record<string, LokaleInhoud> = {
  "/regio/gelderland/apeldoorn/beekbergen": {
    seo: {
      title: "Woning isoleren in Beekbergen | Gijs",
      description: "Isoleren in Beekbergen, gemeente Apeldoorn? Veel huizen hier zijn vrijstaand en gebouwd voor de jaren tachtig. Lees hoe Gijs je helpt een warmere, zuinigere woning te krijgen.",
    },
    kicker: "Beekbergen, gemeente Apeldoorn",
    h1: "Je woning isoleren in Beekbergen",
    intro: [
      ["Beekbergen is een dorp aan de rand van de Veluwe, in de gemeente Apeldoorn. De meeste woningen zijn vrijstaand of twee-onder-een-kap en zijn gebouwd voor de jaren tachtig — ver vóór de huidige isolatienormen."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt met isoleren."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vrijstaand-veluwe",
        titel: "Vrijstaand wonen aan de Veluwe",
        alineas: [
          ["Beekbergen heeft relatief veel vrijstaande woningen in een bosrijke omgeving. Vrijstaande huizen hebben aan alle kanten buitenmuur en vaak een groot dak. Ze verliezen daardoor meer warmte per vierkante meter dan een rijwoning — dus isoleren levert hier extra veel op."],
          ["Veel woningen in Beekbergen zijn gebouwd in de jaren vijftig tot zeventig, toen er nauwelijks isolatienormen bestonden. Dat betekent dat er in veel huizen nog warmte verloren gaat via het dak, de spouwmuur of de vloer."],
        ],
        kaartenTitel: "Waar is Beekbergen bekend om?",
        kaarten: [
          { icon: "trees", titel: "Beekbergerwoud", tekst: "Het nationaal bosreservaat naast het dorp is een van de oudste aaneengesloten loofbossen van Nederland." },
          { icon: "home", titel: "Villadorp op de Veluwe", tekst: "Beekbergen staat bekend om zijn groene uitstraling en vrijstaande woningen in bosrijke omgeving." },
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie bij een oudere vrijstaande woning",
      intro: "In Beekbergen komen deze maatregelen het vaakst aan bod bij vrijstaande en twee-onder-een-kapwoningen.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Bij vrijstaande woningen is het dak het grootste oppervlak waarlangs warmte ontsnapt. Vaak de eerste stap." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij woningen van vóór 1975 is de spouw vaak nog leeg of beperkt gevuld. Controleer of je woning dit heeft." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Een kruipruimte kan van onderaf worden geïsoleerd. Dat maakt de vloer aangenamer en scheelt energie." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Oudere kozijnen met enkel of oud dubbelglas zijn een duidelijk aandachtspunt bij woningen uit de jaren zestig en zeventig." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Beekbergen",
      alineas: [
        ["Begin met de digitale woningscan en zie welke maatregelen bij je woningtype passen."],
        ["Voor advies over je eigen woning komt een adviseur van Gijs langs voor de gratis energiescan. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Beekbergen valt onder de gemeente Apeldoorn. Welke regelingen er beschikbaar zijn, vind je bij de gemeente Apeldoorn."],
    ],
    faq: [
      { question: "Hoort Beekbergen bij de gemeente Apeldoorn?", answer: "Ja. Beekbergen is een dorp in de gemeente Apeldoorn, in de provincie Gelderland." },
      { question: "Mijn huis staat in het bos. Heeft dat gevolgen voor isolatie?", answer: "Niet voor de technische mogelijkheden, maar soms voor de regelgeving rondom beschermde natuur of monumenten. Een adviseur kan dit meenemen in het advies." },
      { question: "Komt Gijs ook bij mij thuis in Beekbergen?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats, ook in Beekbergen." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Apeldoorn", href: "/regio/gelderland/apeldoorn", tekst: "Overzicht van isoleren in de gemeente Apeldoorn." },
        { naam: "Zo werkt de woningscan", href: "/woning", tekst: "Ontdek welke maatregelen bij jouw woningtype passen." },
      ],
    },
    werkgebied: [["Gijs helpt bewoners in heel Beekbergen en de rest van de gemeente Apeldoorn."]],
  },
};

/** Sleutel = regiopad (zie regioPad in lib/content/regio.ts). */
export const REGIO_LOKAAL: Record<string, LokaleInhoud> = {
  ...ZWOLLE, ...TWENTE, ...TWENTE_RONDE_2, ...HENGELO_BECKUM, ...ENSCHEDE_DORPEN,
  ...BORNE_DORPEN, ...HOF_VAN_TWENTE_DORPEN, ...ALMELO_DORPEN,
  ...RIJSSEN_HOLTEN, ...HELLENDOORN, ...TWENTERAND, ...GELDERLAND_DORPEN,
};

export const getLokaleInhoud = (pad: string): LokaleInhoud | undefined => REGIO_LOKAAL[pad];
